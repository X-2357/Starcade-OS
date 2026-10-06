# X-2357's Starcade OS — feature consolidation handoff

Prepared October 6, 2026. Additive planning for the receiving mod chat; no sibling code was changed and no fresh implementation audit is claimed. Read the current project brain and released baseline before deciding anything is missing.

## Scope and recommended consolidation

Starcade is an existing released arcade. Read its current brain at C:\Modding\MO2\mods\Starcade OS 1.3.0 Complete Source\CLAUDE.md; the directory name is not the current release version.

1. Legacy achievements based on actual supported high scores and game identities.
2. Optional colony/leisure availability with LSS/OC only where real interaction support exists.
3. Holo-sports or a casino-themed game as arcade content if approved; financial wagering requires an explicit accounting design and cannot be inferred from current scores.
4. AISS discussion of actually published play history.
5. Optional Corporate Wars sponsorship as bounded content, not a new financial system.

Physical robot fights, concerts, theater tours and zero-gravity sports are not assigned to the arcade simply because they are entertainment. Those need their own scope or appropriate host. Current documented state contains last game, play time and high scores; no established payout or favorite-cabinet field. Preserve save-driven freshness and legacy schema behavior.

## First candidate to fully scope

SC-ADD-001: one supported score milestone for Legacy. Verify score meaning per game (higher/lower/best rule), identity and whether the available state proves a new achievement. Publish stable evidence if a new event adapter is required; do not infer a full play history from one current best score. Repeated saves and reload yield one achievement. If no event capability is available, Legacy can display the current sourced score without fabricating its date or participants.

This is a proposed next feature, subordinate to the receiving project's unfinished accepted work. Before implementation write exact trigger/state/ownership/teardown/reload behavior and concrete CK records. The broad list below is a backlog, not simultaneous implementation scope.

## Recipient-specific acceptance checks

Existing games and save files unchanged; old save-driven data not expired; no invented money payout; optional consumers absent remain harmless.

Also test normal completion, repeat activation, cancellation, timeout, combat where relevant, actor/target loss, quest stop, travel/unload, player death/reload, missing properties and optional-mod absence. Record expected and actual results against an attributable build. No other mod's state is written directly.

## Copy-ready opening prompt

Continue my existing Starcade OS work using this feature-consolidation addendum. Read my current brain, rules, last runtime result and checklist first. Reconcile the assigned catalog and recent brainstorm ideas against what already works; mark duplicates or completed features instead of rebuilding them. Preserve ownership across the ecosystem, including Corporate Wars, Shadow Network and Legacy. Finish previously accepted work before choosing one additive feature to scope completely. Keep the brain and integration contracts current, inspect siblings read-only, and provide exact remaining CK actions with separate compile/record/runtime evidence.

## Recent brainstorm additions and consolidation

The recent brainstorm uses R01–R30 below, separately from the original catalog's #1–#353. The master routing index accounts for all 30. Primary assignment does not exclude the supporting integration responsibilities in this handoff.

No separate recent idea is primarily assigned here; its supporting integrations are described in the scope above.

## Original 353-list candidates assigned here

These are proposed routing decisions, not proof the feature is absent or accepted for release. Check current source and the original expanded list before adoption. Listed difficulty is the earlier conceptual estimate where available, not a fresh engine feasibility result. Only the receiving mod's owned portion belongs here; sibling consequences use the contracts above.

### #336. Holo-Sports League — earlier estimate 7/10

Original idea: Follow teams and bet on matches. [SSSE, Starcade]

Earlier build scope: Build team records, schedules, match results, betting, and payouts. A simulated holo-league is far easier than fully playable sporting matches, but economy integration still needs testing.

### #342. Casino Night — earlier estimate 8/10

Original idea: Visit a full casino in Neon. [Starcade]

Earlier build scope: Build several casino games, betting interfaces, payouts, venue assets, and NPC activity. Each game needs its own rules, input handling, and exploit-resistant transaction logic.

## Development continuity and working rules

This is a design handoff prepared October 6, 2026, not a source change or proof of implementation. The broad catalog is a backlog; fully scope and implement ONE accepted feature lifecycle at a time. Review existing behavior before adding anything: classify each candidate as already working, partial, new, duplicate, incompatible, or deferred.

