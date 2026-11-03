# Razor Derby tactics before code
Player chooses Balanced, Wide outlets or High press from setup/paused menus.
Balanced is the exact existing default. Wide spreads friendly support lanes by
five units toward each sideline; High press assigns a third eligible defender to
chase possession instead of two. No speed, hit chance, clock or reward modifiers.
The controlled runner remains directly controlled. Enemy AI is unchanged.

One match owns optional tactic metadata. Missing legacy field means balanced;
invalid field rejected on restore. Selection changes future AI intent, never
teleports players. Persist with normal match checkpoint across exhibition/practice/
season. Completed results are not edited; selection then applies to next match.
New mode loads its saved tactic, not a previous mode's unsaved intent. No native
commands, sibling facts, personnel assignments or world mutations. No new timers.

Horizontal: engine role selection/support target; game setup/pause/new/resume;
match restore and mode switches; season snapshots and async settlement; controller
menu activation; exhibition record policy. All use the match-owned tactic.
Acceptance: implicit and explicit Balanced produce identical full simulation;
Wide/Press change intended positioning while remaining bounded/deterministic;
restore retains tactic, malformed values fail; browser select/pause/reload; season
and practice isolation regression. Human tactical balance/actual OSF remains open.

Journal extension before code: new exhibition entries optionally retain selected tactic. Existing entries without it remain readable and display no invented tactic. Validate optional value against the same three names; season/practice still excluded from exhibition journal.
