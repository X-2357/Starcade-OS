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

## Deployment

`state/starcade.ini` in this folder is the **inert seed** (`ready=0`, empty fields) - per AISS's
own contract, this needs to ship at `Data/SFSE/AISS/state/starcade.ini` in every release so mod
managers place it correctly and a fresh install never replays stale data. Include this folder's
`state/` contents at that path when building a release package, same as `SFSE/Plugins/` and
`Scripts/`.

The real, live file (the one `Starcade.dll` actually writes) is generated at runtime in the same
location and immediately overwrites this seed - nothing here needs updating by hand as the game
is played.

## Why the seed lives here, not in AISS

Per AISS's own integration contract: each companion mod ships the inert seed for *its own*
`state/<mod>.ini` file, inside its own package - not AISS. AISS handles a missing file cleanly on
its own (the reader returns `not_found` and the health check stays silent about it), so the seed
isn't there for AISS's benefit - it's purely mod-manager path hygiene, so Vortex/MO2 place
`starcade.ini` under the right owning mod from install. If AISS shipped this seed instead, it
would need updating every time a new companion mod integrates - a dependency pointing the wrong
way. Every future companion mod seeds its own file the same way; AISS never needs to know they
exist in advance.

## AISS-side support required

This only does something once AISS's own code reads `Data/SFSE/AISS/state/starcade.ini` into its
conversation context - that's a change on the AISS project itself, not something this repo can
do. See AISS's own `Docs/AISS_INTEGRATION_CONTRACT.md` for the read-side contract; the concrete
ask for that project is: read the `[starcade]` section above and surface `last_played_game`/
`high_scores` the same generic way it already reads any other companion mod's state file - no
seed or advance knowledge of Starcade specifically required on AISS's side.
