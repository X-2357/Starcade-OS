# Pre-match scouting — scope before code

Gain: compare actual starting lineups and next opponent's current-season results
before starting a fixture, with a direct route to existing roster management.
Additive read-only panel; zero engine/native/PEX/CK/save-schema or reward changes.

Authority: existing eight-team season fixture schedule, results, current lineups,
rosters, playerStats and rating. Starcade exclusively owns fictional athletes.
Find player fixture in fixturesFor at round(results); never infer opponent from
last completed match. Show both starting six, actual season appearances/goals/
assists/saves and current league rating. Recent form lists latest five accepted
current-season fixtures from opponent perspective, including opponent name/score.
No invented tactics, probabilities, scouting cost, personnel or historical backfill.
No matches -> explicit no results. Legacy season/no career/completed season -> no
scouting model. No active-match preview: frozen fixture ratings remain authoritative.

Lifecycle: between fixtures -> open -> pause/panel -> roster or Back -> explicit
start. Block while active match (including unfinished paused), unsettled result or
settling. Completed settled result may inspect the actual next round. Refresh on
each open after lineup/training changes. No cached mutable state or write on open.
Final round settlement hides action. Reload derives same next fixture; no new
state. Close/unload/travel/death/quest-stop use existing close path; no timers or
resources requiring cleanup. Empty/legacy handled, validated career authority
unchanged; unsupported saves already blocked at restore. Removal leaves saves usable.

Horizontal seams: actual season schedule/round -> pure projection -> game guards
on button visibility and handler -> shared panel keyboard/shoulder paging ->
roster route existing management locks. No new key mapping or sibling API.
Cadence on request only, bounded12 starters and latest5 results (current28 max).
No AISS field/schema/seed, world-personnel/market/history ownership or dependency.

Acceptance: all seven opponents from real schedule; zero/accepted fixtures and
opponent-perspective W/D/L/score; changed lineup reflected; no snapshot/RNG writes;
legacy/completed/missing; browser initial and post-settlement next-round identity,
active/unsettled guards, roster route, reload, controller Back/paging and screenshot.
Existing career/presentation/report regression. Actual Starfield/controller/human
usefulness/readability/combined ecosystem performance remain unverified.