Read first:
- Workspace rules: C:\Users\MwMak\OneDrive\Documents\CLAUDE.md
- The receiving project's current CLAUDE.md, AGENTS.md if present, latest relevant runtime result, and active checklist.
- Shared ecosystem: C:\Users\MwMak\OneDrive\Documents\My Games\Starfield\ModSource\X2357_MOD_ECOSYSTEM.md
- Shared X2357_ECOSYSTEM_RELEASE_GATE.md and CK_TASK_LIST_HANDOFF.md in that ModSource directory.
- VanillaPapyrusReference\CAPABILITY_INDEX.md and CORPUS_MAP.md before proposing engine mechanisms.
- AISS\Docs\STARFIELD_MODDING_STARTER_HANDOFF.md and relevant verified mechanism research.
- Original catalog: C:\Users\MwMak\Documents\Codex\2026-09-28\c\outputs\Starfield_353_Ideas_Expanded_10_Point.md

Treat those release/status documents as dated evidence. A later verified result can supersede an old limitation. A separate user-mentioned big checklist has not been located beyond the catalog/shared gate; merge it when identified without pretending it was read.

Maintain one canonical project brain. Merge into an existing CLAUDE.md; never overwrite its history with a starter. Keep current status first: purpose, repo/remote, working build and deployment identity, accepted decisions, latest gameplay result, unresolved failures, next exact action. Preserve dated decisions and failures below. Link design, integration contracts, risk register, feature checklist and test evidence instead of creating conflicting copies.

For each feature record: source idea ID, visible benefit, owner, prerequisites, state machine, every exit, CK records, sibling consumers, implementation status, compile result, record inspection, runtime result and evidence. Use distinct states: proposed/scoped/implemented/compiled/record-verified/runtime-partial/runtime-passed/deferred. Update the active checklist and brain every session, including after compaction.

Before changing working behavior, document the improvement, user CK/save rework, and additive alternative. Read the relevant last known-good result. Perform a horizontal review of consumers, UI paths and sibling integrations before a fix. Calibrate inspection tools against known-good and known-bad cases. Prefer owned assignments over changing shared faction/AI/actor state; where mutation is necessary, name the restore path on every exit. Handle None, missing actors, empty arrays, actual container limits, repeat activation, timeout, cancellation, player death, quest stop, unload and reload. Define bounded work and diagnostic traces.

Keep edits and Git actions inside the authorized project; inspect siblings read-only and supply handoffs for their required changes. Never stage everything with git add . or git add -A. Inspect diffs and name exact paths. Do not replace working systems merely for a cleaner design. User willingness to do CK work means correct architecture comes first.

The August 2026 SSD/source loss makes source control and real remote backup essential. Verify actual repo and remote before claiming backup. Previously inspected configured remotes include https://github.com/X-2357/AISS, https://github.com/X-2357/SSaW, https://github.com/X-2357/SettledSystemsExchange and https://github.com/X-2357/X2357CrewTitles. These are existing sibling identities, not destinations for a new mod. New project paths and remotes remain to be established in their own dev chats; do not invent them. A local commit is not a remote backup.

### CK and verification deliverables

Use the current CK checklist rules: continuously numbered, one action per line, exact verified existing or explicitly NEW EDIDs, values, properties, button indexes, array slots and links. Long body text goes in separate plain-text files containing only the body, with explicit whole-body replacement instructions. Keep only remaining actions; optional steps are marked inline. End the actionable list with “Save. Tell me.”

The established pipeline edits ESP and generates ESM for play. Read back actual generated records. Verify the winning MO2 build when attributing runtime behavior; timestamps or binary size are not record proof. Follow up with remaining corrections only.

Compilation, record inspection, deployment/hash confirmation, simulation and gameplay are different evidence. A test card identifies build, initial state, exact action, expected result, observed result, evidence and cleanup. Do not call unsupported gameplay working. Respect documented failures and user reports. Test optional integrations absent, present, stale and partially unavailable; test combined ecosystem load as well as standalone play.

## Shared ecosystem requirement — October 6, 2026

**User requirement: every handoff must explain the mod ecosystem and how its feature interacts with the other mods.** Carry this requirement into the development brain and every subsequent feature handoff. Each mod remains independently usable and gains optional connections. These connections are a design scope, not a claim that all adapters already work.

