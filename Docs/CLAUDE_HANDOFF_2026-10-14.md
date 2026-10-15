# Starcade OS — Claude development handoff

Prepared October 14, 2026. Continue Michael's existing Starfield mod, not a new project. This handoff summarizes evidence and points to the canonical brain; it does not replace its history.

## Start here

Repository: https://github.com/X-2357/Starcade-OS.git (public).

Active source checkout:
C:/Users/MwMak/Documents/Codex/2026-10-06/https-github-com-x-2357-starcade/outputs/Starcade-OS

At handoff preparation local main and fetched origin/main both pointed to 5deedd8e0f5ac769ea7bf3ae520bccc222af5644. The handoff/builder commit comes after it. Resolve current HEAD and compare with live remote main; do not hard-reset a dirty checkout. Codex verifies the final pushed SHA separately when delivering this file.

Read, in order:
1. CLAUDE.md current checkpoint and latest affected historical session.
2. AGENTS.md and workspace rules (Reference/WORKSPACE_RULES_2026-10-06.md is an archival fallback).
3. Docs/FEATURE_CHECKLIST.md, Docs/PLAYTEST_LOG.md and Docs/RISKS.md.
4. Docs/INTEGRATION_CONTRACT.md and Docs/AISS_HANDOFF_2026-09-30.md.
5. Docs/OSF_UI_RENDERING_HANDOFF.md for any web/3D/UI work.
6. Current shared ecosystem/release-gate/CK-format documents under C:/Users/MwMak/OneDrive/Documents/My Games/Starfield/ModSource if present. Repository Reference/ copies are dated evidence; newer verified results supersede old status.

Environment correction: on October 14, C:/Modding/MO2/mods/Starcade OS 1.3.0 Complete Source did NOT exist. Earlier brain references to its source checkout, OSF UI dependency, compiler output and dirty cache are historical. Do not overwrite/recreate that location or assume any old MO2 test-install path is active. Locate the current intended MO2 instance/profile and winning files before deployment. No broad recursive Documents/Downloads/OneDrive sweep.

## What is actually in development source

- Source changelog baseline 1.9.8, with later unreleased music/docs.
- 32 embedded games: 25 original plus Freedoom, Micropolis, Hextris, Mah Jong, Quadrilactic, Clumsy Bird and Billiards. OpenMW is one additional external-launch card.
- Eight casino games already wager real credits through native/Papyrus transaction handling. Preserve them. Exported high scores are not payout accounting.
- 84 MP3 files: prior 63 plus 21 unique supplied October 6. Enlia's second download was SHA256-identical and excluded. Manifest: Docs/MUSIC_BATCH_2026-10-06.json.
- October 6 music is content only. No launcher/native/Papyrus behavior changed to add it; existing discovery handles MP3s.
- Root NEXUS_DESCRIPTION.md is the maintained player-facing draft. RELEASE-VALIDATION.md is July historical evidence, not 1.9.8 signoff.
- Git tracks CreationKit/x2357starcade.esp, but no DLL/ESM/PEX appeared in the tracked-artifact inventory on October 14. A source backup is not a complete installable runtime release. Locate/rebuild required artifacts using verified dependencies; never invent an ESM from a filename rename.

Latest confirmed public upload in project evidence is 1.9.5, owner report September 15. Newer source/build existence does not prove public Nexus publication.

## Runtime evidence to preserve

| Feature | Strongest recorded evidence | Remaining boundary |
|---|---|---|
| Launcher, credits/recovery, selected original games | Historical owner gameplay reports | No current winning digest attributed here |
| Billiards | Owner confirmed actual 3D table rendering | Mouse-only shots; not all 3D engines proven |
| OpenMW | Owner confirmed separate-window launch | True embedding is deferred, not implemented |
| Music browser + prior 63 tracks | Owner confirmed in-game September 27 | October 6 additions not gameplay-tested |
| Hextris 1.9.8 | Browser fresh run + save/reload worked September 27 | In-Starfield retest pending |
| Micropolis | Browser Play/Budget/Road worked September 27 | Owner button symptom unresolved; ask exact discriminator |
| AISS Starcade context | Reader implemented v3.6.0+, actual earlier snapshot inspected | Current writer destination and conversation round trip unverified |
| Warzone2100 | Built/initialized experimental port | First rendered frame fails ANGLE/D3D11; excluded/deferred |

No fresh gameplay, compile or record inspection was performed to write this handoff.

## First concrete work

1. Verify Git status and current remote, then establish the actual MO2 profile, Starcade/AISS winners, runtime versions and hashes before touching live files.
2. Follow PT-001 in Docs/PLAYTEST_LOG.md: trace one supported new score through native publication into the physical AISS state root and its conversation logs. Protect existing state before any shadow cleanup. Diagnose the actual failing layer first.
3. Run PT-002 for Hextris and PT-003 for the music additions on attributable winning assets. Preserve existing owner confirmations; do not claim everything untested.
4. Complete scoped maintenance gates before choosing one proposed new feature.

If runtime access or Michael's observation is required, do independent source/path/record work first and return one concise exact test card. Do not claim the runtime result on his behalf.

## The giant ecosystem and sharing work

Michael's standing direction: all current/future mods cooperate as one large ecosystem and can share workload. Reuse the authoritative owner's capabilities, cached facts, published snapshots and verified research instead of duplicating systems. One owner per mutable state, optional adapters, standalone fallback and measured combined Papyrus/WebView/GPU load. Do not create a mandatory master, global queue or file lock.

