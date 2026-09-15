# Changelog

## 1.9.5 - 2026-09-15

- The reusable Starcade Pad is now a wrist-worn watch instead of a dataslate (visual/CK change only - same item, same Aid-inventory behavior).

## 1.9.4 - 2026-09-15

- Made the music volume slider bigger (was noticeably smaller than the buttons next to it).
- Fixed the library footer showing "VERSION 1.7.3" - a leftover literal that never got updated across the last five releases. Now shows the real running version.

## 1.9.3 - 2026-09-10

- Fixed Hextris not spawning any blocks in some sessions: the code that positions the score/button row didn't check whether that row still existed after Starcade's own privacy cleanup removes it, and threw before the game board could finish rendering.
- Settled Systems Dice now shows real physical dice with pips and a short roll animation instead of plain "X + Y" numbers.
- Fixed a Space Racer exploit where the ship could sit motionless between lanes and never be hit by traffic. Steering is now lane-locked (one lane per key press, smooth slide into place) so the ship always ends up somewhere traffic can actually reach it.

## 1.9.2 - 2026-09-09

- Music player now auto-discovers any `.mp3` dropped into `audio/music/` at runtime instead of only playing a fixed bundled list - replace or add tracks without editing anything. Bundled tracks keep their curated title/artist credit; new files get a readable title guessed from the filename. Added a volume slider next to the existing on/off and next/previous controls.
- Added an optional, one-way integration with AISS (AI Settled Systems), for anyone who has both mods installed: Starcade publishes the most recently played game and every game's high score to AISS's shared bridge folder, so an AISS companion can bring up what you've been playing. Off by default in the sense that it does nothing unless AISS is installed and adds AISS-side support for it; harmless no-op otherwise.

## 1.9.1 - 2026-08-30

- Added 28 royalty-free 8-bit/chiptune background music tracks that loop across the library screen in a shuffled, per-session order, with an on/off toggle and next/previous track controls in the top bar. Off by default; the on/off preference persists locally across sessions. Music automatically pauses when an embedded game opens and resumes when returning to the library; external launches (OpenMW) are unaffected since those play in a separate window. See `games/../audio/music/SOURCE-AND-LICENSES.txt` for full per-track attribution and a licensing note that still needs confirmation from the source.

## 1.9.0 - 2026-08-30

- Added **Quadrilactic** (Apache-2.0, Ben Coveney), a fast-paced procedurally generated platform climber.
- Added **Clumsy Bird** (GPL-3.0, ellisonleao), a Flappy-Bird-style melonJS clone.
- Added **Billiards** (GPL-3.0, tailuge), a 3D pool physics simulator; Starcade disables four upstream network call sites (usage tracking, online score reporting, URL shortening) and ships the offline-functional practice mode.
- Fixed Micropolis's "Play!" button not responding in the real OSF UI webview: irrelevant external links (About/GitHub/donation/Twitter) were reachable by D-pad before the actual game controls and are now excluded from focus order, and a redundant guarded click handler was added to the submit button since native HTML form-submit semantics aren't always reliable in an embedded webview.
- OpenMW now launches in fullscreen borderless mode by default (previously windowed), matching how a normally launched game presents itself.
- **Investigated but not shipped: Warzone 2100.** The official WebAssembly "Web Edition" build compiles and loads cleanly (WASM init, ~60 MB of assets stream in with zero errors) but crashes on the very first rendered frame due to an ANGLE/D3D11 graphics-driver incompatibility. Two well-reasoned root-cause hypotheses (a recent upstream rendering-pipeline refactor; a packed vertex-attribute format ANGLE is known to mishandle) were each tested with a real rebuild-and-verify cycle and both were disproven. The full diagnostic trail is preserved in `Warzone2100-Engine/` and `games/warzone2100/SOURCE-AND-LICENSES.txt` in the Complete Source archive for anyone who wants to pick the investigation back up; it is not included in the installable release.
- The curated public library now contains 32 embedded games plus the OpenMW external-launch card - 33 catalog entries total.
- Attempted Skyrim and Oblivion external-launch cards using the same pattern as OpenMW; pulled before release after they didn't work as expected in-game. The native detection/launch code remains in `Native/src/main.cpp` for a future pass, just not exposed in the catalog.