### Ownership and connections

| Mod | Owns | Interactions to scope |
|---|---|---|
| **Corporate Wars** | Corporate actors, competition, contracts, influence and supported operational consequences | SSSE owns market accounting; Shadow Network owns discovered evidence; OC owns colony membership and conditions; Infamous Ships owns vessels. |
| **Shadow Network / Lost Signals** | Cases, clues, intelligence provenance, source trust and who knows what | Corporate Wars supplies supported incidents; Infamous Ships supplies subject identities; AISS sees only appropriately disclosed facts; Legacy receives safe resolved-case history. |
| **Legacy** | Historical archive, commemorations, keepsakes and cross-mod achievement presentation | Receives authoritative events; never becomes a competing fame, personnel, exploration, fleet or economic controller. |
| Crew Titles | Its personnel roles, titles, rank and progression | Supplies supported qualifications to colonies and vessels; receives eligible service accomplishments. It decides personnel progression. Keep colony residency separate from vanilla crew assignment. |
| Outpost Communities | Residency, community jobs, habitability, services, policies, growth and settlement networks | Uses Crew Titles qualifications; offers activity opportunities to LSS; supplies destinations and service facts to Infamous Ships; publishes colony conditions for AISS; interprets bounded market and war pressures. Basic colony behavior must work standalone. |
| Living Settled Systems | Supported local routines and everyday social behavior | Executes supported work, meals, leisure and downtime opportunities for residents and visiting captains. Respects quest ownership and releases actors on interruption. Does not own colony membership, ship travel or promotions. |
| Infamous Ships | Pilot and vessel identities, ship ownership/fleets, rivals, expeditions, races, championships, records and fame | Visits supported colonies; offers captains' local downtime to LSS; attributes crew participation to Crew Titles; publishes verified accomplishments to AISS; can consume war danger and economic context. Keep pilot, vessel and crew records distinct. |
| Settled Systems Stock Exchange (SSSE) | Its markets, portfolio, economic events and financial accounting | Can interpret eligible shipping, colony, competition and war outcomes as bounded economic events. Supplies economic context. Other mods do not directly rewrite prices or generate investment payouts. |
| Settled Systems at War (SSaW) | Its campaign, fronts and strategic outcomes | Supplies danger and campaign context to shipping, colonies, markets and conversation. Receives only explicitly supported inputs. Preserve campaign ownership; do not add a competing colony raid timer. |
| AISS | AI conversation and supported reactions | Consumes factual personnel, colony, local-life, ship, fame, war, market and leisure context. NPCs can acknowledge supported accomplishments. Generated dialogue does not itself move ships, promote crew, award money or complete quests. |
| Shore Leave | Its leave workflow and permissions | Coordinates eligible downtime with LSS and supported destinations. Does not own roster, rank or payroll. Read existing navigation research before assuming travel capabilities. |
| Starcade OS | Its games and recorded scores | Supplies leisure content and conversation facts; colonies and LSS may offer supported recreation opportunities. Documented published facts include last game, play time and high scores. Payouts, favorite cabinets and attendance are not established published fields. |
| Discovery Journal | Its documented exploration records | Potential connection to colony siting and expedition discoveries. Inspect actual interfaces; do not create a second competing exploration journal. |
| Passenger Rescue and future mods | Their own verified gameplay state | Connect through specific optional adapters. A rescue might lead to a residency offer through a supported recruitment flow; never silently convert quest actors into permanent colonists. |
| AISS world profiles, including Star Wars Genesis | Setting-specific AISS content/configuration | Treat as content profiles, not independent state publishers unless implementation changes. Do not invent a plugin or bridge for a data-only add-on. |

The table describes ownership and intended integration opportunities. Verify which connections actually exist. Shared documentation records existing AISS consumers for several publishers, including Starcade; older paragraphs claiming nobody reads sibling data or Starcade has no integration are superseded. Outpost Communities has an inspected seven-script foundation, but its full gameplay loop is not thereby proven.

### One connected player experience

