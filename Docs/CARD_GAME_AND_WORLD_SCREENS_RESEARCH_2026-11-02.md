# Card game and physical ship-screen research
November 2, 2026. User asks about “triple tried” (assumed Triple Triad) and adapting screen mods so Starcade games, eventually Morrowind, play on physical ship monitors. Feasibility research only; no working screen adapter or card game claimed.

## Triple Triad-style game

[Square Enix's guide](https://na.finalfantasyxiv.com/lodestone/playguide/contentsguide/goldsaucer/tripletriad/) describes a 3x3 board, opposing edge values, alternating placement and capture, plus optional advanced rules. A browser-native original Starfield-themed interpretation fits Starcade's established DOM/Canvas/input architecture. This is engineering judgment, not a completed prototype.

Proposed first version: original title/art/card identities; two five-card hands, nine board positions, basic adjacent-value captures and CPU opponent, controller/mouse support, plain-data save/resume. Count controlled cards including the last unplayed card under the selected rules. No mandatory timer, advanced rule combinations, real-credit wagers or external collection unlocks in the first lifecycle. Define ties, invalid moves, animation cancellation and duplicate completion before implementing. Clearly distinguish simulated opponents from real NPC participants.

Potential later content: collectible independently authored cards, optional rulesets, tournament history and named fictional rivals. Source-game art, characters, music and branded presentation are not assets to import. Technical rules research is not legal clearance for copying presentation.

Ecosystem: Starcade owns match/deck/collection; Legacy can archive a later stable achievement receipt; AISS acknowledges actual published facts only. CT does not promote real crew from card wins. Native casino transactions remain separate. An optional PC screen adapter must not become required to play the card game.

## Screen mod found and source evidence

[ScreenSFSE Nexus](https://www.nexusmods.com/starfield/mods/18465), by comespm, lists buildable video screens. It documents local/online video, channels, positional audio, activation controls and save resume, not arbitrary interactive browser games or universal ship-monitor support.

[Author-linked repository](https://github.com/iromeroh/ScreenSFSE), inspected tree ce1d1a7c104d1a372bf50038e9ed4710e84cd4e3 (0.3.2 source):

- [src/frame_source.h](https://github.com/iromeroh/ScreenSFSE/blob/ce1d1a7c104d1a372bf50038e9ed4710e84cd4e3/src/frame_source.h): internal FrameSource produces RGBA at the target screen size; copyLatest accepts sequence/buffer/pitch; onSurfaceLive allows idling. A plausible adaptation seam, NOT an established third-party ABI.
- [src/media_player.h](https://github.com/iromeroh/ScreenSFSE/blob/ce1d1a7c104d1a372bf50038e9ed4710e84cd4e3/src/media_player.h): file-video frame/audio path using Media Foundation/XAudio2.
- [src/live_player.h](https://github.com/iromeroh/ScreenSFSE/blob/ce1d1a7c104d1a372bf50038e9ed4710e84cd4e3/src/live_player.h): streamed media decoding path, not game-input hosting.
- [exports.def](https://github.com/iromeroh/ScreenSFSE/blob/ce1d1a7c104d1a372bf50038e9ed4710e84cd4e3/exports.def): lists SFSE loader/version exports; no exported game-frame-provider contract found in that file. This is not a complete search of all dynamic interfaces.

Repository README identifies GPL-3.0-or-later plus exceptions, and says game plugin/asset-generation tools are not included in the native-source distribution. Do not assume native source grants rights to every screen mesh/texture. Before reusing anything read exact LICENSE/EXCEPTIONS and component provenance, and preserve required corresponding source/credits. Optional adapter is preferable to bundling someone else's whole mod. No message to its author has been sent.

Local read-only mod-name inventory found Settled Systems Radio but no installed ScreenSFSE-named directory. This is not a complete VFS/file audit.

## Four different deliverables

| Capability | Current evidence | Work still required |
|---|---|---|
| Physical monitor activates ordinary Starcade overlay | Existing launcher/activator pattern supports a candidate | Exact CK records, placement, ownership and exit behavior |
| Video on buildable world screen | ScreenSFSE documents this | Real installation/version/content validation |
| Live browser game actually drawn on mesh, controlled while looking at it | Internal frame-source interface is promising | Browser-frame producer, texture target/lifetime, input/audio and performance prototype |
| Morrowind interactive on a physical ship monitor | Starcade OpenMW currently launches a separate native window | OpenMW capture/render integration, input/focus/pointer ownership, audio/save/process lifecycle and host performance |

An overlay opened from a monitor is not the same as a live image physically on that monitor. A prerecorded video or live stream is not interactive gameplay. Neither proves Morrowind embedding.

## Proposed architecture, not yet implemented

Starcade game/OSF browser surface -> bounded latest-frame transport -> native screen texture provider -> selected world monitor.

Screen interaction -> explicit control session -> game input; release on exit/interruption. For mouse games ray-hit/UV coordinate mapping or a deliberate fullscreen control mode needs verification. Controller games can map direct actions once focus ownership is proven.

OpenMW process/render surface -> separate capture producer -> same optional frame transport. Do not use HTML iframe navigation or window reparenting as a substitute for proving texture capture. Preserve user's legally owned Morrowind data and existing isolated OpenMW config/saves.

Potential shared workload: one frame/screen transport may serve Starcade and independently owned SSSE/SSaW/OC/CT display adapters. It must have an explicit provider API, versioning and teardown, not a new mandatory ecosystem controller. Each producer owns facts and processing; screen rendering is presentation only. Do not modify sibling repositories here.

## Prototype gates

1. Audit actual ScreenSFSE video_surface and screen_manager implementation, runtime asset targeting and exact licenses; inspect current OSF UI capture capabilities. Headers are not enough to specify an integration.
2. On ONE authored buildable monitor, show a generated moving test pattern. Verify texture updates, material UV/orientation, dimensions/color space and no accidental replacement of all shared-material screens.
3. Feed ONE simple Starcade game. Confirm actual moves alter the rendered board and a clean exit restores controls; no duplicated saves/scores/rewards from mirroring.
4. Prove ship placement separately: furnishing vs pre-existing cockpit mesh, changing cells, ship edits, travel, unloaded/deleted reference, combat interruption, player death/load and mod absence.
5. Bound resolution/frame rate and buffer count; never block the render thread waiting on browser, decoder or capture. Hidden/unloaded screens idle. One play session can mirror to several displays; do not launch one engine per physical screen. Frame sequence and lifetime prevent stale data/use-after-free.
6. Test audio ownership, attenuation, focus/pointer escape and close/reopen repeatedly. Native ABI/plugin absence shows fallback/unavailable, not a crash.
7. Only then test OpenMW capture, one controlled action, escape to Starfield, save/reload, child-process exit/crash and full cleanup. Two 3D games running simultaneously need measured CPU/GPU/VRAM/frame-time budgets.

Card game can be scoped independently of the physical-screen prototype. First screen candidate should be a simple 2D/turn-based game, not OpenMW. No existing working overlay/OpenMW launcher gets replaced to conduct research.

## Status

SC-CARD-001: user-requested direction, implementation not started; original Triple Triad-inspired card game needs full lifecycle scope.
SC-SCREEN-001: user-requested direction, source-backed feasibility lead; no runtime proof.
SC-SCREEN-002: OpenMW-to-world-screen research, high uncertainty; extends existing deferred true-embedding goal.

No CK batch, new binary, installed external dependency or gameplay/source change. Retain existing release maintenance and owner-confirmed native rebuild evidence.