- Starcade owns games, scores and supported game transactions.
- AISS owns conversation; generated dialogue is not a gameplay command.
- Crew Titles owns qualifications/rank/progression.
- OC owns residency/jobs/conditions; LSS local routines; Shore Leave permissions/workflow.
- Infamous Ships owns pilots/vessels/fleet results/fame.
- SSSE owns market/portfolio accounting; SSaW campaigns/strategic outcomes.
- Corporate Wars owns corporate agreements; Shadow Network cases/provenance/disclosure.
- Starborn Legacy archives actual milestones; Discovery Journal exploration records.

Sibling source is read-only here. Supply concrete handoffs for changes owned by those chats. Every feature handoff explains provider/consumer, exact fields, identities/lifetimes, capabilities/version floors, privacy, cadence/cache, bounds, duplicates, failures, reload/removal and standalone/integrated tests. Snapshots do not imply command support or full event history.

Actual Starcade→AISS contract: native writer publishes schema 1, ready, last_played_game, last_played_time_unix and high_scores. AISS owns the inert seed. Starcade runtime packages must include NO SFSE/AISS files. No expiration for save-driven Starcade state; no required legacy source key. Current writer uses temporary file/rename/copy fallback, not generic Cassiopeia ready=0 calls. Preserve title/score semantics and verify physical MO2 destination. No published payouts, favorite cabinet, stable achievement-event identities or participants.

## Requested rendering handoff already completed

Docs/OSF_UI_RENDERING_HANDOFF.md explains HTML/Canvas, actual Three.js/WebGL Billiards, software-framebuffer Freedoom, browser engine ports, external OpenMW, origin/capabilities, resize/DPR, controller/focus, audio, save restoration, cleanup, shared cadence and deployment.

Important: virtual-host mapping is not file://; model previews do not expose Starfield NIF/ship geometry automatically; WebGPU/live world texture/native embedding remain unverified. Do not loosen CSP or replace OSF UI to make a port start. Warzone's failed rollback/packed-attribute hypotheses are recorded; do not repeat them as established fixes.

## Music add-on deliverables and reproducibility

Delivered local overlay:
C:/Users/MwMak/Documents/Codex/2026-10-06/https-github-com-x-2357-starcade/outputs/Starcade-Music-Additions-2026-10-06.zip

Original SHA256: c38452df2355054e4fa99cc3d62ebbd310235ee292f5be7c035a0591500a6bca.

21 MP3s only; sole Data/ root, forward-slash entries, each extracted payload matched manifest SHA256. Requires existing Starcade automatic discovery (1.9.2+); install as a separate higher-priority overlay and fully restart Starfield. No live deployment occurred here. Individual source/license pages for the new batch remain unverified; prior-batch license evidence is not new-batch proof.

Rebuild from the repository using Python stdlib:

    python tools/package_music_additions.py --output <new-output-path>.zip

Builder checks source hashes, refuses overwrite, creates deterministic entry metadata and reads archive bytes back. A rebuilt container hash may differ from the original archive due to packaging metadata/compression versions; payload identity is the relevant invariant. ZIP is a local deliverable, not a GitHub Release; source MP3s and builder are backed up.

## Tools and release constraints

Read tools/validate.ps1 and tests/ui-audit.mjs before running. The validator expects 32 embedded entries. Browser audits require Node/Playwright; use origin-correct HTTP serving. Their narrow syntax/load checks are not full gameplay.

Native build historically used xmake + MSVC, from PowerShell with explicit Windows/x64/releasedbg, plus an external OSF UI source/dependency checkout. That dependency is not established in this active checkout; inspect current xmake.lua and installed SDK before rebuilding. Do not automatically install machine-wide toolchains.

Edit ESP in CK; generate ESM for play; read actual generated records back. Give Michael only remaining CK actions: continuous numbering, one exact action per line, verified existing or explicitly NEW EDIDs, exact properties/slots/buttons/links; long body-only paste files; end “Save. Tell me.”

No blanket input/console claims. Micropolis placement, Mah Jong tile selection and Billiards shots still require a mouse. OSF UI view changes under MO2 require full game restart due to mirrors. Record winner/hash before every runtime attribution.

Runtime ZIP: one top-level Data/, forward slashes, no meta.ini, no OSF UI overrides and no Starcade-owned AISS seed. Full release also needs compiled artifacts, corresponding-source/license coverage and final-archive checks.

Never git add . or git add -A; stage named paths, inspect diffs and verify actual remote SHA after push. User explicitly authorized publishing this project's prepared documentation/reference/music changes; approval was resolved October 7. Do not resurrect the older blocked-push paragraphs as current status.

## Backlog is not simultaneous implementation scope

Docs/ORIGINAL_FEATURE_ADDENDUM.md and routing/deferred documents preserve original #1–#353 and separate R01–R30. Starcade primary candidates: #336 Holo-Sports League and #342 Casino Night; current casino content overlaps #342. Legacy milestone, colony/LSS recreation and sponsorship are proposed optional integrations. Scope one complete lifecycle only after accepted unfinished work. Physical robot fights, concerts/theater and zero-G sports are not automatically Starcade responsibilities.

Keep CLAUDE.md, feature evidence, playtest log, risk/contract records and Nexus draft synchronized every session and after compaction. State exactly what is verified and what is missing.
