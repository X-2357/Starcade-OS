# Handoff to the Starcade OS chat - 2026-09-30

From the AISS chat. **Nothing in the Starcade repo was edited or committed from here** (files were only
read) - this is what AISS now does with your file, one thing that can silently break it, and two
sentences in your `AISS-Bridge/README.md` that are no longer true.

## 1. What AISS does now (AISS v3.6.0)

AISS reads `<AISS mod>/SFSE/AISS/state/starcade.ini` and tells characters the game the player last
played and their best score in each game. Read-only: nobody plays a game or changes a score in
conversation. It was built from the real file (`C:\Modding\MO2\overwrite\SFSE\AISS\state\starcade.ini`,
11 games on 2026-09-29), not from the README.

Keys AISS depends on - please do not change any of them without telling the AISS chat first:

| Key | What AISS does with it |
|---|---|
| `ready` | `1` = readable. `0` (the seed, or a write in progress) = skipped silently. |
| `schema_version` | Must be `1`. Greater than 1 shows nothing (`unsupported_schema`) until AISS is updated - so a bump is a coordinated change, not a quiet one. |
| `last_played_game` | Named as "most recently played". |
| `last_played_time_unix` | Real wall-clock Unix seconds. Only ever turned into "just now" / "earlier today", and only when under a day old. |
| `high_scores` | `Title:score,` pairs, trailing comma, raw text (no percent-encoding). AISS reads the lazy title up to the colon that is followed by a number, so `Freedoom: Phase 1:120,` is fine. **A title containing a comma cannot be recovered and is skipped.** |

**Always write every key, even when empty** (your own seed does). AISS treats `ready=1` with
`high_scores` or `last_played_game` missing as a read that landed mid-write and shows nothing for that
turn rather than half a file.

**Title text matters.** When the player says a game's name, AISS recognises it by matching the titles in
the file (a whole title of 6+ characters, or a tail of 2+ words / one 9+ character word - so "hold em"
finds `Red Mile Hold 'Em`). Renaming a title in Starcade changes what AISS recognises; keep them stable.

**There is deliberately no freshness window.** You republish only when something is saved, so a file
from last month is still exactly true. (SSSE and Crew Titles republish on a timer and are aged out after
10 minutes; copying that here would have silently disabled the feature for anyone who had not played
today.) Your file also has no `source` key and AISS does not require one.

## 2. The one thing that can silently kill it - the seed

Your README (`AISS-Bridge/README.md`, "Why the seed lives here, not in AISS") says each companion mod
ships the inert seed for its own `state/<mod>.ini`. **AISS's contract is the reverse, and the reversal
is load-bearing** (`Docs/AISS_INTEGRATION_CONTRACT.md`, seed paragraph; Crew Titles hit it 2026-09-13,
SSSE 2026-09-18):

- Under Mod Organizer the mod that ships a file OWNS its path in the VFS and receives the game's writes.
- The AISS backend runs OUTSIDE the VFS and reads only AISS's own mod folder.
- So if a Starcade package ships `Data/SFSE/AISS/state/starcade.ini` and outranks AISS, Starcade's saves
  land in Starcade's folder while AISS keeps reading its own inert seed - **forever, with no error
  anywhere**. The health check would say `found_not_ready`, which is also the normal quiet state.

AISS ships `SFSE/AISS/state/starcade.ini` (`ready=0`, empty fields) as of v3.6.0. **Please ship NO file
under `SFSE/AISS/` in any Starcade release package.** Checked 2026-09-30 with `ls -d SFSE/AISS` in each
folder under `C:\Modding\MO2\mods`: the enabled `Starcadeos` and the `Starcade-OS-1.8.0`, `1.9.0` and
`1.9.1` MO2 installs have no `SFSE/AISS` folder at all, so nothing is wrong right now - this is to keep
it that way. Keeping the seed in your repo as documentation (your `AISS-Bridge/` folder) is fine; just
keep it out of what you package.

## 3. Two README sentences that are no longer true

1. *"AISS handles a missing file cleanly ... the same generic way it already reads any other companion
   mod's state file - no seed or advance knowledge of Starcade specifically required on AISS's side."*
   There is no generic reader. Until v3.6.0 AISS read nothing from `starcade.ini` at all; it now has a
   reader written for exactly this file, plus a seed, a health-check row, a package-manifest entry and a
   test that fails by name if any of those goes missing.
2. The seed-ownership paragraph above.

## 4. Things you may want to know

- **The ecosystem table said you publish "credits won" and a "favourite cabinet". The real file has
  neither.** Corrected in `X2357_MOD_ECOSYSTEM.md` today. If a payout figure is wanted (SSSE could treat
  a big win as consumer-sector activity), it is a new key on your side - tell the AISS chat and it will
  read it additively.
- **Existing installs have a copy in MO2's `overwrite\` folder** (yours was last written 2026-09-27).
  Under v3.6.0 the AISS health check names it as shadowing; deleting it once lets your next save land in
  the AISS folder. That Starcade's next save then lands there is **inferred from the SSSE precedent, not
  yet observed for Starcade**.

## 5. Your side of the acceptance test

After the owner deletes the `overwrite\` copy and plays any game to a new score: the changed file is
`<AISS mod folder>\SFSE\AISS\state\starcade.ini` (not `overwrite\`), its `high_scores` carries the new
number, and the AISS log reads `Starcade context: active (N games, last: <game>) -> ...` once the player
next mentions the arcade. If the file changes under `overwrite\` instead, something outranks AISS or the
copy was not deleted.
