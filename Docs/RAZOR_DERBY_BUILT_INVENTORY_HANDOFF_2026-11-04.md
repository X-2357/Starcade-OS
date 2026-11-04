# Razor Derby — what is already built in Starcade (inventory for the standalone-mod chat)

Written 2026-11-04 from the source at `main` (gameplay last changed in commit `9ff9e65`).
**This is the inventory. The owner decisions and the rebuild direction are in
[RAZOR_DERBY_STANDALONE_HANDOFF_2026-11-03.md](RAZOR_DERBY_STANDALONE_HANDOFF_2026-11-03.md)
— read that first, then this.** Where the two disagree, the source code wins; tell the owner.

How this was produced: every module below was read in full by me, plus the launcher
seam, the host script, the native prize handler and the Papyrus ledger. **The tests were
not re-run by me** (their results below are Codex's recorded results). **Nothing here
has ever been run in Starfield** — see section 12.

## 1. Reading order

1. The 11-03 standalone handoff (decisions, direction, ecosystem rules).
2. This file.
3. `Docs/RAZOR_3D_REBUILD_2026-11-03.md` (scoped direction, no code exists).
4. The source in section 3, starting with `engine.js`.
5. `Docs/ADDRESS_LIBRARY_ERROR_2026-10-27.md` (section 11 explains why it matters to you).
6. Workspace rules `C:\Users\MwMak\OneDrive\Documents\CLAUDE.md` (25 rules) and the ecosystem
   contract `...\ModSource\X2357_MOD_ECOSYSTEM.md`.

## 2. Where everything lives

| What | Where |
|---|---|
| Repo (read-only reference for you) | `C:\Users\MwMak\Documents\Codex\2026-10-06\https-github-com-x-2357-starcade\outputs\Starcade-OS`, remote `X-2357/Starcade-OS` |
| Game source | `Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby/` (13 files, ~3,000 lines of dense JS) |
| Tests | `tests/razor-*.mjs` (14), `tests/derby-prize-policy.cpp`, `tests/frontier-convoy.mjs` (a different game) |
| Prize service | `Native/src/main.cpp` + `Native/src/DerbyPrizePolicy.h`; Papyrus `Web-and-Papyrus/Source/x2357StarcadeDerbyPrizes.psc`, `x2357StarcadePlayerAlias.psc`, `x2357StarcadeNative.psc` |
| Launcher seam | `launcher/main.js` (lines ~302-406), `launcher/games/host.js`, `launcher/games/catalog.js` entry `razor-derby` |
| Installed for the owner (MO2, profile `main`) | `C:\Modding\MO2\mods\Starcade OS - Scouting Development 2026-11-03` — Starcade-OS plus Razor Derby, native DLL 1.7.4 (sha256 `86d1274b…15bdf`) |
| Install archive | `outputs/Release-Development-2026-11-03/Starcade-Derby-Scouting-Development.zip`, sha256 `95c36a24…fa95f6`, receipts in `outputs/MO2-Scouting-Deployment-2026-11-03/` |
| License | Original Starcade game, Starcade OS MIT License (`LICENSE-MIT.txt`). Preserve attribution when porting. |

Do not disturb the installed Starcade build or write to the Starcade repo from the new chat.

## 3. The game, module by module

All modules are plain browser scripts (no build step) that attach to `window` (`RazorDerby`,
`RazorSeason`, ...). `index.html` loads them under a strict CSP: `default-src 'self'; script-src 'self'; connect-src 'none'`
(no inline scripts, no network, no eval). It also links the shared stylesheet `../game.css` — a Starcade dependency.

| File | Lines | Role |
|---|---|---|
| `engine.js` | 162 | The match simulation. Pure, deterministic, seeded. `RazorDerby = {create, step, restore, target, pass, shoot, shotTarget, challenge, distance, team, LIMIT}`. |
| `legacy-season.js` | 14 | The original 4-team, 3-round season (schema 1). Kept so old saves still load. |
| `season.js` | 36 | The 8-team career (schema 2): rosters, fixtures, standings, per-player stats, XP/levels, training, lineups, rollover, validation. `RazorSeason = {...}` |
| `aim.js` | 7 | Shot-lane choice: Auto / Upper / Lower. |
| `coach.js` | 23 | The optional live coach: reads match state and returns the on-screen hint, energy, recovery, range, and whether the chosen pass lane is covered. |
| `practice.js` | 36 | Three training drills (passing, finishing, defending) as seeded setups with their own checkpoints, goals and no rewards. |
| `report.js` | 26 | Builds the factual match report (team counters, per-player table, hints) from the real match telemetry. |
| `records.js` | 7 | The exhibition record list: latest 10 results, validated, de-duplicated by id. |
| `prizes.js` | 24 | Turns the career history into prize entitlements (credits / items). **Starcade-specific; see section 7.** |
| `presentation.js` | 63 | Draw-side helpers: league leaders, arena colours/geometry, court feedback (ball-direction tail, energy), pre-match scouting. |
| `game.js` | 327 (49 KB) | The shell: canvas rendering, input, menus/overlay, save/restore, host messaging, all screens. The biggest file and the least separated one. |
| `index.html`, `style.css` | | Page and styling. |

## 4. Match rules, exactly as implemented (rules version 1)

This is a flat 2-D game. **It is not 3-D** and has no height, vertical control, attacks or techniques.

- Fixed 60 ticks per second; a match is 7,200 ticks = 2 minutes. 6 per side: id 0 is the teal keeper, ids 1-5 are runners; ids 6-11 are rose (keeper = 6). Teal always attacks right.
- Pitch 100 × 60 units. A goal counts when the ball crosses the end line with y between 21 and 39. Other end-line crossings restart at the defending keeper.
- Possession clock 1,200 ticks (20 s). It resets only when possession changes — passes do not reset it. Expiry = turnover and a keeper restart.
- Loose ball: 300 ticks (5 s) with no owner = restart.
- Movement: speed 12 (keeper 8, sprint 18), sprint needs energy above 5, costs 24/s, recovers 10/s while not sprinting. The league rating raises speed 2% per point.
- Pass: speed 34, goes to a chosen receiver or the best automatic target. Shot: speed 47, aimed at Auto (away from the keeper) / Upper (y 24) / Lower (y 36) with seeded inaccuracy that grows with range and shrinks with rating (divided by 1 + 0.08 × rating).
- Challenge (steal): human range 4, AI auto-challenge range 2.8, 45-tick cooldown, **a flat 65% success**. This is the only "attack/defence" interaction today.
- Pickup radius 1.6 (keeper 2.6). A keeper save is counted when the ball is faster than 40 on contact. The shooter cannot re-collect for 18 ticks.
- Tactics (Balanced / Wide / Press): small AI positioning changes only (Press sends 3 chasers instead of 2; Wide pushes the winger lanes).
- Randomness: one seeded linear-congruential generator in the match state; same seed + same inputs = same match.
- Statistics tracked per player per match: ticks played, goals, assists, shots, passes, completed passes, steals, saves; plus team shots/passes/steals/saves/turnovers.
- `restore()` validates every field (schema 1, rules 1, bounded positions/velocities/timers, exactly 12 distinct players, legal possession, bounded counters) and throws on anything else. **Rules versions must never be mixed** in saves or rewards (rules 1 only today).

## 5. League and career (season.js)

- **Legacy (schema 1):** 4 teams, 3 rounds. Still supported; explicit rollover starts a schema-2 career and archives it without inventing stats.
- **Career (schema 2):** 8 fictional clubs (Relay Runners = the player's team, id 0; Ion Comets, Vector Wolves, Aurora Guard, Solar Corsairs, Cinder Falcons, Nova Tide, Prism Lynx). 64 fictional athletes, 8 per club, ids `t<club>p<slot>`, roles Keeper / Defender ×2 / Wing ×2 / Striker / Reserve ×2. Six play each match (keeper fixed in slot 0).
- Season = 7 rounds, 28 fixtures (circle-method round-robin, 4 per round). The player plays one fixture per round; **the other three are simulated with the real engine** (computer vs computer, in animation-frame batches), with frozen lineups and ratings stored per fixture so history keeps correct attribution after later lineup changes.
- Standings: 3/1/0 points, then goal difference, goals for, club id.
- XP per athlete (from real telemetry): 50 per appearance + 25 per goal + 15 per assist + 10 per save + 10 per steal + 2 per completed pass. Level = min(20, 1 + XP/300). League rating = min(10, level − 1 + trainings).
- Training points: 1 per played round (+1 for a win); season rank prize points 3/2/1 for ranks 1/2/3. One point buys one training; max 5 per athlete; max 40 stored trainings.
- Between matches: change lineup (slots 1-5), spend training. Rollover keeps rosters, lineups, training and the prize passport and archives the season (cap 1,000 archived seasons).
- Pre-match scouting, league leaders, previous seasons, fixture list, match report, athlete cards are all derived views over this data.
- Deliberately NOT built: recruitment, contracts, transfers, tournaments, injuries, per-skill attributes (one rating drives everything), technique learning.

## 6. Where saves live (and why they do not migrate by themselves)

The game runs in an iframe inside the Starcade launcher in OSF UI's WebView2, origin `https://osfui.local`, shared with the launcher and every Starcade game.

| Key (localStorage, same origin) | Holds |
|---|---|
| `starcade.razor-derby.match.v1` | exhibition checkpoint (also sent to the launcher as a host `save`, which stores `starcade.save.razor-derby` and mirrors it to the native Starcade state) |
| `starcade.razor-derby.season.v1` | legacy 4-team season |
| `starcade.razor-derby.career.v2` | the 8-team career (the important one) |
| `starcade.razor-derby.records.v1` | exhibition records, latest 10 |
| `starcade.razor-derby.practice.v1`, `...practice.<passing|finishing|defending>.v1` | practice/drill checkpoints |
| `starcade.razor-derby.coach.v1` | live coach on/off |

Another mod's WebView origin will not see these. **There is no migration code and no shared save backend.** The owner may have a live career in these keys. The standalone mod must treat them as read-only source data: preview, backup, confirmation, duplicate handling, rollback. Never delete or overwrite them. Lesson from Hextris (2026-10-20): restore code must reject unexpected data, and a restore test must use a copy of a *real* profile, because a fresh-profile test cannot see poisoned old saves.

## 7. The prize system (the part most tied to Starcade)

What the owner asked for: matches and seasons pay real Starfield credits and Med Packs.

- Amounts: per match, loss 100 / draw 150 / win 200 credits (no item). Season placing: 1st 500 + 3 Med Packs, 2nd 300 + 2, 3rd 150 + 1, 4th-8th 100 + 1. Only the player's own career matches count; no practice, exhibition or legacy-season backfill; never through the casino wager route.
- Identity: each career has a 24-hex "prize passport" kept across rollover. Each prize has an ordinal (season × 8 + round; the 8th slot of each season is the placing prize). The ledger remembers, per passport, the highest ordinal claimed (the "frontier") and a status.
- Path: game (`derbyPrize` message with `expectedFrontier`) → launcher (`main.js` forwards `starcade.arcade.derby.prize` over OSF UI) → native `DispatchDerbyPrize` (validates game, rules, action `status|claim`, ordinal, result) → Papyrus `x2357StarcadeDerbyPrizes.ProcessPrize` → `x2357StarcadePlayerAlias.ProcessDerbyPrize` → reply through `x2357StarcadeNative.ReportDerbyPrize` → `starcade.derbyPrize` back to the game.
- The ledger **lives in the Starfield save**, as arrays on Starcade's own startup quest alias (quest form 0x809, alias 0 in `x2357starcade.esm`), inside a Papyrus guard: capacity 128 careers per save; the claim is reserved *before* `AddItem`, the inventory change is then verified, and an uncertain result locks that career instead of retrying. Status codes: 0 unavailable, 1 granted, 2 already recorded / query, 3 uncertain. Vanilla forms used: credits (0x0F) and the Med Pack (0xABF9) from Starfield.esm.
- Because the ledger is save-owned and the career is browser-storage-owned, a loaded older save and a newer WebView career can disagree; `expectedFrontier` makes a stale claim return the real position instead of paying. The standalone mod **cannot reuse Starcade's ledger without depending on Starcade** (the ledger is in Starcade's plugin). Whether to copy this design into the new mod's own plugin or define a shared contract is an open design decision — the 11-03 handoff says do not reuse the frontier blindly. Acceptance (real inventory deltas, save/reload, wrong-save load) has never been done in Starfield.

## 8. How the game talks to the launcher (the seam to replace or re-implement)

- Messages use `{channel: "starcade", game: "razor-derby", session, type, value}`; the launcher accepts Razor messages only with the right game id and the current launch serial (stale ones are dropped). Types in use: `ready`, `load`, `prepareClose`, `save`, `derbyPrize` (+ `exit`).
- Start: the game posts `ready`; the launcher answers `load` with the saved match. Controls are inert (`inert`, `data-ready=false`) until load/restore completes.
- Close: back/Escape/B asks the game to `prepareClose`; the game checkpoints and exits; the launcher forces the close after 250 ms. Older Starcade games still close immediately.
- Controller: the launcher turns native gamepad events into key events; for Razor the right-stick press becomes `v` (shot lane). Buttons map to Enter / x / y; sticks to arrows.
- Keyboard: arrows/WASD move; Enter/A shoots (or switches defender); X passes (or challenges); C / RB picks the pass receiver; V / RS picks the shot lane; Shift / LB sprints; Y/P pauses; Escape/B returns. Source: the 11-02 scope doc and the launcher mapping; **never tried on a real controller in game**. The catalog's `controls` text is out of date (does not mention C/V).
- Pause/visibility: the game pauses and checkpoints on blur or hidden; reload restores paused (never catches up wall-clock time). Fixed 1/60 steps with clamped accumulation. Local checkpoint every ~2 active seconds; native checkpoint at most every 15 active seconds plus goals/pause/end.

## 9. Menus and screens that exist

Start overlay buttons: Live coach on/off, Practice review, Tactic, Start exhibition, Rosters & player stats, Career & rewards, League leaders, Previous seasons, Season fixtures, Scout next opponent, Match report, Match records, Reset damaged season, League season, Training drills, Practice controls, New exhibition, Return to arcade. In match: live coach panel (action, hint, possession clock, recovery, range, lane-covered cue), energy bars, ball-direction tail, nominal goal guide, pass-receiver marker, shot-lane indicator. All panel screens scroll with LB/RB / Shift/C / Page Up-Down for controller use.

## 10. Tests and how to run them

14 Playwright scripts in `tests/razor-*.mjs`: engine behaviour and determinism (`razor-derby`), season and career (`season`, `career`, `statistics`, `records`), practice drills, aim, coach, presentation/court feedback, match report, scouting, startup readiness, world-prize transport (`razor-world-prizes`, which also asserts the ledger order: reserve before `AddItem`), plus a C++ check of the prize table (`derby-prize-policy.cpp`). Codex recorded them passing for the final builds, with **inventory mocked**. Run with Edge (`STARCADE_BROWSER=C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`), Python at `C:/Users/MwMak/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`, `npm install` first. Browser results are not Starfield/WebView2 results.

## 11. Lessons from Starcade that apply to the new mod

1. **Address Library crash.** On 2026-10-27 `Starcade.dll` ended the game with "REL/IDDB.cpp(25): Failed to open Address Library file" although the file existed. The first game-address lookup opens that file and a failed open is fatal; it landed right after data loading. Fix in Starcade 1.7.3 (confirmed in game 2026-11-02): read and retry the file at plugin load with a logged Windows error, and switch off address-dependent features instead of ending the game. If the standalone mod ships its own native plugin, copy that pattern (`EnsureAddressLibrary` in `Native/src/main.cpp`; full record in `Docs/ADDRESS_LIBRARY_ERROR_2026-10-27.md`).
2. A view change needs a full Starfield restart under MO2 (OSF UI mirrors views at launch); a `.pex` survives a save reload.
3. Release zips: single top-level `Data/`, forward-slash entries, built with Python `zipfile`, no `meta.ini`, no AISS file.
4. Check for running Starfield/MO2 on the host before any MO2 write; sandbox process lists have missed real open apps.
5. Name the build behind every in-game result (winning folder + DLL hash), or the result means nothing.
6. One heavy job at a time; named `git add` paths only; verify the pushed remote SHA.

## 11b. What is portable and what is Starcade-coupled

- **Portable as-is (pure logic):** `engine.js`, `season.js`, `legacy-season.js`, `practice.js`, `coach.js`, `aim.js`, `report.js`, `records.js`, `presentation.js` (draw helpers), and the bulk of `game.js`.
- **Starcade-coupled:** `host.js` and the `main.js` message protocol, the catalog entry, `../game.css`, `prizes.js` plus the whole native/Papyrus prize path and its ledger on Starcade's quest, and the localStorage key names.
- Likely first extraction order: engine + season (already testable headless) → renderer replacement → your own shell/save/close protocol → prize design → optional Starcade adapter.

## 12. What has and has not been verified

| Claim | Status |
|---|---|
| Source read and summarised in this document | done by me, from the current files |
| Tests pass | recorded by Codex; not re-run by me; inventory mocked |
| Any Razor Derby feature works in Starfield | **never run in Starfield.** Last `Starcade.log` is from 2026-11-02 (before any Razor build was installed) |
| Controller feel, readability, performance next to other mods | not measured |
| Prize payout and save/reload behaviour | not tested in game |
| True 3-D, attack/endurance system, techniques | do not exist; design only |

## 13. Suggested first message for the standalone chat

Read the 11-03 handoff and this inventory, then the engine and season source. Confirm the repo does not already exist before creating `Razor-Derby`. Port engine + season headless first with their tests, keep the saved-data formats read-only, and treat the prize ledger and the Starcade adapter as separate designs. Do not edit the Starcade repo; send Starcade-side needs to the Starcade chat as a concrete handoff.
