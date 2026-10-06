# AISS integration bridge

Optional, one-way integration with AISS (AI Settled Systems), following AISS's own published
integration contract for companion mods. Starcade never reads anything back from AISS and has no
dependency on it - if AISS isn't installed, this is a harmless file nobody reads.

## What it does

Every time `Starcade.dll` saves its own state (a score submitted, a run finished, a save written),
it also republishes `Data/SFSE/AISS/state/starcade.ini` with:

- `last_played_game` - the most recently opened game's title
- `last_played_time_unix` - when that was (Unix timestamp)
- `high_scores` - every game's best score, as `Title:score` pairs joined by commas

This lets an AISS companion who's installed alongside Starcade bring up what the player's been
playing - "still trying to beat your Hextris record?" - without Starcade knowing or caring whether
AISS exists.

## Deployment and seed ownership

AISS v3.6.0 and later owns and ships the inert SFSE/AISS/state/starcade.ini seed. Starcade must ship NO files under SFSE/AISS/ in a runtime archive. The AISS-Bridge/state seed here is reference documentation only; never copy it into a Starcade release.

Under MO2 the mod shipping a file owns its VFS write destination. The AISS backend reads AISS's physical mod folder outside that VFS. A Starcade-owned seed or an overwrite shadow can therefore leave AISS reading ready=0 forever while the publisher writes elsewhere. Inspect actual ownership, preserve old contents and verify the next save's destination before claiming the link works.

## Actual AISS support

AISS has a dedicated reader, seed, prompt integration, health-check row and tests since v3.6.0. It accepts schema 1, raw title/score pairs, legacy absence of source and arbitrarily old save-driven scores. Do not expire those facts on a timer. Titles with colons are supported; commas in a title cannot be represented by this schema.

Current native publisher writes a complete temporary file with ready=1 then attempts rename and copy fallback. This is not Cassiopeia publication and does not use a ready=0/payload/ready=1 sequence. Stream/fallback atomicity needs verification; a ready flag alone is no guarantee.

The live writer destination and conversation result remain unverified after seed-shadow correction. See Docs/AISS_HANDOFF_2026-09-30.md (historical receiving handoff), Docs/INTEGRATION_CONTRACT.md (current contract), and PT-001 in Docs/PLAYTEST_LOG.md. No published payouts, favorite cabinet, stable event identity or complete play history exists in this snapshot.
