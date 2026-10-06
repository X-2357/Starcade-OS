# X-2357's mod ecosystem — design

Owner, 2026-09-24: *"i want ssse, ssaw, aiss, starcade, and crew titles plus any of my other mods
and future mods to form one giant ecosystem."*

This is a design note for the shared shelf (`ModSource\`), not owned by any one project. Paste the
relevant section into whichever mod's session is doing the work.

---

## 1. The good news: most of it already exists

You are not starting from nothing. **A state bus is already shipped, installed and working in
game.** `C:\Modding\MO2\mods\AISS - AI Settled Systems\SFSE\AISS\state\` currently holds:

| File | Written by | Read by |
|---|---|---|
| `ssse_market.ini` | **SSSE** — market, portfolio, movers, headlines | AISS |
| `ssaw_campaign.ini` | **SSaW** — campaign state | AISS |
| `crew_titles.ini` | **Crew Titles** | AISS |
| `current_speaker.ini`, `hud.ini`, `liveliness_gate.ini`, `long_input_capture.ini` | AISS itself | AISS |

Three of your mods already publish into one place, with a convention that has survived a public
release and an in-game confirmation (you confirmed the SSSE↔AISS link working on 2026-09-23).

**The conventions that make it work** — these were learned the hard way and should not be
re-litigated:

1. **Path:** `.\Data\SFSE\AISS\state\<mod>.ini`, written with Cassiopeia `WriteIni`.
2. **The gate:** every extender call sits behind `Game.IsPluginInstalled("x2357aiss.esm")`. No
   Cassiopeia name is ever *reached* without AISS, which is what keeps the core console-safe.
3. **AISS ships the seeds, not the publisher.** Under MO2 the mod that ships a file owns the VFS
   path and receives the game's writes (Crew Titles' lesson, 2026-09-13). Each publisher's seed
   file ships **in AISS** with `ready=0`.
4. **Handshake:** write `ready=0` first, fill the values, write `ready=1` last. A reader that sees
   `ready=0` skips the file. Every file carries `schema_version` and `source`.

5. **Freshness is decided per publisher, from how it republishes.** SSSE and Crew Titles republish
   on a timer, so AISS ages them out after 10 minutes; SSaW's window is 24 hours; **Starcade
   republishes only when something is saved, so AISS applies no window at all** - a file from last
   month is still true and aging it out would silently delete the feature (Starcade, 2026-09-30).
   Copying a sibling's window is the mistake to avoid. Starcade's file also carries no `source`
   key, so a reader must not require one.

## 2. The one missing half: reading

Today it is hub-and-spoke — everyone writes *to* AISS, nobody reads anyone. SSSE cannot see SSaW's
war; SSaW cannot see SSSE's market; Starcade is not on the bus at all.

**`CassiopeiaPapyrusExtender.ReadIni(path, name, section, key)` exists** (the local API stub,
line 888) and returns a `String`. It takes the same dependency and the same gate as `WriteIni`.
So a mod can read any other mod's state with code it already knows how to write.

That single addition turns the hub into a bus. Nothing else about the architecture needs to change.

### The reader contract

```papyrus
; Same gate as publishing - no extender name is reached without AISS installed.
bool Function BusReady()
    return Game.IsPluginInstalled("x2357aiss.esm") && Game.IsPluginInstalled("<the publisher>.esm")
EndFunction

string Function BusRead(string asFile, string asSection, string asKey, string asDefault)
    if !BusReady()
        return asDefault
    endif
    string v = cassiopeiapapyrusextender.ReadIni(StatePath, asFile, asSection, asKey)
    if v == ""
        return asDefault
    endif
    return v
EndFunction
```

Rules for readers, each one the mirror of a rule that already exists for writers:

- **Never read without checking `ready=1` and `schema_version` first.** A half-written file must
  read as "no data", not as zeros.
- **Absence is normal.** A missing file, a missing plugin, an empty value — all mean "that mod is
  not here", and the feature must degrade to nothing, not to an error.
- **Never write another mod's file.** One owner per file, always. Two writers is a defect even if
  it works today.
- **Read on a cadence, not in a hot path.** SSSE republishes every 240 s; readers should poll no
  faster than that, and cache.

## 3. What each mod can offer and use

| Mod | Publishes (has, or could, cheaply) | Would use |
|---|---|---|
| **SSSE** | prices, sector moves, the player's portfolio, headlines, option positions | war fronts (defence/transport pressure), arcade winnings as a cash source, crew roles for flavour |
| **SSaW** | active fronts, who holds what, casualties, campaign phase | market confidence as a war-weariness input; a faction's listed companies collapsing |
| **AISS** | who is speaking, companion mood, conversation topics | *everything* — it is the natural consumer of the whole bus |
| **Crew Titles** | crew roster, roles, bonuses | crew reacting to the player's portfolio or the war |
| **AISS - Star Wars Genesis** (`AISS_StarWarsGenesis`, added 2026-09-28) | nothing - a data-only AISS world profile + config; no plugin, no scripts, no bridge file | AISS only (it is AISS content, not a bus participant). Lesson for the ecosystem: `AISS_Backend.exe` launched directly runs OUTSIDE MO2's VFS, so any add-on that ships AISS data as a separate MO2 mod is invisible to it - unsolved as of this row |
| **Starcade OS** | the game last played, when (real-clock Unix time), and each game's best score as `Title:score` pairs - **AISS reads it since v3.6.0 (2026-09-30)** | nothing yet — but it is the ecosystem's leisure economy. It does NOT publish credits won or a favourite cabinet; earlier versions of this table said it did, and the real file (read 2026-09-27) has neither |

## 4. The integrations worth building, in order

**1. SSaW → SSSE: the war moves the market.** The highest-value link and the one you asked for
first. SSaW publishes `ssaw_campaign.ini` already. SSSE reads the front count / intensity and
applies it exactly like a world event: defence up, transport and shipbuilding down while fronts are
hot, unwinding when they cool. SSSE's world-event system (feature 6) already knows how to land a
dated, decaying, headlined entry in the ledger — this is a new *source* for it, not new machinery.
Degrades to nothing without SSaW.

**2. SSSE → SSaW: the market funds the war.** The mirror. A faction whose listed companies are
collapsing has less materiel. SSaW reads a sector index and nudges supply. **Careful:** SSaW
mutates shared world state, so this must set a value SSaW owns, never a vanilla faction record.

**3. Starcade → the bus.** *AISS half BUILT 2026-09-30 (v3.6.0): companions know the game last played
and each game's best score; read-only.* Starcade publishes `starcade.ini` (`last_played_game`,
`last_played_time_unix`, `high_scores` - **no** credits-won or favourite-cabinet figure; earlier
versions of this paragraph said there was). The SSSE half - treating a big payout as consumer-sector
activity - needs Starcade to publish a payout figure first. It also proves the bus works for a mod that is not
"serious", which is the point of an ecosystem.

**4. Crew Titles ↔ SSSE.** Crew already publishes roles. A crew with a "Quartermaster" could give a
small trading-fee edge; a crew member could comment on a loss. Small, characterful, no risk.

**5. A shared registry.** One file, `x2357_registry.ini`, written by each mod at load:
`[<mod>] plugin=..., version=..., schema=..., ready=1`. Any mod can then discover what else is
present without hardcoding plugin names, and *you* get a single place to look when something is not
talking.

## 4b. Sharing the machine: the cadence contract

Four mods now run inside one game: AISS, SSaW, SSSE and Starcade, and the OSF UI log shows **eight
or nine WebView2 views hosted at once**. They share three things whether they like it or not:

1. **One Papyrus VM.** Every mod's timers, remote events and guarded functions queue on the same
   script engine. SSSE has already been bitten by this on its own: a publish sat behind two chart
   walks and the log filled with `Stack potentially stalled - waiting on guard` for 41 seconds.
2. **One WebView2 host.** Every open view costs memory and frame time, and a view that is hidden or
   throttled will **release its queued timer callbacks in a burst** when it resumes.
3. **One state folder.** Files in `SFSE\AISS\state\`, written and read on timers.

### Is a queue the answer?

**Inside one mod: yes, and that is a lock, not a queue.** SSSE's market is behind a compiler-checked
`Guard`; nothing reaches the ledger or a price except through it. Any mod that mutates state from
more than one entry point wants the same. Papyrus's `Guard` is the right tool and it is free.

**Across mods: there is nothing to lock.** Papyrus has no cross-mod mutex, no shared scheduler and
no way for SSSE to know SSaW is mid-publish. A "queue" between mods would have to be built out of
files in the state folder, and a file-based lock that survives a crash, a reload and a mod being
uninstalled is far more dangerous than the contention it would prevent - one stale lock file and
every mod in the ecosystem goes quiet with nothing to explain it.

**So the contract is about cadence, not mutual exclusion.** Each mod stays cheap and polite, and
they stop colliding without ever needing to know about each other.

### The six rules

1. **Never `setInterval` for anything that calls into Papyrus.** A throttled or suspended WebView
   backs the callbacks up and releases them together. Use a self-rescheduling `setTimeout`, which
   cannot accumulate a backlog. *(SSSE's exchange view was doing exactly this wrong: the owner's
   log 2026-09-25 shows three refreshes inside one second, then three market recomputes.)*
2. **Put a floor under every outbound call.** Keep the timestamp of the last call and refuse a new
   one inside the floor. A burst then collapses to one. SSSE: 20 s cadence, 15 s floor.
3. **Go silent while hidden, and catch up once on return.** A view nobody is looking at should ask
   for nothing. One refresh on `visibilitychange`, subject to the same floor.
4. **One request in flight.** Cache the promise, not the value, so a re-render during a slow reply
   reuses it instead of sending a second. *(SSSE learned this one the hard way too - two 120-close
   chart walks in flight at once was half of the 2026-09-15 stall.)*
5. **Stagger the Papyrus timers.** Every mod republishing on a round 240 s will eventually align.
   Derive a small offset from something stable per mod so they interleave.
6. **Publish on a stamp, not on every change.** Bump a counter when state changes and let the timer
   notice; do not push on every event. SSSE debounces 10 s behind a trade for this reason.

### How to tell whose fault a stall is

The evidence is already there and costs nothing to read:

- `Documents\My Games\Starfield\Logs\Script\Papyrus.0.log` - `waiting on guard` names the script
  that is holding one; a burst of identical actions in the same second is rule 1 or 2 being broken.
- `Documents\My Games\Starfield\SFSE\Logs\OSF UI.log` - which views loaded, when each finished
  loading, how many are hosted, and any manifest complaint. **It says "loaded view" once per view;
  more than once means something is reloading it.**

### Manifest conformance (checked 2026-09-25, OSF UI 1.6.0)

Every view OSF UI 1.6 ships declares `"mod": "<mod id>"` and **none** declares `targetVersion`,
which 1.6 reads as the OSF UI version the view was built against. SSSE's manifest had no `mod` and
a stale `targetVersion: "1.0.0"`; both fixed. **Worth checking the other three mods' manifests
against the same two points** - it is a two-minute job per mod and it removes a whole class of
"why is this view behaving oddly on the new OSF UI" questions.

## 5. Hard rules for every mod that joins

These come from rules you have already set, and from what has actually broken before:

1. **No hard dependencies. Ever.** No master dependency on another of your plugins, no
   `IncompatibleModules`, nothing that greys out or auto-unticks (your Bannerlord rule 13.5 applies
   here too). Every mod must install and run alone.
2. **Console-safety by construction.** The gate comes first; no extender name is reached on a path
   the gate does not guard. A mod whose core needs the bus is a mod that cannot ship to console.
3. **One owner per file, one writer per value.**
4. **Version every schema, and never break an old reader.** Add keys; do not repurpose them.
5. **Seeds ship with the owner of the path** (AISS today), `ready=0`, and are covered by that mod's
   package tests — a file the game *writes* must still ship as a seed, or a fresh install has
   nowhere to write.
6. **Absence is the default case, not the error case.**
7. **Every link gets its own acceptance test** — the in-game action that proves it, written before
   it is built.

## 6. What this is deliberately not

- **Not a shared ESM or a master chain.** That would make every mod depend on every other and turn
  a load-order problem into a support problem.
- **Not a runtime API.** Papyrus has no way to call across mods safely; files on a cadence are
  slower, simpler and survive one mod being absent, mid-update, or crashed.
- **Not a reason to change a working mod.** Each link is *added beside* what exists. Nothing that
  already works in game gets rewritten to join the bus (SSSE working rule 12).

## 7. First concrete step

The smallest thing that proves the whole design: **SSSE reads `ssaw_campaign.ini` and turns an
active front into a dated market event.** It uses machinery both mods already have, it degrades to
nothing for anyone who owns only one of them, and when it works, the same three functions
(`BusReady`, `BusRead`, a cadence) copy into every other mod unchanged.

Scope it properly before building — one feature, whole, with its lifecycle and acceptance test
written first.

## 8. The other half: the shared OSF UI runtime
> **Read this with section 4b (`Sharing the machine: the cadence contract`).** 4b was written
> independently on the same day and covers the *page-side* discipline - timer shape, floors,
> visibility, one-in-flight, staggering. This section covers what the *runtime* shares and what it
> silently drops. They were reached by separate investigations and agree on the headline: there is
> nothing to lock across mods, so the contract is cadence and validation, not mutual exclusion.

Owner, 2026-09-25: *"i want all my mods to work together in harmony in an ecosystem. aiss, ssaw and
ssse, and starcade all use osf ui and i think there is some refresh issuies maybe, do we need a
queue or something?"*

Sections 1-7 are the **data** layer — mods reading each other's state through files. This is the
**runtime** layer — four of your mods drawing into one process at the same time.

**The question as asked, answered first: no, you do not need a queue. OSF UI already has one, it is
namespaced per mod, and on your machine it has never dropped anything.** Everything below was read
out of the installed runtime (`OSFUI.dll` 1.6.0) and your own `SFSE\Logs\OSF UI.log` on 2026-09-25.
Nothing here is inferred from documentation.

### What is actually shared, and what is not

| Resource | Shared between your mods? | Evidence |
|---|---|---|
| The view list | **No** — namespaced `views/<modId>/<viewId>` | ten views loaded side by side at 13:00:08 |
| `SetView*` data keys | **No** — every call takes `asModId` | API signature, `OSFUI.psc` |
| The push queue | No, but **bounded and drops silently** | `PapyrusApi: pending view-push queue full; dropping push for {}.{}` |
| The pre-ready send queue | Per view, bounded, **drops the OLDEST** | `BridgeApi: pre-ready SendToWeb queue for view '{}' is full ({}); dropping oldest queued '{}'` |
| Requests in flight | **Per mod**, capped | `PapyrusApi: too many view requests in flight for '{}'` |
| Reply tokens | 10 seconds, session-scoped | `OSFUI.psc` line 153 |
| **The Papyrus VM** | **YES, genuinely** | SSaW's first publish after a load takes **27 seconds** |
| **Window focus** | **YES, genuinely** | the watchdog below |

Your four views coexist without contending: `renderer = webview2`, ten views loaded at startup,
`controller ready (9 view(s) hosted)`. **No single-view limit applies today** — but the runtime does
carry `Runtime: renderer '{}' supports one view in this phase; loading only default '{}'`, so never
write a mod that assumes its view is the only one, or that its view loaded at all.

### The three things that can actually bite

**1. The Papyrus VM is the one genuinely contended resource, and reply tokens expire in 10 seconds.**
OSF UI namespaces its queues per mod, but every bridge script runs on the same VM. SSaW's
first-publish-after-load takes ~27 s (~1 s steady). Any other mod that receives a view *request*
during that window has 10 seconds to reply, and a `ReplyView*` after that is discarded. This already
cost the Exchange a debugging session ("history replies arrived after their ten-second token
lifetime"). **Therefore: never answer a request with work that can take longer than a second or
two. If the answer is expensive, publish it with `SetView*` on a cadence and let the page read the
published copy** — which is what SSaW's bulk column exporters exist for.

**2. Under MO2 the game does not read your view files. It reads a mirror.**
`WebView2HostWebRenderer: USVFS detected — views mirrored to C:\Users\MwMak\AppData\Local\OSFUI\views-mirror-<pid>`
— taken **once**, when the WebView2 host launches. Editing a view in its MO2 folder mid-session
cannot reach the game, and **a save reload will not pick it up either**, because the mirror belongs
to the process, not to the save.

> **A `.pex` deploy survives a save reload. A view deploy needs a full restart of Starfield.**

This cost a whole debugging session on 2026-09-25: view files were written at 13:16 under a game
running since 13:00, the save was reloaded at 13:23, the bridge correctly re-registered and
published — and the page on screen was still the pre-13:16 copy from the mirror. The symptom reads
as "my change did nothing" or "the mod is broken", and it will happen identically to AISS, SSSE and
Starcade.

**3. The queues are bounded and drop silently, so the PAGE must refuse a partial snapshot.**
A dropped push produces no error anywhere the page can see. Publishing `meta` last is **not**
sufficient protection: it fixes ordering, not loss — if an early column is dropped and `meta` still
arrives, a naive page commits a snapshot with a missing column.

### The pattern to copy (SSaW, and it is the right answer)

Every published column carries a `[sequence, epoch]` footer, and the page refuses to commit unless
**every** subscribed column has (a) arrived, (b) at least its expected length, and (c) a footer
matching the current `meta`. A column dropped by a full queue keeps its *stale* footer, fails
check (c), and the page shows `waiting for <key>` instead of drawing wrong numbers.

```js
for (const k of ARRAY_KEYS) {
  const need = EXPECTED_LENGTH[k], version = columnVersions[k];
  if (!staging[k] || staging[k].length < need ||
      !version || version[0] !== meta[1] || version[1] !== meta[2]) {
    diag("Receiving snapshot #" + meta[1] + ": waiting for " + k); return;   // do NOT commit
  }
}
```

The `epoch` half is what makes a loaded save win: bump it on every load, and any column still in
flight from the previous session fails the same check.

### FRAME GENERATION IS INCOMPATIBLE WITH THE OSF UI OVERLAY (confirmed 2026-09-25)

**Owner found this one: the extreme flicker was frame generation.** Turning FG off stops it.

**The signature, so nobody re-chases it:** `SFSE\Logs\OSF UI.log` fills with ring adoptions
alternating between two resolutions of the same aspect ratio - the upscaler render size and the
presented size - climbing a generation counter several times a second:

```
D3D12Compositor: shared ring adopted (2560x1440, 4 slots, generation 130)
D3D12Compositor: shared ring adopted (1504x848,  4 slots, generation 131)
... 116 adoptions, generation 130 -> 146 in about five seconds
```

**Why it happens:** OSF UI carries an explicit frame-generation path - the strings
`frameGeneration`, `D3D12Compositor: FG seam uses only the transparent COPY_SOURCE UI layer`,
`seam-only overlay armed (no IDXGISwapChain::Present hook)` and a perf counter reporting `FG={}`
are all in the 1.6.0 binary. It is **auto-detected, not a user setting** - no settings schema
declares `frameGeneration`, and the user-facing knobs are F10 -> OSF UI, persisting under
`Documents\My Games\Starfield\OSFUI`. With FG on, the overlay surface is rebuilt against a render
resolution that no longer matches the presented one, and the ring is re-adopted forever.

**Nothing in any of the four mods causes this, and nothing in them can fix it.** It is one game
setting against one code path in OSF UI. Worth reporting upstream with the excerpt above.

**The rule this gives every mod here:** an OSF UI view is an *overlay on the engine swapchain*, so
it inherits whatever the display pipeline is doing. **Before blaming a view, check the game's
upscaling and frame-generation settings, and the ring-adoption count in `OSF UI.log`.**

Two hypotheses were wrong before this was found, and both are recorded because the reasoning was
plausible each time: a focus watchdog (real, but it fired twice in the session that flickered
hardest) and the number of concurrently hosted views (false - the thrash began with one view open,
and the War Room, opened four minutes later, had already adopted correctly at its declared size).

### Focus: the one live ecosystem conflict, and it is not your mods

Your 2026-09-25 log carries this **13 times**, bursting every ~3 seconds:

```
[W] WebView2HostWebRenderer: interactive menu live but game window still owns focus;
    re-sending focus request (watchdog)
```

That is the reported "flicker back to game and back on again", in the runtime's own words — the
overlay is up, Windows focus is on the game window, and a watchdog keeps re-requesting it. **The
first firing precedes the War Room being opened, so it is not caused by any one mod's view.**

⚠ **UNVERIFIED, but the strongest candidate, and it is a third-party clash rather than one of
yours:** you have a second menu framework installed. At `13:01:51.516` **SFSE Menu Framework** logs
*"Engine menu-ownership lifecycle installed"* and *"Menu input layer 0 retained for the process
lifetime"*; at `13:01:51.518` — two milliseconds later — **OSF UI** logs *"Plugin: focusMenu on —
registering OSFUI_FocusMenu"*. Two plugins installing menu ownership in the same millisecond, one of
them holding input layer 0 permanently.

**The decisive test** (cheap, reversible, no code): disable `SFSE Menu Framework` and the mods that
pull it in (`DevilzDad's ESM Shop Mod Explorer` / `SFStarfieldMCM`), cold-start, open any OSF view
and let it sit. If the watchdog line stops appearing in `SFSE\Logs\OSF UI.log`, that is the cause
and it belongs upstream, not in your mods. If it still fires, the next suspect is OSF's own
`focusMenu` / `captureInput` config against your display mode.

### Rules for every mod of yours that uses OSF UI

1. **One `modId` per mod, one view id per surface, and never reuse either.** Yours today:
   `x2357.ssaw/warroom`, `x2357.ssse/exchange`, `x2357aiss.companionlog/companionlog`,
   `starcade.arcade/launcher`. A future mod gets a new one; do not fork an existing id.
2. **Never edit a view file while the game is running.** Deploy, then cold-start. (Rule 2 of the
   shared working rules, applied to a place it was not obvious.)
3. **Keep every request/reply under a couple of seconds.** Anything expensive is published on a
   cadence, never answered on demand. The token dies at 10 s and the failure is silent.
4. **The page validates before it draws.** Length **and** `[sequence, epoch]` footer on every
   column, or it shows "waiting", never a half-snapshot.
5. **Bump an epoch on every game load** and make stale columns fail the same check. A loaded save
   always wins.
6. **Never assume your view is open, loaded, or alone.** Degrade to nothing, exactly as the data-bus
   reader contract in section 2 requires.
7. **Never grab focus, and never fight for it.** Let OSF own the overlay lifecycle.
8. **One publisher per key.** Same rule as the file bus: two writers is a defect even if it works.
9. **Keep the core free of OSF entirely.** The console build must never reach an OSF symbol — the
   view is an optional PC add-on with its own plugin, exactly as SSaW's War Room is.

### What is genuinely unverified here

- That SFSE Menu Framework is the focus conflict (correlation and mechanism, not proof).
- Whether the queues ever overflow under heavier load than yours — **they have never dropped on this
  machine**, so the bound is known to exist but not its practical size.
- Frame cost with several WebGL views hosted at once. Only one of yours draws 3D today.

---

## 9. The coordinated release (Michael, 2026-09-26)

> *"i want aiss, ssse, ssaw, and crew titles, and starcade all to be in an amazing state and ill
> update all of them publicly at the same time i release ssaw for the first time."*

**Five mods, one drop, gated on SSaW's first public release.** AISS, SSSE, SSaW, X2357CrewTitles and
Starcade OS. This section exists so no session learns about it late.

**SSaW is the gate, and its gate is VERIFICATION, not features.** As of 2026-09-26 its brain file
carries **100 "NOT in-game tested" flags against 10 in-game confirmations**. Shipping more features
does not move that number; playing the game does. Every other mod therefore has real time, and the
right use of it is its own readiness rather than waiting on SSaW.

### ⚠ What a simultaneous release changes about the risk

Normally a version-skew window is small and one-sided: one mod updates, the others do not, and a
contract mismatch shows up in one place with the others as a control. **Release all five at once and
players will have updated everything, so a bus or runtime mismatch surfaces in all five in the same
minute, with nothing left to diagnose against.** Players also update in an arbitrary order over a few
minutes, so every pairing of old-and-new will exist somewhere.

**The protection is already section 5's rule and it is now load-bearing rather than defensive:**
absence is normal, degrade to nothing, never a hard dependency between two of these mods. Before the
drop each mod should be able to state, from its own source, what it does when each of the others is
missing AND when each is present but one version behind.

### The release gates that apply to all five

1. **A fresh-install first launch of the FINAL archive**, not the dev folder. A played install hides
   launch-time file defects, and every file a script reads *or writes* must ship as a seed.
2. **Archive layout verified by opening the archive** - root `Data/`, forward-slash entry names, built
   with Python `zipfile` rather than `Compress-Archive`.
3. **A view change needs a full Starfield restart to test** (section 8.1). Four mods now share the OSF
   UI process, so "it did nothing" during release testing is usually this.
4. **Version numbers bumped and changelogs written** for each mod, at the same time, so the five read
   as one coordinated update rather than five unrelated ones.
5. **Nothing at the launcher/manifest level that removes a player's choice** - no hard dependency, no
   incompatibility declaration. Players install what they like and the mods degrade.

### 9a. ⚠ The bus is append-only, because WriteIni cannot delete

Found by AISS's session, 2026-09-26, while checking skew safety for the coordinated release. It is a
third sighting of the same class in AISS alone that day, so it is worth stating as a bus rule.

**AISS's writer never clears `ssaw_campaign.ini`.** It writes `ready=0`, loops the publisher's fields
writing each key, then `updated_unix_ms`, `source`, and `ready=1`. Nothing removes a key that is no
longer exported - `WriteIni` has no delete.

**So any key a publisher stops exporting keeps its last value forever, and looks live.** `ready=1`
still flips and `updated_unix_ms` still advances beside it, so the stale row is indistinguishable
from a fresh one. The consumer of the typed numbers is SSSE, so the realistic failure is a stock
market reacting to a faction treasury from a campaign that no longer exists.

**Two rules for every publisher on this bus:**

1. **The field count stays a compile-time constant and the key set only grows.** A count that can be
   lowered orphans every key above the new value with no way to clean them up.
2. **Never make an export conditional.** If a field genuinely must go away, publish it as an **empty
   string** so the row is OVERWRITTEN rather than orphaned. That is section 4's "absence is normal"
   rule extended one step: absence must be *written*, not merely omitted.

**Do not reach for a revision counter to detect this** - `updated_unix_ms` advances for the whole
snapshot, so it cannot distinguish a fresh row from a stale one next to it.

⚠ **It bites on a DOWNGRADE, not an upgrade** - which is precisely what people do during a
coordinated multi-mod release when they roll one mod back to test. SSaW enforces both rules in
`WarRoom/Tests/typed-export.test.cjs` block 11b; any other publisher that joins should do the same.

---

## 10. One fact every Starfield mod here should check against its own source (2026-10-01)

**Starfield's Papyrus distances are METRES.** SSaW wrote its ground geometry to Skyrim's ~70-units-to-the-metre and lived with
landing markers 3.5 km away, hold markers 1.1 km away and a navmesh snap tried from 600 m up, for weeks, because nothing about a
too-big number looks wrong in code. The evidence and the vanilla quotes are in `VanillaPapyrusReference\CAPABILITY_INDEX.md`
(top section). **Each project's session should grep its own distance constants once** - `PlaceAtMe` / `MoveTo` offsets,
`GetDistance` comparisons, any `Float Property ... = <hundreds or thousands>` - and ask whether a person standing there would
call it "near". This note does not say any other project is wrong; it says nobody has measured, and SSaW's cost two weeks.

**Make it a gate, not a note (SSaW, 2026-10-01).** `SSaW\WarRoom\Tests\ground-distance-scale.test.cjs` scans every `Float Property`
whose name reads as a length (`Distance`, `Offset`, `Gap`, `Tolerance`, `Radius`, `Forward`, `Spacing`, ...) in every script and
requires each to be classified in one table - GROUND (metres, with a ceiling), SPACE (pinned), RETIRED (must be read by nothing),
LEGACY (reason written down) or not-a-distance - so an unclassified new distance **fails by name** instead of shipping at the wrong
scale. Copy its shape (it is ~60 lines of the file). Run on SSaW it also caught a claim the author had written, "nothing reads
this constant", that a grep would have refuted: write the grep before you write the sentence.
