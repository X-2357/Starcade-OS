# Running feature and evidence checklist
Updated October 6, 2026. Baseline source 6b26c7e20ed4bc6294d61aae4281272ab5033d04. This is the active list; RELEASE-VALIDATION.md preserves historical July validation.

States: proposed / scoped / implemented / compiled / record-verified / runtime-partial / runtime-passed / deferred. Evidence dimensions are independent; historical owner confirmation remains valid in its original scope. No new gameplay performed at setup.

| ID / source | Player benefit and owner | State / evidence | Next action |
|---|---|---|---|
| SC-BASE-001 existing | Portable watch/pad, F9 launcher; Starcade | runtime-partial: historical owner launch/control confirmation; 1.9.5 watch is changelog-described | Inspect winning ESM/item and current package before next test |
| SC-BASE-002 catalog | 25 original + 7 adapted embedded games (32), OpenMW external card | implemented; historical per-game evidence varies, not all runtime-passed | Preserve per-game results; new archive clean install gate |
| SC-BASE-003 casino | Eight games wager real player credits; native validates, Papyrus changes inventory | runtime-partial: historical real-credit/Dice/Racing Book/High-Low/recovery confirmation in historical validation | Attributable current-build completion, duplicate/refund and reload tests |
| SC-BASE-004 saves/XP | Persistent scores, saves, achievements and non-casino XP | runtime-partial historical baseline | Trace current save/XP behavior before new awards; preserve legacy saves |
| SC-BASE-005 OpenMW | User-owned Morrowind launches via bundled OpenMW, separate fullscreen window | runtime-partial: owner confirmed launch; exact current DLL hash unavailable | Current-build launch/save/exit/return card |
| SC-BASE-006 music 1.9.6/7 | Music browser and 63 tracks | runtime-passed: owner September 27 confirms these features; current DLL attribution absent | Do not downgrade or rebuild; verify final archive tracks |
| SC-FIX-001 Hextris 1.9.8 | Blocks animate and saves restore live objects | implemented, browser/save-reload passed September 27; in-game UNVERIFIED | Cold-start game with verified 1.9.8 assets, fresh and existing save |
| SC-FIX-002 Micropolis | Play/Budget/Road interactions | runtime-partial: browser passed September 27; owner button failure unresolved | Obtain exact button/action if symptom persists, compare winning files |
| SC-FIX-003 dice / racer 1.9.3 | Pips, animation, lane exploit closed | implemented/browser confirmed; later gameplay proof not recorded here | Regression smoke only when shipping affected content |
| SC-INT-001 AISS 1.9.2+ | Companions discuss actual last game/high scores | implemented both sides; AISS v3.6.0+ reader; live writer destination and conversation UNVERIFIED | First priority: Docs/PLAYTEST_LOG.md PT-001 |
| SC-MAINT-001 manifest | OSF UI launcher registration | implemented September 26 mod field/removal; source inspected October 6 | Per-game manifests and shared cadence still require scoped review |
| SC-MAINT-002 package | Reliable MO2/Vortex install, no seed shadow | scoped gate; older corrected root layout inspected historically, old ZIPs use backslashes | Next archive Python zipfile, inspect entries, no SFSE/AISS or meta.ini |
| SC-MAINT-003 controller | Broader controller play | partial; mouse needed Micropolis placement, Billiards shots, Mah Jong tiles | One game at a time; no blanket controller claim |
| SC-ADD-001 addendum | One supported score milestone displayed by Starborn Legacy | proposed; score snapshot lacks stable event id/game id/time/participants | Finish accepted maintenance first; inspect Legacy adapter before full lifecycle |
| SC-ADD-002 addendum | Optional colony/LSS leisure | proposed; OC residency and LSS routines retain ownership | Verify actual interaction/actor release capability; no NPC play claim |
| SC-ADD-003 #336 | Holo-Sports League | proposed; no implementation/engine proof | Reconcile simulation, sport identity and explicit financial design |
| SC-ADD-004 #342 | Casino Night venue/content | partial overlap: eight casino games already exist; venue/new rules proposed | Avoid rebuilding current games; scope venue and new transactions separately |
| SC-ADD-005 addendum | Corporate sponsorship content | proposed bounded content | Corporate Wars owns contracts; SSSE owns market effects; no score-derived payout |
| SC-FUT-001 accepted future | True OpenMW embedding | deferred, not started | Research render/host boundaries; separate window remains working default |
| SC-FUT-002 historical | Warzone2100 | deferred, excluded; built but first-frame render failure | Read failed hypotheses first; no host backend alteration without owner direction |
| SC-FUT-003 historical | Skyrim/Oblivion external cards | deferred, removed on owner failed-test report | Ask detection vs launch discriminator before implementation |

For each next scoped feature append: source ID, visible benefit, owner, prerequisites, full state machine/exits, exact CK records, siblings/contract, standalone fallback, compile result, generated-record readback, winning digest and attributable runtime result. No new CK batch or release created in this session.
