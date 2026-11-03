# Razor Derby practice — scope before code

Player benefit: learn movement, passing, challenges and shooting without a scored
match. Add an explicit practice button next to exhibition. Same rules/AI/clock;
practice is a complete two-minute session with an explanatory final report.
Exhibition stays the default and keeps its own saved match. Practice uses its own
local checkpoint and never sends score, finish, achievement or native save data.
Returning to the arcade leaves exhibition progress intact. On reopen the normal
exhibition checkpoint is loaded; choosing Practice resumes the separate drill.
Starting a new practice after its result resets that practice only.

Owner: Starcade, same fictional players and engine. No native/Papyrus/CK or sibling
changes. No additional active simulation or polling; only the currently selected
mode runs. Practice absent/corrupt/unsupported: start fresh with a notice. Mode
switch first pauses and checkpoints exhibition. Practice return, blur, hide,
unload, timeout and completion stop input and checkpoint locally. Reload resumes
exhibition; explicit Practice resumes drill paused. Clear mode labels prevent a
practice result being mistaken for leaderboard progress. No reward on restore.

Horizontal entry table: start/resume, practice button, Y/P pause, new-session
confirmation, Return/Escape, launcher prepareClose, hidden/blur and result all
use the same mode-aware checkpoint/finish owner. Existing exhibition snapshot
schema remains unchanged. Native saved state always belongs to exhibition.
Diagonal acceptance: exhibition -> practice -> return -> reopen exhibition;
practice -> pause -> reopen -> explicit practice restore; complete practice ->
zero score/finish/native-save messages; malformed drill -> fresh practice;
exhibition completion still sends exactly one finish. Browser proof remains
separate from actual OSF/gameplay acceptance.
