# Starcade Address Library file-open error — October 27, 2026

Owner reports dialog when trying to close Starfield. Screenshot 2026-10-27 121255.png shows Starcade.dll, REL/IDDB.cpp(25), Failed to open Address Library file, requested C:/Steam/steamapps/common/Starfield/Data/SFSE/Plugins/versionlib-1-16-244-0.bin.

## Read-only findings

### Evening update — owner discriminator answered

Owner reports Starcade enabled fails to load and disabling it permits loading. Screenshot 2026-10-27 223836.png shows the SAME IDDB.cpp(25) file-open dialog on the LOAD screen. This supersedes the quit-only framing. Owner also reported Creations downloads deactivated mods, but the assistant's response attributing the incident to that alone was premature; restoration has not demonstrated a pass with Starcade enabled.

Latest inspected Starcade.log (not necessarily the screenshot's exact session) records startup 22:59:48.630, OSF connection 22:59:49.079 and the same fatal read at 23:01:14.283. No callbacks-bound entry. Latest sfse.txt is from a later session (UTC October 28 06:03:53); do not merge it with Starcade's earlier failed session. Current selected MO2 profile is now main; its modlist has both Starcade installs disabled and Address Library/OSF UI enabled. Therefore current disabled configuration cannot disprove the owner's prior enabled failure. Starcadeos DLL hash is unchanged from the morning.

Later OSF UI log has another legacy source-file read failure (shop/app.js); it belongs to another view/session and is only a lead for shared file-access investigation. No causal OSF UI 2.0 regression is proven. Correct database exists with ordinary Archive attributes.

Next discriminator: inspect/read the exact database from inside the affected MO2/SFSE process context (or a controlled MO2-launched probe), distinguishing filesystem exists from actual stream read, and correlate with Starcade's first relocation/Papyrus binding. A stack trace or targeted diagnostic DLL requires reconstructing the actual build dependencies; no active osf-ui dependency checkout is established here. Do not silently rebuild with unrelated vendored headers or strip callbacks required for wagers/XP.

- Installed Starfield.exe file version 1.16.244.0 matches requested filename.
- Matching file exists in C:/Modding/MO2/mods/Address Library for SFSE Plugins/SFSE/Plugins, length 5,099,968 bytes. meta.ini identifies All in one v22 for 1.16.244.0.
- Selected MO2 profile from ModOrganizer.ini: X2357 Individual Skin Testing. Its modlist enables Address Library, Starcadeos and OSF UI; old X-2357's Starcade OS is disabled. Configuration evidence only, not a complete winning VFS audit.
- No matching file in physical Steam Data during inspection; that alone is normal under MO2 and does not prove absent VFS content.
- Starcade.log: 11:50:43.034 Starcade v1.7.2.0; 11:50:43.469 OSF UI connected; 11:51:17.634 fatal file-open error. No Papyrus callbacks-bound entry in that short log.
- OSF UI.log: v2.0.0.0, Starcade discovered as legacy view; Papyrus OSFUI bound 11:50:56.152. At 11:51:17.627 an OSF Animation legacy settings JSON cannot be opened and its file is preserved. These are adjacent file-access failures, not proof of common cause.
- sfse.txt says Starcade loaded correctly, handle 14.
- Enabled-folder Starcade.dll SHA256 07dcb76896cc173b6424ba192394596247d241fd5d012c3ef370175ce7fda043, size 845,312. Native metadata 1.7.2 is not necessarily the whole mod/package version.

## Source trace and limits

Vendored Dependencies/commonlib-shared/src/REL/IDDB.cpp:25 raises this exact message when std::ifstream fails to open the computed database path. Its constructor first tests filesystem existence, then opens the stream. This identifies the open stage, not a missing relocation ID or proven wrong game version. Actual installed DLL build dependency equivalence has not been established.

Starcade OnMessage(kPostDataLoad) calls BindPapyrus, which calls RE::GameVM::GetSingleton; its vendored header uses a static REL relocation. This is a candidate lazy first-use path. No stack trace or diagnostic establishes that it caused this event. There is no explicit quit handler in inspected Starcade main.cpp. Therefore do not label this a proven shutdown bug or rebuild/add shutdown guards from the screenshot alone.

Log error time is 11:51:17; screenshot time is about 12:12. Owner clarification needed: whether this dialog first appeared only on Quit, and whether the game loaded a save/Starcade successfully during that session. Preserve the owner's observation; discrepancy is a discriminator, not grounds to dismiss it.

## Next exact action

Establish the actual event timeline and MO2 VFS visibility at the failure. On a fresh normal MO2/SFSE launch, record whether main menu/load-save/Starcade/quit first raises the dialog; preserve logs immediately afterward. If needed, inspect the process-specific usvfs trace or controlled file-open diagnostics to separate file visibility, access/sharing and native first-use timing. Do not copy/rename a different version database into Steam Data, reinstall unrelated mods or change shared OSF runtime as a speculative fix.

No gameplay/plugin/config/deployment changes made. Root cause unresolved; file is installed/enabled, but successful read from the failing process is not proven.

## October 29 update (owner confirmed Starcade is the trigger)

Owner: Starcade crashes the game and the dialog (Starcade.dll, REL/IDDB.cpp(25), shown on the LOAD screen) is the warning; disabling Starcade stops it.

- The version database IS physically present at C:\Steam\steamapps\common\Starfield\Data\SFSE\Plugins\versionlib-1-16-244-0.bin (5,099,968 bytes, dated 2026-06-13) and also in the MO2 Address Library mod. Starfield.exe is 1.16.244.0. So this is an open failure on a file that exists, not a missing or wrong-version file.
- Timing: Starcade's fatal at 11:51:17.634 came 7 ms after OSF Animation failed to open its own settings file at 11:51:17.627 (see above). Two unrelated plugins failing to open files in the same instant points to a process-wide transient file-open failure; Starcade is the one that hard-stops on it (commonlib REX::FAIL), the others fail soft. UNVERIFIED as the mechanism.
- OSF UI.log / OSF UI.1.log / OSF Animation.log from the two Oct 28 launches (Starcade disabled) contain no open failures.
- Starcade's code is unchanged since Oct 20 (Hextris/music/AISS-writer all worked in game that day, OSF UI 2.0.0 already installed since Oct 2). Something other than Starcade's files changed between Oct 20 and Oct 27. Candidates, none tested: Creations downloads that deactivated mods (owner report), profile `main` also enabling Settled Systems Radio (RFSSRadio.dll, not in the Individual Skin Testing profile), general system file-access pressure.
- Windows recorded no Starfield APPCRASH since Oct 7 (those two were OSFUI.dll 1.6, offset 0x114ed0); the Address Library dialog is a message box, not a recorded crash.
- Build feasibility: xmake and VS 18 Build Tools are installed; the osf-ui sibling checkout that Native/xmake.lua includes (../osf-ui/lib/commonlibsf) is NOT on this machine and must be cloned from GitHub (needs the owner's yes: it is a download).
- Candidate fix (not built, hypothesis): before Starcade's first relocation use, open the database with a short bounded retry and log each attempt, so a transient failure is survived and the log names when and how often it happens. Additive; no change to wagers, XP or the AISS writer.

## October 29 later — native 1.7.3 built (owner: "double check everything and rebuild it anyway")

Mechanism, from the vendored source (the dialog's own file and line, IDDB.cpp(25), match the vendored copy exactly): `REL::ID::offset()` calls `IDDB::GetSingleton()`, whose first call opens `versionlib-<exe version>.bin` with `std::ifstream` and ends the game via `REX::FAIL` if it will not open. Starcade's first address use was `BindPapyrus` (`RE::GameVM::GetSingleton`) at `kPostDataLoad`. The 10/27 11:50:43 plugin start -> 11:51:17 failure gap (34 s) is that message. UNVERIFIED: why the open fails at that moment.

Change (Native/src/main.cpp, plugin 1.7.2 -> 1.7.3): `EnsureAddressLibrary(stage, attempts)` probes the same file the same way (ifstream, reads 4 bytes), up to 20 tries 250 ms apart, logs `exists / errno / winerror` per failed try, and only then lets commonlib open it. Called at `SFSE_PLUGIN_LOAD` and again in `BindPapyrus`. `g_addressLibraryReady` (atomic) gates the four address-using sites (player name in SendState, the VM lookups in DispatchXP and the credit path, BindPapyrus), so an unreadable file turns wagers/XP/player-name off with a log line instead of ending the game. Nothing else changed.

Checked (outside the game): builds clean against the vendored CommonLibSF via a git-ignored junction `osf-ui/lib/commonlibsf` -> `Dependencies/CommonLibSF`. Calibration: the unchanged HEAD source rebuilt with the same setup gives 845,824 bytes with the same 20 imports and exports as the shipped 845,312-byte DLL; the new DLL is 850,432 bytes. The probe was tested standalone: real file READABLE; same file held with no sharing -> NOT readable, winerror 32, readable again once released; missing -> winerror 2; empty -> not readable. NOT tested: anything inside Starfield.

Build identity: new DLL sha256 0389EDED65E57C8A9BCF69F3933ADE8349D975E18F54733AAA966EF3829239FB, file version 1.7.3.0, in `outputs/Starcade-DLL-1.7.3/` with the previous 1.7.2 DLL (07DCB768...) beside it for rollback. Deployed to MO2 `Starcadeos/SFSE/Plugins/Starcade.dll` (hash verified). A run of the new build is recognisable by `Starcade v1.7.3.0` in Starcade.log.

Test card (about 3 minutes): enable Starcadeos in the profile you play, start Starfield, reach the main menu and open Load. Pass: no dialog, and Starcade.log shows `Starcade v1.7.3.0`, then `Address Library readable (stage: plugin load, attempt 1)`, then later `Papyrus credit and XP callbacks bound`. Fail with dialog: send the screenshot plus Starcade.log. Fail without dialog: Starcade.log will show `Address Library not readable ... winerror=N` lines - N names the cause (32 = another program holds the file; 5 = access denied; 4 = too many open files). Do not relaunch immediately after a failure; wait for the old process to exit.
