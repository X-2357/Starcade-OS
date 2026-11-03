# Razor Derby records — scope before code
SC-RCH-011, bounded first implementation. Show the ten latest completed exhibition
results with actual goals, shots, challenges and saves. System timestamp is a local
completion date, never a Starfield date. Original rules revision1 explicitly shown.
Practice never records. No fabricated older history or last-best dates.

Starcade owns a local schema1 journal. New exhibition gets a persistent random
match id; older active saves get an id when resumed. Completed legacy restores do
not backfill. Completion records idempotently by match id before finish publication;
reload/result redraw never creates another record. Keep only latest ten. No changes
to native high-score policy, AISS schema, Legacy receipts, personnel or world state.
This is a browser archive, not a cross-mod event ledger or crash-proof reward receipt.
Uninstall leaves inert local data. No native/CK/Papyrus/sibling edits or polling.

Lifecycle: choose Records while setup/paused/result -> pause/checkpoint if needed ->
show journal -> close journal returns paused -> explicit resume. Result write occurs
only on live->result. Practice skips write. New game/mode switch/close uses existing
checkpoint behavior. Validate journal shape/ids/counts; absent means empty. Malformed
or unsupported journal shows unavailable and is preserved rather than overwritten.
Storage failure does not prevent match completion. Pause/death/travel/reload/unload
never manufactures results. Retention means results older than ten leave this view.

Horizontal table: exhibition create/resume/id metadata; live completion/persist;
practice isolation; journal read/write/render; keyboard/controller focus; close and
return. Each uses one journal owner and existing host transport. No background work.
Acceptance: record twice -> one entry; eleven -> ten; invalid/future data rejected;
practice no record; completed reload no backfill; browser records open/close remains
paused and goals/statistics agree. Actual OSF/gamepad/performance still separate.
