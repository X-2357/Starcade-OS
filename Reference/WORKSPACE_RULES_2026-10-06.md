# Documents Workspace Index

This is Michael's (X-2357) general Documents folder — not a single project. It contains personal files alongside active mod dev work.

## Active mod projects (each has its own CLAUDE.md — read that file when working inside its folder)

### Starfield (Papyrus / Creation Kit)
Root: `My Games\Starfield\ModSource\`
- `AISS\` — AI Settled Systems — [brain file](My%20Games/Starfield/ModSource/AISS/CLAUDE.md)
- `SSaW\` — Settled Systems at War — [brain file](My%20Games/Starfield/ModSource/SSaW/CLAUDE.md)
- `X2357CrewTitles\` — X2357's Crew Titles — [brain file](My%20Games/Starfield/ModSource/X2357CrewTitles/CLAUDE.md)
- `OutpostCommunities\` — Outpost Communities (residents/concerns layer for player outposts) — [brain file](My%20Games/Starfield/ModSource/OutpostCommunities/CLAUDE.md)
- `ShoreLeave\` — Shore Leave (crew take leave at settlements) — [brain file](My%20Games/Starfield/ModSource/ShoreLeave/CLAUDE.md). New build, not a recovery; scripts compile, no CK records yet.
- `SettledSystemsExchange\` — **X-2357's Settled Systems Stock Exchange** (a stock market that reacts to the player's universe: brokerage terminal, seeded game-clock market, console-safe core, OSF UI view planned) — [brain file](My%20Games/Starfield/ModSource/SettledSystemsExchange/CLAUDE.md). GitHub `X-2357/SettledSystemsExchange`. **v1.1.0 public on Nexus 2026-09-20** (1.0.0/1.0.1 on 09-15: OSF UI exchange view, quest/purchase reactivity, AISS awareness bridge; 1.1.0: world events, options with exercise/expiry, resource flows, 220-row quest table); built 2026-09-13 to 09-20.
- **`VanillaPapyrusReference\`** — **shared, mod-agnostic reference for ALL Starfield projects here.** Built from a full sequential read of every vanilla Papyrus script (5,033 files, 313,446 lines). `CORPUS_MAP.md` gives line numbers for every base API script and notable system; `CAPABILITY_INDEX.md` answers "I need to do X, where's the answer?". **Check it before designing any spawning, combat, faction, location, quest or console-safety behaviour — vanilla almost certainly already solves it.**
- `AISS_StarWarsGenesis` — **AISS - Star Wars Genesis**, a data-only AISS add-on (a `star_wars_genesis` world profile + its own config) for the Star Wars: Genesis modlist — [brain file](My%20Games/Starfield/ModSource/AISS_StarWarsGenesis/CLAUDE.md). GitHub `X-2357/AISS_StarWarsGenesis` (private). Created 2026-09-28; Genesis installed at `C:Star Wars GenesisGame`. Ships as a separate MO2 mod; blocked on an AISS-side change (handoff in its Docs/). **That chat never edits AISS** - hard rule.
- More Starfield mods will be added here as work resumes on them.
- **Starcade OS** — portable in-game arcade + Freedoom port. Already released (v1.7.3), source never lost, so it lives outside ModSource in its own MO2 mod folders instead: brain file at `C:\Modding\MO2\mods\Starcade OS 1.3.0 Complete Source\CLAUDE.md` (see that file's Status section for why).

### Mount & Blade II: Bannerlord (C#)
Root: `Mount and Blade II Bannerlord\ModSource\`
- No named projects scaffolded yet — see [CLAUDE.md](Mount%20and%20Blade%20II%20Bannerlord/ModSource/CLAUDE.md) there for setup instructions.

## Background

August 2026: previous SSD failed, original mod source (.psc scripts, project files) was not backed up anywhere and is presumed lost except for compiled .pex releases already published. Machine is being rebuilt from a fresh drive. Recovery plan: decompile .pex → .psc with Champollion + Decompiled_PSC_Repair, then rebuild each project under the structure above with git as the real backup this time (see each project's CLAUDE.md for status).

## WORKING RULES — all projects, no exceptions

Michael, 2026-09-09: *"im sick of wasting time fixing things that didnt need to be broken. always
read the fucking brain file and check and verify everything, just take the time, i never gave you
timeline to rush and be lazy and triple my work."*

Each of these exists because breaking it cost him hours of rework.

1. **Read the project's brain file FIRST, before touching anything** — then grep it for the last
   in-game/runtime result on the system you are about to change. **A documented failure outranks any
   reasoning about why this time is different.** Reading a warning and arguing past it is worse than
   never reading it.
2. **Always look, always check.** Read the file before editing, the target before overwriting, the
   diff before committing, and any file you did not write before it enters a commit. **`git add -A`
   and `git add .` are banned** — name every path explicitly.
3. **There is no deadline. Take the time.** No timeline has ever been given. One slow correct pass
   beats a fast one needing four corrections; rushing triples his work.
4. **Do not break what is not broken.** Prove something is wrong by reading it before "fixing" it.
   **A convention that differs from the vanilla/reference pattern may be deliberate** — check why it
   is that way before matching the reference.
5. **Ask why it SHOULD be right, not why it is wrong.** Name the mechanism, then trace it end to end.
   Repeated different fixes failing on one system falsifies the **approach**, not the fix.
6. **One bug is never one bug — grep every sibling before reporting.**
7. **Compiled, deployed and hash-verified prove nothing about behaviour.** Never answer "is this
   good?" with a compile count.
8. **Verify a tool against a known-good value before believing its output.** A broken reader invents
   bugs that do not exist.
9. **Say what was verified and what was inferred.** Label unconfirmed things UNVERIFIED. A confident
   wrong answer costs more than an honest "not yet checked".
10. **Never let "that would need extra setup work" shape a design decision.** Pick the correct
    architecture and write down the manual step.

11. **A feature is not done at 80%. Ship it whole or do not call it shipped.** Michael, 2026-09-09:
    *"i want all the features fully scoped planned out built and working... i should never have to
    tell you to reset the factions back."* **He must never be the one who notices a feature has an
    unhandled lifecycle.**

    **Prefer ASSIGNMENT over MUTATION of shared world state.** Assigning a unit to a team needs no
    cleanup. Mutating faction relations, aggression, essential flags, crime factions, AI enable or
    actor values needs a correct restore on *every* exit. **Before writing any mutation of shared
    state, name the restore path and every exit that reaches it — if you cannot, redesign it as
    assignment.** SSaW's combat-faction bug is exactly this: mutation shipped first, teardown was
    bolted on later, and the bolt-on erases a CK guarantee permanently in the save.

    **Definition of done — all of these, or it is not finished:**
    1. Lifecycle written down FIRST: what starts it, what ends it, and abandon / timeout / failure /
       player death / quest stop / **save+reload**.
    2. **Every exit path reaches teardown** — win, loss, abandon, timeout, reload. Enumerate them;
       never assume one cleanup function is reached.
    3. **One owner per piece of mutable state.** Two writers is a defect even if it works today.
    4. **Reload survives**: timers re-armed, flags persisted, aliases re-resolved.
    5. **Failure paths handled**: every property that can be None, every array that can be empty or
       exceed 128, every native that can return None.
    6. **Observable**: one test must reveal *which step* failed. A failure that produces silence
       means the feature is not done — trace behind a flag, as vanilla's `ShowTraces` does.
    7. **Written acceptance test before building** — the exact in-game action that proves it works.
    8. **State what is unverified.** Compiled and deployed is not working.

    **Scoping rule: never scope many features shallowly in one pass.** That produces the very
    80%-done work he is complaining about. Scope ONE feature completely, then build it. A thin plan
    covering ten features is the same sin committed at planning time.

12. **Changing a WORKING feature needs a proven improvement, not a better-looking design.**
    Michael, 2026-09-13, after the ship rosters were retyped for "variety" the day after ship
    battles first worked in-game: *"why did you change the ship type? i told you they worked?"* ...
    *"make a new rule that if changing working features make sure the change actually improves the
    mod."* Before touching anything that has been seen working in-game, answer in writing: what
    does the player get that they do not get today, what does Michael have to redo in the CK or in
    a save because of it, and could the same result be had by ADDING next to it instead. If the
    gain is theoretical, or the cost is his re-doing work that already works, do not make the
    change - offer it, with those three answers, and wait for a yes. "Cleaner", "more vanilla",
    "unlocks a future option" are not improvements the player can see.

13. **A published release is the baseline; measure the blast radius before touching it.** Michael,
    2026-09-17, after a "fix" that silently re-aged 1,344 Robert's Rebellion characters and a
    launcher guard that stopped him switching world-states: *"I'm sick of fixing issues that
    weren't there before because you were stupid … make rules so you aren't dumb and take your
    time."* Before changing ANY data or behaviour that shipped in a public release:
    1. **Diff against the release, not against what looks right.** Merge/build the published
       version (each repo's root commit) and the proposed version, and count exactly which
       entities change. Report the number. "Dozens" was 1,344.
    2. **Anything that touches more than a handful of entities, or removes/moves an entity, is a
       design decision, not a fix — get a yes first, with the count in front of him.**
    3. **A reviewer or agent saying "this is a bug" is a hypothesis.** Check the author's stated
       intent first: the mod's own changelog, comments, file names, the timeline it models. An
       OR-chain of every culture with "age − 16" for a mod set 16 years earlier is design.
    4. **Never call work "done" or "releasable" while any deviation from the published behaviour
       is unresolved or unreported.** Done means: diffed against the release, every difference
       either asked-for or explicitly approved, and the list handed over.
    5. **Never add anything at the launcher/manifest level that removes a choice** (no
       `IncompatibleModules`, nothing that greys out or auto-unticks). Players install everything
       and pick.
    6. **Slow down.** There is no deadline (rule 3). One correct pass with the numbers in hand is
       the only acceptable speed.

14. **REVIEW HORIZONTALLY, OR DO NOT CALL IT A REVIEW.** Michael, 2026-09-25, after an outside
    review found a dozen defects in systems he had asked me to review repeatedly: *"how is this
    possible i told you many times to review the systems and how they interact with each other
    which is horizontal ... of course you shouldve checked horizontally too"*, and *"this makes me
    think the mod isnt as far along as i thought if you never even reviewed horizontally but lied
    to me and said you did."*

    **Vertical** = trace one function end to end. **Horizontal** = check that two things which
    share something AGREE. Every defect in that review was horizontal, and every review I had run
    was vertical. A vertical pass can be flawless and still miss all of them.

    Three checks, each producing a written table, before any review is reported as done:

    1. **Shared choke point.** Before touching state that another feature also reacts to, list
       EVERY feature that should react to the same event and check each one. Then say which you
       checked. (SSaW's choke points: ownership change, war / truce / peace / alliance, allegiance
       change, faction elimination, save+load, campaign start.) The 2026-09-25 example: blockade
       ended on ownership change and espionage never did, so a captured system kept draining its
       own captor - and the blockade fix had shipped the day before, in the same function.
    2. **Two front-ends, one backend.** Any capability reachable from more than one entry point -
       terminal, War Room bridge, arrival chain, AISS - gets its entry points listed and their
       guards diffed side by side. A guard present in one and absent in the other is a defect in
       one of them; decide which, never leave both. The 2026-09-25 example: the War Room refuses to
       deploy an operation unless you stand at its target system; the terminal launches anywhere
       and credits the distant system. **I wrote both sides and never compared them.**
    3. **Siblings.** blockade/espionage, ground/ship, once-only/repeatable, player/AI, accept-time/
       deploy-time. Fixing one means checking its sibling the SAME DAY, in the same pass.

    **A source-structure test that reads ONE file cannot see a seam.** Any claim about a seam needs
    a test that reads BOTH sides and asserts they agree. Property checks ("does this rule hold
    everywhere") are not integration checks ("do these two features agree") - do not name a tool
    after the thing it does not do.

    **And report the SHAPE of what was checked, never just the result.** "All five blockade exits
    route through one owner" reads as finished. Write it as "blockade's five exits - espionage NOT
    checked." A narrow finding in completeness language is how a dozen defects survived ten
    requests to review the systems. **Completeness language is a claim, and claims get verified.**


15. **EVERY MOD JOINS AN ECOSYSTEM, INCLUDING THE NEXT ONE.** Michael, 2026-09-25: *"i want all my
    mods to work together in harmony in an ecosystem"* and *"lets make sure that the ecosystem of my
    current and future mods is always handled well."*

    **`My Games\Starfield\ModSource\X2357_MOD_ECOSYSTEM.md` is the shared contract.** Read it before
    building anything that publishes state, reads another mod's state, or draws a UI. It is
    mod-agnostic and sits on the shared shelf beside `VanillaPapyrusReference`. Two layers:

    - **Sections 1-4: the data bus** — files in `SFSE\AISS\state\`, `ready=0`/`ready=1` handshake,
      `schema_version`, one owner per file, absence is normal.
    - **Sections 4b and 8: the shared runtime** — four mods now draw into one OSF UI process and one
      Papyrus VM. 4b is page-side cadence (timer shape, floors, visibility, one-in-flight,
      staggering); 8 is what the runtime shares and what it silently drops.

    **The five that cost real time when broken:**
    1. **A `.pex` deploy survives a save reload; a VIEW deploy needs a full restart of Starfield.**
       Under MO2, OSF UI mirrors every view to `%LOCALAPPDATA%\OSFUI\views-mirror-<pid>` once, when
       the host launches. Editing a view in its MO2 folder mid-session cannot reach the game, and
       the symptom is "my change did nothing" (2026-09-25, a whole session).
    2. **Never call into Papyrus from a bare `setInterval`.** A throttled view releases the backlog
       in one burst, and every mod shares that VM. Self-rescheduling `setTimeout`, with a floor.
    3. **Reply tokens die after 10 seconds.** Never answer a view request with expensive work;
       publish it on a cadence instead and let the page read the published copy.
    4. **OSF UI's queues are bounded and drop silently**, so the PAGE must refuse a partial
       snapshot: every column validated for length AND a matching `[sequence, epoch]` footer, or it
       shows "waiting", never half a snapshot. Publishing `meta` last fixes ordering, not loss.
    5. **One `modId` per mod, one view id per surface; declare `"mod"` in the manifest and no
       `targetVersion`** (the shape OSF UI 1.6's own views use). Never a hard dependency between two
       of Michael's mods - each must install and run alone, and degrade to nothing when the others
       are absent.

    **Do not build a cross-mod queue or lock.** Two independent investigations on 2026-09-25 reached
    the same answer: OSF UI already queues, namespaced per mod, and Papyrus has no cross-mod mutex -
    a file-based lock that must survive a crash, a reload and an uninstall is more dangerous than
    the contention it would prevent. The contract is **cadence and validation**, not exclusion.

    **When a new mod is built, add it to that document** - its row in section 3, its `modId`, and
    anything it learned. A shared contract that is not updated becomes the thirteen CK guides.
16. **ADDING A RECORD IS NOT DONE UNTIL EVERY TABLE KEYED BY IT IS WIRED.** Michael, 2026-09-26,
    after three hand-written NPC presets shipped with no voice routes: *"if you add npc and
    profiles you need to add them to the config too for voices and properly link everything, that
    shouldve been obvious and seems like youre trying to be lazy again."*

    He is right that it should have been obvious, and **the reason it was not caught is worse than
    the miss**: the health check printed `NPC profiles: 1353` directly above `TTS voice routes:
    1350` and still reported **HEALTHY**. Two numbers that only mean something when diffed, in a
    report nobody diffs. The three would have fallen through to the gender fallback pool, which is
    ElevenLabs-only and **adult**-only - so two adopted children would have spoken in adult voices.

    **Before calling any content addition done, list every table keyed by the thing you added and
    check each one, in writing.** For an AISS NPC that is at minimum: the preset file,
    `tts.npc_voices` in `config.json`, the SAME key in all seven `config_presets/*.json` (a preset
    archive silently drops whatever it omits - AISS entry 79), and the pack's `manifest.json`.
    For any mod: the record itself, every catalog that indexes it, every config table keyed by its
    id, and every doc that states a count.

    **And write the gate, not just the rule** (rule 5 - prefer the check that makes the whole class
    impossible). `Source/Backend/tests/voice_route_coverage.test.js` now fails by name when a
    shipped preset has no route, when a preset archive is missing a key `config.json` has, or when
    a Fish table is handed an ElevenLabs id. **A rule you have to remember is the weakest possible
    fix; a rule a test enforces cannot rot.**

17. **AN UNCONFIRMED FIX IS NOT A FIX - IT IS A HYPOTHESIS WITH CODE ATTACHED.** Michael,
    2026-09-28, after the third misdiagnosis of the same symptom: *"why are so many things broken
    when its been months and youve told me you did exhaustive revioews"*.

    Menu mode was blamed for a menu that would not draw on **2026-08-31** (Strategy Council),
    **2026-09-10** (War Beacon) and **2026-09-27** (every decision in the mod). **Neither of the
    first two fixes was ever confirmed working in game - this file says so in both entries** - and
    I cited them as though they established the mechanism. The real cause was one CK flag.

    - **Never cite an unconfirmed fix as evidence for a diagnosis.** If the entry says "NOT
      in-game tested", it is not a precedent, it is an open question.
    - **When the same mechanism is blamed twice and neither fix was confirmed, the mechanism is
      wrong.** Stop. Go and find a different layer - data, records, flags, load order - before
      writing a third fix. Rule 5 says repeated different fixes failing falsifies the APPROACH;
      this is the specific form it takes.
    - A fix and the belief it was right are separate things. Track them separately.

18. **NAME THE BUILD BEHIND EVERY IN-GAME RESULT, OR THE RESULT MEANS NOTHING.** From 2026-09-20
    to 2026-09-27 an enabled beta mod won the VFS for all 22 SSaW files. **Michael's in-game
    confirmations on 2026-09-26 - ground battles, space battles, AI peace, exploration - were
    describing 09-20 CODE.** Four confirmations were attributed to code that had never run, and
    eight days of changes were "verified" against a build the game never opened.

    - Run `Tools/check_mo2_winner.py` **at the start of a test cycle**, not only after deploying.
    - **Record the winning digest alongside every in-game result.** A result without a build is
      unattributable and cannot close anything.
    - When Michael says something got WORSE, **diff against the last build he confirmed working**
      before reasoning about current source. That is what found the 2026-09-21 regression, and it
      was only done because he said "going backwards" - it should have been the first move.

19. **EXTEND WORKING LOGIC. DO NOT REPLACE IT.** On 2026-09-21 the rule "the player joins their
    own faction's combat faction, or nothing" was replaced by one that picked a side from war
    state. Because the six combat factions are permanently mutually hostile, that put a Crimson
    Fleet player into Independent's faction and **made his own faction hostile to him**, and
    handed his victories to a faction he never chose.

    The old rule worked. The new case (a third side) should have been ADDED beside it.

    - When changing logic that has ever worked in game: **keep the old branch as the default and
      add the new behaviour as a narrow extra case**, such that removing the new case reproduces
      the old behaviour exactly.
    - Rule 12 asks whether the change is an improvement. This asks a second question: **if it is,
      can it be added instead of substituted?** Usually it can.

20. **THE HORIZONTAL TABLES COME BEFORE THE FIX, NOT AFTER IT.** Rule 14 was written 2026-09-25
    and broken on 09-26 (two ship-disposal paths, only one guarded) and again on 09-27 (two
    decision front-ends, only one given the identity guard I had built that same day).

    The reason it kept failing is that the tables were being produced as a **reporting step after
    the work**. They are a **design precondition**.

    - Before writing a fix, write the list: every sibling, every front-end, every consumer of the
      choke point being touched.
    - **The fix is not started until that list exists**, and every entry on it is either fixed in
      the same pass or explicitly deferred **with a reason and a name**.
    - A fix that touches one of N identical sites is not finished, it is started.

21. **A TOOL ANSWERS EXACTLY ONE QUESTION. WRITE THAT QUESTION DOWN AND COMPARE IT TO THE ONE
    BEING ASKED.** `check_decision_menus.py` counted `ITXT` button entries and reported all 19
    decision records healthy. The defect was the `DNAM` Message Box flag, which it could not see.
    **I built the instrument that made me confident and never asked what it was blind to** - for
    four weeks, across three misdiagnoses.

    - Before trusting a tool: write the question it **actually** answers, write the question that
      **needs** answering, and compare them in writing.
    - Calibrate against a **known-good AND a known-bad** example before believing any output.
      Rule 8 says calibrate; this says calibrate **the right layer**.
    - **Never report a tool's green as an answer.** Report it as "X holds, where X is <the tool's
      question>" - which makes the gap visible instead of hiding it inside the word "verified".

22. **MICHAEL'S IN-GAME REPORT IS THE HIGHEST GRADE OF EVIDENCE IN THIS PROJECT. ASK FOR THE
    DISCRIMINATOR BEFORE THEORISING.** Michael, 2026-09-28: *"i give you constant feedback from in
    game testing dont lie"* - correcting a claim of mine that the loop lacked feedback. **It does
    not. His reports are frequent, specific and accurate; what has been failing is what I do with
    them.**

    Three times he described the decision popups precisely and correctly. Each time the report was
    converted into a plausible theory and shipped, instead of into a test that could tell the
    competing theories apart.

    - When he reports a symptom, **first ask which observation would separate the candidate
      causes**, and ask him for exactly that - a log line, a screenshot, one named record.
    - **The diagnostics already exist and are barely used.** `DiagnoseBattle`/`DiagnoseSide`
      already print a verdict naming the failing layer; `TraceGroundSpawn` names the anchor per
      unit. Ask for the log before writing a diagnosis, not after the fix fails.
    - **Every batch ends with one short test card** - the exact in-game actions, under ten
      minutes, and what a pass and a failure each look like. A batch with no test card is a batch
      whose result cannot be attributed to it.
    - **Never explain a defect by how much he tests.** He tests constantly. The defect is mine.

23. **EXPORT-TIME DATA IS NOT GAME DATA. PROVE IT AGAINST A LIVE INSTALL, OR IT IS UNVERIFIED.**
    Michael, 2026-09-28, after every modded quest, every modded item and 442 NPC identity matches
    turned out to have been broken at the same time, silently, for weeks: *"how could you break
    all the quest add ons? thats ridculous and how didnt you find that in all the exhaustive
    reviews ive had you do?"* and *"how can you make guards againast that"*.

    **The mechanism, because it will recur in every Bethesda project here:** an xEdit export bakes
    the plugin's **load-order index** into every form id. The player's load order is different, so
    a baked id is wrong in their game - and it fails SILENTLY: the lookup misses, the formatter
    returns `""`, and an entire awareness block disappears with no log line.

    **Four checks, each of which would have caught it alone:**
    1. **NEVER VERIFY BY COUNT.** AISS entry 84 "verified" the addon quest merge as
       `1342 -> 2000 records`. That proves catalogues PARSE. **Assert that one specific MODDED
       record RESOLVES end to end**, by the name a player would say. Population is not resolution,
       and every one of these three bugs shipped behind a count.
    2. **VANILLA PASSING PROVES NOTHING ABOUT MODDED CONTENT.** Vanilla is index `00`, and `00` is
       the identity case - the full id and the local id are the same number. That is exactly why
       this looked fine for years. **Every id-bearing feature needs a MODDED test case or it is
       untested.**
    3. **PREFER THE ENGINE CALL THAT TAKES A NAME.** `Game.GetFormFromFile(localId, pluginName)`
       resolves the index at runtime and cannot care about load order; an absolute baked id never
       can. When the codebase already proves a load-order-independent fetch, use it rather than
       inventing a second route (AISS entry 152 learned this once already, for the subtitle
       carrier, and it cost a whole play session).
    4. **A FIXTURE TEST CANNOT SEE THIS CLASS.** The defect lives between SHIPPED DATA and a REAL
       GAME, and a fixture has no load order. The guard must read the real catalogues and the real
       `active_plugins`, and assert an INVARIANT - "nothing we hand the game carries an index" -
       so data exported tomorrow at a new index is covered without touching the test.
       `AISS/Source/Backend/tests/load_order_independence.test.js` is that guard; copy its shape.

24. **A RISK YOU WRITE DOWN BUT NEVER MEASURE IS WORSE THAN ONE YOU NEVER NOTICED.**
    The load-order defect was recorded in AISS's own brain file **twice** - entry 85 (*"only valid
    on a load order placing that plugin at the same index"*) and entry 148's V236, which even went
    as far as measuring pack-against-pack collisions - and **neither ever compared a baked id
    against the runtime load order.** That is one command. It took ninety seconds on the day it was
    finally run, and by then it had cost three shipped features.

    Writing a risk down creates the ILLUSION of coverage: the next reader sees it acknowledged and
    assumes someone is on it. **So the session that records a risk either measures it, or states in
    one line exactly what measurement is missing and what it would cost to run.** "Known
    limitation" with no number attached is not a disclosure - it is a deferral with no owner, and
    it reads as safety while being the opposite.

25. **SIMPLER FIRST, AND MEASURE BEFORE REACHING FOR THE GENERAL CASE.**
    Michael, 2026-09-28, mid-fix: *"are you making things more compicated for no reason when
    siompler is usally better?"* He was right - I had started building plugin-type masking and
    active-plugin gating when the entire difference between a broken id and a working one was the
    **first two hex digits**.

    Before building the general mechanism, **measure whether the narrow one is sufficient, and
    write the number down.** Both real decisions that day were settled in under a minute each:
    last-six matching was safe because 2,052 of 2,056 values were unambiguous, and comparing local
    NPC ids beat dropping them because it produced 3 collisions instead of 24. **If the measurement
    says the simple thing is enough, the complex thing is not "more robust" - it is unverified
    extra surface**, and it is the version that will be wrong in a way nobody checks.

## Working conventions for all mod projects
- Every project folder is its own git repo, with a CLAUDE.md ("brain file") that gets updated after every session or major change — read it first, keep it current, don't let it go stale.
- Git identity: X-2357 / mwmaksirisombat@gmail.com (already configured globally on this machine).
- **Handing Michael Creation Kit work? Follow `My Games\Starfield\ModSource\CK_TASK_LIST_HANDOFF.md`** (2026-09-14): a numbered checklist of single actions with exact EDIDs, paste text as one plain `.txt` per record, nothing done or explanatory in it, and a read-back of the saved plugin afterwards that hands back only what is left. Three formats were tried; this is the one he liked.
- **Starting a new mod, or a fresh session on any of them? Paste `My Games\Starfield\ModSource\AISS\Docs\STARFIELD_MODDING_STARTER_HANDOFF.md`** (revised 2026-09-12): the working rules, brain files, GitHub, the research shelf, toolchain, the Mod Organizer facts, the release gates - every path in it verified on this machine.
- GitHub remote push requires `gh auth login` to be completed by Michael first (gh CLI not yet installed/authenticated as of this setup).
