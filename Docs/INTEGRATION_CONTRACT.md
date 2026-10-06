# Starcade ecosystem contract
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
