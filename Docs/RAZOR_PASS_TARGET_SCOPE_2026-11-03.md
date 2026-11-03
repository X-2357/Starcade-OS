# Razor Derby manual pass targeting

Player benefit: choose a teammate instead of relying exclusively on the automatic
outlet. Existing automatic selection remains the default; C / RB (forwarded
Control key) cycles eligible friendly runners excluding the carrier and
keeper. A visible diamond and text identify the receiver. X passes to that receiver.
If no explicit target is chosen, retain existing automatic behavior.

Owner: active Starcade match. Selection is transient input intent, not save state.
Carrier change, pause, blur, visibility loss, reload, new match, return and mode
switch clear selection. No timers, native commands, CK records, real crew state,
sibling dependencies, rewards or new snapshot schema. Exhibition and practice
share the same controls; practice remains isolated from score/native-save writes.
Invalid/opponent/self/keeper targets are rejected by engine and default to the
automatic valid outlet. Existing AI calls without explicit target stay unchanged.

Horizontal seams before code: engine target/pass/step; Canvas diamond and target
text; keyboard C and forwarded Control; X button and keyboard/controller; possession
changes; pause/new/close; practice/exhibition. All use one eligible-target resolver.
Acceptance: explicit target produces matching pass direction; invalid targets
fall back safely; default/AI behavior preserved; cycle excludes ineligible players;
browser keyboard and forwarded controller cycle/execute; pause clears intent;
existing deterministic-match and restore tests pass. Human tactical usefulness
and actual OSF controller behavior remain separate gameplay gates.
