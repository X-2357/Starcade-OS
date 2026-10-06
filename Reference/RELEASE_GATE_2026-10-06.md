# The five-mod simultaneous release — the shared gate

Michael, 2026-09-26: *"i want aiss, ssse, ssaw, and crew titles, and starcade all to be in an amazing
state and ill update all of them publicly at the same time i release ssaw for the first time."*

Read `X2357_MOD_ECOSYSTEM.md` first — this file is the release gate that sits on top of it.

**Scope of this file.** Section 2 is cross-cutting: things no single mod's session can see, because
they only show up when four mods are hosted in one process. Section 3 is SSSE's own gate, in full,
because that is the mod this file was written from. Section 4 names the questions each of the other
four has to answer **without pretending to answer them** — a thin plan covering five mods is the
80%-done sin committed at planning time (working rule 11).

---

## 1. What "released together" actually changes

1. **Four of the five have a public baseline; SSaW does not.** AISS 3.2.0, SSSE 1.1.0, Starcade 1.7.3
   and Crew Titles are all live. Working rule 13 applies to each: **diff against the released version,
   count exactly which entities change, and report the number** before calling anything releasable.
   SSaW's first release is the only one with nothing to regress.
2. **One player now installs all five at once.** They share one Papyrus VM, one WebView2 host and one
   state folder. A stall in any one of them is felt in the others.
3. **A single bad interaction reads as "X-2357's mods are broken"**, not "mod N has a bug". That is the
   real cost of shipping together, and it is why section 2 exists.
4. **Simultaneous release removes ordering as a fix.** If mod A needs a version of mod B, that pair's
   minimum versions must be written down and each side must degrade gracefully against an OLDER
   partner, not only an absent one.

## 2. The cross-cutting gate — none of this is visible from inside one mod

### 2.1 Starfield frame generation makes every OSF UI view flicker ⚠ VERIFIED

Confirmed in game 2026-09-25: with `uiFrameGenerationTech` non-zero the overlay flickers, and turning
frame generation off stops it dead. Measured from OSF UI's own host log — ring rebuilds per
interactive-capture window were 33, 20, 92, 20, then **0** after the setting changed, and stayed 0.
Mechanism: `fRenderResolutionScaleFactor=0.5883` means the internal render target is 1504x848 against
a 2560x1440 output, frame generation presents both, and OSF UI reallocates its shared capture texture
on every size change (`keyedMutex=false`, so nothing synchronises the swap).

**This is not SSSE-specific and not mod-specific** — it reproduced with `osfui/settings` and
`osfui/handoff` as the active view. So it will hit **all five mods** the moment a player with frame
generation on opens any of them.

- [ ] **Every mod with an OSF UI view says so in its Nexus description or FAQ.** One line: if the
      overlay flickers, turn Frame Generation off in Starfield's Display settings. Five mods each
      getting the same bug report is five times the support load for one sentence of prevention.
- [ ] The report for OSF UI's author is written and ready at
      `SettledSystemsExchange/Docs/OSFUI_FLICKER_REPORT_FOR_AUTHOR.md`. Sending it before release is
      worth more than after: a fixed OSF UI removes the FAQ line entirely.

### 2.2 OSF UI 1.6 manifest conformance — two mods still fail

Audited read-only across the installed MO2 folders, 2026-09-25 (`SettledSystemsExchange/Tools/audit_osfui_views.js`).
Every view OSF UI 1.6 ships declares `"mod": "<id>"` and **none** declares `targetVersion`.

| View | `"mod"` | `targetVersion` |
|---|---|---|
| `x2357.ssse/exchange` | ok | ok |
| `x2357.ssaw/warroom` | ok | ok |
| OSF UI's own four | ok | ok (the reference) |
| `x2357aiss.companionlog/companionlog` | **missing** | **1.0.0 present** |
| `starcade.arcade/launcher` | **missing** | **1.0.0 present** |
| `starcade.arcade/launcher/games/billiards` | **missing** | — |

- [ ] AISS session: add `"mod": "x2357aiss.companionlog"`, remove `targetVersion`.
- [ ] Starcade session: same for the launcher **and** the per-game sub-manifests.

Two minutes each, and it removes a whole class of "why is this view odd on the new OSF UI".

### 2.3 The page cadence contract, measured not assumed

`X2357_MOD_ECOSYSTEM.md` §4b has the six rules. What the 2026-09-25 logs actually measured:

- **SSSE's exchange** was calling into Papyrus from a bare `setInterval` and fired three refreshes in
  one second when the view resumed. Fixed: self-rescheduling `setTimeout` plus a 15 s floor.
- **SSaW's War Room** shows the same pattern unfixed — **five `action refresh` inside one second** at
  14:11:19 — and its publishes took **13.8 s, 6.3 s and 6.2 s**. On the shared VM that is felt by every
  other mod, including SSSE.

- [ ] SSaW session: apply the §4b cadence to the War Room, and look at why a publish takes 6–14 s.
- [ ] AISS Companion Log and Starcade launcher: check the same six rules. Neither has been measured.

### 2.4 Each mod installs and runs alone

Rule 15: never a hard dependency between two of Michael's mods; each must install and run alone and
degrade to nothing when the others are absent.

- [x] **SSSE verified** 2026-09-26: its only external hooks are `Game.IsPluginInstalled("x2357aiss.esm")`
      and `Game.IsPluginInstalled("x2357ssaw.esm")` — vanilla natives, soft, no master records. It also
      degrades against an *older* SSaW, because a missing key reads `""` and `""` is no-signal.
