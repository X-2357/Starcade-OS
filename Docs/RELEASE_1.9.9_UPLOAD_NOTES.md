# Starcade OS 1.9.9 - Nexus upload notes

## r2 (2026-11-04) - USE THIS ONE: same 1.9.9 with the fixed Starcade.dll (1.7.3)

| | |
|---|---|
| File | `outputs\Release-1.9.9\Starcade-OS-1.9.9-r2.zip` (kept outside the repo; 498,328,416 bytes) |
| SHA-256 | `7CBA56F6FBB0791E81E80E85630DB21609D29DC639921EC41923A05A8C70CD18` |
| What changed vs the original 1.9.9 zip | only `Data/SFSE/Plugins/Starcade.dll` (1.7.2 -> 1.7.3, sha 0389EDED65E57C8A...) and one added line in the bundled `Docs/CHANGELOG.md` |
| Version to enter on Nexus | `1.9.9` (owner confirmed 2026-11-04 that the original 1.9.9 was never uploaded, so no renumbering) |

Why: the 1.7.2 DLL could end the game with "Starcade.dll: Failed to open Address Library file" (see `Docs/ADDRESS_LIBRARY_ERROR_2026-10-27.md`). 1.7.3 was confirmed in game on 2026-11-02 (log: `Starcade v1.7.3.0`, Address Library readable on attempt 1, Papyrus callbacks bound).

How it was made: the original `Release-1.9.9/Starcade-OS-1.9.9.zip` no longer exists on disk (folder last modified 2026-10-21 22:52, not by this session), so r2 was rebuilt from the same inputs with the same builder as at the 1.9.9 commit (`61c629a`: `tools/build_release_zip.py`, repo override files and docs as of that commit) and the `Starcadeos` MO2 folder, which has changed since 1.9.9 only by this DLL. NOTE: `tools/build_release_zip.py` in the repo has since been reworked by Codex for the 1.7.4 Razor Derby package and can no longer produce 1.9.9.

Verified by re-reading the finished zip: 1,683 entries (same count as the original), `Data/` only top-level entry, no `meta.ini`/`starcade.ini`, 84 mp3 and no duplicate, footer VERSION 1.9.9, Hextris `main.js`/`save-state.js`, `x2357starcade.esm` and `x2357StarcadeTerminal.pex` have the same sha256 prefixes recorded when the original zip was verified, DLL is the confirmed 1.7.3 build.

NOT verified: this exact zip has not been installed into a fresh MO2 folder or run. Each part was seen working separately (1.9.9 content on 2026-10-20 with the 1.7.2 DLL; DLL 1.7.3 on 2026-11-02); the combination in one package has not been run. The text further down describes the original zip; where it says `Starcade.dll` unchanged or 1.7.2, r2 differs as above.

---

# Original 1.9.9 build notes (2026-10-21)

Built 2026-10-21 from the tested MO2 folder `C:\Modding\MO2\mods\Starcadeos` with `tools/build_release_zip.py`.

| | |
|---|---|
| File | `Starcade-OS-1.9.9.zip` (kept outside the repo; 498,326,064 bytes) |
| SHA-256 | `EC671DD2F43E45C9D97409C7E8E6F233E6F87EA05537CBFF656B88DE04C69992` |
| Version to enter on Nexus | `1.9.9` |
| File category | Main file (replaces the previous main file; archive the old one) |
| Structure | only top-level entry is `Data/`; forward-slash entries; 1,683 entries; no `meta.ini`, no AISS seed, no saved state |

## Text for the Nexus "file description" / changelog field

Starcade OS 1.9.9 (includes everything since 1.9.5)

- Hextris works again. Old Hextris saves in your profile could break the game on launch; it now ignores that old data. Fully restart Starfield after installing.
- 21 more background tracks (84 total). Drop your own .mp3 files into the audio/music folder and they appear in the track list as before.
- The track-list button, a bigger volume slider and the wrist-watch Starcade Pad from 1.9.4-1.9.6 are included.
- Install over the previous version and let it replace the old Starcade files.

(Do not claim in the Nexus text that AISS now reads your last game - the writing half is confirmed, the AISS reading half is not yet.)

## What is in the zip, and what was checked

Verified by re-reading the finished zip (not by trusting the builder): single `Data/` root; Hextris `main.js` / `save-state.js`, `Starcade.dll`, `x2357starcade.esm` and `x2357StarcadeTerminal.pex` are byte-identical to the files tested in game; footer reads VERSION 1.9.9; 84 mp3 files and no duplicate.

Differences from the tested `Starcadeos` folder (all intentional):

1. Launcher footer `VERSION 1.9.8` -> `1.9.9` (the only code change after testing).
2. `audio/music/SOURCE-AND-LICENSES.txt` is the repo's current copy, which lists the 21 new tracks.
3. The byte-identical duplicate `enlia-...571630(1).mp3` is left out.
4. The loose root documents (CHANGELOG, README, licenses, third-party notices) are placed in `Data/SFSE/Plugins/Starcade/Docs/` instead of beside `Data/`; `meta.ini` is dropped. Delete the `Docs` folder from the zip if you do not want it - nothing reads it.

## Not verified

- A fresh install of this exact zip into an empty MO2 mod folder has not been run.
- Micropolis buttons (owner report), AISS reading the bridge file in conversation, and the individual source/license pages for the 21 new tracks.
- The repo's `x2357StarcadeTerminal.psc` calls `OSFUI_View.Open`, but the shipped `.pex` (and the `.psc` in the zip) call `OSFUI.OpenMenu`. The zip ships the `.psc` that matches its `.pex`. The repo source is not what was compiled.
- `Starcade.dll` is the build already installed; it was not rebuilt this session.
