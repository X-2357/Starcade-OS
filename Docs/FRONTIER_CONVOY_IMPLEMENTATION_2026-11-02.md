# Frontier Convoy — scope before code

SC-RCH-003: original short expedition inspired by route/resource choices, not a
port or a second real fleet/economy controller. Player escorts a fictional convoy
through six legs. At each leg choose cruise, slingshot or emergency ration route;
exact fuel/supply/hull costs are visible before choosing. Then encounter one of
twelve authored situations, each with explicit costs and outcomes and a free
decline. Fixed seeded event order; no undisclosed random casualty roll.

Three bounded resources: fuel, hull, supplies. Start 9/10/6, caps 15/10/12.
Cruise costs 2 fuel +1 supply; slingshot 1 fuel +1 supply +2 hull;
emergency 1 fuel +3 hull. A route requires hull strictly above its damage, not a
posthumous arrival. Six surviving legs wins; if no route is affordable, distress
extraction ends the run as loss. No infinite waiting or empty option list.
Optional event aid earns fictional commendation points, not credits/crew ranks.
No new wagers, custom XP, receipts, world actors, outposts or market mutations.

Lifecycle: route -> event -> route ... -> arrived/stranded. Every choice saves
immediately. Replayable schema-1 seed/actions validates restore; maximum eleven
choices. Finished restore never sends finish again. New run requires confirmation
when unfinished; abandon/close does not manufacture completion. No timers to
restore on death/travel/unload/quest stop. OSF absent uses local browser save; host
provided native save preferred. Corruption/unsupported revision gives visible
fresh run. Crash between final save and notification can omit a reward; durable
exactly-once world rewards are not claimed. No native/CK additions.

| Entry / consumer | Handling before implementation |
|---|---|
| catalog, iframe ready/load | new frontier-convoy id, existing StarcadeHost |
| mouse / keyboard / forwarded D-pad+A | same visible option buttons and affordability guards |
| return / reload / new run | every choice checkpointed, explicit abandon confirmation |
| result, native score, AISS | existing score/finish path; no events inferred from snapshot |
| Razor Derby / old games | independent rules/storage; launcher immediate-close branch |
| CT / IS / SSSE / OC / LSS / CW / SN / Legacy | no adapter; real personnel/fleet/economy/cases stay with their owners |

Starcade owns resources, authored encounters and run history. Fictional run IDs
do not represent actual ships or colonists. Reuse existing host/save/renderer;
no new background poll, VM cadence, global queue or mandatory sibling dependency.
Rendered exact cost previews and a factual route log apply SC-RCH-001 as well.

Acceptance before code: at least one winning route policy for each tested seed;
resource conservation/caps; unaffordable choices rejected on both UI and engine;
six legs complete exactly once; stranded explicit; every legal action restore;
invalid/duplicate/out-of-phase actions rejected. Browser full run, visible cost
preview, D-pad/A choices, abandon confirmation, result/reload, bad-save recovery;
actual launcher ready/save/exit/reopen. No performance claim from fixture counts.
Human readability/fun and actual Starfield input/close remain separate gates.
