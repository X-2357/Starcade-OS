# Derby world-prize candidate — build and acceptance

Native1.7.4 + all three changed PEX + new UI must travel together. Existing ESP
editing / ESM play retained; no CK changes. Runtime is a development candidate,
not an owner-confirmed inventory test or public release.

Build from repository root (PowerShell), using a NEW output directory:

```powershell
$runtime = '../Starcade-Derby-Prizes-1.7.4-r2'
$compiler = 'C:/Steam/steamapps/common/Starfield/Tools/Papyrus Compiler/PapyrusCompiler.exe'
$imports = '-i=Web-and-Papyrus/Source;C:/Steam/steamapps/common/Starfield/Data/Scripts/Source'
$flags = '-f=C:/Steam/steamapps/common/Starfield/Data/Scripts/Source/Starfield_Papyrus_Flags.flg'
foreach ($script in @('x2357StarcadeNative','x2357StarcadePlayerAlias','x2357StarcadeDerbyPrizes')) {
    & $compiler "$script.psc" $imports "-o=$runtime/Scripts" $flags
    if ($LASTEXITCODE -ne 0) { throw "Compile failed: $script" }
}
Push-Location Native
xmake f -p windows -a x64 -m releasedbg -y
if ($LASTEXITCODE -ne 0) { throw 'Native configure failed' }
xmake build Starcade
if ($LASTEXITCODE -ne 0) { throw 'Native build failed' }
xmake build DerbyPrizePolicyTest
Pop-Location
python tools/stage_derby_runtime.py --runtime $runtime
python tools/build_release_zip.py --install C:/Modding/MO2/mods/Starcadeos --prize-runtime $runtime --out ../Release-Development-2026-11-03/Starcade-Derby-World-Prizes-Development-r2.zip
```

Use the installed Python runtime if `python` is unavailable. Dependency packages
and CommonLib are the existing local toolchain; do not replace SDK copies merely
to silence warnings. Build dirties tracked Native/.xmake caches; restore only the
tracked cache files after reviewing their diff, never remove unrelated scratch.
Receipt binds staged DLL/PEX and corresponding source hashes; it is not a
cryptographic attestation that those binaries execute correctly. Builder rejects
missing/stale selected runtime instead of falling back to native1.7.3.

## In-game acceptance (pending)

1. Close Starfield and MO2 before enabling the complete candidate. Keep previous
   mod and profile backup. Full restart through SFSE; verify winning DLL1.7.4,
   three PEX, launcher and Razor files. Existing save should retain its pad.
2. Make a separate manual save. Note actual player credits and Med Pack counts.
   Open Razor -> League season -> Career & rewards -> Starfield inventory prizes.
3. Finish a league match. Claim next earned prize. Loss100/draw150/win200 credits,
   no match item. Confirm exact inventory delta after closing overlay. Confirm
   in-menu receipt agrees. No actual-game pass is recorded until this is observed.
4. Reopen, double click, query and save/reload: same milestone must not pay again.
   Claim next actual match. No duplicate score/XP/casino publication is expected.
5. Finish seven rounds. Claim outstanding matches oldest first, then season prize:
   first500credits+3MedPacks, second300+2, third150+1, fourth-eighth100+1. Confirm
   item actually exists in inventory and standings/rank agree with prize preview.
6. Start next season. Old prizes remain claimable, career passport unchanged;
   old claims remain recorded. Existing four-team season has no world prizes;
   explicit rollover unlocks schema2 prizes without fabricated legacy results.
7. Load the separate earlier manual save. Inventory AND save-owned ledger must
   return to that save's point. WebView career may be ahead: UI queries the save,
   not cached receipts. Different character saves maintain independent claims. Also test loading another save while the prize menu stays open: the expected-frontier guard must return the new save position without granting/skipping prizes.
8. Close overlay during pending claim, travel, then reopen/query. Never infer
   failure from timeout. Stop/missing quest, dead player and old/missing DLL/PEX
   should report unavailable/unknown without console-command or casino fallback.
   A reserved uncertain result blocks later claims; retain save/logs for diagnosis.
9. Verify pad, exhibition/practice, casino wager/payout/cancel and actual XP still
   behave as baseline; test simultaneous SSSE/AISS/CT without market/actor/history
   changes. No shared performance acceptance has yet been recorded.

Prizes are optional small inventory grants, not SSSE market transactions. No new
native/score fields are published to AISS; no claims of narration or Legacy events.
Uninstall leaves granted inventory intact. Do not clear ledger fields to retry an
uncertain award; AddItem and ledger writes are not an atomic external transaction.
