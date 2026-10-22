# Starcade OS 1.9.9 - Nexus upload notes

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