## 1.8.0 - 2026-08-29

- Added **Micropolis**, Starcade's port of Electronic Arts' open-source (GPL-3) release of the original SimCity engine and data, via graememcc/micropolisJS. Removed the upstream page's Twitter widget and 30-minute donation-nag popup; fixed a startup rendering bug (tile-sheet slicing failed under a tainted canvas). Camera panning and all toolbar/menu navigation work without a mouse; placing zones and roads still requires one.
- Added **Hextris**, a GPL-3.0-or-later hex-puzzle game, as a fully local embedded game. Removed analytics, advertising, remote score submission, injected remote scripts, remote fonts, store links, and social-sharing behavior; added a restrictive CSP (`connect-src 'none'`).
- Added **OpenMW: Morrowind** as Starcade's first external-launch card: an allow-listed native command detects a legally installed Steam copy of Morrowind and launches the bundled GPL-3.0-or-later OpenMW engine against it. No Morrowind or other Bethesda data is bundled or redistributed; only the user's own installation is used. Saves and configuration are isolated under Starcade's own user-data directory.
- Added **Mah Jong**, an adaptation of the MIT-licensed ffalt/mah project - a complete, actively maintained Mah Jong Solitaire game with 84 boards and 13 tile sets. Only the shared Starcade host/input bridge was added; not yet wired into Starcade's leaderboard/XP system.
- The curated public library now contains 25 original Starcade games, Freedoom: Phase 1, Micropolis, Hextris, and Mah Jong (29 embedded/launchable entries), plus the OpenMW external card.
- Note: bundling the OpenMW runtime adds roughly 240 MB to the installed mod, almost entirely from OpenMW's own dependencies (Qt6, MyGUI, OpenAL, OpenThreads) - most of the increase from the previous ~14 MB release.

## 1.7.3 - 2026-07-28

- Removed Settled Systems Solitaire and The Last Outpost from the public catalog, runtime, source set, documentation, and licensing references at the creator's request.
- The curated public library now contains 25 original Starcade games plus Freedoom: Phase 1 (26 total).
- Retains the confirmed-working 1.7.2 XP bridge, save repair, leaderboard variation, and completion-only reward safeguards.

## 1.7.2 - 2026-07-28

- Fixed legacy save entries stored as `null`, which could reject score, leaderboard, save, and XP commands.
- Added native-to-UI XP confirmations and an on-screen XP toast while retaining the vanilla Starfield XP notification.
- Scores, records, leaderboard entries, and XP now commit only when a game explicitly finishes; leaving an unfinished run grants nothing.
- Rebuilt The Last Outpost around four readable command pages with recovery actions, clear costs, objectives, controller navigation, and save migration.
- Prevented duplicate completion in Codebreaker, duplicate Missile Defense interceptions, and multi-hit life loss in Space Racer and Void Invaders.
- Great Serpent may now safely move into the cell vacated by its tail.
- Recompiled Papyrus, rebuilt the SFSE plugin, and validated all 28 catalog entries.

## 1.7.1 - 2026-07-28

- Curated the library to 28 finished applications; removed six prototype additions from the public catalog.
- Rebuilt Settled Systems Solitaire with full tableau sequences, foundations, limited redeals, scoring, and controller navigation.
- Expanded Constellation Codebreaker to a ten-round campaign with 42 archive entries, categories, streak scoring, integrity, and limited clues.
- Rebuilt The Last Outpost as a versioned persistent campaign with crew assignments, production, buildings, research, expeditions, threats, chapters, and a real ending.
- Added repeatable vanilla XP rewards for new personal records, plus one-time leaderboard-rank milestones. Casino games never award XP.
- Seeded leaderboard rivals now have game-category strengths and deterministic per-game affinities, so their order varies by game.
- Existing JSON score histories and campaign saves migrate in place.

## 1.7.0 - Internal beta (not released)