- [ ] The other four: confirm no hard masters and no shared-file assumptions, and say which pair of
      mods was actually tested with one of them uninstalled.

### 2.5 Fresh-install first launch, per mod

A played dev folder hides launch-time file defects. **Every file a script reads OR writes must ship as
a seed.** The gate is a first launch of the **final archive** into a clean install, not the folder the
testing happened in.

- [ ] One clean-install launch per mod, from the archive that will be uploaded.

### 2.6 Minimum compatible versions, written down

- [ ] A table, per pair that talks: which version of each is the floor, and what the older side does.
      SSSE ↔ SSaW is the live example: SSSE's war bridge reads `latest_event_*`, present in SSaW's
      58-field export, so it works against old SSaW; the faction-scale values need SSaW's 68-field
      build. Both degrade to no-signal, which is the shape every pair should have.

### 2.7 Nothing blocks a player's choice at the launcher

- [ ] No mod removes an option, greys anything out, or auto-unticks another mod.

---

## 3. SSSE's own gate

**Public: 1.1.0 (Nexus, 2026-09-20). Built and unreleased: 1.2.0.** Tags: v1.0.0, v1.0.1, v1.1.0.

### Blocking

- [ ] **The exchange page is not reaching Papyrus.** Verified from the log: `OnOSFUIViewAction` traces
      every action on entry, and across a whole session there were **zero** actions and zero requests
      after the page loaded — while SSaW's War Room page reached Papyrus fine in the same session. So
      the board has no data and the charts are empty. **Nothing visible in 1.2.0 works until this is
      fixed.** Needs the page's console errors (Debug mode) to separate demo-mode fallback from a
      startup throw.
- [ ] **The F7 hotkey does not fire.** Registration succeeds (`hotkey 196610`) but `OnHotkey` never
      runs, while SSaW's `openWarRoom` does. Check what "Open the exchange" is bound to in Mod Settings.
- [ ] **416 quest rows, zero verified in game.** `Docs/TEST_CHECKLIST_1.2.0.md`. Section 2 first: **53
      rows** hang on `ANY_STAGE` + `IsCompleted()` for Shattered Space and Terran content, and if those
      quests stop without setting a completion flag all 53 silently never fire — a code problem, not a
      data one. Nothing else in 1.2.0 can invalidate more work.
- [ ] **The war bridge has never fired.** Not a defect: `contested`, `frontline`, `blockaded` and
      `recently_changed_hands` are all 0 in the current save, and Kryx is the player's own faction's
      uncontested capital. Needs a system that is actually in play.
- [ ] **No archive, no version bump, no tag** until the checklist passes.

### Known-unfinished, deliberate, and to be stated in the release notes rather than fixed

- Terran incursions pay out once per *type*, not per incursion: `ANY_STAGE` rows cannot be repeatable,
  and the real completion stages are not provable from the data that ships.
- ~30 vanilla encounters are deliberately unwired because their fragments are empty — a row there
  would price a coin flip.
- `Fragment_Stage_0180` for `SE_Player_Attack12/13` is unpriced: they are ShatteredSpace.esm, which
  ships no script sources, so the stage cannot be verified the way the other eleven were.

### Verified this session, so it does not need re-doing

- 416 rows, 0 internal defects: no duplicate ledger key across 179 once-only rows, every headline id
  has text, no `ANY_STAGE`+`KIND_FLOW`, no unresolved target, no dead magnitude, 416 distinct
  (quest, stage, target) triples. Re-runnable: `node Tools/audit_quest_rows.js`.
- Every keyed stage carries a script fragment.
- All 9 `.pex` and all 6 view files byte-identical in the ticked MO2 install.
- Runs alone (2.4).

---

## 4. The other four — the questions, not the answers

Each mod's own session owns these. Written as questions because answering them from here would be
guessing, and four shallow plans is worse than none.

**SSaW (first release, the anchor).** No public baseline, so rule 13 does not bite — but everything
else does. What is the fresh-install first-launch result? Does the War Room obey §4b (2.3 says it does
not yet)? Why does a publish take 6–14 s on the shared VM? Does it run with AISS and SSSE both absent?
Is the 68-field export in the shipped build?

**AISS (public 3.2.0).** What changes against 3.2.0, counted? The Companion Log manifest (2.2). Does
the Companion Log page obey §4b? It is the writer of `ssaw_campaign.ini` — does that path degrade when
SSaW is absent, and when Cassiopeia is absent?

**Starcade (public 1.7.3).** What changes against 1.7.3, counted? The launcher and per-game manifests
(2.2). Does the launcher obey §4b? Its own session's brain file explains why the source lives outside
ModSource — that stays true.

**Crew Titles (public).** What changes against the released version, counted? It publishes to the state
bus — one owner per file still true? Does it run with AISS absent?

---

## 5. One risk about this file and the contract beside it

**`X2357_MOD_ECOSYSTEM.md` and this file are not in any git repository.** `ModSource/` is not a repo;
each mod folder inside it is. So the shared contract for five mods — and this gate — have **no
backup**, which is the exact failure that cost the original sources in August 2026.

Worth deciding: make `ModSource/` its own small repo for the shared docs (`X2357_MOD_ECOSYSTEM.md`,
`CK_TASK_LIST_HANDOFF.md`, this file, `VanillaPapyrusReference/`), or have one mod repo carry the
canonical copy with the others pointing at it. Either is fine; the current state is the one that is
not. **A mirror of this file is committed at `SettledSystemsExchange/Docs/ECOSYSTEM_RELEASE_GATE.md`
so at least one backed-up copy exists until that is decided.**
