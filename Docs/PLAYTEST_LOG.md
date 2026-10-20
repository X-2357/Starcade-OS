# Gameplay evidence and next test
Updated October 6, 2026. No new gameplay, deployment, compilation or record inspection performed during this documentation session.

| Date / build | Result | Evidence limits |
|---|---|---|
| July 28 / 1.7.3 validation | Owner confirmed launches, real credit changes, Dice, Racing Book, High/Low, wager recovery and controls | Historical RELEASE-VALIDATION.md; no winning digest recorded |
| August 29/30 | Owner confirmed Billiards rendering and OpenMW launch | Brain session history; exact current assets not attributed |
| September 15 / public 1.9.5 | Owner confirmed Nexus upload | Brain report, not live Nexus query in this session |
| September 27 / 1.9.6-7 | Owner confirmed music track list and expanded tracks in-game | Brain owner report; no digest recorded; preserve its feature-specific pass |
| September 27 / 1.9.8 | Hextris fresh launch + true save/reload passed browser checks | Not a Starfield runtime pass; Micropolis Play/Budget/Road passed browser, owner button report remains unresolved |
| September 30 / AISS handoff | Reader built against real earlier Starcade file; writer-to-AISS after shadow cleanup not observed | AISS Docs/HANDOFF_TO_STARCADE_2026-09-30.md |
| October 6 / setup | Remote baseline and source contract inspected | Documentation only; no gameplay claim |

## PT-001: existing Starcade/AISS bridge (first priority)
Build: record current winning MO2 Starcade.dll, launcher/main.js/catalog.js and x2357starcade.esm paths + SHA256; AISS backend/version and enabled profile. Historical Starcadeos is a candidate, not proof of current winner.
Initial state: inspect AISS physical seed/state and MO2 overwrite shadow; preserve copies of existing state before changing ownership. Confirm actual seed ownership and whether current DLL includes 6b26c7e diagnostics. No blind deletion of overwrite file.
Action: cold start Starfield after view changes; open Starcade, play one supported scored game and establish an attributable new score; return to library; mention that game/arcade to an AISS speaker.
Expected: complete schema-1 snapshot updates in AISS's physical state root, includes exact new score and title; native log names destination/success; AISS logs active (N games, last: <game>) with full relevant block. Older valid scores persist. No second reward due solely to reading/reloading.
Observed Oct 20 (partial): WRITER half PASS. Starcade.log 15:10:31 local "AISS bridge writing to C:\Steam\...\Data\SFSE\AISS\state\starcade.ini" then "write succeeded"; MO2 put the file in the live mod folder C:\Modding\MO2\mods\AISS_v3.7.7\SFSE\AISS\state\starcade.ini (mtime 15:10:31, ready=1, last_played_game=Hextris, 11 real high scores). The physical Steam Data path holds no file (MO2 redirects it) - that is not a failure. READER half NOT YET TESTED: aiss_rebuilt_backend.log (UTC; local = UTC-7) shows found_not_ready at 22:01Z and 22:02Z (15:01-15:03 local) i.e. BEFORE the first write; every Starcade-context line Oct 8-20 is found_not_ready. Previously this bridge was reported working from source and compile evidence only. Next: talk to an AISS NPC about the arcade now that the file is ready=1; pass = AISS log shows active (N games, last: Hextris) and the NPC names it.
Evidence: attach both file snapshots, hash/build manifest, native/AISS log excerpts, exact action/observed dialogue. If found_not_ready, distinguish inert seed from torn read and wrong VFS owner before editing.
Cleanup: preserve actual score state; restore any temporary test configuration. Shadow cleanup requires verified destination and protected prior content.

## PT-002: Hextris 1.9.8 follow-up
October 20 update: owner reported Hextris still broken in Starfield after 1.9.8 (reports of Oct 14-20). Cause found from the owner's real WebView2 saveState: 58 old function-source strings that the 1.9.8 save merge copied over the real methods (fresh-profile browser tests could not see this). Fix: parseSavedState in save-state.js / main.js, deployed to MO2 Starcadeos (main.js sha256 a2ffd4bd37e59b32..., save-state.js 7bdf29629e8d4737...; rollback copies kept in session scratchpad). Browser-verified only.
Test card (needs a FULL Starfield restart, not a save reload - OSF UI mirrors views at launch): launch Starfield, open the arcade, start Hextris, press Play. Pass: blocks fall and the hex rotates with the arrow keys / A-D. Then quit Hextris, reopen it: pass = it restores or starts without blank screen. Fail: describe exactly what is on screen (blank, frozen, menu only) and whether the hex is drawn.
Observed October 20 (owner, after full Starfield restart, build = the hashes above in MO2 Starcadeos): "hextris worked". PASS in Starfield. Owner gave no detail on the quit/reopen step, so restore-on-reopen is not separately attributed.
Original card follows.
Winning build/hash + initial localStorage/native save attribution required. Cold-start corrected view, begin fresh run, observe blocks/rotation, save, close and reload, confirm restored blocks animate. Expected no CSP eval error and callable restored game objects. Observed NOT RUN in Starfield for 1.9.8. Record failure stage and actual error; do not reuse disproven focus/rAF theories.

Future cards: exact build, initial state, one action sequence, expected/observed, evidence, cleanup. Completion/repeat/cancel/timeout/combat/actor loss/quest stop/unload/death/reload/missing dependencies coverage selected per actual feature lifecycle.

## PT-003: October 6 music additions
Install audio-only overlay above Starcade in MO2/Vortex; preserve base mod and fully close/restart Starfield so OSF UI rebuilds its mirror. Open music list and select a new track (e.g. Enlia Cozy Cyberpunk), then next/previous, volume and toggle, enter a game and return. Expected new songs play, pause/resume and controls retain established behavior. Source library total 84; an older installed base may have fewer existing songs. Observed Oct 20: owner reported the new music tracks work in game (no per-track detail; hashes not recorded). PASS. Record winning archive/file hashes, base version and actual playback. No CK or save rework. Optional-mod behavior is unchanged: this is local launcher audio; no publisher fields or sibling mutation.
