// Starcade native bridge - Copyright (C) 2026 X-2357
// GPL-3.0-or-later. See LICENSE-GPL-3.0.txt in the source distribution.
#include "OSFUI_API.h"

#include <SFSE/SFSE.h>
#include <RE/Starfield.h>
#include <REX/REX/LOG.h>
#include <RE/B/BSScriptUtil.h>

#include <ShlObj.h>
#include <shellapi.h>
#include <nlohmann/json.hpp>

#include <filesystem>
#include <fstream>
#include <sstream>
#include <algorithm>
#include <array>
#include <cctype>
#include <cstdlib>
#include <ctime>
#include <mutex>
#include <regex>
#include <string>
#include <unordered_map>
#include <unordered_set>
#include <vector>

namespace Starcade
{
    using json = nlohmann::json;
    constexpr auto kView = "starcade.arcade/launcher";
    OSFUI::API::Client g_ui;
    std::recursive_mutex g_lock;
    json g_state = { { "version", 1 }, { "games", json::object() }, { "achievements", json::array() } };
    std::filesystem::path g_statePath;

    struct CreditRequest
    {
        std::string source;
        std::string game;
        std::string action;
        std::int32_t amount{ 0 };
    };
    std::unordered_map<std::string, CreditRequest> g_creditRequests;
    std::string g_wagerGame;
    std::int32_t g_wagerAmount{ 0 };
    bool g_wagerSettlementPending{ false };
    std::string g_cancelAfterWagerGame;
    std::uint64_t g_autoRequest{ 0 };

    std::filesystem::path PluginDirectory()
    {
        HMODULE module = nullptr;
        if (!GetModuleHandleExW(GET_MODULE_HANDLE_EX_FLAG_FROM_ADDRESS | GET_MODULE_HANDLE_EX_FLAG_UNCHANGED_REFCOUNT,
                reinterpret_cast<LPCWSTR>(&g_ui), &module)) return {};
        std::wstring buffer(32768, L'\0');
        const auto size = GetModuleFileNameW(module, buffer.data(), static_cast<DWORD>(buffer.size()));
        if (!size || size >= buffer.size()) return {};
        buffer.resize(size);
        return std::filesystem::path(buffer).parent_path();
    }

    std::string Utf8(const std::filesystem::path& a_path)
    {
        const auto& wide = a_path.native();
        if (wide.empty()) return {};
        const auto size = WideCharToMultiByte(CP_UTF8, 0, wide.c_str(), static_cast<int>(wide.size()), nullptr, 0, nullptr, nullptr);
        std::string result(static_cast<std::size_t>(size), '\0');
        WideCharToMultiByte(CP_UTF8, 0, wide.c_str(), static_cast<int>(wide.size()), result.data(), size, nullptr, nullptr);
        return result;
    }

    std::filesystem::path ReadRegistryPath(HKEY a_root, const wchar_t* a_key, const wchar_t* a_value)
    {
        wchar_t buffer[32768]{};
        DWORD bytes = sizeof(buffer);
        if (RegGetValueW(a_root, a_key, a_value, RRF_RT_REG_SZ, nullptr, buffer, &bytes) == ERROR_SUCCESS) {
            return std::filesystem::path(buffer);
        }
        return {};
    }

    void AddSteamRoot(std::vector<std::filesystem::path>& a_roots, const std::filesystem::path& a_root)
    {
        if (a_root.empty()) return;
        const auto normalized = a_root.lexically_normal();
        if (std::ranges::find(a_roots, normalized) == a_roots.end()) a_roots.push_back(normalized);
    }

