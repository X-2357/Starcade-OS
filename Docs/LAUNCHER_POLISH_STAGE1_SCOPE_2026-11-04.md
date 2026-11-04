# Launcher polish — Stage 1 scope (owner request 2026-11-04)

Owner: "refine everything, make it work better, look better, more animated stuff, more fun."
Owner choices: one stage at a time; **browser preview first, nothing near MO2 until he says yes.**
Stage 1 = the launcher and library screen only. Games are untouched until later stages.
Branch `launcher-polish-stage1` in worktree `outputs/Starcade-OS-polish` — NOT on `main`, so no release build picks it up unapproved.

## Player gain (rule 12: what the player gets that they do not get today)

The library is the first thing seen on every launch and every return from a game. Today it is flat and static.
Stage 1 adds: a slowly drifting star background, glow on the title and live-status light, cards that
rise into place and light up in their own colour when selected (with a light sweep), a smoother filter
rail, animated panel changes, a live equaliser on the music button that moves only while audio is
actually playing, softer open/close for panels and game launches. Nothing is removed and no function changes.

Cost to the owner: none to saves, CK or settings. A launcher view change needs a full Starfield restart to appear.
Additive alternative: this IS the additive form — see "Reversibility".

## Design constraints (the shared-runtime contract, X2357_MOD_ECOSYSTEM.md section 4b/8)

OSF UI's WebView2 and the GPU are shared with AISS, SSaW, Crew Titles and others.
- Animate only `transform`, `opacity`, `background-position/size` on tiny elements, `box-shadow` on ONE element. No `filter: blur`, no `backdrop-filter`, no canvas, no WebGL.
- No `requestAnimationFrame` loop, no `setInterval`. The only JS is event/mutation driven and runs once per change.
- Continuous animations while the library is showing: 2 star layers (transform), header scan line, status light, title glow, the selected card's pulse, and the equaliser only while audio plays. Everything else is one-shot.
- While a game is running the launcher's continuous animations are switched off (`data-view="player"`), so the arcade costs nothing extra during play.
- Respects `prefers-reduced-motion`.

## Reversibility (rule 19: extend, do not replace)

New files `polish.css` and `polish.js`, loaded after the existing ones by two tags in `index.html`.
`style.css` and `main.js` are NOT edited (Codex also edits `main.js`; avoiding it avoids conflicts and keeps the Razor seam untouched).
Delete the two tags and the launcher is exactly as before.

## Lifecycle / entry points / consumers (written before code)

| Thing | Starts | Ends | Notes |
|---|---|---|---|
| Star layers, header scan, status light, title glow | page load | page unload; stopped by `data-view="player"` while a game runs | CSS only |
| Card entrance | only when the grid's content key (filter + game ids) changes, or the library is shown again after a game | one-shot, 0.45 s, delay capped at 12 steps | The launcher redraws all cards on EVERY native state push (`main.js` line ~443); without the key check the cards would re-animate constantly |
| Selected-card pulse | card gets `.selected` | card loses it (render replaces nodes) | one element at a time |
| Equaliser | audio `playing` event | `pause` / `ended` / `emptied` | driven by the real audio element, not by the on/off setting |
| Panel/modal open | element loses `.hidden` | one-shot | CSS animation restarts when display flips |

Entry points that change what is shown: mouse click, keyboard arrows/Enter/Escape, native gamepad (`ui.gamepad`), `starcade.state`
push, return from game, music events. All keep their existing handlers; polish only observes (MutationObserver / audio events).
Consumers of the DOM: `main.js` (ids and classes unchanged), tests `constellation-cards`, `razor-aim`, `razor-derby`, `razor-drills`,
`razor-world-prizes`, and `ui-audit` (all click `.game-card` and read the launcher) — hooks unchanged; entrance animation uses
`animation-fill-mode: backwards` so it never overrides the existing hover transform afterwards.

Failure paths: if `polish.js` throws or an element is missing it does nothing; CSS still works. No storage, no network.

## Acceptance (written before building)

Browser, at 1600x900 and 1280x720, with the stand-in OSF UI bridge:
1. Screenshots: first load, a hovered/selected card, after changing the filter, track-list panel open, leaderboard open, in-game view, back to library.
2. Computed-style checks: no `filter`/`backdrop-filter`; animated properties are only the allowed ones; `data-view` flips to `player` on launch and back; `prefers-reduced-motion` disables animation.
3. The entrance does NOT replay when a state push re-renders the same filter (counted by reading the grid's `enter` marker).
4. The equaliser animates only while the audio element is playing.
5. No console errors; keyboard arrows/Enter/Escape still work; the existing UI audit and the card-driving tests still pass.

UNVERIFIED by this stage and needing the owner: how it looks and feels in Starfield's WebView2, controller/hardware behaviour,
frame time next to the other mods' views. A browser pass is not a Starfield pass.

## Later stages (not started; each gets its own scope and preview)

2. Games batch A (the flattest ones: game-feel, particles, transitions) — owner picks.
3. Games batch B. 4. Casino games. 5. Razor Derby is excluded (moving to its own mod).
