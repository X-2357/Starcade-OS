# Starcade Razor Derby direction
November 2 update: user chose **Razor Derby**, named in Starfield Ryujin Top Secrets dialogue. Secondary corroboration: https://eip.gg/starfield/guides/top-secrets/ . No complete canon rulebook established. Six-a-side, spherical arena and Blitzball mechanics below are earlier proposals, not canon or settled Razor Derby rules. Settle original rules before implementing.

November 2, 2026. User asks if a Blitzball-style game is achievable, citing its PS2 history. Direction accepted for research/design, not a promise of exact Final Fantasy recreation or already working gameplay.

## Assessment

Yes: an original playable team sport with a readable arena, passing, shooting, interceptions, team tactics and a league is a credible candidate for Starcade. Existing Billiards proves one real WebGL/Three.js game renders in the owner's Starfield setup. The number of simulated participants is not inherently prohibitive. This is engineering judgment; no sphere-sport prototype or benchmark exists yet.

PS2 history demonstrates that compelling sports simulation does not need modern visual complexity. It does not prove browser/GPU compatibility or eliminate AI, input, animation, rules, balancing, persistence and host teardown work. Much of the scope is match design rather than rendering raw geometry.

## Evidence

[Official FFX portal](https://na.finalfantasy.com/en/titles/finalfantasy10/) establishes Blitzball's role; it does not document the complete match engine.
[Jegged's FFX strategy guide](https://jegged.com/Games/Final-Fantasy-X/Blitzball/Strategy-and-Tips.html) is SECONDARY evidence for manual ball-carrier movement, formations and role-fit. Exact calculations, difficulty and physical depth behavior require deeper verification.
An original PS2 manual PDF surfaced at Gaming Alexandria but direct retrieval failed; do not claim its full text or tutorial was reviewed. Do not use the unrelated tabletop fan rules as FFX engine evidence.

Our design below is independent: no copied names, character models, rosters, music, stadiums, animations, UI or event text.

## Intended experience

A selectable Starcade game: choose a fictional team, play a six-a-side match in a sci-fi spherical arena, make meaningful movement/pass/shoot/tackle choices, see a clear score and debrief. Management and leagues are extensions of the same game, not substitutes for playing.

Start by evaluating a legible movement plane with a 3D presentation; true full-volume movement is a separate usability choice, not something to assume from a spherical-looking arena. If full 3D swimming/zero-G is chosen, prototype camera, vertical controls and targeting before building a season. The user has not chosen between these movement designs.

Potential structure: direct control of the ball carrier; teammates/opponents follow bounded tactical roles. A targeting/decision mode can pause or slow only the simulation while choosing a pass/shot; exact behavior is a design choice. Show risk and matchup reasons rather than unexplained dice. Avoid a permanent “hold the ball safely forever” exploit.

## First complete feature scope to write before code

- Exact original rules, arena bounds, team size/positions, clock, goal/reset, possession, passes, blocks/interceptions, tackles, goalkeeper and tie/overtime policy.
- Bounded opponent/teammate AI with no deadlock or unreachable-ball state. AI decisions at a measured fixed cadence; rendering separate; deterministic seed/state for reproducible cases.
- Full input mapping for keyboard/controller, targeting focus, switch/release behavior and accessibility. Pause when hidden; no held-input leakage back to Starfield.
- State machine: setup -> kickoff -> live -> decision/paused -> goal/reset -> halftime if adopted -> completed/abandoned. Define exits from every state, including close, unload, death/game reload, unavailable native bridge and malformed save.
- Persist plain match data and rules revision, never live GPU/engine objects. Repeated resume/finish must not duplicate rewards/results.
- Prototype can use simple geometric players to prove a full match; finished art/animation is separately budgeted. No promise to ship placeholder content as finished.
- First version can be exhibition-only with original balanced teams; desired six-a-side playable target remains. A smaller internal test fixture is not a permanent reduction of scope.
- League, recruiting, training, tactics, contracts and collectibles remain a later phase once exhibition is fun and reliable. No external world/player credits or real crew mutation in the initial match.

## Acceptance gates

1. One match runs kickoff-to-finish with both teams able to score and a useful win/loss/draw result.
2. Ball possession, targeting and goals are never ambiguous; AI attempts valid play; repeated tests reveal no stall/holding exploit.
3. A player can control passes/shots/defense with controller and exit immediately without input leakage.
4. Pause/close/resume preserves clock, positions, possession and deterministic outcomes according to defined rules.
5. Reopen/load/repeat completion does not create duplicate awards or standings; corrupt saves fail safely.
6. Actual OSF UI/WebView2 render and combined Starfield performance measured; desktop browser success remains separate.
7. Once match passes, scope one season lifecycle with stable team/player/match IDs and historically accurate rosters.
8. Physical ship-monitor rendering is an optional separate adapter; OpenMW capture is not a prerequisite.

## Ownership and roadmap consolidation

Use #336 Holo-Sports / SC-ADD-003 as the umbrella; SC-SPORT-001 denotes this playable original sphere-sport direction. SC-RCH-005 supplies later management ideas. Starcade owns fictional athletes, matches and season simulation; CT real personnel, Infamous real vessel/racing careers, Legacy verified commemorations, AISS factual narration, OC/LSS supported recreation.

Missing adapters never block ordinary game play. New milestones need stable event receipts; current high-score export cannot establish a championship's date or participants. No gameplay/CK/assets have been implemented by this design note.
