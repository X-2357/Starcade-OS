# Razor Derby 3D rebuild — owner-directed development

Owner explicitly requested true3D and Blitzball-like play, then emphasized attacks,
statistics and the wider sport systems. This supersedes incremental planar polish
as the direction. Existing eight-team career remains the saved baseline; prototype
results must not enter its stats, prize frontier or AISS snapshot.

## First complete lifecycle: playable renderer proof

Build separate 3d-preview/index.html using actual existing engine input and state.
True WebGL perspective, depth buffer, solid lit meshes, industrial enclosed arena,
goals, human-shaped armored kits, team/selection colors and moving ball. Original
procedural geometry only; no Square Enix/Bethesda assets, imported paid assets,
remote CDN, dependency or sibling code. Existing Billiards Three files are webpack
chunks, not directly importable modules; do not assume imports work.

Renderer owner is preview page. Init shader/program/buffers once; bounded geometry;
render on existing single preview RAF. CPU transforms are presentation only and
must not write engine/RNG. Context failure/loss pauses simulation and shows a
visible message; explicit reload recreates. No silent fallback claiming3D. Resize
bounded device pixel ratio, camera changes do not reset match. Pause/blur/hidden
stop simulation; re-enter requires Resume; pagehide disposes buffer/program and
cancels RAF. No storage or native messaging; reload starts a fresh preview, clearly
labeled. No career/reward/native/CK/schema/modlist changes. Missing WebGL cannot
start match. Reset requires explicit button; no score publications. Keyboard only
prototype; hardware/OSF controller capability not claimed.

Tests: shader compile/link errors visible, rendered screenshot nonblank, WebGL
context/depth buffer proven, actual engine advances on Start, input/pause/camera/
reset/hidden lifecycle, context-loss stop and error, renderer snapshot/RNG equality.
Capture actual pixels, not a generated concept. Existing installed mod unchanged.
Browser GPU result is not WebView2 inside Starfield acceptance or performance proof.

## Gameplay direction — subsequent independently scoped lifecycles

The current prototype still uses planar rules1. True3D gameplay requires rules2:
height/velocity and bounded volume; camera-relative input/ascend/descend, 3D pass
targeting, keeper coverage and collision, fair AI vertical navigation, deterministic
replay/restore, distinct statistics and prize eligibility. No cosmetic Z field.

Stats must drive decisions: attack vs endurance for breaking/tackles; block for
interceptions; pass accuracy/range; shot power/placement; keeper catch; speed and
stamina. Distinct archetypes and role growth rather than one generic rating.
Techniques need stamina cost, telegraph, counterplay, recovery, bounded status
duration, duplicate-safe XP and AI access under the same rules. Candidate original
techniques: shoulder drive, feint release, bank pass, charged shot, brace save.
These are proposed, not implemented or claimed as canonical Starfield rules.

Encounter choice should let player attempt break, pass or shoot against nearby
defenders, with readable stats and actual resolution feedback. Evaluate tactical
pause vs continuous action in a separate playable slice; don't freeze silently.
Eight clubs/rosters/current+career+archived seasons remain required, with explicit
rules version and migration/parallel career to avoid incompatible results mixing.
Recruitment/contracts/tournaments/technique learning get separate full scopes.

## Style and ecosystem

Industrial orbital venue, cream/graphite equipment, fabric/armor kits, safety
rails, pressure panels, restrained teal/amber team lighting and legible telemetry.
Blitzball influences team encounters/management; no copied names, models or moves.
Lore search confirms mentions of the sport but did not establish a canonical
rulebook; our arena/rules remain Starcade interpretation.

Starcade owns fictional sporting identities; Crew Titles owns real crew; SSSE
owns market; Legacy real history; AISS optional narration. No sibling writer or
hard dependency added. Future renderer sharing should expose create/render/
resize/dispose with caller-owned context and budget, never a global render loop
or cross-mod lock. Proposed contract only, no sibling adapter claimed.

Research starting points: Square Enix official manual portal
https://support.na.square-enix.com/manual.php?id=9681 ; no exact Blitzball formula
verified from that portal yet. Razor lore corroboration (secondary walkthrough):
https://eip.gg/starfield/guides/top-secrets/ . Treat uncertain rules as uncertain.
