# Razor league presentation and leaders — scope before code

Player-visible gain: readable standings, individual roster cards with actions next
to each athlete, actual statistical leaderboards, club identity and a more legible
stylized arena. Add next to existing modes; no physics, match rules, saves, prize
amounts, native/PEX/CK or sibling changes. Current deployed r2 remains baseline.

One lifecycle: league dashboard -> roster/leaders/history/prizes -> back -> resume
or return. Opening any panel pauses, background is inert, explicit resume required.
Keyboard/controller arrows and Enter/Back remain usable, focus moves into panel;
tables are read-only. Current/career/latest archived leaders derive from accepted
fixtures, omit athletes without tracked appearances, support all64 via pages of12,
use shared metric ranks and stable identity ties. Empty/latest absent shows a clear
message. Legacy four-team season retains team standings but has no invented player
leaderboard. Long names wrap; active-match roster/training locks remain unchanged.
Historical rows must never show current ratings as historical facts.

No presentation state persisted or authoritative counters cached. Reload derives
fresh display from validated career. Exit/unload/death/quest stop use existing match
pause/checkpoint flow; no new timers or world mutation. No new resources to tear
down beyond document-owned DOM/canvas. Arena decoration cached once per view;
no external assets/fonts, new frame loop or sibling polling. Static graphics do
not imply actual volumetric3D or physical ship-screen support.

Horizontal seams: show/pause/record panel + actual host forwarded controller keys;
stats read same RazorSeason playerStats as rosters; legacy/exhibition/practice;
existing world-prize button/callbacks and training assignments; new script order
and release builder both updated. CT owns real personnel, SSSE markets, Legacy
real history, AISS narration: all additions remain fictional local league UI.

Acceptance: known fixture goals/assists/pass/saves leaders and shared ties; empty,
career/latest archive,64-player pagination; roster action focus/assignment and
active-match locks; actual launcher keyboard/forwarded input; existing career,
legacy/exhibition/prize regressions. Screenshots at desktop and smaller view,
check overflow, focus and scroll. Build ZIP with existing verified1.7.4-r2 runtime,
read back hashes. Actual OSF/Starfield/controller and human visual enjoyment remain
separate tests. Do not replace deployed r2 while host apps are running.

Implementation evidence: data/browser lifecycle and64-athlete shared ranks passed; final/current-vs-next opponent labels and empty-history focus tested. Desktop/compact screenshots reviewed, dashboard controls no longer clipped, panels open at heading, roster actions retain position. Final1725-entry archive hash-verified and installed as a separate MO2 candidate with r2 native/scripts/plugin unchanged. No Starfield gameplay pass. Detailed deployment evidence is in canonical CLAUDE.md and PLAYTEST_LOG.md.
