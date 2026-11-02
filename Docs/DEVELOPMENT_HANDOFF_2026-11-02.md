# Current development handoff

User authorized continuing Claude's latest work, new implementation and a broad
ecosystem-aware roadmap. Scope one complete feature at a time; use as many research
ideas as improve actual play, rather than adding overlapping controllers.

## Completed implementation batch

- SC-CARD-001: Constellation Cards, original mirrored five-card tactical duel.
  Mouse, keyboard and existing forwarded controller; X changes card, Y rematch;
  unfinished rematch requires confirmation. Legal-history saves restore full
  matches, unsupported saves recover visibly. Completed restore never re-awards.
- SC-RCH-001 applied inside the new game: factual capture preview and after-action
  report, derived from actual moves. No working older game's mechanics replaced.
- Catalog now 33 embedded games plus OpenMW external card. The four new game
  files are HTML/CSS/JS; no native/Papyrus/CK edits or new dependency.
- Runtime packaging includes current catalog/game/footer and owner-confirmed
  native 1.7.3 (0389eded65e57c8a9bcf69f3933ade8349d975e18f54733aaa966ef3829239fb).
  This supersedes the older packaged native 1.7.2 without changing the live mod.

Evidence: 200 simulated complete duels with restore after every move; explicit
capture/equality/invalid-state fixtures; browser play, result, rematch, corrupt
save and forwarded-input tests; actual launcher save/close/reopen with native
transport stubbed; catalog load audit 33 pages; existing expansion interaction
audit one game. No new Starfield gameplay pass, live MO2 deployment or Nexus upload.
Player test card is in Docs/PLAYTEST_LOG.md. No CK tasks for this batch.

## Next implementation

Razor Derby is the chosen sport name. The in-game dialogue establishes its name,
not a full rulebook. Earlier Blitzball/sphere/six-a-side notes are comparative
ideas. Next scope one original playable exhibition: movement, camera, ball,
contact rules, clock, AI, controls, pause/close/save, result and anti-stall play.
Choose the actual rules before code. Exhibition must be a game the player plays;
a management screen alone does not satisfy that direction. League management
(#336/SC-RCH-005) follows a complete fun match, using the same authoritative teams.

The other candidates remain routed in Docs/GAME_DESIGN_RESEARCH_2026-11-02.md:
Frontier Convoy, Ship Crisis, Race Director, Supply Chain Puzzle and additive
scenarios/archives. Check Fleet Command, Docking Vector, Lunar Descent and
Codebreaker overlap before duplicating their mechanics. These are not implemented
merely because the user authorized broad development.

## Remaining release and ecosystem gates

Actual OSF input/render/close/resume and combined GPU/VM measurements remain.
AISS writer is owner-confirmed; reader dialogue acceptance remains separate.
Physical screens require test-pattern -> one game -> input/teardown -> ship
lifecycle proof. ScreenSFSE's internal frame interface is not an established
external interactive API. OpenMW remains the working separate-window application.
Resolve documented Papyrus source/PEX mismatch before recompilation. Verify music
rights before public distribution. Corresponding adapted-engine sources/notices
remain required; the development ZIP is not a replacement for them.

Starcade owns fictional matches; CT owns real personnel, IS real vessels/racing,
OC/LSS residency/routines, SSSE money/markets, CW contracts, SN case truth, Legacy
historical receipts and AISS narration. No new integrations claim to exist.
No sibling Git/code edits, no global queue/lock, no new SFSE/AISS seed.