    std::vector<std::filesystem::path> SteamRoots()
    {
        std::vector<std::filesystem::path> roots;
        AddSteamRoot(roots, ReadRegistryPath(HKEY_CURRENT_USER, L"Software\\Valve\\Steam", L"SteamPath"));
        AddSteamRoot(roots, L"C:\\Steam");
        AddSteamRoot(roots, L"C:\\Program Files (x86)\\Steam");
        AddSteamRoot(roots, L"C:\\Program Files\\Steam");

        for (std::size_t i = 0; i < roots.size(); ++i) {
            std::ifstream input(roots[i] / "steamapps" / "libraryfolders.vdf");
            if (!input) continue;
            const std::string text((std::istreambuf_iterator<char>(input)), std::istreambuf_iterator<char>());
            const std::regex pathPattern(R"vdf("path"\s+"([^"]+)")vdf", std::regex::icase);
            for (std::sregex_iterator match(text.begin(), text.end(), pathPattern), end; match != end; ++match) {
                auto path = (*match)[1].str();
                for (std::size_t slash = 0; (slash = path.find("\\\\", slash)) != std::string::npos; ++slash) path.replace(slash, 2, "\\");
                AddSteamRoot(roots, std::filesystem::u8path(path));
            }
        }
        return roots;
    }

    std::filesystem::path FindMorrowindData()
    {
        std::error_code ec;
        for (const auto& steam : SteamRoots()) {
            const auto common = steam / "steamapps" / "common";
            const std::array candidates{
                common / "Morrowind" / "Data Files",
                common / "The Elder Scrolls III - Morrowind" / "Data Files"
            };
            for (const auto& data : candidates) if (std::filesystem::is_regular_file(data / "Morrowind.esm", ec)) return data;
        }
        return {};
    }

    std::filesystem::path FindOpenMW()
    {
        std::error_code ec;
        std::vector<std::filesystem::path> candidates{
            PluginDirectory() / "Starcade" / "External" / "OpenMW" / "openmw.exe",
            std::filesystem::current_path() / "Data" / "SFSE" / "Plugins" / "Starcade" / "External" / "OpenMW" / "openmw.exe",
            std::filesystem::current_path() / "SFSE" / "Plugins" / "Starcade" / "External" / "OpenMW" / "openmw.exe",
            ReadRegistryPath(HKEY_LOCAL_MACHINE, L"Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\openmw.exe", nullptr),
            ReadRegistryPath(HKEY_CURRENT_USER, L"Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\openmw.exe", nullptr),
            L"C:\\Program Files\\OpenMW\\openmw.exe",
            L"C:\\Program Files (x86)\\OpenMW\\openmw.exe"
        };
        if (const auto* local = std::getenv("LOCALAPPDATA")) candidates.push_back(std::filesystem::path(local) / "Programs" / "OpenMW" / "openmw.exe");
        for (const auto& candidate : candidates) if (!candidate.empty() && std::filesystem::is_regular_file(candidate, ec)) return candidate;
        return {};
    }

    // Skyrim and Oblivion have no OpenMW-equivalent open-source engine to bundle,
    // but they don't need one either - unlike Morrowind's original engine, both
    // run natively on modern Windows. So Starcade just finds and launches the
    // player's own Steam-installed .exe directly, and deliberately does NOT
    // touch either game's own display/graphics settings the way it does for
    // OpenMW - these are far more likely to already be modded/configured
    // (MO2, Vortex, ENB, custom INIs) and blind-forcing fullscreen would risk
    // breaking an existing setup for no real benefit (the game's own window
    // already behaves like any other launched game).
    struct SteamGameCandidate { const wchar_t* folder; const wchar_t* exeName; };

    std::filesystem::path FindSteamGameExe(std::initializer_list<SteamGameCandidate> a_candidates, const wchar_t* a_masterFile)
    {
        std::error_code ec;
        for (const auto& steam : SteamRoots()) {
            const auto common = steam / "steamapps" / "common";
            for (const auto& candidate : a_candidates) {
                const auto root = common / candidate.folder;
                const auto exe = root / candidate.exeName;
                if (std::filesystem::is_regular_file(exe, ec) && std::filesystem::is_regular_file(root / "Data" / a_masterFile, ec)) return exe;
            }
        }
        return {};
    }

    std::filesystem::path FindSkyrimExe()
    {
        return FindSteamGameExe({ { L"Skyrim Special Edition", L"SkyrimSE.exe" }, { L"Skyrim", L"TESV.exe" } }, L"Skyrim.esm");
    }

    std::filesystem::path FindOblivionExe()
    {
        return FindSteamGameExe({ { L"Oblivion", L"Oblivion.exe" } }, L"Oblivion.esm");
    }

    json ExternalStatus(std::string_view a_id)
    {
        if (a_id == "openmw") {
            const auto openmw = FindOpenMW();
            const auto data = FindMorrowindData();
            return {
                { "id", "openmw" }, { "installed", !openmw.empty() && !data.empty() },
                { "engineFound", !openmw.empty() }, { "gameDataFound", !data.empty() },
                { "enginePath", Utf8(openmw) }, { "dataPath", Utf8(data) }
            };
        }
        if (a_id == "skyrim") {
            const auto exe = FindSkyrimExe();
            return { { "id", "skyrim" }, { "installed", !exe.empty() }, { "enginePath", Utf8(exe) } };
        }
        if (a_id == "oblivion") {
            const auto exe = FindOblivionExe();
            return { { "id", "oblivion" }, { "installed", !exe.empty() }, { "enginePath", Utf8(exe) } };
        }
        return { { "id", std::string(a_id) }, { "installed", false } };
    }

    void SendExternalStatus(const char* a_view, std::string_view a_id, std::string_view a_message = {}, bool a_launched = false)
    {
        auto status = ExternalStatus(a_id);
        status["launched"] = a_launched;
        if (!a_message.empty()) status["message"] = a_message;
        g_ui.SendToWeb(a_view ? a_view : kView, "starcade.external", status.dump().c_str());
    }

    void LaunchNativeSteamGame(const char* a_view, std::string_view a_id, const std::filesystem::path& a_exe)
    {
        if (a_exe.empty()) {
            SendExternalStatus(a_view, a_id, "Steam installation not found. Install the game through Steam, then reopen Starcade.");
            return;
        }
        SHELLEXECUTEINFOW execute{ sizeof(execute) };
        execute.fMask = SEE_MASK_NOCLOSEPROCESS | SEE_MASK_NOASYNC;
        execute.lpVerb = L"open";
        execute.lpFile = a_exe.c_str();
        execute.lpDirectory = a_exe.parent_path().c_str();
        execute.nShow = SW_SHOWNORMAL;
        if (!ShellExecuteExW(&execute)) {
            SendExternalStatus(a_view, a_id, "Windows could not start the game.");
            return;
        }
        if (execute.hProcess) CloseHandle(execute.hProcess);
        SendExternalStatus(a_view, a_id, "Launched using the detected Steam installation.", true);
        g_ui.RequestMenu(kView, false);
    }

    void WriteStarcadeOpenMWDisplaySettings(const std::filesystem::path& a_configDir)
    {
        // Starcade always launches OpenMW as a separate top-level window (see
        // LaunchOpenMW) rather than embedding its rendering inside the Starcade
        // webview - true window-embedding across OpenMW's native OpenGL surface
        // and OSF UI's WebView2 host is real, separate future work, not attempted
        // here. In the meantime, force borderless-fullscreen so the window at
        // least fills the screen the way a launched game normally would, instead
        // of appearing as a small windowed OpenMW default. "window mode = 1" is
        // OpenMW's windowed-fullscreen (borderless) mode - avoids the exclusive-
        // fullscreen display-mode-switch some setups have trouble with.
        //
        // OpenMW itself may already have generated settings.cfg with its own
        // defaults (e.g. after the user's first real launch, before this Starcade
        // change existed) - merge just these 3 keys into whatever is already
        // there instead of overwriting the whole file, so any other display/audio/
        // control settings the player has already changed survive untouched.
        static const std::unordered_map<std::string, std::string> kForced{
            { "fullscreen", "false" }, { "window mode", "1" }, { "window border", "false" }
        };
        const auto settings = a_configDir / "settings.cfg";
        std::vector<std::string> lines;
        bool inVideo = false;
        std::unordered_set<std::string> seenInVideo;
        {
            std::ifstream in(settings);
            std::string line;
            while (std::getline(in, line)) {
                auto trimmed = line;
                trimmed.erase(0, trimmed.find_first_not_of(" \t\r"));
                if (!trimmed.empty() && trimmed.front() == '[') inVideo = trimmed == "[Video]";
                if (inVideo) {
                    const auto eq = trimmed.find('=');
                    if (eq != std::string::npos) {
                        auto key = trimmed.substr(0, eq);
                        key.erase(key.find_last_not_of(" \t") + 1);
                        if (const auto it = kForced.find(key); it != kForced.end()) {
                            seenInVideo.insert(key);
                            lines.push_back(key + " = " + it->second);
                            continue;
                        }
                    }
                }
                lines.push_back(line);
            }
        }
        if (seenInVideo.size() != kForced.size()) {
            bool hasVideoSection = std::ranges::any_of(lines, [](const auto& l) { return l == "[Video]"; });
            if (!hasVideoSection) lines.push_back("[Video]");
            for (const auto& [key, value] : kForced) {
                if (!seenInVideo.contains(key)) lines.push_back(key + " = " + value);
            }
        }
        std::ofstream out(settings, std::ios::trunc);
        for (const auto& line : lines) out << line << "\n";
    }

    bool PrepareOpenMWConfig(const std::filesystem::path& a_openmw, const std::filesystem::path& a_data, std::filesystem::path& a_configDir)
    {
        a_configDir = g_statePath.parent_path() / "openmw";
        const auto config = a_configDir / "openmw.cfg";
        std::error_code ec;
        std::filesystem::create_directories(a_configDir, ec);
        if (std::filesystem::is_regular_file(config, ec)) {
            WriteStarcadeOpenMWDisplaySettings(a_configDir);
            return true;
        }

        const auto ini = a_data.parent_path() / "Morrowind.ini";
        const auto importer = a_openmw.parent_path() / "openmw-iniimporter.exe";
        if (!std::filesystem::is_regular_file(ini, ec) || !std::filesystem::is_regular_file(importer, ec)) return false;

        const std::wstring parameters = L"-g -f \"" + ini.wstring() + L"\" \"" + config.wstring() + L"\"";
        SHELLEXECUTEINFOW execute{ sizeof(execute) };
        execute.fMask = SEE_MASK_NOCLOSEPROCESS | SEE_MASK_NOASYNC;
        execute.lpVerb = L"open";
        execute.lpFile = importer.c_str();
        execute.lpParameters = parameters.c_str();
        execute.lpDirectory = a_openmw.parent_path().c_str();
        execute.nShow = SW_HIDE;
        if (!ShellExecuteExW(&execute)) return false;
        const auto wait = WaitForSingleObject(execute.hProcess, 30000);
        DWORD exitCode = 1;
        if (wait == WAIT_OBJECT_0) GetExitCodeProcess(execute.hProcess, &exitCode);
        CloseHandle(execute.hProcess);
        const bool ok = wait == WAIT_OBJECT_0 && exitCode == 0 && std::filesystem::is_regular_file(config, ec);
        if (ok) WriteStarcadeOpenMWDisplaySettings(a_configDir);
        return ok;
    }

    void LaunchOpenMW(const char* a_view)
    {
        const auto openmw = FindOpenMW();
        const auto data = FindMorrowindData();
        if (openmw.empty()) {
            SendExternalStatus(a_view, "openmw", "OpenMW is not installed. Install OpenMW for Windows, then reopen Starcade.");
            return;
        }
        if (data.empty()) {
            SendExternalStatus(a_view, "openmw", "Morrowind.esm was not found in any registered Steam library. Install Morrowind through Steam, then reopen Starcade.");
            return;
        }

        std::filesystem::path configDir;
        if (!PrepareOpenMWConfig(openmw, data, configDir)) {
            SendExternalStatus(a_view, "openmw", "OpenMW configuration could not be generated from Morrowind.ini.");
            return;
        }
        const auto userData = configDir / "userdata";
        std::error_code ec;
        std::filesystem::create_directories(userData, ec);
        std::wstring parameters = L"--config \"" + configDir.wstring() + L"\" --user-data \"" + userData.wstring() +
            L"\" --data \"" + data.wstring() + L"\"";

        SHELLEXECUTEINFOW execute{ sizeof(execute) };
        execute.fMask = SEE_MASK_NOCLOSEPROCESS | SEE_MASK_NOASYNC;
        execute.lpVerb = L"open";
        execute.lpFile = openmw.c_str();
        execute.lpParameters = parameters.c_str();
        execute.lpDirectory = openmw.parent_path().c_str();
        execute.nShow = SW_SHOWNORMAL;
        if (!ShellExecuteExW(&execute)) {
            SendExternalStatus(a_view, "openmw", "Windows could not start OpenMW.");
            return;
        }
        if (execute.hProcess) CloseHandle(execute.hProcess);
        SendExternalStatus(a_view, "openmw", "OpenMW launched with the detected Steam Morrowind data.", true);
        g_ui.RequestMenu(kView, false);
    }

    const char* kSettings = R"json({
      "id":"starcade.arcade","title":"Starcade OS","accent":"#8df7c7","targetVersion":"1.0.0",
      "inputContexts":[{"id":"launcher","label":"Open Starcade","blocksGameplay":true}],
      "groups":[
        {"label":"Gameplay","settings":[
          {"key":"openKey","label":"Open Starcade","type":"key","default":"F9","inputContext":"launcher"}
        ]}
      ]
    })json";

