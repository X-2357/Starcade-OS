# Razor Derby standalone — new development chat handoff

## Owner decisions — confirmed in this chat

Michael explicitly chose **Standalone mod with optional Starcade access**.
The standalone project owns the game, fictional athletes, league, career save,
and reward entitlement ledger. Starcade is an optional launcher into that same
game, not a second simulation/save/reward system. Preserve standalone operation
when Starcade/AISS/any sibling is absent.

Michael wants true3D, Starfield style, and the depth of Blitzball: not merely a
perspective court. He specifically emphasized attacks, stats and its many sport
systems. Build methodically with player experience and his whole ecosystem in
mind. Keep canonical brain, feature list, Nexus description, tests and GitHub
current. Work autonomously within scope; do not ask after every small update.

## Exact starting point and truthful status

Starcade source checkout:
`C:/Users/MwMak/Documents/Codex/2026-10-06/https-github-com-x-2357-starcade/outputs/Starcade-OS`

Remote: https://github.com/X-2357/Starcade-OS
Latest implemented gameplay checkpoint before this documentation handoff:
`9ff9e6558965ab33d5e73e358f31d92340b55bfc`.

Game source:
`Web-and-Papyrus/starcade.arcade/launcher/games/razor-derby/`
Read `engine.js`, `season.js`, `legacy-season.js`, `game.js`, `presentation.js`,
`coach.js`, `practice.js`, `aim.js`, `report.js`, `records.js`, `prizes.js`,
`index.html`, `style.css`. Launcher seam: `launcher/main.js`, shared `games/host.js`.

**No true3D renderer or new 3D gameplay prototype was implemented in this chat.**
`Docs/RAZOR_3D_REBUILD_2026-11-03.md` is a scoped direction, not working code.
It originally described an isolated preview under Starcade; after the confirmed
split, build that slice in the new standalone project instead. No new standalone
repository/remote, plugin, executable, native DLL, world venue or launcher adapter
has been created here. A GitHub repository availability check was attempted;
do not infer a repository exists from that attempt. Inspect before creating.

Current game is planar deterministic rules1, 60 ticks/sec, two-minute matches,
6v6, teal attacks right. Canvas arena uses perspective styling and silhouettes;
it is not 3D. Current challenge is a range/cooldown check with fixed65% success,
not an attack/endurance system. Generic league rating affects speed/shot accuracy;
it is not a full per-skill athlete model. No actual technique/attack selection,
3D height simulation, recruitment/contracts or Blitzball encounter system exists.

## Existing working source to preserve and extend

- Eight clubs,64 stable fictional athletes, six starters/two reserves each;
  seven-round/28-fixture season, six athletes play each fixture.
- Current-season, career and archived-season player stats; frozen fixture
  lineups/rosters retain historical attribution. Training points/XP/levels and
  between-match lineup/training controls. Four-team legacy saves supported.
- Exhibition journal, free practice, passing/finishing/defending drills with
  independent checkpoints and no rewards; actual engine event telemetry.
- Live coach, shot-lane selection Auto/Upper/Lower via V/RS, nominal goal guide,
  court stamina/recovery bars, pass/shot direction tail; actual-stat reports,
  league leaders and pre-match scouting with roster-management route.
- Launcher session IDs/close checkpoint protocol and readiness guard: initial
  controls inert until load/restore completes. Preserve tested lifecycle.
- Native1.7.4 world-credit/item prize source and compiled receipts exist in
  Starcade. Actual inventory acceptance remains pending; browser mock is not a
  Starfield pass. Do not duplicate/reuse prize frontiers blindly in a new mod.

## Current deployment — do not disrupt

Active MO2 main-profile mod:
`C:/Modding/MO2/mods/Starcade OS - Scouting Development 2026-11-03`
Previous Court Feedback candidate disabled and retained.
Archive in workspace `outputs/Release-Development-2026-11-03/Starcade-Derby-Scouting-Development.zip`.
SHA256 `95c36a245dba8b18875a65518b8df34b8e4af0cfaf79e7ca2f330e7d83fa95f6`.
1729 entries, Data/ only, all source and extracted bytes checked.
Receipt/profile backup: `outputs/MO2-Scouting-Deployment-2026-11-03/`.
DLL1.7.4 SHA256 `86d1274ba292172b7ce4bf3ac3c5e71b655c1b2c3422b3ba174f6d16bd715bdf`.
Engine/DLL/three PEX/ESM byte-equal previous Court Feedback build.

Current browser/simulation tests passed for career, four-team legacy, reports,
presentation, drills, aim, startup and world-prize transport (inventory mocked).
Actual Starfield/hardware controller/readability/enjoyment/combined performance/
world inventory acceptance remain unverified. Cold restart for OSF UI changes.
Do not describe installed old Starcade as the standalone 3D game.

## Rebuild direction — next scopes, not finished features

1. Establish independent repo and canonical brain from day one. Suggested local
   destination `.../outputs/Razor-Derby`; suggested remote name `X-2357/Razor-Derby`,
   both **proposed** until existence/ownership checked. Preserve MIT attribution
   when porting Starcade source. No sibling code writes from this new chat.
2. Build a real3D renderer proof: solid lit athletes/ball, industrial enclosed
   venue, depth-tested geometry, readable broadcast camera, goals and team/control
   cues. Test actual pixels and context-loss/disposal lifecycle. Original assets.
   Existing Billiards `three_module.js`/`three_core.js` are webpack chunks, not
   directly importable Three modules. Don't claim a simple import works.
3. Scope rules2 before changing physics: genuine height/velocity/collision,
   camera-relative input and vertical control, 3D targeting/keeper coverage,
   deterministic AI/replay/restore. Rendering3D alone does not make gameplay3D.
