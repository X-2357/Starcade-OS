# OSF UI rendering handoff for X-2357 mod development chats

Prepared October 12, 2026 from Starcade source checkpoint 63ad820 and dated ecosystem/runtime evidence. Give this file to the receiving mod chat alongside its current brain and rules. This is technical reference, not permission to change OSF UI, Starcade or sibling repositories.

## The useful starting point

OSF UI hosts web content inside Starfield through WebView2. Your mod can draw HTML/CSS, SVG, Canvas 2D and browser-compatible 3D into its own view. Starcade demonstrates several distinct renderer types; there is no single universal engine conversion.

For a ship dossier, colony map, market board, case board or trophy room, use a local visual scene whose data comes from the owning mod. WebGL is a possible UI renderer; it does not automatically expose Starfield meshes, ship interiors, cameras, world actors or engine rendering targets.

## What is proven, and at which layer

| Path | Starcade example | Evidence | Transferable limit |
|---|---|---|---|
| HTML/CSS/SVG and Canvas 2D | Original arcade/casino games | Historical owner launch/play/credit/control reports; individual game coverage varies | Browser animation and mod actions are separate systems |
| Three.js/WebGL 3D | Billiards practice.html | Owner confirmed the 3D table rendering August 29; source inspected October 12 | Real browser 3D works; not proof every shader/engine/GPU works |
| Browser framework application | Mah Jong Angular; Micropolis | Browser loading/interactions recorded; Micropolis owner button symptom remains unresolved | Module loading, layout and host input need their own tests |
| Software-rendered engine framebuffer | Freedoom asm.js/Canvas port | Historical render-frame and runtime validation | Its old Emscripten build is project-specific, not a universal WASM recipe |
| Emscripten WASM/native-engine port | Warzone2100 experiment | Engine built/initialized in browser; first rendered frame failed | Compilation and module initialization are not rendering success |
| External native application | OpenMW | Owner confirmed Morrowind launch in a separate window | Not embedded. True embedding is a future research goal |
| WebGPU, live Starfield render-to-texture, arbitrary NIF/ship extraction | No demonstrated Starcade adapter | UNVERIFIED | Do not promise these or implement against guessed APIs |

Latest public Starcade upload confirmed in its brain is 1.9.5; source is 1.9.8 plus later music/docs. These examples are architectural evidence, not a claim that a fresh build was tested today.

## View identity, layout and host boundaries

Use the receiving mod's unique mod ID and qualified view ID. Do not borrow starcade.arcade for another mod. Local runtime content goes under Data/SFSE/Plugins/OSFUI/views/<mod-id>/<view-id>/.

Starcade's actual launcher manifest declares id=launcher, mod=starcade.arcade, entry=index.html, 1600x900, transparent=true, capturesInput=true, pausesGame=false and permissions nativeBridge=true/filesystem=false/network=false. Its targetVersion field was removed after OSF UI 1.6 conformance research. This is an inspected example, not a mandatory setting for every view. Transparent overlays and opaque full-screen panels have different needs; pausing the world is an explicit product decision.

OSF UI supplies the shared bridge script. Starcade's launcher loads ../../shared/osfui.js; that relative path depends on its directory depth. Inspect the installed OSF UI SDK and a working sibling view before choosing the receiving mod's path and bridge API. A native settings-schema field is not automatically a view-manifest field.

Starcade's copied native header advertises legacy ABI 1.7 (0x00010007). Do not infer the user's installed runtime ABI from that source header or from a WebView2 version. Record Starfield, SFSE, OSF UI plugin, bridge and WebView2 runtime versions separately.

The local OSF UI source at C:/Modding/MO2/mods/Starcade OS 1.3.0 Complete Source/osf-ui/tools/webview2_host/HostApp.cpp:839 maps views with SetVirtualHostNameToFolderMapping and DENY_CORS. That gives local content a mapped web origin. Do not test module/fetch applications by double-clicking a file:// page and call the failure an OSF bug. Microsoft documents the origin and resource-access behavior in [WebView2 local content](https://learn.microsoft.com/en-us/microsoft-edge/webview2/concepts/working-with-local-content).

Use local same-origin assets and inspect the actual mapping/access policy. Do not assume cross-origin requests, filesystem access, worker isolation headers or all browser APIs are enabled. A manifest permission is not proof of an implemented native service.

## Choose a renderer by the player-visible feature

