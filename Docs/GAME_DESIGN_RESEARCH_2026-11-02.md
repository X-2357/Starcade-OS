# Game-design research for Starcade and the X-2357 ecosystem
Prepared November 2, 2026. Online source survey requested by Michael. All 30 named game/franchise families addressed below; Civilization IV space mods and selected Stellaris expansions receive separate treatment. This is a design comparison and routing backlog, not implementation, engine feasibility certification or a full audit of every expansion.

## Findings that matter most

My recommendation: make Starcade better at **short games with meaningful decisions, readable consequences and replayable records**. It does not need a whole commercial game recreated inside it.

The best new-game candidates are a convoy journey, a compact ship-crisis game and an original holo-sports manager. The best improvements to existing games are optional challenge scenarios, end-of-run explanations and clearly separated simulated rival records. Their value comes from decisions and understandable results, not polygon count.

The major ecosystem opportunity is sharing **authoritative outcomes**, not sharing ownership: activity owners produce results, consumers show them appropriately, and only the transaction owner awards anything. This applies equally to scoreboards, sponsorships, colony leisure, historical trophies and AISS conversation.

## Method and confidence

Read the current Starcade brain/rules/checklist before browsing. Current evidence: native 1.7.3 rebuild works by owner report and log; 1.9.9 archive has older native DLL; October 20/21 Hextris and music gameplay confirmations supersede old pending labels. Research must not replace release/maintenance work already accepted.

For each reference separate (a) source-supported observation, (b) our proposed adaptation, (c) responsible owner, and (d) unresolved implementation risks. Publisher/developer pages and manuals preferred; Civ mod-author sites/threads are primary for those mods. Product pages establish advertised features, not measured quality or transferable code. Search snippets sometimes supply the only available detail; those entries are discovery-level. No binaries downloaded, no games played, no sibling source modified.

Names are normalized: Kerbal Space Program, Civilization IV, Sins of a Solar Empire, Helldivers, Dyson Sphere Program and OOTP. Ambiguous franchise requests are treated as families: XCOM 2, Homeworld 3 War Games, modern Oregon Trail, Madden 26/27 and NBA 2K26/historical Eras supply representative examples. KSP 1 evidence is not evidence for KSP 2. Stellaris is a selected expansion survey, not an exhaustive current DLC catalog.

All adaptation text below is **our inference/proposal**, not a feature claimed to exist in Starcade. No external game source/art/audio/maps/characters/rosters are proposed for copying or redistribution.

## Coverage register: 30 families