The player makes a hostile world habitable. Outpost Communities evaluates the improvements and admits eligible residents. Crew Titles supplies an engineer's supported qualification; OC assigns a community job; LSS provides the local routine. Infamous Ships can send a supported named trader or expedition. SSaW supplies regional danger that OC translates into preparedness concerns without an independent attack clock. SSSE can turn an eligible colony or shipping milestone into its own limited economic event. AISS receives the facts and lets appropriate NPCs discuss the colony or visiting captain. Shore Leave and Starcade provide supported downtime opportunities. This is the intended experience; each link needs its own implemented and tested adapter.

### Required integration scope for every feature

1. Identify the authoritative owner of every fact and mutation. Consumers never write another mod's save state or publisher file.
2. List exact published and consumed fields; mark each connection implemented, proposed or awaiting evidence. Define the visible benefit and standalone fallback.
3. Define identities and lifetimes for people, ships, outposts and events. Display names and exported load-order IDs are not reliable persistent identity. Verify actual plugin-local resolution mechanisms.
4. Define eligibility, participation attribution, revision/timestamp semantics and duplicate suppression. Polling or reload must not repeatedly award the same battle, delivery or race result.
5. Specify capability checks, supported platform, transport, refresh cadence and cache. Extend the existing optional exchange; do not invent a mandatory ecosystem master or global file lock.
6. Handle absent mods, unavailable/malformed data, unsupported schemas, interrupted publication, stale data and save/load. Missing data means unavailable integration, not zero-valued truth. Assess removal behavior; do not promise universally safe uninstall.
7. Cap cross-system effects and preserve provenance. War affecting markets and markets affecting war must not create runaway feedback. One owner handles each financial or item transaction.
8. Bound work across the shared Papyrus VM. Cache reads, stagger updates, suppress hidden UI polling and permit only one UI request in flight where appropriate.
9. Supply exact CK tasks and separate standalone/integrated acceptance checks. Compilation, record inspection and runtime confirmation are distinct evidence.
10. Keep edits and Git work in the authorized project. Read siblings as needed; hand off concrete changes when both sides need implementation.

### Existing exchange and durable continuity

Read the current shared design at `C:\Users\MwMak\OneDrive\Documents\My Games\Starfield\ModSource\X2357_MOD_ECOSYSTEM.md`, the shared release gate, and affected project brains. Later verified evidence supersedes older status paragraphs. This section supplements those living records.

The documented optional PC exchange uses `Data\SFSE\AISS\state\<publisher>.ini` and capability-verified Cassiopeia access. Preserve one writer per file and the existing MO2 seed ownership arrangement. The convention writes `ready=0`, the payload, then `ready=1`; follow the actual schema and verify reader consistency rather than assuming the flag alone guarantees atomic reads. Freshness is publisher-specific. Starcade's documented consumer uses no expiration window for its save-driven data and accepts its legacy lack of a `source` field. Do not copy timer-driven expiration rules onto it. Plugin presence alone does not prove every dependency or proposed function is available.

Native gameplay must remain usable without the PC bridge or sibling mods. A published fact is not an executable command: command/acknowledgement flows require explicit design. Preserve existing scheduling practices instead of introducing a global cross-mod queue or lock.

Record each connection's owner, schema, publisher/reader paths, capabilities, refresh policy, defaults, compatible versions and latest test result in the owning project's brain or linked integration document. Preserve failures and decisions. Future handoffs must include this ecosystem map plus the specific feature's integration contract, so new chats continue established work rather than relearning or duplicating it.

## New-project integration examples for the whole ecosystem

- Corporate Wars sponsors an eligible OC facility; OC applies its own local benefits, CT validates supported qualifications, LSS performs local activities, Infamous Ships supplies eligible shipping, SSSE interprets public economic consequences, and Legacy records a completed milestone. AISS discusses only facts appropriate to its current speaker.
- Shadow Network investigates a supported corporate shipping incident using Infamous ship identity and its own authored evidence. Choosing disclosure creates a public/private outcome. Corporate Wars and SSSE apply only their own supported consequences; the rescue owner handles survivors. Legacy archives an approved summary.
- Legacy displays a championship model with names and crew as they were at the event. Infamous retains results/fame; CT retains rank; Legacy's archive never rewrites either. AISS can recall that recorded event without inventing a new reward.

Do not create cross-mod commands by writing another publisher's file. Any request/accept/result flow needs a supported adapter, explicit authority, correlation identity and failure behavior. Existing snapshots alone do not prove execution or provide a complete event history.
