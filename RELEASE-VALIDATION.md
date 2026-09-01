# Starcade OS 1.7.3 release validation

## 1.7 expansion verification

- `tools/validate.ps1`: validates all JavaScript files and 26 catalog entries.
- Headless browser load audit covers all 26 game pages.
- Keyboard/controller interaction smoke audit covers Constellation Codebreaker.
- Existing `x2357starcade.esm` remains the verified clean master; `Starcade.dll` and the XP bridge PEX files were rebuilt for 1.7.2.
- Runtime archive begins at `Data`; no OSF UI DLL or OSF UI configuration replacement is bundled.

Validated 2026-07-28.

- All 26 catalog entries have unique IDs and resolve to included local files.
- Every original browser game includes the shared Starcade host/input bridge; Freedoom uses its dedicated asm.js bridge.
- All JavaScript files pass `node --check`.
- The prior 24-game browser smoke suite remains the gameplay baseline; the added Freedoom framebuffer was separately exercised for 120 rendered frames with 64,000/64,000 opaque pixels.
- The optimized x64 release configuration of `Starcade.dll` builds successfully.
- Casino transactions enforce one active wager, bounded payouts, unique request IDs, exact-stake cancellation refunds, and queued cancellation when a wager callback is still pending.
- Red Mile Hold 'Em completes pre-flop, flop, turn, river, and showdown in the focused browser test; interrupted matching wagers are cancelled and refunded before a retry.
- Galactic Chess completes a legal player move and CPU reply in the focused browser test without altering the 1.4.0 rules engine or AI behavior.
- Starfall Blocks retains seven-bag, hold, kicks, lock delay, advanced scoring, and now adds milestone pressure phases.
- Leaderboard rows use a dedicated style class, show the native Starfield character name instead of the `YOU` placeholder, and merge player results with ten deterministic rival scores.
- Orbital Roulette uses the correct European single-zero pocket sequence and preserves the existing wager/payout path.
- Celestial High / Low preserves its risk-priced payout logic while restoring full card suits and presentation.
- The OSF UI 1.3.0 package retains the documented qualified-view layout used by Starcade; no OSF files are bundled or overwritten.
- No Papyrus script calls `DisablePlayerControls` or `EnablePlayerControls`.
- The OSF UI manifest keeps world simulation active and captures input only while the Starcade view is open.
- The packaged `x2357starcade.esm` is the clean pre-Red-Mile-edit master retained from the tested Beta 3 baseline.
- Runtime archive has a top-level `Data` folder for direct MO2/Vortex installation.
- Raw controller mode is enabled only while a game is open and explicitly disabled on return to the library; Starcade does not call Papyrus control-locking functions.
- MIT, GPL-2.0 (Doom engine), BSD-3-Clause (Freedoom), GPL-3.0-or-later (native plugin), third-party notices, editable source, and corresponding-source archives are provided.

In-game testing by X-2357 confirmed game launching, real-credit increases/decreases, Dice, Racing Book, High/Low, the wager recovery update, and normal control restoration. Future Starfield, SFSE, Address Library, or OSF UI updates may require a matching native rebuild.
