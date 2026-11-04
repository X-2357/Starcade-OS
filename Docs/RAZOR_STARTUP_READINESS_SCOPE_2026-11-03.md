# Razor startup input readiness — scope before fix

Regression repeated a drill reopen timeout after last session's navigation-wait
change; that change alone did not settle the concern. Controlled reproduction
delayed game.js: training button paints with onclick:null, main not inert, early
click is lost and selector never opens afterward. Known-bad test passed on actual
current UI. This proves the pre-handler readiness gap, not that every observed
timeout has the same root cause. Avoid claiming browser timing proves Starfield.

Gain: player cannot activate controls before game initialization/checkpoint
restore. Add main inert in HTML, visible loading status outside inert content,
remove inert/hide status and mark ready only after existing load/restore/show/draw
finishes. Key handler and resume/drill guards refuse pre-load actions (host script
can deliver forwarded keys before restore). No replacement of load/save protocol,
request session IDs, close handshake, seed/rules/native/PEX/CK or sibling change.

Lifecycle: document paint inert -> scripts bind -> ready message -> launcher load
reply -> restore or existing visible damaged-save recovery -> controls ready.
Standalone load(null) same mechanism. Missing script/reply stays loading/inert,
never invents a fresh save; parent Back/close fallback remains available. No timer
or automatic retry. Reload/new document starts inert again; no persistence or
global lock. Blur/unload before ready causes no new match/score/reward. Existing
launcher-session ownership and accepted delayed-close behavior unchanged.

Tests before claiming fix: known-bad controlled script-delay calibration; same
test after guard; delayed parent load reply with forwarded Enter/V before ready
must not create/save a match; initialized input works; actual launcher drill
close/reopen repeated and shot-placement RS seam. Old game siblings untouched.
Scope exactly Razor HTML/input readiness, plus test synchronization on actual
ready state. Actual Starfield/hardware-controller startup still unverified.
