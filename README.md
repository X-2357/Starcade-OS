# Starcade OS 1.9.5

Starcade OS is a portable, controller-friendly arcade, strategy library, and casino for Starfield. Use the automatically granted Starcade Pad or the configurable OSF UI hotkey to open the local game library. Version 1.9 adds optional looping 8-bit background music to the library screen (off by default; toggle, next/previous, and a volume slider are in the top bar) - drop your own `.mp3` files into the game's `audio/music/` folder and they play automatically, no editing required. Also makes OpenMW/Morrowind launch fullscreen by default and fixes Micropolis's "Play!" button not responding in some setups. 1.9.3 fixes a real Hextris rendering bug, gives Settled Systems Dice actual visual dice instead of plain numbers, and closes a Space Racer exploit that let the ship dodge every hazard by sitting between lanes. 1.9.4 is a small polish pass: a bigger volume slider and a corrected version display. 1.9.5 reskins the reusable Starcade Pad as a wrist-worn watch.

## Included games

Great Serpent, Meteor Field, Orbital Paddle, Reactor Breaker, Minefield Protocol, Lunar Descent, Memory Matrix, Signal Relay, Void Invaders, Starfall Blocks, Docking Vector, Space Racer, Fleet Command, Missile Defense, Orbital Checkers vs CPU, Galactic Chess vs CPU, Red Mile Blackjack, UC Video Poker, Red Mile Hold 'Em, Orbital Roulette, Neon Constellation Slots, Settled Systems Dice, Celestial High / Low, Red Mile Racing Book, Constellation Codebreaker, Freedoom: Phase 1, Micropolis, Hextris, Mah Jong, Quadrilactic, Clumsy Bird, and Billiards.

The OpenMW card launches the bundled GPL OpenMW engine using an existing legal Morrowind installation. Starcade searches registered Steam libraries and `C:\Steam`; Morrowind assets are never copied into or redistributed with Starcade.

## Requirements

- Starfield for PC (Steam)
- Starfield Script Extender (SFSE)
- Address Library for SFSE Plugins
- OSF UI 1.3.0 or newer with native bridge ABI 1.4 support
- Microsoft Visual C++ 2015-2022 x64 runtime for bundled OpenMW

## Installation

Install the ZIP with Mod Organizer 2 or Vortex and enable `x2357starcade.esm`. Launch Starfield through `sfse_loader.exe`. Replace older Starcade versions; do not enable multiple Starcade packages together.

The native plugin registers Starcade with OSF UI automatically. Do not add a manual Starcade configuration entry or overwrite OSF UI's configuration.

## Use and safety

- Use the automatically granted **Starcade Pad** under Aid, or use the configurable OSF UI hotkey (F9 by default).
- Arrow keys/D-pad navigate, Enter/A selects, and Escape/B returns.
- The Starfield world remains simulated while Starcade is open. Play in a safe location.
- OSF UI captures gameplay input only while the Starcade view is open so actions do not fire behind the interface.
- Starcade does not call Papyrus player-control locking functions.
- Casino games use the player's real in-game credits. Leaving an unfinished round automatically refunds its active stake.

High scores, recent runs, play counts, saves, and achievements are stored in `Documents/My Games/Starfield/Starcade/state.json`.

## Updating from 1.2

Close Starfield before updating so `Starcade.dll` can be replaced. Install 1.3 over 1.2 or remove the old package first. The plugin filename and saved state location remain unchanged.

## Credits and licenses

- OSF UI and its public bridge API by ozooma10.
- Starcade OS concept, integration, and all 25 original game implementations by X-2357.
- Freedoom: Phase 1 data is BSD-3-Clause; its Doom engine port is GPL-2.0. Full notices and corresponding source are supplied.
- Hextris and Starcade's offline modifications are GPL-3.0-or-later; editable source is included with the runtime.
- Mah Jong is MIT-licensed (ffalt/mah); editable source is included with the runtime.
- Quadrilactic is Apache-2.0-licensed (bencoveney/quadrilactic); editable source is included with the runtime.
- Clumsy Bird is GPL-3.0-licensed (ellisonleao/clumsy-bird); editable source is included with the runtime.
- Billiards is GPL-3.0-licensed (tailuge/billiards), with four upstream online features disabled for offline compliance; editable source is included with the runtime.
- OpenMW is GPL-3.0-or-later with separately licensed components. The exact corresponding source revision is included in the Complete Source archive.

All editable HTML/JavaScript game source is included. See `THIRD_PARTY_NOTICES.md`, the license files, and the separate 1.7.3 corresponding-source archive.
