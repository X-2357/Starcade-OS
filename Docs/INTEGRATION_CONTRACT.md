# Starcade ecosystem contract

November 3 Razor records batch: SC-RCH-011 bounded local exhibition journal implemented, latest ten actual completed results with rules1 and local completion timestamps. Persistent match ids deduplicate live completion; practice and completed legacy reload never backfill. Invalid/future journal preserved and reported unavailable. Records panel pauses play, traps activation and requires explicit resume. Tests cover dedupe/retention/invalid data and real completion/modal; Razor full regression passed. No native schema/CK/Papyrus/sibling changes; no Legacy/AISS event-history claim. Actual Starfield/gamepad/balance/shared performance remain unverified. Scope Docs/RAZOR_RECORDS_SCOPE_2026-11-03.md. Overlap review: Fleet Command already has five operations; Docking Vector/Lunar Descent already progress contracts/landings. Consolidate candidate duplicates, do not add them as empty new games.

November 3 Supply Chain Puzzle batch: SC-RCH-009 implemented with visible extraction/smelting/delivery recipes, bounded storage, twenty-shift deadline, exact legality guards, factual log, abandonment and legal-history checkpoint saves. All 157 reachable resource/shift/result states checked; seventeen-shift win, timeout/capacity/invalid/replay and browser completion/reload/no-repeat/abandon passed. Catalog now38 embedded (31 original +7 adapted), plus OpenMW external. No native/Papyrus/CK/sibling state changes. OC real production and SSSE markets remain authoritative; this factory is fictional. Actual Starfield/controller/balance/shared performance remain unverified. Scope Docs/SUPPLY_CHAIN_SCOPE_2026-11-03.md and tests/supply-chain.mjs.

November 3 Race Director batch: SC-RCH-006 implemented as an eight-lap fictional race strategy game with visible pace/fuel/tyre/weather forecasts, pit laps, puncture consequences, five rival totals, retirement, factual lap report and legal-history saves. 200 full races verify forecast agreement, resource bounds and every-order restore; browser race/reload/result/no-duplicate-finish/retire passed. Catalog 37 embedded games (30 original + 7 adapted) plus OpenMW external. Existing casino/racing/real-vessel systems unchanged. No native/CK/Papyrus/sibling edits or new integration. Actual Starfield/gamepad/balance/shared performance remain unverified. Scope Docs/RACE_DIRECTOR_SCOPE_2026-11-03.md and tests/race-director.mjs.

November 3 Ship Crisis batch: SC-RCH-004 implemented as a complete turn-based reactor/repair/combat/escape simulation, ten-turn limit, visible forecasts, factual damage log, seeded replay saves and explicit surrender. 100 seeds have tested winning paths; every-order restore, invalid/empty-repair guards and browser win/reload/no-repeat-finish/surrender passed. Catalog now 36 embedded games (29 original + 7 adapted), plus external OpenMW. No new native/Papyrus/CK or sibling state. Actual Starfield input/render/balance and ecosystem performance remain unverified. Scope Docs/SHIP_CRISIS_SCOPE_2026-11-03.md; acceptance tests/ship-crisis.mjs.

November 3 manual targeting: Razor Derby now supports C / RB receiver cycling, a visible selected/automatic target label and X passes to the selected eligible runner. Automatic passing/AI remains default; transient selection clears on possession change and pause/reload/close. Engine direction/fallback fixtures and browser keyboard/forwarded-controller tests pass alongside 30 complete seeded matches. Practice reward/save isolation remains covered. No native, CK, Papyrus, schema or sibling changes. Actual Starfield input, enjoyment, balance and combined-mod performance remain unverified. Scope: Docs/RAZOR_PASS_TARGET_SCOPE_2026-11-03.md.

November 3 practice continuation: Razor Derby now has explicit separate practice checkpoints and no score/finish/native-save publication from practice; exhibition snapshot and rules unchanged. Full scope Docs/RAZOR_PRACTICE_SCOPE_2026-11-03.md. Repeatable tests/frontier-convoy.mjs covers 200 arrivals, every-choice restores, stranded/invalid fixtures and browser full run/reload/keyboard/abandon. Razor browser regression and practice isolation passed. Actual Starfield/gamepad/performance and human balance remain unverified. No sibling, CK, Papyrus or native changes.

November 3 continuation: Razor Derby exhibition and Frontier Convoy implemented in source; catalog now 35 embedded games. Razor engine: 30 full matches and deterministic restore passed; browser movement/pause/checkpoint/reopen tests passed November 2. Convoy: 200 winning runs and every-choice replay restore passed November 3. JavaScript/catalog validation passed. Actual Starfield input, balance, rendering and combined ecosystem performance remain UNVERIFIED. No native/Papyrus/CK or sibling edits. Razor transport uses launch serials to reject stale saves; no new cross-mod state publisher. Full scopes: Docs/RAZOR_DERBY_IMPLEMENTATION_2026-11-02.md and Docs/FRONTIER_CONVOY_IMPLEMENTATION_2026-11-02.md.