    std::filesystem::path StatePath()
    {
        PWSTR raw = nullptr;
        if (SUCCEEDED(SHGetKnownFolderPath(FOLDERID_Documents, KF_FLAG_CREATE, nullptr, &raw)) && raw) {
            std::filesystem::path result(raw);
            CoTaskMemFree(raw);
            return result / "My Games" / "Starfield" / "Starcade" / "state.json";
        }
        return std::filesystem::path("Data") / "SFSE" / "Plugins" / "Starcade" / "state.json";
    }

    void LoadState()
    {
        std::scoped_lock lock(g_lock);
        g_statePath = StatePath();
        std::error_code ec;
        std::filesystem::create_directories(g_statePath.parent_path(), ec);
        std::ifstream in(g_statePath);
        if (in) {
            try { in >> g_state; }
            catch (...) {
                const auto bad = g_statePath.string() + ".bad";
                std::filesystem::copy_file(g_statePath, bad, std::filesystem::copy_options::overwrite_existing, ec);
                g_state = { { "version", 1 }, { "games", json::object() }, { "achievements", json::array() } };
                REX::WARN("Starcade: invalid state quarantined to {}", bad);
            }
        }
        if (!g_state.is_object()) g_state = json::object();
        if (!g_state.contains("games") || !g_state["games"].is_object()) g_state["games"] = json::object();
        for (auto& [id, entry] : g_state["games"].items()) {
            if (!entry.is_object()) {
                REX::INFO("Starcade: repaired legacy null state for game '{}'", id);
                entry = json::object();
            }
        }
        if (!g_state.contains("achievements") || !g_state["achievements"].is_array()) g_state["achievements"] = json::array();
    }

