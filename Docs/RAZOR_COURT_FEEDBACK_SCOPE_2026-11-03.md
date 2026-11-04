# Court feedback lifecycle — scoped before code

Player gain: see controlled runner energy and action recovery without looking away
from court; distinguish pass/shot direction using a short current-velocity tail.
Additive Canvas presentation only; zero engine/native/PEX/CK/save rework. Existing
gold control ring, pass diamond, nominal goal ring and textual HUD stay authoritative.

Owner: Starcade match engine supplies energy0..100, cool0..45 (release30/challenge45), ball owner/kind/vx/vy.
Read-only presentation derives energy fraction, remaining recovery fraction and a
bounded tail opposite current velocity; no historical trail or future trajectory.
Only controlled runner gets two tiny separated meters: cyan energy and amber
remaining recovery (empty means ready). Existing HUD provides exact text and meters.
Tail only for loose pass/shot with nonzero finite velocity; no tail for carried,
stationary or unknown-kind balls. Shot gold, pass cyan; no flashing or new animation.
Meters and tail hidden at full time; paused view freezes actual state. Missing state
returns null. Invalid numeric input suppresses affected cue rather than inventing it.

Entry points: draw called from live RAF, pause/resume, restored exhibition, career,
free practice and drills, panel closure and aim toggle. Pure cue function consumes
state; renderer uses existing projection/cadence. No new persistence, preference,
timer, DOM listener, native publication or dependency. Close/unload/death/travel/
quest stop use existing pause/checkpoint path; no retained effects to clean up.
Reload derives cues from restored state, removal leaves all saves usable.

Ecosystem: no sibling adapter/state/seed/schema or ownership change. No personnel,
market, historical or reward writes. O(1) derivation and fixed drawing operations
per existing frame; integrated resource cost still needs actual-game measurement.

Acceptance before claiming implementation: pure fixtures for both directions,
pass/shot/carried/stationary/unknown/result/missing/malformed; compare snapshot and
RNG before/after derivation; actual engine release/cooldown seam; browser restored
fixture and screenshot, existing aim/coach/presentation/exhibition regressions.
Visual readability, human usefulness, hardware and Starfield performance unverified.
