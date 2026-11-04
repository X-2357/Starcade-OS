# Razor Derby world prizes — lifecycle before implementation

User authorizes actual Starfield credits and inventory rewards. Additive service;
casino wager accounting, XP, pad delivery, existing CK records and AISS schema
remain unchanged. Player gain: explicit, previewed claims of earned match and
season prizes. No CK/property refill or new save required: extend existing alias0
script on startup quest local0809, inspected in editing ESP. Confirm generated
ESM alias/quest match before packaging. Vanilla Aid_MedPack ALCH0000ABF9 inspected
directly in Starfield.esm; Credits MISC0000000F existing tested service.

## Authority and lifecycle

Career schema2 retains a stable random prize passport across rollover. Existing
schema2 careers receive one on first prize-menu access, written before claims.
Completed actual fixtures (including archives) produce sorted entitlements;
legacy schema1/practice/exhibition/scheduled fixtures do not. Local career is
shared WebView data; world claims are per Starfield save/character, clearly labeled.
Claim explicitly, one prize at a time, oldest first. Each claim includes the last queried expectedFrontier; Papyrus compares it under the claim guard and returns the actual frontier without granting if the save changed under the open menu. No passive or timed grant.
Fixed rules1: match loss100 credits, draw150, win200; completed season top three
500/300/150 credits plus3/2/1 Med Packs; other completed placings100 credits and
1 Med Pack. Native derives amounts from outcome/rank; web cannot select forms or
arbitrary amounts. No wager or entry cost. Not an anti-cheat/verified-server sport.

Papyrus player alias owns save-bound passport/frontier/status arrays (max128
careers, no eviction). Per passport monotonic ordinal season*8-8+round1..7 or
season*8 prize. Query authoritative frontier whenever menu opens or retry occurs;
never trust a WebView receipt across save loads. Native is transport/validation;
no external JSON reward ledger or cross-mod locks. Script Guard serializes this
service only. Resolve quest/player/forms and reject dead player before reserving.
Reserve frontier with uncertain status BEFORE inventory mutation, verify deltas,
then mark confirmed. Interrupted/failed verification stays reserved/uncertain:
never automatically re-grant potentially delivered inventory. Explain uncertainty
instead of promising atomic exactly-once operations that AddItem cannot provide.
An earlier game save rolls back inventory and claim ledger together. Future claims
blocked on an uncertain frontier. Capacity/None/overflow/quest-stop fail visibly.

Unload/close/travel: dispatched Papyrus claim may complete after view closes;
return queries ledger. UI15s timeout means unknown, not failure or automatic retry.
Duplicate/out-of-order claim returns already recorded, no mutations. On game load
ledger comes from save; no OnLoad reset/clear. Death before claim rejects; normal
death/reload follows save rollback. Quest stop or missing script produces visible
unavailable/timeout; original pad/arcade continues. Partial-version native/PEX/UI
fails visibly, never falls back to casino payout or arbitrary console commands.

## Horizontal seams and ecosystem

| Seam | Both sides / acceptance |
|---|---|
| Game -> host -> launcher | Dedicated derbyReward, current Razor frame only, fixed game last, request identity and launch serial |
| Launcher -> native -> Papyrus | Dedicated command/callback, bounded fields, fixed prizes, existing property-free dispatch pattern |
| Papyrus -> game inventory | Existing alias/quest, verified forms, save-owned ledger, guard/reservation/count verification |
| Practice/exhibition/casino | No new claims from these modes, original wager guards unchanged |
| Rollover/archive/reset | Passport retained, actual fixtures only, no ledger eviction; new career gets new passport |
| SSSE/AISS/CT/Legacy | SSSE remains markets owner; prizes vanilla inventory only, no fabricated market/narration/history events or real personnel |

No sibling dependency/polling/seed/schema edit. Cost: bounded per-menu query and
explicit per-claim Papyrus call; no timers except transient UI timeout. Compatible
absent service shows unavailable; removal stops claims, already granted inventory
is intentionally retained, save alias fields remain inert until reinstall.

Acceptance before completion: native fixed-prize policy positive/negative tests;
both-sides transport and callback/identity checks; browser status/claim/duplicate/
timeout/old native/reload behavior; career rollover identity and entitlement order;
Papyrus compile + native compile; script/quest/form readback and ZIP hash checks.
In-game gate (separate): note inventory, claim loss/win/season, verify exact delta,
double click/reopen/reload no extra grants; load earlier save ledger/inventory
rollback; two characters independent; death/stop/unavailable, casino regression
and sibling-mod simultaneous load. Source/browser/compile cannot prove this gate.
