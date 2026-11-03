# Razor Derby exhibition — scope before code

The user chose Razor Derby, a sport named in Starfield dialogue. The following
**Starcade exhibition rules are original**, not a claim of canonical sport rules.
Six per side: keeper and five runners on a readable bounded holo-pitch; planar
movement with a projected arena presentation. No swimming/volumetric-control claim.
Player controls the friendly carrier or a selected defender. Move, pass, shoot,
challenge, pause and immediately return. A complete two-minute match ends win/loss/
draw; one point per goal. Opposing kickoff after a goal. Twenty-second possession
clock forces a turnover, including across passes. Loose ball has a five-second
recovery limit; misses restart at the defending keeper. No permanent safe holding.

Start screen explains rules and controls. Arrows/WASD move; Enter/A shoots or
switches defender; X passes or challenges; Shift/LB sprints; Y/P pauses; B/Escape
returns. Shot aims toward the open side, with distance-based seeded inaccuracy.
Nearest useful teammate is visibly marked for passing. AI uses bounded roles,
passes under pressure, advances and shoots. Keeper and ball states are explicit.
Rendering is Canvas, not a claim of true WebGL 3D. No external assets required.

Authority: Starcade owns fictional athletes, ball, match clock, score and seeded
randomness. Plain schema-1 snapshot includes all of these and revision. No new
native commands, wagers, roster recruitment, NPC mutation or sibling state writer.
CT/IS/OC/LSS/SSSE/CW/SN/Legacy/AISS retain their real-world responsibilities. Existing
save and finish bridge only; no new event-history or payout transport. Removal
leaves an inert namespaced save. Unsupported data starts fresh with a notice.

## Entry/consumer table before changes
| Entry / seam | Scope |
|---|---|
| catalog / iframe ready-load | new razor-derby id; existing game host protocol |
| keyboard / native-forwarded controller / buttons | same engine actions; release on blur/pause |
| launcher back button / B / Escape / root close | narrow Razor-only prepareClose handshake: save then exit, bounded 250ms fallback |
| old 33 games | original immediate-close branch retained, regression audit |
| native save / standalone fallback | same validated snapshot; host provided save preferred |
| active / hidden / blur | pause and checkpoint; explicit resume; no hidden simulation |
| AISS / score / native rewards | existing game completion only; no invented receipts |
| delayed close/save after new launch | Razor messages carry game id and launch serial; launcher rejects stale serials; serial is transport-only, not persistent match identity |

Lifecycle: setup -> live -> paused -> live -> result. Goal/restart are bounded
live transitions. Reload always restores paused, never catches up elapsed wall
time. Every action frame uses fixed 1/60 steps and clamped accumulation. Pause,
visibility loss, close and completion clear input and save. Native checkpoint
no faster than every 15 active seconds plus goals/pause/end; local checkpoint
every 2 active seconds. Abrupt process death can roll back to last checkpoint;
normal return flushes first. No match world mutations require restoration on
player death/travel/quest stop. Host unload is treated as close; process crash
has no guaranteed final callback. A result restores without re-sending finish;
crash between saving result and notification can omit a reward, never replay it.
No custom reward implementation. New match from unfinished pause requires confirm.

## Acceptance written before implementation
Known-good and invalid snapshot fixtures; finite positions/velocities/timers,
exactly 12 distinct players, legal possession, bounded counters. Both teams can
score, keeper can save, passes transfer, challenges can steal, shot-clock and
loose-ball timeouts resolve. Full seeded AI matches finish with no stalls; restore
and continue yields identical simulation. Browser: start/move/pass/pause, hidden
pause, held-input release, corrupt recovery, result restore without finish,
controller forwarding and normal save-close-reopen through actual launcher.
Razor-only flush handshake and old immediate-close path checked side by side.
Actual OSF render/input/performance and human enjoyment remain separate gates.

Additive blast radius: one catalog entry, new game files and Razor-only launcher
close handling. No CK edits or existing-save migration. No changed old-game rules.
League, training, sponsorship and physical monitors follow their own scopes;
they are not implemented by calling this an exhibition.