| Feature | Recommended first prototype | Upgrade only after measurement |
|---|---|---|
| Lists, buttons, dossier, terminal, case evidence | HTML/CSS and accessible DOM controls | Canvas only where a custom drawing is useful |
| Graphs, trade routes, colony schematics, timelines | SVG or Canvas 2D | WebGL for genuinely large/3D scenes |
| Ship/keepsake/model preview | One local exported GLB/glTF scene in a pinned browser renderer | Multiple assets, effects and interaction after load/rotate/close works |
| Authored 3D colony/fleet/map visualization | Minimal WebGL scene plus DOM selection/detail panel | Picking, instancing, animation and streamed chunks after capability tests |
| Retro software 3D | Engine framebuffer to canvas, if source/build permits | Measure CPU/frame-copy cost and resolution |
| Native game engine port | Minimal browser build with one rendered scene | Full game only after input, assets, persistence and teardown pass |
| External application | Explicit separate-process launcher | Embedding requires dedicated host/native research and permission |

For 3D, distinguish a diagram/model preview from a live authoritative simulation. A rotating decorative vessel is not proof of actual player ship geometry or fleet position.

## A bounded 3D implementation recipe

1. Freeze the exact renderer version and its required graphics API. Current Three.js documentation is not necessarily the API of Starcade's vendored Billiards build. Test the chosen WebGL/WebGL2 context in the installed host.
2. Start with a colored triangle/cube and one camera. Then load one local model. Record first visible frame, load failures and GPU/context errors.
3. Export models to a supported browser format with local textures. NIF is not a browser-ready format by default. Verify model origin, rights, scale, axis, material assumptions and missing dependencies; never fetch proprietary game assets from a CDN.
4. Keep geometry/textures bounded; use a sensible default quality tier. GPU memory, draw calls, texture dimensions, lights, shadows and postprocessing each need measurement on the supported machine.
5. Size the drawing buffer to the actual visible container. Zero-size hidden iframes are not valid camera dimensions. Observe resizing, update camera aspect/projection and renderer size only when needed. Cap DPR by a measured pixel budget; higher DPR raises pixel work in both dimensions. See [Three.js responsive rendering](https://threejs.org/manual/pages/responsive.html).
6. Use one animation loop per active scene. Separate simulation time from wall-clock catch-up. Clamp elapsed time after hidden/resume; do not replay minutes of physics in one frame. Static dossier previews can render only on camera/data changes.
7. Handle context creation failure and context loss with an actionable fallback panel. Retain authoritative data separately from GPU objects; recreate resources or reload the scene using the renderer's supported recovery path.
8. On exit stop animation, dispose geometry/materials/textures/render targets, detach listeners/observers, release input and audio and terminate owned workers. Repeated opening must not multiply loops or WebGL contexts. Object removal from a scene alone is not GPU-resource disposal.
9. Keep DOM buttons and a textual equivalent for important facts. Do not make progression or transaction confirmation depend on clicking an unlabeled 3D mesh.

Inspected Billiards example: src/utils/webgl.ts creates WebGLRenderer with depth=true, stencil=false, alpha=false, quality-dependent antialiasing; shadows disabled, SRGBColorSpace, NoToneMapping and capped DPR (0.5/1/2). Those are that game's choices. They are not universal optimal defaults. Its view.ts updates size. Read that pinned implementation before copying API names.

## Browser-engine ports: prove capabilities before building the whole game

Verify WASM MIME/loader behavior, workers, asset loading, memory limits, persistence and first frame independently. An engine can build successfully and still fail in the host.

Pthread builds need SharedArrayBuffer and suitable cross-origin isolation. Inspect crossOriginIsolated, SharedArrayBuffer availability and actual worker startup in OSF UI; do not assume localhost testing proves virtual-host support. Emscripten documents the [pthreads prerequisites](https://emscripten.org/docs/porting/pthreads.html). A single-thread build is a separate artifact/design decision, not an automatic fallback for every pthread binary.

Warzone's recorded experiment used SDL3/pthreads. Its later browser diagnostics reached real initialization, then failed at ANGLE/D3D11 dynamic shader compilation on rect.vert on the first frame. Two attempted approaches failed: rolling back the suspected scene refactor and changing packed normalized vertex attributes to floats. Do not repeat either as a proven fix. The host/backend alternative was declined by the owner; no global Chromium/ANGLE flags, security relaxation or OSF UI DLL replacement is authorized by this handoff. Browser capability and actual in-game capability remain distinct.

Freedoom uses a specific older asm.js/software-framebuffer port with its own input and build toolchain. Do not generalize “Freedoom works” into “all C++ engines work” or “WASM is unsupported.”

## Hosting many games or scenes without running them all

Starcade's catalog exposes 32 embedded entries, but the launcher uses one active game iframe. launch assigns frame.src; close navigates to about:blank, releases controller inputs and raw mode, restores the library and resumes music. This is a useful architecture: a catalog is many choices, not 32 concurrent engines.

For a receiving mod, lazy-create expensive views/scenes and stop hidden work. One hub can host independent scene modules with explicit mount/unmount ownership. Avoid retaining renderers, workers, audio or network subscriptions merely because the card remains in a list.

Parent/iframe messaging needs explicit schemas, allowed actions, source-window/origin validation where the actual host permits it, bounds and correlation IDs. Starcade has its own channel/bridge; audit that implementation before reuse rather than assuming postMessage('*') is a complete trust boundary.

Offline adaptation is more than disabling a manifest permission: inspect analytics, multiplayer handshakes, external fonts, score servers and remote asset loaders. Billiards uses practice.html because its default multiplayer path waited for a handshake. Starcade neutralized real usage/score/shortening calls; verify all launch paths in a new adaptation.

## Input, focus, audio and saves

- Inspect each game's actual mouse, keyboard and controller contracts. Synthetic keyboard input cannot automatically provide camera drag, ray picking, pointer lock or analog aim.
- Use focusable controls with visible focus. Exclude unrelated external links from D-pad/Tab order. Provide a real exit/back path from menus, dialogs and 3D controls.
- Clear held keys/buttons on exit, blur or interruption. Distinguish a held analog axis from a rising-edge button. Restore only input ownership taken by your view; do not toggle global Papyrus controls casually.
- Starcade raw gamepad mode is enabled while a game is open and disabled on close. Verify exact current OSF commands and failure behavior before adopting it in another mod.
- Audio starts from an accepted user action; catch play() rejection without suppressing unrelated failures. Own one music policy across parent/child scenes; pause/mute/stop correctly on exit and hidden state.
- Separate UI preference/browser storage, engine save data and authoritative Starfield/Papyrus state. A browser score or animation must not directly promote crew, settle a portfolio, resolve a case or change a campaign.
- Preserve plain-data save schemas and migration. Hextris failed because its serializer used eval under restrictive CSP; then restored objects lacked methods. Construct real engine objects and apply validated saved data. Do not loosen CSP just to avoid finding the serialization cause.
- Persistence needs independent tests for fresh state, existing state, malformed state, close/reopen, game save/reload and NG+ only if explicitly supported.

## Data bridge and shared ecosystem performance

Render local UI state at animation cadence. Request authoritative mod data at a bounded cadence or on meaningful user actions; never use Papyrus round trips for every 3D frame.

The dated ecosystem source records bounded push/pre-ready queues and session-scoped 10-second Papyrus reply tokens. Verify these against the installed SDK before relying on exact limits. Keep replies cheap; publish/cache expensive state separately.

Use self-rescheduling timeouts for outbound polling, a minimum interval, one request in flight, silence when hidden and one bounded refresh on return. Stagger publisher timers. Do not introduce a cross-mod global queue or file lock.

For multi-column snapshots validate expected lengths and matching sequence/epoch before committing a display. Meta arriving last is not enough if an earlier column was dropped. A loaded save must invalidate old-session data. Keep previous coherent display or show “waiting for <field>”; never draw half a fleet/market snapshot.

Owner map for receiving chats:

| Owner | UI may present | UI must not take over |
|---|---|---|
| Infamous Ships | Pilot/vessel dossiers, supported result/route previews | Actual identity, fleet results and fame |
| Outpost Communities | Community conditions, resident/service diagrams | Residency, jobs, habitability and growth |
| LSS / Shore Leave | Supported activity/leave views | Actor routines and leave permissions |
| Crew Titles | Rank/qualification/service presentation | Personnel progression |
| SSSE / SSaW | Market charts / strategic maps | Accounting / campaign outcomes |
| Shadow Network | Recipient-appropriate cases and evidence boards | Hidden truth, disclosure and evidence provenance |
| Starborn Legacy / Discovery Journal | Keepsakes/history / exploration records | Source-mod live facts or fabricated backfill |
| AISS | Factual conversation/reactions | Commands inferred from generated dialogue |
| Starcade | Games, recorded scores and its supported transactions | Another mod's save/publisher file |

Every new adapter names owner, exact fields, identity/lifetime, capabilities/platform, compatible schema/build floor, refresh policy, privacy, duplicate handling, bounds and absent/older/malformed/partial behavior. Each mod remains independently usable. A 3D UI does not require a new mandatory ecosystem master.

## Deployment and the two regressions to remember

Under MO2, OSF UI mirrors view assets into a per-process views-mirror directory when the host launches. A live folder edit can leave the game showing old assets. Fully close/restart Starfield after view deployment, then verify the winning MO2 file paths and hashes, and the actual mirrored content where available. Cache-busting a desktop browser is not a replacement for that check.

Frame Generation caused overlay flicker in the owner's September 25 tests; turning it off stopped the symptom. Treat this as dated shared-host evidence, not a diagnosis for every blank canvas. Test settings explicitly before attributing a symptom to a mod.

Package only your mod's assets and legitimate corresponding source. Do not replace OSF UI configuration/runtime as a shortcut. Runtime archives use sole top-level Data/, forward-slash ZIP names and no meta.ini. Starcade must not ship AISS's seed; preserve the receiving mod's actual seed-owner contract.

## Verification ladder and diagnostic decision table

Record exact source revision, final archive hash, winning files, installed runtime versions, initial save/UI state and settings. Each pass is independent:

1. Parse/build/source checks: dependencies, manifest, entry/asset paths, JS syntax, source/licensing inventory.
2. Origin-correct browser check: local HTTP server, required MIME/types, installed renderer version, console/page/network errors and visible first frame.
3. Render interaction: resize, camera/picking, input, audio, meaningful scene/state changes, existing save and repeat exit/open.
4. OSF UI in-Starfield check: winning/mirrored assets, real controller/focus, overlay compositing, gameplay interruption and save/load.
5. Combined ecosystem check: other views running, hidden/resume bursts, optional mods absent/present/older, data coherence and performance.

| Symptom | First discriminating evidence |
|---|---|
| Blank view | HTML loaded? first JS exception? entry URL/asset 404? |
| DOM works, blank canvas | Nonzero buffer/container? context created? first draw? shader log? |
| Works in browser, fails in host | Host version/origin/CSP/capability differences and winning mirror hash |
| Frozen after first frame | Actual rAF ticks in visible view, simulation progress, exception/context loss |
| Broken after save | Data vs live instances, schema and method restoration |
| Port initializes then crashes | First failing frame/pass/shader and GPU/ANGLE logs, not build count |
| Controls fail | Focus, held state, modal path, raw mode, pointer/keyboard mapping |
| Data partly wrong | Both producer/consumer schemas, sequence/epoch, queue loss and stale session |

Use a known-good case and a deliberate known-bad fixture to calibrate the failing-layer tool. A screenshot alone cannot prove animation, persistence, command delivery or cleanup. Browser pass is not gameplay pass; compilation is not rendering pass.

## First receiving-chat prototype and handoff requirements

Choose ONE feature, such as one rotating authored ship model with a textual dossier. Write trigger, state owner, scene lifecycle, all exits, data contract, fallback and acceptance card first. Prototype one model/first frame, input/resize, teardown/reopen, then authoritative data. Expand only when those pass.

Before reporting complete supply: exact files/build, visible benefit, changed runtime/CK/save work, verified capabilities and limits, source/licenses, lifecycle exits, standalone and integrated results, remaining failures, and next exact action. Keep knowledge in the receiving brain. Any CK work remains a separate exact action-only checklist under CK_TASK_LIST_HANDOFF.md.

No source, plugin, OSF UI runtime or sibling mod was changed to produce this document. No fresh browser/in-game/performance test was run October 12.

## Source shelf

- Starcade CLAUDE.md: dated Billiards, Freedoom, OpenMW, Warzone, Hextris, focus/cache and owner runtime evidence.
- Starcade Billiards-Engine/src/utils/webgl.ts and src/view/view.ts: actual renderer/resize implementation.
- Web-and-Papyrus/starcade.arcade/launcher/main.js, manifest.json and games/host.js: scene host/input/bridge pattern.
- tests/ui-audit.mjs: origin-correct browser harness; its narrow page-load scope does not establish all-game play.
- Reference/ECOSYSTEM_2026-10-06.md: archival shared runtime/cadence/ownership evidence; read living ModSource/X2357_MOD_ECOSYSTEM.md before implementing.
- Local OSF UI tools/webview2_host/HostApp.cpp: actual virtual-host mapping; research checkout version may differ from installed runtime.
- [Microsoft virtual-host API](https://learn.microsoft.com/en-us/microsoft-edge/webview2/reference/win32/icorewebview2_3), [Three.js renderer documentation](https://threejs.org/docs/pages/WebGLRenderer.html), and [Emscripten pthreads](https://emscripten.org/docs/porting/pthreads.html): official primary documentation checked October 12. Verify API applicability to pinned versions.
