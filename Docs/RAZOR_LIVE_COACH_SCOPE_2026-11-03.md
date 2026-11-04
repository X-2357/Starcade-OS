# Live coach and practice review — scope before code

Player improvement: understand recovery, pressure, shot range, current passing
coverage and possession time; practice review explains actual attempts/completions
without inventing accomplishments. Optional coach toggled with a normal focused
button in setup/pause. No new binding, aim automation, physics, scoring, rewards,
RNG, native/PEX/CK or sibling changes. Current deployed presentation is baseline.

Authority: read current validated match players/ball/cool/energy/shotClock and
existing team0 individual counters. Coach is derived, never stored in match.
Optional visibility preference is separate local key, defaults on, invalid/missing
defaults on, blocked storage leaves a visible session-only setting. Coach forecasts
no probability or guaranteed pass: label current lane coverage, players move.
Segment-distance coverage uses the actual static catch radii (runner1.6/keeper2.6)
and defenders only; zero-length/no receiver/loose/enemy possession handled. Shot
range is qualitative; player rating and random error remain untouched.

Lifecycle: setup -> play -> pause/menu -> resume -> result -> practice review or
return. HUD updates only inside existing draw loop; pause freezes game data. Hidden,
unload/travel/death/quest stop retain existing checkpoint/exit behavior. No new
timers/listeners per frame, sibling reads, world state or publication. Removed
coach retains all saves; preference absence is normal. Progress bars are bounded
from actual energy/possession; labels readable without color. Status text does not
announce every animation frame to screen readers.

Practice review opens same inert-background/pause panel and reads tracked home
player pass attempts/completions, shots, challenges and saves. No fabricated distance
or old missing-stat backfill. It neither completes a run nor awards training/world
prizes/XP/native save/score. Legacy matches without individual metrics show coverage
as unavailable until the existing engine starts collecting actual events. Close
returns paused; explicit resume. Empty review offers concrete control guidance.

Horizontal seams: derived model ↔ engine cooldown/catch radius/possession semantics;
game draw and cached athlete names; all modes and existing controller/menu focus;
practice native-publication isolation; script order + release builder; saved/future
data; current career/world reward bridge remains unchanged. Starcade owns fictional
sport; CT real personnel, SSSE money/markets, Legacy real history, AISS narration.
No new ecosystem adapter or shared lock. Cost one bounded12-player read per draw.

Acceptance before completion: pure model attack/defend/loose/zero-distance/covered/
open/no-target/cooldown/limits, read-only equality incl RNG; radii seam with actual
engine; browser toggle/reload/storage denial, practice review/counters/no native
publication, pause/restore, forwarded controller Back; existing presentation,
career and exhibition regressions. Screenshot review. Package/hash readback and
separate deployment only with host apps closed. Actual Starfield/controller,
human usefulness/balance and combined ecosystem performance remain separate gates.

Evidence: pure-model/engine-radius seam and browser practice/publication/storage/restore checks passed; screenshots reviewed. Presentation/exhibition/career/world-prize regressions passed (inventory mocked).1726-entry archive source-hash verified; installed as a separate MO2 candidate, baseline engine/DLL/PEX/ESM unchanged. No actual Starfield pass. See canonical brain/PLAYTEST_LOG for exact deployment receipt and remaining gameplay gate.