    // Publishes Starcade's own play state into AISS's shared, one-way file
    // bridge (Data/SFSE/AISS/state/starcade.ini), per AISS's documented
    // integration contract. Harmless no-op if AISS isn't installed - nothing
    // reads this file in that case. Titles are derived from the catalog id
    // (hyphens -> spaces, title-cased) rather than duplicating catalog.js's
    // display names in native code.
    std::string TitleFromGameId(const std::string& a_id)
    {
        std::string title = a_id;
        std::replace(title.begin(), title.end(), '-', ' ');
        bool capitalizeNext = true;
        for (auto& ch : title) {
            if (capitalizeNext && std::isalpha(static_cast<unsigned char>(ch))) {
                ch = static_cast<char>(std::toupper(static_cast<unsigned char>(ch)));
                capitalizeNext = false;
            } else if (ch == ' ') capitalizeNext = true;
        }
        return title;
    }

    std::string IniSingleLine(std::string a_text)
    {
        std::replace(a_text.begin(), a_text.end(), '\n', ' ');
        std::replace(a_text.begin(), a_text.end(), '\r', ' ');
        return a_text;
    }

    std::filesystem::path AISSStatePath()
    {
        const auto pluginDir = PluginDirectory();
        if (pluginDir.empty()) return {};
        return pluginDir.parent_path() / "AISS" / "state" / "starcade.ini";
    }

