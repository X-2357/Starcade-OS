# STARCADE OS

**Created by X-2357**

Starcade OS adds a portable arcade operating system to Starfield. It contains
twenty-five original games plus four clearly identified open-source
adaptations (Freedoom: Phase 1, Micropolis, Hextris, and Mah Jong) inside a
unified Starfield-themed interface, supports keyboard and controller input,
preserves high scores, and can be opened with a reusable inventory pad or
configurable hotkey. A fifth card, OpenMW: Morrowind, is an optional external
launcher rather than an embedded game - see below.

The 25 original Starcade games were written specifically for Starcade OS.
Freedoom: Phase 1, Micropolis, Hextris, and Mah Jong are clearly identified
open-source adaptations, each distributed with its required license notices
and corresponding source. The download contains no proprietary Doom WAD,
advertising, analytics, external fonts, or remotely downloaded gameplay
content.

For access to dev builds and direct feature requests and mod suggestions, please visit my patreon!

[My Patreon!](https://www.patreon.com/cw/x2357)

## Main features

### Version 1.8.0 update

- Adds **Micropolis**, an adaptation of Electronic Arts' 2008 open-source (GPL-3) release of the original SimCity engine and data. Camera panning and all menu/toolbar navigation work without a mouse; placing zones and roads still needs one.
- Adds **Hextris**, a GPL-3.0-or-later hex-puzzle game, fully embedded and offline with all networking/analytics/social features removed.
- Adds **OpenMW: Morrowind**, Starcade's first external-launch card. Detects a legally installed Steam copy of Morrowind and launches the bundled GPL-3.0-or-later OpenMW engine against it. No Morrowind or other Bethesda data is bundled; the card does nothing without a real, owned installation.
- Adds **Mah Jong**, an adaptation of the MIT-licensed ffalt/mah project - a complete Mah Jong Solitaire game with 84 boards and 13 tile sets. Not yet wired into Starcade's own leaderboard/XP system.
- The public library now contains 29 embedded/launchable entries: 25 original games, Freedoom: Phase 1, Micropolis, Hextris, and Mah Jong, plus the OpenMW external card.

### Version 1.7.3 update

- Repairs older Starcade JSON saves containing empty/null game records.
- Makes XP rewards visible inside Starcade as well as through Starfield's vanilla XP notification.
- Prevents unfinished runs from creating records, leaderboard entries, or XP rewards.
- Removes Settled Systems Solitaire and The Last Outpost from the public library at the creator's request.
- Includes targeted reliability fixes for Codebreaker, Great Serpent, Missile Defense, Space Racer, and Void Invaders.

- Twenty-five complete original offline games plus Freedoom: Phase 1 (26 total).
- Unified controller-friendly game library.
- Automatic Starcade Pad delivery through a small startup quest.
- Reusable pad: using it does not permanently consume it.
- Configurable F9 launcher hotkey through OSF UI settings.
- Arrow-key, keyboard, D-pad, and controller-button support.
- Starfield input is captured while Starcade is open.
- Escape/B consistently returns to the library or closes Starcade.
- Persistent high scores, ten-score histories, play counts, save data, and achievements.
- Varied in-world rival leaderboards and repeatable vanilla XP rewards for new personal records (non-casino games only).
- Automatic OSF UI view and settings registration through an SFSE plugin.
- No replacement interface files and no OSF UI configuration overwrite.
- Editable source for the 25 original games is included in the installation; complete corresponding Freedoom engine source is supplied as a separate source archive.

## Included games

### Great Serpent

Guide the Great Serpent through a xenobiology grid, consume stellar energy,
grow longer, and avoid colliding with the containment boundary or yourself.

### Meteor Field

A vector-space survival game. Rotate, thrust, preserve momentum, fire on
asteroids, and survive the increasingly dense debris field.

### Orbital Paddle

A fast paddle duel against an automated opponent. Defend the relay, return the
orb, and score by breaking through the opposing side.

### Reactor Breaker

Use a movable containment paddle to keep the reactor sphere active and clear
every unstable cell in the chamber.

### Minefield Protocol

Scan a concealed orbital minefield, interpret neighboring-mine counts, and
open every safe sector without triggering a mine.

### Lunar Descent

Control horizontal translation and limited vertical thrust to land a fragile
survey craft on the illuminated pad at a safe velocity.

### Memory Matrix

Navigate a grid of concealed navigation symbols and restore every matching
pair using as few attempts as possible.

### Signal Relay

Observe an expanding directional transmission and repeat the complete sequence
using the D-pad or arrow keys.

### Void Invaders

Defend the settled systems from descending formations of hostile craft. Move,
fire, clear the formation, and prevent the attackers from reaching your line.

### Starfall Blocks

Move and rotate falling cargo formations, complete horizontal rows, and keep
the cargo hold from filling to the top.

### Docking Vector

Use four-direction translation to match position and velocity with a moving
orbital docking collar before time expires.

### Space Racer

Pilot a high-speed ship through multiple traffic lanes while the pace and
hazard density continually increase.

### Fleet Command

Search a concealed tactical grid and destroy the entire hostile fleet using
careful targeting and as few wasted shots as possible.

### Missile Defense

Move the targeting reticle and create expanding interception fields before
incoming warheads reach the colony.

### Orbital Checkers vs CPU

Play a complete checkers match as the green side against the Starcade computer.
The CPU evaluates legal moves, prioritizes captures, and moves automatically.

### Galactic Chess vs CPU

Play White in a complete-board strategy match against Starcade's
independently written CPU move evaluator.

### Casino collection

Red Mile Blackjack, UC Video Poker, Red Mile Hold 'Em, Orbital Roulette, Neon
Constellation Slots, Settled Systems Dice, Celestial High / Low, and Red Mile
Racing Book use the player's real in-game credits. The transaction bridge
guards against duplicate charges and invalid payouts, and automatically
refunds an unfinished active stake when the player returns to the library.

### Constellation Codebreaker

Constellation Codebreaker is a ten-round archive campaign with 42
Starfield-themed entries, clue categories, signal integrity, streaks, limited
hints, and full controller navigation.

### Freedoom: Phase 1

The open-source first episode of Freedoom runs offline through a non-WebAssembly
asm.js Doom engine adapted for OSF UI. D-pad or left stick moves and turns, A
fires, X uses, LB runs, Start opens the menu, and B returns to the library.
The Doom engine is GPL-2.0 and Freedoom v0.13.0 data is BSD-3-Clause. No
commercial Doom assets are included.

### Micropolis

Build and manage a city in Starcade's adaptation of Micropolis, Electronic
Arts' 2008 open-source (GPL-3) release of the original 1989 SimCity engine and
data. Arrow keys/D-pad pan the map, and Tab or D-pad cycles every toolbar and
menu control; placing zones, roads, and other tools on the map still requires
a mouse. Starcade removes the upstream page's Twitter share widget and
30-minute donation-nag popup. No proprietary SimCity/Micropolis assets beyond
what Electronic Arts already released under GPL-3 are included.

### Hextris

A fast hexagonal block-matching puzzle game, adapted from the GPL-3.0-or-later
Hextris project as a fully offline embedded game. Starcade removes analytics,
advertising, remote score submission, injected remote scripts, remote fonts,
store links, and social-sharing behavior, and adds a restrictive Content
Security Policy blocking outbound connections.

### Mah Jong

A complete Mah Jong Solitaire game adapted from ffalt/mah, with 84 built-in
boards, 13 tile image sets, three difficulty levels, and auto-save. Mouse
selects matching tile pairs on the board itself; every menu, dialog, and
settings screen is Tab/D-pad navigable. Not yet wired into Starcade's own
leaderboard/XP system - it manages its own save/progress state internally.
MIT-licensed; no proprietary assets are included.

## External applications

### OpenMW: Morrowind

An optional card that launches the open-source OpenMW engine against a
legally installed Steam copy of The Elder Scrolls III: Morrowind, rather than
running inside the Starcade interface. Starcade's native plugin searches
registered Steam libraries (including a `C:\Steam` install) for
`Morrowind.esm` and, only when both OpenMW and real Morrowind data are found,
offers the launch. Configuration and saves are isolated under Starcade's own
user-data directory and never touch a real Starfield or Morrowind save.
**No Morrowind or other Bethesda game data is bundled with or redistributed
by Starcade** - the card does nothing without the player's own genuine
installation. OpenMW is GPL-3.0-or-later with separately identified bundled
component licenses; its exact corresponding source revision is included in
the Complete Source archive.

## Requirements

- Starfield for PC through Steam.
- Starfield Script Extender (SFSE).
- Address Library for SFSE Plugins.
- OSF UI 1.3.0 or newer with native bridge ABI 1.4 support:
  https://www.nexusmods.com/starfield/mods/17711
- Microsoft Visual C++ 2015-2022 x64 redistributable, required by the bundled
  OpenMW build (only needed to use the optional OpenMW: Morrowind card).
- A legally installed Steam copy of The Elder Scrolls III: Morrowind, only if
  you want to use the optional OpenMW: Morrowind card. Every other part of
  Starcade works without it.

These requirements are not included in the Starcade archive and retain their
own licenses, authors, support pages, and update schedules.

## Installation with Mod Organizer 2 or Vortex

1. Install SFSE, Address Library, and OSF UI first.
2. Download the Starcade OS archive.
3. Install it normally with MO2 or Vortex.
4. Enable `x2357starcade.esm` in the plugin list.
5. Launch Starfield through `sfse_loader.exe`.

The archive has a top-level `Data` folder for normal MO2/Vortex installation.
The plugin, Scripts, and SFSE folders are inside that Data folder.

Starcade registers its view automatically. Do not manually add Starcade to an
OSF UI configuration file, and do not allow another mod to overwrite OSF UI's
configuration on Starcade's behalf.

## Starting Starcade

The startup quest checks the player's inventory and silently adds one Starcade
Pad when none is present. Find **Starcade Pad** under Aid and use it to open the
arcade. The item restores itself after use and is not permanently consumed.

You can also press **F9**. The hotkey can be rebound in OSF UI settings and
remains available if the inventory item is misplaced.

## General controls

- Arrow keys / D-pad: navigate menus and most games.
- Enter / controller A: select or perform the primary action.
- Space: fire in games that use a dedicated fire control.
- Escape / controller B: return to the library or close Starcade.
- Individual controls are displayed on every library card and game screen.

## Saves and high scores

The native Starcade plugin records high scores, play counts, game saves, and
achievement state in:

`Documents/My Games/Starfield/Starcade/state.json`

Removing this file resets Starcade's stored progression. It does not alter a
Starfield save. Invalid state data is quarantined instead of being silently
overwritten.

## Game source code and modding permissions

The full editable source for all 25 original games is distributed with the mod.
Those browser games do not use hidden binaries, obfuscated bundles, downloaded
scripts, or proprietary game engines. Freedoom uses a generated asm.js engine;
its preferred C source, adaptations, build instructions, exact license texts,
and Freedoom source attribution are in the separate 1.8.0 source archive.
Micropolis, Hextris, and Mah Jong are likewise shipped as fully editable
HTML/JavaScript under the games directory, each with its own
`SOURCE-AND-LICENSES.txt` identifying exactly what Starcade changed versus
upstream; Micropolis's and Mah Jong's complete buildable TypeScript/JavaScript
source is additionally included at `Micropolis-Engine/` and `Mah-Engine/` in
the source archive. OpenMW's exact corresponding source revision is included
as `Dependencies/OpenMW-0.52.0-a042cd3-source.zip` in the source archive; no
Morrowind or other Bethesda data is included anywhere.

After installation, the game source is located under:

`SFSE/Plugins/OSFUI/views/starcade.arcade/launcher/games/`

Shared game integration code:

- `games/host.js` — score, save, achievement, exit, and input bridge.
- `games/game.css` — shared game layout and X-2357 attribution.
- `games/catalog.js` — titles, categories, entries, controls, colors, and license data.

Each game has its own folder containing:

- `index.html` — game screen and script entry point.
- `game.js` — complete gameplay, drawing, controls, scoring, and state logic.

The launcher source is also included:

- `launcher/index.html` — launcher structure.
- `launcher/style.css` — complete launcher presentation.
- `launcher/main.js` — library navigation, iframe hosting, scoring, saving, and OSF bridge behavior.
- `launcher/manifest.json` — OSF UI permissions and view metadata.

Papyrus source is included under `Scripts/Source` for the reusable pad effect
and automatic player-alias delivery script. Compiled `.pex` files are included
under `Scripts` for normal users.

All original Starcade game, launcher, and Papyrus source is copyright 2026
X-2357 and is released under the included MIT License. You may study, copy,
modify, merge, publish, and redistribute that original source, including in
other projects, provided you preserve the copyright and MIT permission notice.

When publishing a modified build, clearly identify your changes and do not
present it as an official or supported X-2357 release. “Starfield,” Bethesda
assets, SFSE, Address Library, OSF UI, CommonLibSF, spdlog, and nlohmann/json
are not relicensed by Starcade's MIT License. Follow their respective terms.

The compiled Starcade native SFSE component is licensed separately under GPLv3
or later because it uses GPL-covered CommonLibSF and the OSF UI SDK. Its C++
source, build script, SDK interface, exact dependency source, and GPL text are
provided in the separate **Starcade OS 1.8.0 Complete Source** archive intended
for the Nexus Optional Files section.

See `LICENSE-MIT.txt`, `LICENSE-GPL-3.0.txt`, and
`THIRD_PARTY_NOTICES.md` in the download for the controlling
license text and dependency notices. This description is an overview and does
not replace those files.

## Game-by-game code provenance

No implementation among the 25 original Starcade games was downloaded from
GitHub, copied from a browser-game collection, extracted from another mod, or
translated from a ROM. Those games were written specifically for this project
by X-2357. Freedoom: Phase 1 is a separately identified open-source inclusion,
not represented as original Starcade code.

Several games deliberately use familiar genre mechanics. The mechanical idea
or traditional rule set is identified below so users can understand the design
lineage without mistaking that lineage for copied code:

| Starcade game | General design lineage | Code and asset origin |
| --- | --- | --- |
| Great Serpent | Grid-based Snake genre | Independently written movement, growth, food, collision, scoring, and canvas rendering. No external Snake project used. |
| Meteor Field | Classic vector asteroid-field arcade genre | Independently written momentum, rotation, thrust, projectile, asteroid splitting, collision, and vector drawing. No external code or assets used. |
| Orbital Paddle | Traditional two-paddle ball games | Independently written paddle, ball, opponent, collision, and scoring logic. No original arcade-game source or audiovisual assets used. |
| Reactor Breaker | Brick-and-paddle arcade genre | Independently written brick grid, paddle, ball, collision, clearing, and scoring. No Breakout clone source or assets imported. |
| Minefield Protocol | Traditional neighboring-mine deduction rules | Independently written board generation, neighbor counts, recursive opening, navigation, and rendering. No Minesweeper source or graphics used. |
| Lunar Descent | Lunar-lander thrust and velocity genre | Independently written gravity, thrust, fuel, landing tolerance, terrain, scoring, and drawing. No external lander source used. |
| Memory Matrix | Traditional concentration/matching-pairs game | Independently written shuffle, selection, pair matching, timing, symbols, scoring, and canvas presentation. |
| Signal Relay | Traditional repeat-the-sequence memory game | Independently written sequence generation, playback timing, directional input, validation, scoring, and presentation. No commercial-game audiovisual material used. |
| Void Invaders | Descending-formation shooter genre | Independently written formation motion, player movement, firing, hit detection, wave behavior, and vector shapes. No Space Invaders sprites, sounds, source, or level data used. |
| Starfall Blocks | Falling-block puzzle genre | Independently written piece definitions, rotation, collision, locking, row clearing, scoring, and rendering. No Tetris source, branding, music, or assets used. |
| Docking Vector | Orbital docking and velocity matching | Original Starcade design with independently written translation physics, moving target, docking tolerance, timer, scoring, and display. |
| Space Racer | Lane-dodging endless racer genre | Original Starcade implementation with independently written steering, traffic generation, speed progression, collision, and scoring. |
| Fleet Command | Traditional hidden-grid naval guessing games | Independently written fleet placement, targeting grid, hit tracking, navigation, and scoring. No Battleship-branded code, board data, or assets used. |
| Missile Defense | Expanding-interceptor defense genre | Independently written aiming, incoming trajectories, expanding interception fields, collision, colony failure, and scoring. No Missile Command source, art, sounds, or levels used. |
| Orbital Checkers vs CPU | Standard Checkers rules | Independently written board setup, legal moves, captures, turn handling, win detection, controller navigation, and CPU move selection. |

The source files named in this table are shipped directly under each game's
folder as `game.js` and `index.html`. They are the preferred form for editing;
there is no separate hidden or generated game-code bundle.

## Compatibility

- Starcade does not replace vanilla interface files.
- Starcade does not ship an OSF UI configuration override.
- The included `.esm` is the runtime master; no editable `.esp` is installed.
- The interface is offline and the embedded games request no network access.
  The optional OpenMW: Morrowind card is the one exception to "no filesystem
  access": it reads local Steam library files to detect an existing Morrowind
  installation, and launches a separate process when you select it. It cannot
  be triggered by any embedded game, and it never writes outside Starcade's
  own user-data directory or a directory you already own.
- Mods that change unrelated Aid items should not conflict.
- Updates to Starfield, SFSE, Address Library, or OSF UI may require a matching
  Starcade native-plugin update.

## Updating

Install the newer archive over the previous Starcade version and allow its own
files to replace older Starcade files. Do not merge files from multiple
Starcade versions. Existing native state is stored outside the mod directory
and should remain available after updating.

## Uninstalling

1. Close Starfield.
2. Disable `x2357starcade.esm`.
3. Remove Starcade OS through your mod manager.
4. Optionally delete `Documents/My Games/Starfield/Starcade/state.json` to erase
   stored scores and progression.

The automatically granted pad will become unavailable when the plugin is no
longer loaded. As with any plugin removal, making a permanent save before
installation and avoiding mid-playthrough plugin removal are sensible
precautions.

## Troubleshooting

### Starcade does not open

- Confirm the game was launched through `sfse_loader.exe`.
- Confirm SFSE, Address Library, and OSF UI match the installed game version.
- Confirm `x2357starcade.esm` is enabled.
- Try the default F9 hotkey.

### The Starcade Pad is missing

- Load the save once with the plugin enabled and wait several seconds.
- Confirm the startup quest exists by checking that the correct `.esm` is active.
- F9 remains available as a fallback.

### A game opens but input controls Starfield

- Update OSF UI.
- Check for another UI mod overriding OSF input behavior.
- Include the OSF UI log when reporting the problem.

### Scores do not persist

- Check that `Documents/My Games/Starfield/Starcade` is writable.
- Temporarily move a damaged `state.json` and allow Starcade to create a new one.
- Check security software or controlled-folder-access restrictions.

## Bug reports

Please include:

- Starfield runtime version.
- SFSE version.
- Address Library version.
- OSF UI version.
- Mod manager and profile used.
- Keyboard or controller model.
- The exact game and steps that reproduce the issue.
- `Documents/My Games/Starfield/SFSE/Logs/Starcade.log`, when present.
- The OSF UI log.

## Credits

- **X-2357** — Starcade concept, design, launcher, native integration, Papyrus integration, and all twenty-five original Starcade games.
- **Freedoom contributors** — Freedoom: Phase 1 v0.13.0 game data (BSD-3-Clause).
- **id Software, DoomGeneric contributors, and ading2210** — GPL-2.0 Doom engine lineage and asm.js port basis.
- **Graeme McCutcheon** — micropolisJS, the HTML5/JavaScript port of Micropolis that Starcade adapts.
- **Electronic Arts and Maxis, and Will Wright** — the original SimCity engine and data, released as open-source Micropolis under GPL-3 in 2008.
- **Micropolis GmbH (Micropolis Corporation)** — the Micropolis name, licensed as a courtesy under the Micropolis Public Name License.
- **Hextris contributors** — the GPL-3.0-or-later Hextris game that Starcade adapts.
- **ffalt and contributors** — the MIT-licensed Mah Jong Solitaire game that Starcade adapts.
- **OpenMW contributors** — the GPL-3.0-or-later OpenMW engine that Starcade's OpenMW: Morrowind card launches.
- **ozooma10** — OSF UI and its public native/web integration framework.
- **SFSE team** — Starfield Script Extender.
- **CommonLibSF contributors** — native Starfield plugin framework.
- **spdlog contributors** — native logging library.
- **Niels Lohmann and contributors** — nlohmann/json.
- **Bethesda Game Studios** — Starfield and the Creation Kit.

## License summary

Starcade's original web games, launcher, and Papyrus source are provided under
the MIT License with no warranty. The adapted Mah Jong component is also MIT.
The native SFSE plugin and the adapted Micropolis, Hextris, and OpenMW
components are GPLv3-or-later (Micropolis additionally carries the separate
Micropolis Public Name License for its name). Full license texts are included.
Dependency and platform notices are in `THIRD_PARTY_NOTICES.md`. All game
source is included in the main mod; complete native and dependency source,
including Micropolis's, Mah Jong's, and OpenMW's exact corresponding source,
is supplied as a separate source archive on the same Nexus page.