4. Build meaningful skill interactions: attack vs endurance, blocking/intercept,
   passing accuracy/range, shot power/placement, keeper catch, speed and stamina.
   Original techniques need cost, telegraph, counterplay, recovery/status expiry,
   consistent AI rules and observable resolution. Shoulder drive, feint release,
   bank pass, charged shot and brace save are candidate ideas only.
5. Test encounter flow: break through defenders, pass or shoot with clear stats
   and consequences. Evaluate tactical-pause vs continuous play in a scoped slice;
   do not silently freeze matches. No copied Final Fantasy assets/names/moves.
6. Preserve eight-team management depth, current/career/previous seasons and
   actual player attribution. Explicit rules-versioned experimental careers;
   no mixing rules1 stats/reward eligibility with rules2. Later recruitment,
   contracts, tournaments and technique learning each require full lifecycle.
7. Only integrate Starcade after standalone entry/save identity/close protocol
   are tested. Prepare concrete Starcade-side handoff; this chat owns those edits.

## Save/reward migration boundary — unresolved, must design first

Current local keys include exhibition `starcade.razor-derby.match.v1`, career
`starcade.razor-derby.career.v2`, legacy `starcade.razor-derby.season.v1`, free
practice and separate practice.<kind>.v1 slots. Exact key definitions in game.js.
WebView origins can isolate localStorage, so copying JS does not migrate saves.
No automatic migration or shared save backend exists yet.

Design explicit owner/version/character/save identity, read-only import preview,
backup, confirmation, duplicate handling, rollback, old-source coexistence and
reward-frontier reconciliation. Original data must survive failed/unsupported
import. No silent deletion, forced restart or duplicate payouts. Native claim
ledger is save-owned; scores/AISS snapshots are not payout accounting. Distinguish
new rules2 career from any imported rules1 history, never invent missing stats.

## Starfield style and lore

Target graphite/cream industrial gear, fabric/armor sports kits, safety rails,
pressure panels, restrained teal/amber lighting and legible telemetry. This is
an original Starfield-inspired sport interpretation, not a claimed canonical
rulebook. Search found Razor Derby mentions in quest walkthroughs, not verified
official rules proving water/zeroG/combat/arena dimensions. Verify in-game/local
records where possible before asserting lore. Blitzball influence is functional
team-sport depth, not copied creative assets.

Research starts: official Square Enix manual portal
https://support.na.square-enix.com/manual.php?id=9681 ; exact formulas not verified
from portal. Secondary Razor dialogue corroboration:
https://eip.gg/starfield/guides/top-secrets/ . Treat uncertain facts as uncertain.

## Ecosystem ownership and proposed integration contract

Razor owns fictional sports identities/league/gameplay. Crew Titles owns real
personnel; SSSE market; Infamous Ships real vessels; OC/LSS residents; Corporate
Wars contracts; Shadow Network cases; Starborn Legacy real history; AISS narration.
No competition for those controllers or cross-mod global lock. Reuse supported
owner facts/capabilities only after checking actual provider and consumer.

Proposed optional Starcade adapter: detect compatible Razor capability, open same
game entry, pass validated session token, close/checkpoint response. One save owner
and reward ledger, no second play-count/award publication on retries. Absent/older/
malformed provider leaves Starcade usable with explanatory unavailable launch;
uninstalling Starcade must not remove standalone saves. These are requirements,
not an implemented protocol. Need platform/version/identity/session/timeout/
duplicate/removal tests before integration. No AISS seed/schema changes authorized
by mere separation. Never infer executable commands from narrative snapshots.

## Required rules / tools / test evidence

Read Starcade AGENTS.md and canonical CLAUDE.md history for learned failures.
Apply all25 workspace rules:
`C:/Users/MwMak/OneDrive/Documents/CLAUDE.md`.
Shared shelf `C:/Users/MwMak/OneDrive/Documents/My Games/Starfield/ModSource/`:
`X2357_MOD_ECOSYSTEM.md`, `X2357_ECOSYSTEM_RELEASE_GATE.md`,
`CK_TASK_LIST_HANDOFF.md`, AISS/Docs/STARFIELD_MODDING_STARTER_HANDOFF.md.
Some historical index statuses are stale; prefer actual current repo evidence.

One lifecycle fully scoped before code, diagnostics and acceptance first. Compare
all entry points and both ends of seams. No proactive agents without authorization.
Named Git staging only, full diff review, verify pushed remote SHA. No global
profile rollback over newer sibling changes. Elevated host process checks before
MO2 writes: sandbox process enumeration previously missed real open host apps.
Preserve preexisting untracked Starcade `Native/.xmake/windows/x64/tmp/261103/`.
Do not copy caches/binaries/secrets into new source repo.

QA: Starcade tests/razor-*.mjs use Playwright; set STARCADE_BROWSER to
`C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`.
Python: `C:/Users/MwMak/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe`.
Browser/headless GPU evidence is not Starfield/WebView2 behavior. Real controller,
readability/feel, context/memory/frame time with sibling views, save import/rollback
and actual prize inventory need separate acceptance evidence. Record exact missing
measurement and owner rather than calling risk merely known.

## First message for the new dev chat

Read this handoff and linked rules/brain/source before changes. Establish Razor
Derby as its own Git-backed mod, preserve Starcade as read-only reference, and
scope/build the first real3D playable slice. Include the owner-requested attack/
endurance/stat/technique depth in the design; do not call the existing planar
challenge/one-rating model equivalent. Keep existing installed Starcade working.
Continue autonomously with tests and truthful checkpoints; coordinate Starcade
integration through a concrete handoff and keep both mods' ownership clear.
