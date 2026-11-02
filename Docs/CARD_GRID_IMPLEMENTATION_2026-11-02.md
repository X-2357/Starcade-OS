# Constellation Cards — first complete addition

November 2, 2026. User authorized continuing Claude's work and building new games.

Player benefit: a short, readable tactical card duel with an opponent, previews,
keyboard/controller/mouse play, automatic resume and a clear final result.
Additive: one new catalog entry and four game files; existing games, credits,
native DLL and CK records retain their behavior. No CK/save rework.

Scope before code: original five-card hands, nine spaces, alternating turns,
strictly greater touching edge captures, no chains. Unplayed card counts at end.
Ten original ship cards; mirrored balanced hands, random first player. AI maximizes
immediate captures and protected edges. No wagers, XP requests or achievements.
Starcade owns the match. No new sibling adapter or polling; existing save owner
stores plain schema-1 state, including opponent-turn state. Existing launcher
completion route may apply its established non-casino rewards.

Horizontal entry table:
| Entry/consumer | Handling |
|---|---|
| catalog and launcher iframe | new id constellation-cards, existing host protocol |
| mouse / keyboard / forwarded controller | same select-card/place action |
| host load / local standalone reload | validate same schema and replay legal history |
| close / Escape / iframe removal / death / travel / game reload | save every move; no pending world mutation; opponent resumes from saved turn |
| hidden / focus lost | turn-based; no animation loop or native polling |
| native score/AISS | existing completion path only; never fabricate events or payouts |
| other games / shared storage | unique key; no changes to their saves |

Lifecycle: fresh -> player/opponent alternating -> completed. Opponent executes
one bounded move synchronously after player save. Resume replays validated moves,
then finishes any opponent turn. Completed saves display result without sending
finish again. New duel requires explicit action. Corrupt/unsupported saves show
an explanatory fresh match. No timeouts/timers/None actor references. Storage
failure displays a warning; current duel remains playable.

Acceptance before building: strict/equal/multiple captures; ownership scoring
including tenth card; legal opponent moves; complete duel; one completion message;
reload at both turns and completed; reject malformed history; keyboard and
forwarded controller choose/place; Escape returns; launcher catalog entry opens.
Browser tests prove those paths, not Starfield rendering or player enjoyment.

## Implemented result and diagonal checks
Factual debrief (SC-RCH-001) derives captures made/conceded and strongest move by
replaying the same legal history used for restoration. No inferred causes from a
score. Controller focus displays the capture preview in visible text; X returns
to hand and Y requests rematch with confirmation for an unfinished duel.

Diagonal journeys exercised: choose -> place -> save -> reload -> finish;
completed -> reload -> explicit rematch; corrupt history -> fresh playable duel;
forwarded controller -> board actions; real launcher -> ready/load -> save ->
return -> reopen. OSF transport is stubbed only in the launcher browser test.
200 simulated matches check score conservation and replay at every move; strict,
equal and multiple captures have explicit fixtures. Whole catalog load audit
passed 33 games; existing expansion interaction audit passed its one game.

Crash between final save and finish can omit the completion notification; completed
state never replays rewards. Durable world-reward receipts require a separately
scoped native owner contract. This addition does not claim exactly-once rewards
across process crashes. No active animation loop, timer, Papyrus polling or new
sibling contract. Source-level changes preserve existing game branches.