    // Prefers the real catalog title (sent by the JS side on launch, stored on the
    // game's own state entry) over a guess derived from the id - several ids diverge
    // from their real title (e.g. "five-card-draw" is really "Red Mile Hold 'Em").
    // Falls back to the derived form only for state saved before this field existed.
    std::string DisplayTitleForGame(const std::string& a_id)
    {
        const auto it = g_state["games"].find(a_id);
        if (it != g_state["games"].end() && it->is_object()) {
            if (const auto title = it->value("title", std::string{}); !title.empty()) return title;
        }
        return TitleFromGameId(a_id);
    }

    void WriteAISSStarcadeState()
    {
        const auto path = AISSStatePath();
        if (path.empty()) return;
        std::error_code ec;
        std::filesystem::create_directories(path.parent_path(), ec);

        std::string highScores;
        for (const auto& [id, entry] : g_state["games"].items()) {
            if (!entry.is_object()) continue;
            const auto best = entry.value("highScore", 0LL);
            if (best <= 0) continue;
            if (!highScores.empty()) highScores += ",";
            highScores += IniSingleLine(DisplayTitleForGame(id)) + ":" + std::to_string(best);
        }
        const auto lastPlayed = g_state.value("lastPlayedGame", std::string{});

        std::ostringstream out;
        out << "[starcade]\n";
        out << "ready=1\n";
        out << "schema_version=1\n";
        out << "last_played_game=" << (lastPlayed.empty() ? "" : IniSingleLine(DisplayTitleForGame(lastPlayed))) << "\n";
        out << "last_played_time_unix=" << g_state.value("lastPlayedTime", 0LL) << "\n";
        out << "high_scores=" << highScores << "\n";

        const auto temp = path.string() + ".tmp";
        { std::ofstream f(temp, std::ios::trunc); f << out.str(); }
        std::filesystem::rename(temp, path, ec);
        if (ec) {
            std::filesystem::copy_file(temp, path, std::filesystem::copy_options::overwrite_existing, ec);
            std::filesystem::remove(temp, ec);
        }
    }

    void SaveState()
    {
        std::scoped_lock lock(g_lock);
        std::error_code ec;
        std::filesystem::create_directories(g_statePath.parent_path(), ec);
        const auto temp = g_statePath.string() + ".tmp";
        { std::ofstream out(temp, std::ios::trunc); out << g_state.dump(2); }
        std::filesystem::rename(temp, g_statePath, ec);
        if (ec) {
            std::filesystem::copy_file(temp, g_statePath, std::filesystem::copy_options::overwrite_existing, ec);
            std::filesystem::remove(temp, ec);
        }
        WriteAISSStarcadeState();
    }

    void SendState(const char* view)
    {
        std::scoped_lock lock(g_lock);
        auto payload = g_state;
        if (auto* player = RE::PlayerCharacter::GetSingleton()) {
            if (const auto* name = player->GetDisplayFullName(); name && name[0] != '\0') payload["playerName"] = name;
        }
        if (!payload.contains("playerName")) payload["playerName"] = "PLAYER";
        g_ui.SendToWeb(view ? view : kView, "starcade.state", payload.dump().c_str());
    }

    auto CreditArgs(RE::BSFixedString a_request, std::int32_t a_delta)
    {
        return [request = std::move(a_request), a_delta](RE::BSScrapArray<RE::BSScript::Variable>& a_args) -> bool {
            a_args.resize(2);
            a_args[0] = request;
            a_args[1] = a_delta;
            return true;
        };
    }

    auto XPArgs(std::int32_t a_amount)
    {
        return [a_amount](RE::BSScrapArray<RE::BSScript::Variable>& a_args) -> bool {
            a_args.resize(1);
            a_args[0] = a_amount;
            return true;
        };
    }