| ID / reference | Supported observation and source | Adaptation proposed for us | Ownership / boundary |
|---|---|---|---|
| R-G01 Mass Effect | Persistent choices across games and squad-led adventure are described by [EA](https://www.ea.com/games/mass-effect/mass-effect-legendary-edition). | Short arcade story campaigns with 2–3 consequences remembered between missions; a debrief that explains the consequence. | Starcade fictional campaign; real companion history belongs to its source owner/AISS. No global morality meter. |
| R-G02 Civilization IV space mods | Final Frontier is a space scenario in the [official BTS manual](https://files.aspyr.com/support/Civ4_BTS_Mac_Manual_EN_US.pdf); see mod comparison below. | Compact sector strategy board: systems as nodes, routes as scarce commitments, distinct faction objectives. | Starcade simulation; real campaign SSaW, communities OC. New game, not a rewrite of Fleet Command. |
| R-G03 Stellaris + expansions | Councils, federations, corporations, archaeology and first-contact designs are covered below with primary links. | Modular scenarios, conflicting priorities, staged discoveries and informative event options. | Fiction in Starcade; actual leaders CT, corporations CW, cases Shadow, history Legacy. No extra universal simulation. |
| R-G04 X4 | [Egosoft](https://m.egosoft.com/games/x4/info_en.php) describes fleet ownership and a complex economy. | Tiny dispatch board: assign a simulated ship to a route, compare time/risk/cargo, inspect the bottleneck. | Starcade-only tokens; live vessels Infamous, market SSSE, actual production OC. |
| R-G05 Elite Dangerous | The [Frontier-hosted manual](https://hosting.zaonce.net/elite/website/assets/ELITE-DANGEROUS-GAME-MANUAL.pdf) documents ship systems, travel and historical Powerplay. | Fuel/reserve navigation challenge; route preview shows risk rather than hiding arbitrary failure. | Arcade scenario; real navigation/fleet research Infamous. Manual is historical, not proof of current Powerplay balance. |
| R-G06 No Man's Sky | [Frontiers](https://www.nomanssky.com/frontiers-update/) and [Beacon](https://www.nomanssky.com/beacon-update/) describe settlement decisions and expedition debriefs. | Expedition cards with preparation, return reports and durable outcomes; leisure may supply an OC activity opportunity. | OC owns colony decisions; Infamous expedition vessels; Starcade supplies only supported recreation. |
| R-G07 EVE Online | [CCP](https://www.eveonline.com/p/mmorpg) describes corporations, fleet activity and player-driven economics. | Planning choices where roles complement each other; a compact market sim with explainable supply interruptions. | SSSE owns actual markets, CW companies, Infamous fleets. No MMO or player-market infrastructure assumed. |
| R-G08 Homeworld | [War Games FAQ](https://www.homeworlduniverse.com/war-games-demo-faq/) documents linked fleet challenges and run-specific upgrades; it explicitly calls them simulations. | Three-round fleet gauntlet, retained simulated damage and a choice of upgrade between rounds. | Starcade owns simulation; no victories credited to SSaW or actual casualties to CT. |
| R-G09 Star Fox | [Nintendo manual](https://assets.nintendo.eu/image/upload/v1635394987/NAL/Support/Starfox64_3D_manual.pdf) describes route-dependent mission progression. | Original short shooter with optional rescue/accuracy objectives opening different next stages; mission result distinct from score. | New Starcade game; do not replace current Space Racer lane rules or copy characters/levels. |
| R-G10 Outer Wilds | [Mobius](https://www.mobiusdigitalgames.com/outer-wilds.html) describes a solar-system mystery and time loop. | Knowledge-led puzzle in which a learned clue unlocks a new solution, plus spoiler-controlled clue map. | Fictional puzzle Starcade; real clue/provenance Shadow, exploration Discovery Journal. No actual universe reset. |
| R-G11 Kerbal Space Program | [Developer storefront](https://store.steampowered.com/app/220200/Kerbal_Space_Program/) describes construction, physics and Science/Career/Sandbox modes. | Orbit/docking training with visible predicted path, fuel budget and optional scoring; sandbox practice separate from ranked mode. | Starcade fictional physics; no claim of manipulating Starfield orbital mechanics or certifying CT rank. |
| R-G12 Bannerlord | [TaleWorlds dev blog](https://www.taleworlds.com/en/Games/Bannerlord/Blog/80) describes clans, influence and faction votes. | Rival team identities, readable standings, competing offers and costs of coalition support. | Starcade league fiction; live influence SSaW/CW, personnel CT. No new shared faction-relation controller. |
| R-G13 Grand Theft Auto | [Rockstar properties guide](https://www.rockstargames.com/gta-online/guides/k329) links arcades, cabinets, planning rooms and business hubs. | Themed arcade rooms/cabinet browsing as a later venue option; match preparation visible before activation. | OC amenities, CW business agreements; Starcade games. Cabinet income is a separate financial design, not an automatic reward. |
| R-G14 Between the Stars | [Developer storefront](https://store.steampowered.com/app/727130/Between_the_Stars/) advertises crew-dependent text events, captain decisions and equipment growth. | Original ship-event campaign where a simulated specialist creates an alternative action, with authored consequence tags. | Fictional crew Starcade; actual captain/ship Infamous, qualification CT. Never invent real participation. |
| R-G15 FTL | [Subset storefront](https://store.steampowered.com/app/212680/FTL_Faster_Than_Light/) describes rerouting power and multiple encounter solutions. | Small 2D ship-crisis simulator with scarce power, repair teams, branching route and retreat option. | Starcade fiction; real engineering would require Infamous/CT-owned mechanisms. No copied FTL event text. |
| R-G16 Endless Space 2 | [Amplitude storefront](https://store.steampowered.com/app/392110/ENDLESS_Space_2/) describes population politics, battle plans and after-action reports. | Explain a result with plan-versus-plan comparison; offer asymmetric goals instead of only score inflation. | Starcade game systems; actual policies OC, campaign SSaW. |
| R-G17 XCOM | [Firaxis storefront](https://store.steampowered.com/app/268500/XCOM_2/) presents resistance strategy and tactical operations. | Optional grid tactics game with action budgets and extraction; persistent simulated roster only inside that game. | Starcade fictional roster; real operations SSaW/CT. Hidden hit chances require clear presentation. |
| R-G18 Sins of a Solar Empire | [Developer diplomacy journal](https://www.sinsofasolarempire2.com/article/539948/sins-ii-dev-journal-the-diplomatic-method-how-to-win-friends-and-influence-) describes trust, preferences and limits on repeated gifts. | Bounded negotiation challenge: offer scarce goods or favors; clear relationship effects and anti-spam limits. | Fictional game Starcade; actual contracts CW, diplomacy SSaW, financial effects SSSE. |
| R-G19 Warframe | [Devstream 168](https://www.warframe.com/en/news/devstream-168-overview) describes Circuit/Decree run variation. | Opt-in run mutators: choose one tradeoff between stages; separate records by ruleset. | Starcade. No forced daily chores or importing combat balance from another game. |
| R-G20 Helldivers | [Sony's description](https://sonyinteractive.com/en/press-releases/2026/helldivers-2-joins-the-playstation-plus-game-catalog/) establishes team missions within an evolving Galactic War. | Arcade operation board linking small objectives to one simulated campaign; local progress visibly labeled. | SSaW owns real war. No fictional global-player count or server/live-service dependency. |
| R-G21 Destiny | [Bungie Fireteam Finder guide](https://help.bungie.net/hc/en-us/articles/25787853699220-Fireteam-Finder-Guide) supports activity-specific team assembly. | Clear activity cards listing duration, difficulty, controls and required roles; reusable simulated squad presets. | Starcade fictional team manager; actual crew recruitment CT/Infamous. No claim NPCs can join games. |
| R-G22 The Outer Worlds | [Obsidian storefront](https://store.steampowered.com/app/578650/The_Outer_Worlds/) describes player-shaped story, companions and flaws. | Voluntary drawback with a compensating capability inside a fictional campaign; alternative resolutions with concrete consequences. | Starcade fiction; real persistent traits need their existing gameplay owner. Not a blanket player debuff. |
| R-G23 Star Citizen | [Engineering guide](https://robertsspaceindustries.com/en/comm-link/transmission/20935-Engineering-Gameplay-Guide) describes resources, components and failures; indexed primary text available, page itself loaded poorly. | Schematic repair triage: isolate failure, route limited power, choose emergency action. | Fictional Starcade; live engineering Infamous/CT research. No physical ship-systems API assumed. Discovery-level source coverage. |
| R-G24 Dyson Sphere Program | [Developer storefront](https://store.steampowered.com/app/1366540/Dyson_Sphere_Program/) describes production lines and interstellar logistics. | Compact throughput puzzle with three resources and visible bottleneck; improvement measured as delivered output. | Arcade puzzle Starcade; real extraction/production OC, shipping Infamous, prices SSSE. |
| R-G25 Oregon Trail | [Gameloft announcement](https://www.gameloft.com/newsroom/the-oregon-trail-epic-gog-physical) describes decision-driven journeys. | “Frontier Convoy”: choose route, supply allocation and event response; complete a short expedition with a recap. | Starcade fiction; actual passengers Rescue, destinations OC, exploration Discovery. Original sci-fi events only. |
| R-G26 Motorsport Manager | [Developer storefront](https://store.steampowered.com/app/415200/Motorsport_Manager/) describes preparation, staff and race-day decisions. | Simulated race-team manager: prepare handling/reliability plan, change tactics mid-race, learn from split/result report. | New Starcade game; physical Stellar Circuit racing Infamous. Do not turn simulated wins into actual championships. |
| R-G27 Football Manager | [SI Recruitment Revamp](https://www.footballmanager.com/features/recruitment-revamp) describes recruitment focus and targeted scouting updates. | Holo-league recruitment shortlist, role fit and reports when meaningful findings arrive rather than constant alerts. | Fictional league Starcade; actual rank/qualifications CT. Report confidence is our proposal, not established by this source. |
| R-G28 OOTP | [Developer features](https://www.ootpdevelopments.com/ootp65/corefeatures.php) describe fictional players, development and extensive records; this source is an older edition. | Original fictional league schedules, box-score summaries, season history and replayable highlights. | Starcade owns simulated season; Legacy may archive a verified player milestone through a new adapter. No real licensed rosters. |
| R-G29 Madden | [EA franchise deep dive](https://www.ea.com/games/madden-nfl/madden-nfl-26/news/madden-26-gridiron-notes-franchise-deep-dive) describes weekly matchup/scouting cards. | Before a match, show opponent tendencies, strengths and counter-plan tradeoffs; manual critical choices with optional simulation. | Starcade holo-sports; real command roster CT/SSaW. Avoid copying playbooks or endless stat menus. |
| R-G30 NBA 2K | [2K26 MyNBA announcement](https://newsroom.2k.com/news/endless-possibilities-await-as-mynba-levels-up-in-nbar-2k26) describes long-term franchise accomplishments; [MyNBA Eras announcement](https://newsroom-uk.2k.com/news/rewrite-nba-history-in-nbar-2k23-with-all-new-mynba-features-for-playstation-5-and-xbox-series-xs-consoles) supports historical starting points. | Fictional classic-rule seasons, championship banners and roster snapshots that remain historically accurate. | Starcade season; Legacy actual player milestones only. No Ultimate Team/card-pack economy or copied NBA brands/assets. |

## Civilization IV space-mod comparison

1. **Final Frontier:** verified as the included space exploration/combat scenario in Aspyr's BTS manual. Useful lesson: represent a solar system as the unit of territorial decision instead of simulating every ship/planet. Proposed arcade scale: a small node graph with explicit turns and only a few actions per turn. This is our simplification, not a claimed original map size.
2. **Final Frontier Plus:** [authors' site](https://finalfrontierplus.github.io/) explicitly emphasizes performance/reliability, richer content, clearer UI and removal of hardcoded limits in favor of data definitions. Most useful transferable lesson is **data-driven scenarios plus solid diagnostics**, not more content before stability. Their DLL/Python/XML structure is Civ-specific, not a browser port recipe.
3. **deanej's Star Trek conversion:** [author's description](https://forums.civfanatics.com/threads/about-this-mod.297001/) describes reintroducing Great People and unique units into the space design. Useful lesson: faction/role asymmetry can make otherwise similar units feel different. Starcade would use independently authored identities/rules; no Star Trek content imported.
4. **Babylon 5 conversion:** [project page](https://www.moddb.com/mods/babylon-5-mod-for-civilization-4) establishes a Final Frontier-based conversion. It is a discovery reference for thematic faction identity, not evidence that a specific diplomacy or campaign implementation transfers. Detailed rules/code/license audit NOT performed.

No downloaded Civ mod, code-vendoring plan or permission inference. Source availability never automatically licenses all artwork or branded content.

## Stellaris expansion lenses

Expansion feature descriptions are historical design references; current ownership/bundling changes do not change the lessons. For example, Paradox's [2026 base-game update](https://www.paradoxinteractive.com/games/stellaris/news/an-update-on-stellaris-base-game) announces Utopia's inclusion; do not treat it as necessarily a separate purchase today.

| Lens | Source-supported design | Proposed ecosystem use |
|---|---|---|
| Utopia | [Original developer announcements](https://store.steampowered.com/news/posts/?appgroupname=Stellaris&appids=281990&enddate=1488204314&feed=steam_community_announcements) describe staged megastructures and habitats. | OC-owned staged projects with visible progress; Starcade can have a small construction puzzle. No literal Dyson sphere/whole-planet build promise. |
| MegaCorp | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-megacorp) describes corporate branch offices and agreements. | CW sponsorship agreements, OC service effect, SSSE interpretation; arcade branding is a bounded Starcade consumer. |
| Federations | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-federations) describes cohesion, resolutions and different federation types. | SSaW/CW agreement terms; in Starcade, asymmetric optional team rules rather than a new real galactic senate. |
| Ancient Relics | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-ancient-relics-story-pack) describes staged archaeology narratives. | Shadow authored clue lifecycle, Discovery records findings, Legacy archives resolved achievement. Arcade analogue: staged signal puzzle. |
| Galactic Paragons | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-galactic-paragons) describes council assignments and leader development. | CT owns supported qualifications; activity owner owns task outcome. Starcade fictional coaches have distinct tactical jobs. |
| First Contact | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-first-contact-story-pack) describes interactions shaped by awareness and technology. | Shadow/AISS recipient knowledge, not omniscient dialogue. Arcade choice game can reveal information gradually. |
| Overlord | [Announcement](https://www.paradoxinteractive.com/games/stellaris/news/announcing-stellaris-overlord) supplies an empire/relationship-specialization lens. | Proposed CW agreement with distinct obligations; exact specialized contract mechanics need deeper source reading before adaptation. |
| Nemesis | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-nemesis) and Overlord's announcement identify espionage/power escalation. | Shadow owns evidence/secrets; SSaW strategic consequences. Do not automatically expose confidential outcomes to an arcade/news feed. |
| Astral Planes | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-astral-planes) describes branching exploration. | Self-contained authored narrative cabinet with mutually exclusive routes; no physical alternate-dimension system promised. |
| Grand Archive | [Paradox](https://www.paradoxinteractive.com/games/stellaris/add-ons/stellaris-grand-archive) describes collecting and exhibiting discoveries. | Legacy collection provenance and contextual display; Starcade achievement cabinet only after real event evidence exists. |

Other expansions remain a follow-up inventory, not silently claimed as reviewed. This pass selected ten particularly relevant lenses rather than exhaustively reviewing every content pack.

## Deduplicated candidate backlog

All are PROPOSED. “Good candidate” is design judgment, not accepted implementation scope. Browser feasibility below is an architectural hypothesis grounded in existing Starcade 2D/3D patterns, not a prototype result.

| Candidate | Visible benefit | Smallest useful form | Existing overlap / owner | Main uncertainty |
|---|---|---|---|---|
| SC-RCH-001 After-action explanation | Player understands why they won/lost | One game's result panel with 3 decisive factors and a next-run suggestion | Existing scores; Starcade | Game must expose true causal data, not generated guesses |
| SC-RCH-002 Optional scenario cards | Replay value without replacing familiar game | Three explicitly selected modifier variants for one game | Existing games; Starcade | Records/save/XP fairness and input/UI paths |
| SC-RCH-003 Frontier Convoy | Short supply/risk narrative run | Six route nodes, three supplies, small original event deck | FTL/Oregon/BTS; new Starcade game | Save/quit recovery, event balance, authored content workload |
| SC-RCH-004 Ship Crisis | Tactical power/repair choices | One schematic ship, three subsystems, retreat/win/loss | FTL/Star Citizen; Starcade fiction | Bounded simulation, readable controller input |
| SC-RCH-005 Holo-League Manager | Team-building and seasons without huge 3D sports scope | Four fictional teams, brief season, one tactic decision per phase | Existing #336, not a duplicate new backlog | Simulator balance, standings integrity and time advancement |
| SC-RCH-006 Race Director | Strategy rather than reflexes | One simulated course, reliability/pace tradeoff and tactical changes | Motorsport; distinct from Space Racer and real Infamous races | Distinguish Racing Book betting vs actually managing a team |
| SC-RCH-007 Fleet Gauntlet | Linked tactical challenges | Three rounds, carry damage, choose temporary upgrade | Existing Fleet Command needs comparison first | Add mode only if player benefit and lifecycle proven |
| SC-RCH-008 Orbital Workshop | Practice skill with visible feedback | One docking/orbit exercise with path preview | Lunar Descent/Docking Vector overlap | Verify actual existing rules before adding redundant physics |
| SC-RCH-009 Supply Chain Puzzle | Readable optimization | Three resources, bottleneck view, fixed goal | DSP/X4/EVE; separate fictional game | Determinism, useful explanation and CPU bounds |
| SC-RCH-010 Signal Casebook | Knowledge-based puzzle | Authored clue graph with spoiler controls and two solutions | Codebreaker overlap; real cases Shadow | Preserve objective truth, no false history or spoilers |
| SC-RCH-011 Arcade Records Archive | Meaningful personal continuity | Best run, previous best and last completed run under exact ruleset | Existing native scores; Starcade | Native schema/migration and historical attribution |
| SC-RCH-012 Milestone Receipt | Supported Legacy/AISS acknowledgment | One completed supported achievement with stable receipt | Existing SC-ADD-001 | New event transport/identity/dedupe, not snapshot inference |
| SC-RCH-013 Recreation Availability | Make colonies feel connected | OC/LSS offers a supported leisure opportunity | Existing SC-ADD-002 | Interaction and actor teardown capability; no NPC gaming claim |
| SC-RCH-014 Sponsored Scenario | World flavor and optional CW link | Authored brand flavor + optional verified sponsorship fact | Existing SC-ADD-005 | Disclosure/version semantics; no autonomous money generation |
| SC-RCH-015 Physical Arcade Venue | Contextual place to play | One independently usable cabinet/room | #342 partial overlap, OC amenity if supported | Assets, placement, CK records, controller access and actor routines |

### Ranking for Starcade

**First design work:** SC-RCH-001 or 002, after release maintenance. They can improve one working game additively and test whether new feedback/variety is worthwhile. No blanket rewrite.

**First substantial new game:** SC-RCH-003 Frontier Convoy. It combines the most transferable narrative/management lessons in a UI-compatible form. Prefer original event writing and predictable state to a massive 3D engine port.

**Strongest already-routed long-term candidate:** SC-RCH-005 Holo-League Manager, consolidated into #336. Football Manager/OOTP/Madden/NBA provide one coherent design family, not four separate games we must build.

**Research after these:** Ship Crisis, Race Director and Supply Chain Puzzle. Each deserves its own full lifecycle and input prototype. Larger 4X, physical sports, online multiplayer, native executable embedding and simulated galaxy economies stay lower priority.

## Why these candidates could improve play

### After-action reports rather than another number

Persist actual run metrics at the game owner: e.g. collisions, objective completion, fuel remaining, key route decisions. Present 2–3 attributable factors. Do not claim an exact causal explanation from a score alone. Optional comparison uses same game + same rules revision; no comparison of unrelated score scales. This borrows explanatory presentation from strategy/sports games without simulating their whole worlds.

### Challenge cards without breaking records

Keep the current default mode and mechanics exactly intact. Modifier choice is explicit before starting. A ruleset ID/revision separates records; either verify XP fairness through current owner or begin with non-awarding practice. Hidden mid-run difficulty changes are not acceptable. This combines Homeworld/Warframe replay structure with Starcade's existing game catalog.

### Fictional league rather than physical football in Starfield

A selectable tactical plan, readable roster role fit, a compact score timeline and season history can deliver management decisions without animating a full sport. Start with one original fictional sport whose rules and match engine are ours. Fictional athletes must not silently become real crew. Standings, schedule advancement and previous-season snapshots need stable IDs and saved state. Wagering is excluded from the first candidate unless separately designed around the existing transaction owner.

## Engineering/acceptance preconditions before choosing implementation

1. Audit actual game code and UI paths for the chosen candidate; this survey reviewed docs, not every game. Check existing saves, pause/close paths, input, score/finish/achievement calls and all consumers.
2. Write one complete lifecycle: start, active/pause, completion, failure, cancellation, timeout if relevant, close, unload, death/game-save reload, missing bridge, malformed save and version migration.
3. Simulation stays local to the active game. No per-frame Papyrus calls, hidden polling, global timers, new cross-mod lock or sibling mandatory dependency.
4. Existing Starcade scores/XP/credits remain under their owners. Any reward is bounded and idempotent; never award it from a rendered animation, replay or imported snapshot.
5. New records identify game ID, rules revision, run/season ID, completed state and trustworthy attribution. Display names are not stable identity.
6. Native/OSF absence has a defined practice/unavailable outcome. Save state is validated plain data; restore proper engine objects, remembering Hextris's poisoned-function-string failure.
7. Before any live integration specify provider/consumer, exact fields, supported version/capability, transport, cache/freshness, privacy and error behavior. Current schema-1 Starcade bridge has no full history or payout fields.
8. Browser UI prototype must pass keyboard/controller focus and exit/reopen before adding effects. Use Canvas/DOM first for board/management prototypes. Existing Billiards proves one WebGL game works, not universal 3D compatibility.
9. Test fresh/existing/malformed state, repeat finish, cancel/close, reload, optional mods absent/present/stale/partial and ecosystem combined load. Attribute gameplay to actual MO2 winners and hashes.
10. Update brain, checklist, Nexus draft and evidence. Proposed games do not appear as shipped features on Nexus.

## Handoff boundaries and sharing the workload

Starcade can reuse **mechanisms and facts**, not copy another mod's controller. Proposed flow:
- Starcade simulates a fictional season and publishes an eligible completion receipt.
- Legacy archives that verified achievement; it does not advance the season.
- AISS can discuss the disclosed achievement; dialogue cannot edit standings.
- OC can expose a supported recreation opportunity; LSS handles eligible actor routine and safe release.
- Corporate Wars may own a sponsorship agreement; SSSE interprets only explicitly supported economic events.
- Infamous Ships continues to own real racing championships/fleet results. A player winning an arcade simulation is not that achievement.
- CT alone decides real personnel progression. Arcade achievements do not certify real crew automatically.

None of these proposed adapters were implemented by this research. Sibling code/status has not been refreshed in this pass; re-read current affected owners before any handoff that claims an adapter exists.

## Negative findings: what not to import wholesale

- MMO/backend dependence, other players' economies and live-service schedules from EVE/Destiny/Helldivers.
- Loot-box/card-pack/season-pass monetization or manipulative attendance gates.
- Constant background simulation of all ships, markets, populations and sports teams.
- Universal faction morality, omniscient companion knowledge or duplicate personnel systems.
- Full commercial engines or proprietary assets under the assumption that “a mod can use anything.”
- Rewards based on simulated real-world people, absent actors, display-name matches or a best-score snapshot.
- Replacing working games merely to make them more similar to a reference title.

## Follow-up research with exact questions

- SC-RCH-001: Which existing game already exposes enough truthful metrics for a useful debrief without changing gameplay?
- SC-RCH-002: Can a ruleset revision be stored/displayed without mixing old records or changing existing XP behavior?
- SC-RCH-003: Can one complete six-node convoy run remain interesting with only three resource variables?
- SC-RCH-005/#336: Which original sport yields meaningful coaching decisions using a small deterministic/resumable match engine?
- SC-RCH-012: What does current Starborn Legacy actually accept, and how can one stable receipt survive repeated load/read?
- Civ mods: examine author rules/source only if the sector-board candidate advances. No source/asset reuse authorized.
- Stellaris: add remaining packs individually only when they answer a concrete design question; current survey is not all expansions.

No implementation or gameplay changes, new CK batch, mod deployment or release occurred during this research. Source links checked November 2, 2026; pages can change, and edition-specific details should be reverified before implementation.