- Evaluated nine offline prototypes. Six were rejected during playtesting and never promoted into the 1.7.1 public catalog.
- The three retained concepts were rebuilt for the 1.7.1 release.
- Added keyboard and raw-controller input mappings to every new game.
- Added campaign autosaving through Starcade's native JSON persistence with local fallback.
- Added complete per-game provenance for the open-source projects evaluated as references.

## 1.6.0 - 2026-07-22

- Replaced Orbital Roulette's abstract disc with a numbered European single-zero wheel, pocket layout, spindle, ball track, and animated settling ball.
- Restored Celestial High / Low's full playing-card presentation with suits, deck art, and visible directional odds.
- Expanded every Top 10 leaderboard to ten deterministic Starfield rivals; player character scores displace rivals naturally by score.
- Confirmed the existing Starcade bridge and view package remain compatible with OSF UI 1.3.0 without replacing the proven Starcade DLL.

- Rebuilt Minefield Protocol with first-action safety, flags, chord clearing, timed sectors, and escalating mine density.
- Expanded Docking Vector into a fuel-limited contract campaign with moving ports, wind drift, tighter tolerances, and precision bonuses.
- Expanded Fleet Command into a five-operation campaign with limited sonar scans, escalating rewards, and a formal campaign completion state.
- Expanded Orbital Paddle into a best-of-three set match with rally bonuses.
- Added a five-mission completion arc and precision scoring to Lunar Descent and a twelve-round mastery endpoint to Signal Relay.
- Added authentic multi-roll pass-line play to Settled Systems Dice while retaining the original single-roll contracts.
- Rebuilt Celestial High / Low as a persistent streak ladder with risk-priced returns and player-controlled cash-out.
- Added an animated roulette wheel plus dozen and exact-number wagers to Orbital Roulette.
- Added weighted virtual reels, wild symbols, animated reel motion, and constellation bonuses to Neon Constellation Slots.
- Rebuilt the Red Mile Racing Book presentation around an animated heat with distinct runner pace, stamina, and surge profiles.
- Expanded Red Mile Blackjack with a persistent six-deck shoe, early surrender, five-card Charlie, and session records.
- Corrected UC Video Poker to Jacks-or-Better qualification, added a hold advisor, session tracking, and direct controller card selection.
- Preserved the native one-wager transaction guard and automatic casino cancellation on library exit.

## 1.5.0 - 2026-07-21

- Added the working non-WebAssembly asm.js port of **Freedoom: Phase 1**, using the GPL-2.0 Doom engine and BSD-3-Clause Freedoom v0.13.0 game data.
- Corrected the Doom Canvas framebuffer to render opaque RGBA output in OSF UI.
- Added centralized raw Xbox-controller translation for all 25 games, including analog/D-pad movement, A actions, B return, and Freedoom fire/use/run/menu controls.
- Limited raw controller capture strictly to an open game and restored normal OSF UI input immediately on return to the library.
- Preserved the stable `freedoom` persistence ID so scores and future saved state remain compatible across the display-name change.
- Renamed the catalog entry to **Freedoom: Phase 1** to match the embedded game's title screen.
- Updated game provenance, licenses, source availability, public documentation, and automated 25-game validation.

## 1.4.2 - 2026-07-21

- Replaced the leaderboard's `YOU` placeholder with the current Starfield character name supplied by the native player reference.
- Fixed a CSS class collision that caused player leaderboard rows to inherit the giant full-screen game-player layout.
- Escaped character names before rendering them in leaderboard HTML and retained a compact `PLAYER` fallback during early loading.

## 1.4.1 - 2026-07-21

- Fixed Red Mile Hold 'Em becoming stuck after a check or call because the next street entered with player input disabled.
- Added safe recovery for a matching Hold 'Em wager left active when an earlier hand or UI session was interrupted.
- Added an explicit casino cancellation bridge from embedded games to the native credit service.
- Expanded Starfall Blocks progression with named difficulty phases, level-up bonuses, milestone achievements, and predictable gravity-surge pressure rows every five levels.
- Preserved the well-received Galactic Chess rules and CPU implementation and added it to the focused regression pass.
- Revalidated all 24 games, their completion reporting, leaderboard navigation, and non-pausing input behavior.

