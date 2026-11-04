# Optional shot placement — scope before code

Gain: human chooses Auto / Upper lane / Lower lane and sees the selected nominal
goal point. V, focused on-screen button, or RS click cycles; existing A shoots.
Court lanes mean Y24/Y36, not volumetric shot height. Existing automatic aim,
spread/range/rating, speed/cooldown/energy, AI decisions, scoring and rewards kept.
Additive requested gameplay choice; no CK/save rework, native/PEX or sibling edit.

## Authority and exits

Engine exports pure shotTarget(s,id,mode) and manual shoot accepts optional mode.
Absent/default Auto exactly equals previous keeper-away formula and one RNG draw.
Only human input.shoot passes match-owned shotAim; AI shoot calls default Auto,
including parallel career fixtures. Do not globally change the AI's aim because a
human selected a lane. Invalid explicit aim does not release/count a shot or draw
RNG. Existing recovery/possession checks still apply. No guaranteed scoring,
predicted trajectory, event history or claim that all shots used final setting.

Optional snapshot shotAim upper/lower/auto, validated on restore; absent -> Auto.
Auto UI saves omit field for exact legacy/default shape. Setup choice applies to
the next start; current match choice persists pause/checkpoint/close/reload.
Explicit New practice/exhibition/new season and next career fixture reset Auto;
restoring a saved mode adopts its actual field. Practice/drills keep separate slots.
Live toggle checkpoints locally, normal cadence/close handles native checkpoint;
paused toggle uses existing pause persistence. Modal/result/settling block changes.
No repeat-key cycling; host button-held dedupe retained. Shot already in flight
does not change when next-shot selection changes. Selection display says nominal
placement, spread and moving keeper still matter; marker only with controlled ball.

Lifecycle: select -> shoot -> existing resolution -> next possession; choices
remain for that match. Blur/hidden/return/unload/death/travel/quest stop use existing
pause/checkpoint lifecycle; no new timer/RAF or world mutation. Failed storage
keeps normal checkpoint warning; no new external ledger or reward side effect.
Older versions ignore optional setting and continue normal ball velocity; no
fixture/journal backfill or history annotation. Removal keeps schema1 saves usable.

## Horizontal precondition / evidence

Touched boundaries: pure nominal point -> shoot formula -> manual step dispatch;
AI default; UI setup/live/hydration/new-mode resets; all three drill slots; modal
key capture; launcher RS mapping only for Razor; release script includes new helper.
Host currently uses XInput-like digital ids (LB256/RB512 etc); Microsoft's primary
[XINPUT_GAMEPAD reference](https://learn.microsoft.com/en-us/windows/win32/api/xinput/ns-xinput-xinput_gamepad)
confirms RS0x0080. Existing API receives button id/down; add only Razor mapping128
to V, leaving other games unchanged. Source/forwarded integration is not hardware
proof. Existing own artifact is deployed baseline, no owner-confirmed manual-aim
gameplay yet. Old engine functions/defaults verified before editing.

Tests: compare whole default/explicit-Auto snapshots vs pre-change engine from Git
for complete controlled and both-AI matches; same RNG/spread/counters across manual
lanes; AI unaffected by saved human setting; restore/invalid/legacy cases; browser
V/button/held repeat/paused/reload/drill/next-fixture/reset/modal/result locks;
actual launcher RS -> game -> saved aim seam + other-game mapping isolation.
Practice native-publication and career/prize/exhibition/report regressions.
Review marker/labels/screenshots, build archive/readback, guarded separate MO2
deployment. Actual Starfield/hardware-controller/enjoyment/manual-lane balance,
combined ecosystem performance and real inventory acceptance remain unverified.

Starcade owns fictional sport only; no CT personnel, SSSE market/economy, Legacy
history or AISS contract/seed/schema change. Catalog39 unchanged; no new poll or
cross-mod lock. New native authoring/capability not required.
