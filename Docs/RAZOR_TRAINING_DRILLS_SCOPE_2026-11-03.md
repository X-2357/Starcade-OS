# Training scenarios — scope before implementation

Gain: optional passing, finishing and defending practice with immediate context,
visible team objectives and independent checkpoints. Add alongside free practice;
do not replace its saved state. Three initial layouts, same engine/rules/AI/clock.
No exhibition/career balance, physics, RNG, native/PEX/CK or reward change. No CK
work/new save required. Starcade owns fictional training; no real crew/fleet/market/
Legacy/AISS state, contract, sibling dependency or polling.

## One complete training lifecycle

Training drills selector -> choose/resume drill -> paused setup -> explicit start
-> actual engine match -> objective progress -> full time/review -> confirmed
restart same drill or choose another -> return/checkpoint. Opening selector pauses;
panel background inert; existing keyboard/controller Enter/Back conventions.
Passing target3 completed home passes, finishing2 home goals, defending2 successful
home challenges. Team objectives explicitly include AI teammates; not claimed
manual-player achievements. Reaching target acknowledges it without extra rewards
or silently resetting/stopping match. Two-minute clock unchanged. Goals use normal
kickoff afterward; layouts are initial situations, not forced-position loops.

Authoritative state: schema1/rules1 engine snapshot plus optional drill descriptor
{rules:1,kind:passing|finishing|defending}. Existing engine restore validates match;
scenario wrapper rejects wrong/future descriptor, mismatched key and missing
telemetry. Free-practice/exhibition snapshots unchanged. Separate local slots
starcade.razor-derby.practice.<kind>.v1. Live/paused/result checkpoint preserved;
restore live as paused; completed drill remains reviewable. No legacy event
backfill. Reset via existing New practice double-confirm while unfinished; restart
creates same scenario with a fresh seed. Switching scenarios saves current mode
first; storage failure blocks switch and preserves current display/state. Damaged
or future scenario snapshot preserved and reported; never automatically overwrite. Offer explicit double-confirm replacement, comparing original bytes again before replacement so a concurrently changed checkpoint is not erased.

All exits: pause/selector/blur/hidden/pagehide/launcher close retain existing pause
and checkpoint flow. Travel/unload/death/quest-stop no new world operations. Reload
never advances clock, awards anything or replays actions. No new timer/RAF loop;
progress derives from actual counters during existing draw, announces only changes.
No score/finish/native save/XP/inventory publication from any practice scenario.
Removal leaves standard practice/career usable; scenario checkpoints inert until
reinstall. Bound three slots/known kinds; no arbitrary storage paths or commands.

## Horizontal seams and acceptance

Compare scenario setup -> E.restore -> actual pass/goal/challenge engine counters;
practiceKind/storage slot -> persist/pagehide/reopen/New practice; standard practice
entry -> existing key; practice review/coach -> current scenario; selector from
exhibition/career -> original checkpoint retained; settling disables switch;
script order -> release builder includes module. Native prize service untouched.

Tests: three valid distinct layouts, live/paused/result restore, invalid/future/
missing/mismatched descriptors, observed engine goal/pass/challenge progress,
same-seed replay, objective limits/AI labeling; browser initial menu, separate slots,
switch/reopen/review/result/restart/corrupt/storage failure, no native publications,
forwarded controller Back and actual launcher checkpoint; prior coach/presentation/
career/exhibition/prize regression. Review screenshots, ZIP entry/source hashes,
guard host app state before separate candidate deployment. Actual Starfield,
hardware controller, enjoyment/balance and combined performance remain unverified.

Evidence: three scenario engine/restore/event/target tests and browser slot/recovery/replay/full-time/launcher-close flows passed. Existing coach/presentation/30-match/exhibition/career/prize regression passed (inventory mocked). Selector and defending-progress screenshots reviewed.1727-entry package hash-verified and deployed as a separate MO2 candidate; engine/DLL/PEX/ESM unchanged. No actual Starfield pass. Canonical brain/PLAYTEST_LOG hold receipt and remaining gates.