## 1.4.0 - 2026-07-20

- Deepened Galactic Chess with time-bounded iterative search, stronger positional evaluation, improved move ordering, and visible CPU search depth while retaining complete check, checkmate, stalemate, castling, en passant, promotion, repetition, fifty-move, and insufficient-material rules.
- Expanded Starfall Blocks with a five-piece preview queue, canonical hold-piece behavior, additional rotation floor/wall kicks, clearer clear/combo feedback, and the existing seven-bag, lock-delay, T-spin, back-to-back, combo, and perfect-clear systems.
- Rebuilt Red Mile Hold 'Em betting around a single safe table stake, internal chip stacks, street-specific bets, calls, raises, folds, CPU equity estimates, and pot-derived returns capped by the native credit bridge.
- Fixed leaderboard synchronization between browser fallback storage and the native JSON state, including immediate refresh, newest-first recent history, personal-best merging, and behavioral tests.
- Fixed Minefield Protocol, Docking Vector, and Fleet Command so completed or failed sessions formally submit leaderboard runs instead of relying on manual menu exit.
- Reworked Fleet Command around contiguous hidden ships, sinking detection, shot efficiency, and a persistent victory screen.
- Added structured progression and deeper mechanics across the arcade and puzzle library.

## 1.3.0 - 2026-07-19

- Expanded the library from 15 to 24 games.
- Added Red Mile Blackjack, UC Video Poker, Red Mile Hold 'Em, Orbital Roulette, Neon Constellation Slots, Settled Systems Dice, Celestial High / Low, Red Mile Racing Book, and Galactic Chess vs CPU.
- Added real in-game credit wagering through a guarded native/Papyrus transaction bridge.
- Added exact-stake refunds and native lock recovery when leaving unfinished casino rounds.
- Added per-game top-ten boards, the player's ten latest scores, and seeded Constellation companion scores.
- Added progressive difficulty to supported arcade games and expanded Starfall Blocks progression.
- Kept world simulation active while Starcade is open and limited input capture to the open OSF UI view.
- Fixed Galactic Chess empty-square rendering and movement.
- Added a visible, damageable six-structure colony to Missile Defense.
- Added Previous Game and Next Game navigation to the leaderboard.
- Updated licensing, provenance, testing, installation, and public-release documentation.

## 1.2.0 - 2026-07-19

- Added Space Racer, Fleet Command, Missile Defense, and Orbital Checkers.
- Added CPU-controlled opponent turns to Orbital Checkers.
- Finalized the curated public library at fifteen original games.
- Removed Blackjack, Pinball, Frontier Trader, Grav Merge, and Maintenance Maze.
- Added a startup quest that automatically grants one reusable Starcade Pad.

## 1.1.0 - 2026-07-19

- Added Signal Relay, Void Invaders, Starfall Blocks, and Docking Vector.
- Added Created by X-2357 branding throughout the launcher, player, license
  screen, footer, and every game view.
- Expanded the in-app and packaged licensing notices for all twelve games.
- Replaced legacy encoding-sensitive interface symbols with HTML entities.

## 1.0.0 - 2026-07-18

- Added eight original offline games with keyboard and controller controls.
- Added automatic OSF UI view and settings registration.
- Added configurable F9 launcher hotkey.
- Added durable high-score, play-count, save, and achievement persistence.
- Added input capture and consistent Escape/B return behavior.
- Made the inventory Starcade Pad reusable.
- Added public-release installation, licensing, and support documentation.
# 1.8.0

- Added a fully offline, controller-integrated Hextris package with analytics,
  advertising, remote scripts, score beacon, store links, and social sharing removed.
- Added a self-contained OpenMW Windows runtime and an allow-listed native launcher.
- Added Steam library discovery, including `C:\Steam`, for the user's legal
  Morrowind `Data Files` installation; Starcade never copies commercial game data.
- Added the exact OpenMW GPL corresponding-source archive for the bundled build.
