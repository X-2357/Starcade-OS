# AISS catalog capacity — November 3, 2026

Read-only audit of actual sibling source; no AISS code/Git or state edits.
Reader: C:/Users/MwMak/OneDrive/Documents/My Games/Starfield/ModSource/AISS/Source/Backend/lib/starcadeContext.js
Reader SHA256: 2e093eecf9b350665d4b14dae024ee7cbd27f0a9b211a97ddfc9a83535881066
Native publisher: Native/src/main.cpp WriteAISSStarcadeState (schema1, positive highScore entries, all saved games rather than catalog-only).

Actual reader LIMITS.games is40 and LIMITS.title60. Excess pairs are silently truncated to40, not a rejection of the whole file. Tests/aiss-catalog-contract.mjs requires an explicit actual reader path, executes that parser, checks all39 current catalog titles, colon/title handling, ready/schema rejection and41-entry truncation. It also reads native schema/key source. It does NOT execute the native writer or prove DLL output, MO2 VFS ownership, stream atomicity, AISS dialogue or deployed backend version.

Current known-folder Documents Starcade/state.json inspected read-only:27 saved game entries,12 positive scores. No runtime overflow observed in that snapshot. Catalog guard cannot prove absence of extra legacy saved-game ids; future catalog growth beyond40 score publishers requires an explicitly scoped owner contract. Existing snapshots remain save-driven with no expiry; do not alter working native behavior based on a hypothetical future overflow.

Run: set STARCADE_AISS_READER to the actual lib/starcadeContext.js, then node tests/aiss-catalog-contract.mjs. Test prints its precise coverage. Copied mock parser is not an acceptable substitute.