    void DispatchXP(std::int32_t a_amount)
    {
        if (a_amount <= 0) return;
        auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
        if (!vm) {
            REX::WARN("Starcade: could not award {} XP because the Papyrus VM is unavailable", a_amount);
            return;
        }
        const RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> noCallback{};
        vm->DispatchStaticCall("x2357StarcadeRewards", "AwardXP", XPArgs(a_amount), noCallback, 0);
        // The stock XP HUD can be hidden behind the OSFUI menu. Send feedback
        // immediately as well; ReportXPResult later confirms it when the updated
        // Papyrus bridge is installed.
        const json result = { { "amount", a_amount } };
        g_ui.SendToWeb(kView, "starcade.xp", result.dump().c_str());
    }

    bool IsXPGame(std::string_view a_game, std::string_view a_category)
    {
        static const std::unordered_set<std::string_view> casinoGames{
            "blackjack", "video-poker", "five-card-draw", "roulette", "slots",
            "casino-dice", "high-low", "red-mile-bets", "red-mile-holdem"
        };
        return a_category != "casino" && !casinoGames.contains(a_game);
    }

    void SendCreditFailure(const char* a_view, std::string_view a_request, std::string_view a_error)
    {
        const json result = { { "requestId", a_request }, { "success", false }, { "error", a_error } };
        g_ui.SendToWeb(a_view ? a_view : kView, "starcade.credits", result.dump().c_str());
    }

    void DispatchCreditTransaction(const json& a_payload, const char* a_source)
    {
        const auto request = a_payload.value("requestId", "");
        const auto game = a_payload.value("game", "");
        const auto action = a_payload.value("action", "");
        const auto amount64 = a_payload.value("amount", 0LL);
        if (request.empty() || request.size() > 96 || game.empty() || game.size() > 64 ||
            (action != "balance" && action != "wager" && action != "payout" && action != "cancel")) {
            SendCreditFailure(a_source, request, "Invalid transaction request");
            return;
        }
        if (amount64 < 0 || amount64 > 1000000) {
            SendCreditFailure(a_source, request, "Transaction amount outside allowed range");
            return;
        }

        std::int32_t delta = 0;
        const auto amount = static_cast<std::int32_t>(amount64);
        {
            std::scoped_lock lock(g_lock);
            if (g_creditRequests.contains(request)) {
                SendCreditFailure(a_source, request, "Duplicate transaction request");
                return;
            }
            if (action == "wager") {
                if (amount <= 0 || g_wagerAmount != 0) {
                    SendCreditFailure(a_source, request, "A wager is already active");
                    return;
                }
                delta = -amount;
            } else if (action == "payout") {
                const std::unordered_map<std::string, std::int32_t> payoutCaps{
                    { "blackjack", 3 }, { "video-poker", 251 }, { "five-card-draw", 3 },
                    { "roulette", 36 }, { "slots", 101 }, { "casino-dice", 6 },
                    { "high-low", 8 }, { "red-mile-bets", 11 }
                };
                const auto cap = payoutCaps.contains(game) ? payoutCaps.at(game) : 3;
                if (g_wagerAmount <= 0 || g_wagerGame != game || g_wagerSettlementPending || amount > g_wagerAmount * cap) {
                    SendCreditFailure(a_source, request, "Payout does not match an active wager");
                    return;
                }
                delta = amount;
                g_wagerSettlementPending = true;
            } else if (action == "cancel") {
                if (g_wagerAmount <= 0) {
                    const auto pendingWager = std::ranges::any_of(g_creditRequests, [&](const auto& entry) {
                        return entry.second.action == "wager" && entry.second.game == game;
                    });
                    if (pendingWager) {
                        g_cancelAfterWagerGame = game;
                        SendCreditFailure(a_source, request, "Wager cancellation queued");
                        return;
                    }
                }
                if (g_wagerAmount <= 0 || g_wagerGame != game || g_wagerSettlementPending) {
                    SendCreditFailure(a_source, request, "No matching wager to cancel");
                    return;
                }
                delta = g_wagerAmount;
                g_wagerSettlementPending = true;
            }
            g_creditRequests.emplace(request, CreditRequest{ a_source ? a_source : kView, game, action, amount });
        }

        auto* vm = RE::BSScript::Internal::VirtualMachine::GetSingleton();
        if (!vm) {
            std::scoped_lock lock(g_lock);
            if (action == "payout" || action == "cancel") g_wagerSettlementPending = false;
            g_creditRequests.erase(request);
            SendCreditFailure(a_source, request, "Papyrus VM unavailable");
            return;
        }
        const RE::BSTSmartPointer<RE::BSScript::IStackCallbackFunctor> noCallback{};
        vm->DispatchStaticCall("x2357StarcadeCredits", "ProcessTransaction",
            CreditArgs(RE::BSFixedString(request.c_str()), delta), noCallback, 0);
    }

