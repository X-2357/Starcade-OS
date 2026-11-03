# Razor eight-team career — scope before implementation

User explicitly requests eight teams, trackable rosters/player statistics, career
and previous-season records, and Blitzball-style rewards. Original names/rules;
no Final Fantasy assets or exact mechanics promised. This is a whole career
lifecycle, not a team-count-only edit.

## Competition and identities
Eight stable club ids, eight named fictional athletes per club, six starters/two
reserves. Slot0 is keeper; five runner positions may be swapped between matches,
including reserves. No mid-match substitution in this first career implementation.
Seven round-robin rounds, four fixtures per round, 28 fixtures. Player remains
club0/Teal and plays seven matches. Other fixtures use identical role AI on both
sides, same physics and asynchronous120-step batches. Standings: points, goal
difference, scored; sporting ties shared, stable id only orders the display.

## Actual statistics and coverage
Engine telemetry: player ticks played, goals, assists, shots, pass attempts,
completed passes, successful challenges and keeper saves. Goal credit follows the
actual shot source. Assist requires a completed teammate pass within600ticks and
no opposing possession. Own/unattributed goals remain team-only, never assigned
to an invented scorer. Old active matches without telemetry start coverage at
their actual restored tick, never infer historical player totals from team goals.
Each fixture freezes lineup ids, team/player counters and coverage alongside
goals. Standings/career totals derived from accepted fixtures, not mutable cached
leaderboards. A fixture is counted once. Stable players persist across seasons.

## Career and previous seasons
Schema2 stores current season, lineups, training decisions and completed/abandoned
season archives in one local document. Rollover archives immutable actual rosters,
fixtures and table before clearing the current schedule. Completed seasons remain
viewable; abandoned seasons labeled incomplete. Career includes actual accepted
fixtures in both active and past seasons once. No synthetic backfill. Legacy
schema1 four-team season continues through its original adapter and stored key;
explicit rollover creates eight-team career and labels legacy archive coverage.
Exhibition and practice checkpoints remain separate.

## Rewards and player development
Original league rewards: one training point per completed player fixture, one
additional point for a win; season placing awards3/2/1 points for sporting ranks
1/2/3. Trophies identify completed season placing, and player XP derives from
appearances and recorded actions. Training points can be spent on named athletes,
maximum five purchases each; trained/experienced ratings have a bounded effect
on league-only speed/shot accuracy. Exhibition physics remain unchanged. Points,
XP and trophies derive from unique fixtures/season records; no duplicate award
on reload/retry. Visible ledger shows earned/spent/available points and previous
season prizes. No Starfield credits, XP/items or wagering changes in this scope:
existing casino payout is not a general sport-prize interface. A future world
reward needs its own native/Papyrus receipt contract, not fabricated payout calls.

## Lifecycle, storage and failures
Current season setup -> lineup/training -> match -> checkpointed result -> atomic
round settlement -> table/fixtures/stats -> next match -> complete -> archived
rollover. Explicit double-confirm abandonment. Roster/training locked while a
match is active or settling; old completed results never rewritten by development.
One in-flight settlement; hidden/unload suspends/cancels local computation, pending
result reload retries. Storage failure prevents advancement/rollover and preserves
old document; no archive silently dropped to make room. Future/corrupt schema
preserved until explicit reset. Local storage capacity remains a real limit;
failure is visible and no history is discarded. No wall-clock catchup or polling.
All exits retain the last valid checkpoint. Whole-career metadata stays local;
no AISS/Legacy event publication or native reward assertion.

## Horizontal precondition and acceptance
Affected: engine source/restore/telemetry; legacy adapter; schema2 schedule/lineup/
fixture validation; game mode/storage/settlement/menus; records/practice isolation;
packaging and existing tests. No sibling code/Git/CK or real personnel/fleet/market
mutation. CT owns real personnel, IS real ships, SSSE economy, Legacy archives,
AISS narration. Fictional athletes are not those actors.

Tests before completion: 28 unique pairs/seven games each; actual goal/pass/assist/
save provenance; legacy telemetry coverage; roster uniqueness/bench swaps/locks;
stat/team conservation; duplicate/out-of-order settlement; all seven rounds;
rollover snapshot, two-season career sum, no double rewards, bounded training and
earned/spent ledger; invalid/future saves; full browser menu/result/restore/archive/
reward/lineup flows; no native score/save/finish from career. Packaging source/hash
readback. Actual Starfield/controller, human sport balance and shared performance
remain independent gameplay gates. No blanket "everything like Blitzball" claim.