November 2 card addition: constellation-cards owns only fictional match data (schema 1, seed, first, legal move history). Uses existing host save/finish routes; no sibling file or native command added. No wagers or custom XP. Existing non-casino completion reward policy still applies. No new adapter, cadence or VM polling. Standalone browser fallback uses a uniquely named local save; host native save is preferred when provided.
Checkpoint October 6, 2026; reference source 6b26c7e. Shared living design remains ModSource/X2357_MOD_ECOSYSTEM.md. Dated Reference copy is archival. Every future feature handoff must include this ownership map plus its specific contract.

## Actual Starcade to AISS seam
Publisher: Native/src/main.cpp WriteAISSStarcadeState, called from SaveState. Consumer: X-2357/AISS Source/Backend/lib/starcadeContext.js and promptAssembly.js; support introduced v3.6.0 per September 30 AISS handoff. Preserve Native owner of scores and Papyrus owner of actual player credit/XP mutations. AISS reads; dialogue does not award credits, finish games or change scores.

Path resolves from PluginDirectory().parent_path()/AISS/state/starcade.ini (intended Data/SFSE/AISS/state/starcade.ini). AISS backend reads its physical mod state directory outside MO2 VFS. AISS owns inert seed; Starcade release must ship NO SFSE/AISS files. AISS-Bridge/state seed remains documentation only. MO2 overwrite shadow is a known possible failure; inspect and preserve actual content before any cleanup. Do not delete player state at setup.

| Key | Exact current meaning / reader |
|---|---|
| section | [starcade] |
| ready | 1 readable, 0 inert/skip |
| schema_version | 1; future unsupported version rejected |
| last_played_game | display title, stored title preferred, derived id-title legacy fallback |
| last_played_time_unix | wall-clock seconds set on newRun; recent phrasing only, not simulated game date |
| high_scores | positive highScore values, raw Title:integer comma-separated; current writer has no trailing comma, reader accepts either |

No source field required. No expiration: save-driven older scores remain valid. Reader requires last_played_game and high_scores even when empty, caps 40 games / 60 title characters, handles colons before numeric score and rejects unavailable/unsupported state. Missing is unavailable, not zero-valued truth. Commas in display titles cannot be represented safely; title stability matters to conversation matching. Each game owns its score scale; compare no different games.

Current native writer builds complete temporary file then rename, with overwrite-copy fallback. It writes ready=1 into temporary payload; it does NOT use generic Cassiopeia ready=0/payload/ready=1 calls. Do not describe those as actual implementation. Atomicity of fallback, stream errors, optional write behavior and concurrency need measurement before changing working source. SaveState publishes on every save; cadence/VM impact is not yet measured. No file lock/master ecosystem queue is authorized.

Snapshot has display titles, not stable game/event identities, achievement dates, participants, payout totals or favorite cabinets. Local native games map has ids but exported scores do not. A new Legacy event contract must verify score meaning, completed-run eligibility, watermark migration, duplicate-safe event id, persistent revision, reload and backfill policy. Current best cannot prove when a milestone occurred.

## Ownership and connection map
| Mod / repository | Authoritative owner | Starcade connection / evidence |
|---|---|---|
| AISS | conversation/reactions | implemented read-only scores/last game; end-to-end live destination pending |
| X2357CrewTitles | personnel roles, ranks, progression | no Starcade adapter verified; never promote actors from score |
| X2357OutpostCommunities | residency/jobs/conditions/services | proposed recreation opportunities; seven-script foundation, no gameplay proof |
| LivingSettledSystems | local routines/actor activity | proposed supported leisure; compiled first routine, no wired runtime proof |
| X2357InfamousShips | pilots/vessels/results/fame | distinct from arcade simulation; four-script prototype, no records/runtime |
| SettledSystemsExchange | markets/portfolio/economic events | proposed bounded win context only after explicit payout contract; do not rewrite markets |
| SSaW | campaign/fronts/strategic outcomes | context only; game-space simulated combat cannot award campaign victories |
| X2357CorporateWars | corporations/contracts/influence | proposed bounded sponsorship content; documentation foundation |
| X2357ShadowNetwork | cases/evidence/provenance/disclosure | no direct adapter; avoid exposing private case facts through games or AISS |
| StarbornLegacy | historical archive/commemorations | proposed one authoritative milestone; documentation foundation |
| ShoreLeave | leave permissions/workflow | local dated scaffold, no GitHub inventory match; supported downtime only |
| DiscoveryJournal | exploration records | local dated pre-alpha; do not duplicate exploration journal |
| PassengerRescue | rescue/contracts/passenger lifecycle | local dated scaffold; no automatic residence/crew conversion |
| AISS_StarWarsGenesis | data-only setting profile | no new state publisher/plugin; preserve setting-aware titles/content decisions |

Every mod remains independently usable. Starcade's baseline depends on PC SFSE/native/OSF UI, not sibling plugins. Optional proposed links stay unavailable when consumer absent, unsupported, malformed or stale under its own freshness policy. No console or universal safe-uninstall promise.

Before implementing any adapter record capabilities, compatible build floors, identities/lifetimes, privacy, correlation/revision/duplicate rules, bounds/cadence/cache, all interruptions/removal behavior, exact CK actions and absent/present/stale/partial/combined-load tests. Existing files are facts, not commands.