    using PapVM = RE::BSScript::IVirtualMachine;
    void ReportXPResult(PapVM&, std::uint32_t, std::monostate, std::int32_t a_amount)
    {
        if (a_amount <= 0) return;
        std::int64_t total = 0;
        {
            std::scoped_lock lock(g_lock);
            for (const auto& [_, entry] : g_state["games"].items()) {
                if (entry.is_object()) total += entry.value("xpAwardedTotal", 0LL);
            }
        }
        const json result = { { "amount", a_amount }, { "total", total } };
        g_ui.SendToWeb(kView, "starcade.xp", result.dump().c_str());
        REX::INFO("Starcade: awarded {} XP ({} total through Starcade)", a_amount, total);
    }

    void ReportCreditResult(PapVM&, std::uint32_t, std::monostate, RE::BSFixedString a_request,
        bool a_success, std::int32_t a_balance, RE::BSFixedString a_error)
    {
        const std::string request = a_request.c_str() ? a_request.c_str() : "";
        CreditRequest pending;
        bool refundAfterWager = false;
        std::string refundRequest;
        {
            std::scoped_lock lock(g_lock);
            const auto it = g_creditRequests.find(request);
            if (it == g_creditRequests.end()) return;
            pending = it->second;
            g_creditRequests.erase(it);
            if (a_success && pending.action == "wager") {
                g_wagerGame = pending.game;
                g_wagerAmount = pending.amount;
                if (g_cancelAfterWagerGame == pending.game) {
                    g_cancelAfterWagerGame.clear();
                    refundAfterWager = true;
                    refundRequest = "auto-cancel-" + std::to_string(++g_autoRequest);
                }
            } else if (!a_success && pending.action == "wager" && g_cancelAfterWagerGame == pending.game) {
                g_cancelAfterWagerGame.clear();
            } else if (pending.action == "payout" || pending.action == "cancel") {
                g_wagerSettlementPending = false;
                if (a_success) {
                    g_wagerGame.clear();
                    g_wagerAmount = 0;
                } else if (pending.action == "payout") {
                    refundAfterWager = true;
                    refundRequest = "auto-refund-" + std::to_string(++g_autoRequest);
                }
            }
        }
        const json result = {
            { "requestId", request }, { "success", a_success },
            { "balance", (std::max)(a_balance, 0) }, { "error", a_error.c_str() ? a_error.c_str() : "" }
        };
        g_ui.SendToWeb(pending.source.c_str(), "starcade.credits", result.dump().c_str());
        if (refundAfterWager) {
            DispatchCreditTransaction(json{
                { "requestId", refundRequest }, { "game", pending.game },
                { "action", "cancel" }, { "amount", 0 }
            }, pending.source.c_str());
        }
    }

    void BindPapyrus()
    {
        if (auto* gameVM = RE::GameVM::GetSingleton(); gameVM && gameVM->GetVM()) {
            gameVM->GetVM()->BindNativeMethod("x2357StarcadeNative", "ReportCreditResult", &ReportCreditResult, true, false);
            gameVM->GetVM()->BindNativeMethod("x2357StarcadeNative", "ReportXPResult", &ReportXPResult, true, false);
            REX::INFO("Starcade: Papyrus credit and XP callbacks bound");
        } else {
            REX::WARN("Starcade: Papyrus VM unavailable; casino transactions disabled");
        }
    }

