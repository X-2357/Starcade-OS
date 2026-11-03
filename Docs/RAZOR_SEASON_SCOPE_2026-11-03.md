# Razor Derby season lifecycle before code
Development season: four original fictional teams, three rounds, six fixtures.
Player plays all three matches as Teal using the actual exhibition engine; the
other fixture each round uses that same engine with deterministic controller AI.
Three points win, one draw; table sorts points, goal difference, goals, stable id.
Tied sporting totals explicitly remain tied in meaning; id only stabilizes display.
No canon team/rule claim, recruitment, real personnel, money or sponsorship.

One local schema1 season owner: seed, validated ordered results, optional active
match. Standings derived, never separately mutable. Exhibition and practice saves
remain separate. Season does not publish score, native save, finish, achievement,
AISS events or Legacy receipts. No background simulation or extra native polling.
Completed opponent simulation runs once per round under the same seed, without
reward mutation. Bounded 7200 fixed steps, performance measured before acceptance.

Lifecycle: season setup -> active match -> paused -> completed match -> round
settlement -> standings -> next round -> completed season -> explicit new season.
New season requires confirmation when unfinished. Every normal close/pause/local
checkpoint retains active match. Reload opens exhibition by default; explicit
Season resumes saved season paused. No wall-clock catchup. Unsupported/corrupt
season shows error and preserves stored bytes; only explicit new season replaces.
Result settlement and opponent result written together; duplicate completion is
rejected by expected round. Storage failure keeps original match/result visible;
no advancing without saved settlement. Crash can restore last checkpoint; no
durable reward guarantee. Death/travel/unload/quest stop mutate no world state.

Horizontal seams: engine create/restore/step; season schedule/table/settle; game
start/new/pause/result/close; exhibition records; practice/season reward isolation;
keyboard/controller menus; local schema/version/recovery; packaging. Acceptance:
all fixtures once, points/goals conservation, legal standings, every-round restore,
duplicate/out-of-order rejection, completed season, UI next-round/resume/new/reset,
no score/finish/native-save writes. Actual OSF input/human balance/performance with
the full ecosystem remains unverified; this is a development candidate.

Responsiveness refinement before code: browser opponent simulation yields every120 fixed ticks via requestAnimationFrame; hidden tabs suspend it. Result snapshot is checkpointed while settlement is pending. Reopen retries from that result. One in-flight settlement per season; mode changes invalidate the pending write. Exit remains available. Standalone synchronous simulator remains for deterministic engine tests.