    void OnCommand(const char* command, const char* payload, const char* source, void*) noexcept
    {
        try {
            const json p = json::parse(payload ? payload : "{}");
            if (std::string_view(command) == "starcade.arcade.state.get") {
                SendState(source);
                return;
            }
            if (std::string_view(command) == "starcade.arcade.credits.transaction") {
                DispatchCreditTransaction(p, source);
                return;
            }
            if (std::string_view(command) == "starcade.arcade.external.status") {
                SendExternalStatus(source, p.value("id", ""));
                return;
            }
            if (std::string_view(command) == "starcade.arcade.external.launch") {
                const auto id = p.value("id", "");
                if (id == "openmw") LaunchOpenMW(source);
                else if (id == "skyrim") LaunchNativeSteamGame(source, "skyrim", FindSkyrimExe());
                else if (id == "oblivion") LaunchNativeSteamGame(source, "oblivion", FindOblivionExe());
                return;
            }
            const auto game = p.value("game", "");
            if (game.empty() || game.size() > 64) return;
            if (std::string_view(command) == "starcade.arcade.score.submit") {
                const auto score = std::clamp<std::int64_t>(p.value("score", 0LL), 0LL, 999999999LL);
                auto& entry = g_state["games"][game];
                if (!entry.is_object()) entry = json::object();
                // Seed the reward watermark from pre-update saves before the
                // live score stream can raise highScore during this run.
                if (!entry.contains("xpRewardedScore")) entry["xpRewardedScore"] = entry.value("highScore", 0LL);
                entry["highScore"] = (std::max)(entry.value("highScore", 0LL), score);
                entry["lastScore"] = score;
                // Real catalog title from the JS side, so AISS export shows what the
                // player actually sees on screen rather than a guess derived from the
                // id (several ids diverge from their real title, e.g. "five-card-draw"
                // is really "Red Mile Hold 'Em").
                if (const auto title = p.value("title", ""); !title.empty()) entry["title"] = title;
                if (p.value("newRun", false)) {
                    entry["plays"] = entry.value("plays", 0LL) + 1;
                    g_state["lastPlayedGame"] = game;
                    g_state["lastPlayedTime"] = static_cast<std::int64_t>(std::time(nullptr));
                }
                SaveState();
            } else if (std::string_view(command) == "starcade.arcade.run.finish") {
                const auto score = std::clamp<std::int64_t>(p.value("score", 0LL), 0LL, 999999999LL);
                const auto category = p.value("category", "");
                const auto rank = std::clamp(p.value("rank", 99), 1, 99);
                auto& entry = g_state["games"][game];
                if (!entry.is_object()) entry = json::object();
                const auto priorRuns = entry.value("completedRuns", 0LL);
                const auto rewardedScore = entry.value("xpRewardedScore", 0LL);
                auto xp = 0;
                if (score > 0 && IsXPGame(game, category)) {
                    if (priorRuns == 0) xp += 5;
                    // Every genuine new personal record remains rewardable forever.
                    const bool newRewardableRecord = score > rewardedScore;
                    if (newRewardableRecord) {
                        xp += 10;
                        entry["xpRewardedScore"] = score;
                    }
                    auto& bestRewardedRank = entry["xpBestRewardedRank"];
                    const auto previousRank = bestRewardedRank.is_number_integer() ? bestRewardedRank.get<int>() : 99;
                    if (rank == 1 && previousRank == 1 && newRewardableRecord) {
                        xp += 20;
                    } else if (rank < previousRank) {
                        if (rank == 1) xp += 50;
                        else if (rank <= 3) xp += 25;
                        else if (rank <= 5) xp += 15;
                        else if (rank <= 10) xp += 10;
                        bestRewardedRank = rank;
                    }
                    entry["xpAwardedTotal"] = entry.value("xpAwardedTotal", 0LL) + xp;
                }
                entry["highScore"] = (std::max)(entry.value("highScore", 0LL), score);
                if (!entry.contains("recentScores") || !entry["recentScores"].is_array()) entry["recentScores"] = json::array();
                entry["recentScores"].push_back(score);
                while (entry["recentScores"].size() > 10) entry["recentScores"].erase(entry["recentScores"].begin());
                entry["completedRuns"] = entry.value("completedRuns", 0LL) + 1;
                SaveState();
                DispatchXP(xp);
                SendState(source);
            } else if (std::string_view(command) == "starcade.arcade.save.set") {
                auto& entry = g_state["games"][game];
                if (!entry.is_object()) entry = json::object();
                entry["save"] = p.value("value", json{});
                SaveState();
            } else if (std::string_view(command) == "starcade.arcade.achievement.unlock") {
                const auto id = p.value("id", "");
                if (!id.empty() && std::find(g_state["achievements"].begin(), g_state["achievements"].end(), id) == g_state["achievements"].end()) {
                    g_state["achievements"].push_back(id);
                    SaveState();
                }
            }
        } catch (const std::exception& e) { REX::WARN("Starcade command rejected: {}", e.what()); }
    }

    void OnHotkey(const char*, const char*, void*) noexcept { g_ui.RequestMenu(kView, true); }

    void Connect()
    {
        if (!g_ui.Init()) { REX::WARN("Starcade: OSF UI bridge unavailable"); return; }
        g_ui.RegisterView(kView);
        g_ui.RegisterSettingsSchema(kSettings);
        g_ui.RegisterCommand("starcade.arcade.state.get", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.score.submit", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.run.finish", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.save.set", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.achievement.unlock", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.credits.transaction", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.external.status", OnCommand, nullptr);
        g_ui.RegisterCommand("starcade.arcade.external.launch", OnCommand, nullptr);
        g_ui.SubscribeHotkey("starcade.arcade", "openKey", OnHotkey, nullptr);
        REX::INFO("Starcade: OSF UI connected; launcher and persistence registered");
    }

    void OnMessage(SFSE::MessagingInterface::Message* msg)
    {
        if (!msg) return;
        if (msg->type == SFSE::MessagingInterface::kPostLoad) Connect();
        if (msg->type == SFSE::MessagingInterface::kPostDataLoad) BindPapyrus();
    }
}

SFSE_PLUGIN_LOAD(const SFSE::LoadInterface* sfse)
{
    SFSE::Init(sfse, { .logLevel = REX::ELogLevel::Info });
    Starcade::LoadState();
    if (const auto* messaging = SFSE::GetMessagingInterface()) messaging->RegisterListener(Starcade::OnMessage);
    return true;
}
