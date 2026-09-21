# Third-party notices and component licensing

Starcade OS is a combined distribution containing separately identifiable
components. Receiving the archive does not relicense third-party software or
Bethesda content.

## Starcade web games, launcher, and Papyrus

Copyright (c) 2026 X-2357. These original source components are licensed under
the MIT License in `LICENSE-MIT.txt` (also provided as `LICENSE`). Every game is
distributed in editable HTML/JavaScript form under the OSF UI views directory.

## Starcade native SFSE plugin

`SFSE/Plugins/Starcade.dll` and Starcade's corresponding native C++ source are
distributed under GNU GPL version 3 or, at your option, any later version. The
controlling text is included as `LICENSE-GPL-3.0.txt`. This licensing reflects
the native component's use of GPL-covered CommonLibSF and the OSF UI SDK.

## CommonLibSF and commonlib-shared

Starcade's native plugin is built using CommonLibSF and commonlib-shared. The
local source revision used for the release identifies these components under
GNU GPL version 3. Their source and license are included in the separate
Starcade source archive distributed alongside the main Nexus download.

## OSF UI

Starcade requires OSF UI but does not redistribute the OSF UI runtime. The
native source uses the public `OSFUI_API.h` interface. OSF UI is authored by
ozooma10 and is available separately at:

https://www.nexusmods.com/starfield/mods/17711

OSF UI's source distribution and license remain controlling for its code.

## Micropolis

`games/micropolis/` is Starcade's adaptation of `graememcc/micropolisJS`, an
independent HTML5/JavaScript port of Micropolis - Electronic Arts' January 2008
GNU GPL version 3 release of the original 1989 SimCity engine and data (donated
for the One Laptop Per Child project). The port's own source is licensed GPLv3
with additional terms; controlling text is included as `LICENSE`/`COPYING`
inside `games/micropolis/`. The name "Micropolis" is a registered trademark of
Micropolis GmbH (Micropolis Corporation) and is used under the separate
Micropolis Public Name License, also included alongside
(`MicropolisPublicNameLicense.md`). Starcade's specific changes (a removed
network-calling widget, a removed donation-popup timer, one rendering fix, and
the added Starcade host/input bridge) are documented in
`games/micropolis/SOURCE-AND-LICENSES.txt`; the complete buildable source
(unmodified upstream plus Starcade's changes) is included in this archive at
`Micropolis-Engine/`. Upstream project:

https://github.com/graememcc/micropolisJS

## Mah Jong

`games/mahjong/` is Starcade's adaptation of `ffalt/mah`, an independent
open-source Mah Jong Solitaire implementation. The upstream project describes
itself as "Completely free. No ads. No tracking. No cloud." and is licensed
under the MIT License (Copyright (c) 2016 ffalt) - see `LICENSE` inside
`games/mahjong/`. Art, background, sound, icon, and font provenance is
itemized by the upstream project itself; see the per-asset `README.md` files
under `Mah-Engine/src/` in the source archive. Starcade's only change is
adding the shared Starcade host/input bridge (`host.js`, `starcade-bridge.js`)
- no gameplay code was changed. The complete buildable Angular/TypeScript
source is included in this archive at `Mah-Engine/`. Upstream project:

https://github.com/ffalt/mah

## Quadrilactic

`games/quadrilactic/` adapts `bencoveney/quadrilactic` (Apache License 2.0).
Starcade adds the shared host/input bridge and removes two Google Fonts
`<link>` tags (a real network request) for offline compliance. Upstream:
https://github.com/bencoveney/quadrilactic

## Clumsy Bird

`games/clumsy-bird/` adapts `ellisonleao/clumsy-bird` (GNU GPL v3.0), a
Flappy-Bird-style clone built on the melonJS engine. Starcade adds the shared
host/input bridge; no gameplay, art, or audio was changed. Upstream:
https://github.com/ellisonleao/clumsy-bird

## Billiards

`games/billiards/` adapts `tailuge/billiards` (GNU GPL v3.0), a 3D pool
physics simulator. The upstream project has real online features (a
multiplayer lobby, online score submission, URL shortening, and an automatic
usage-tracking ping) that conflict with Starcade's offline design; all four
network call sites were disabled at the source level before building - see
`games/billiards/SOURCE-AND-LICENSES.txt` for the exact changes. The complete
buildable source is included at `Billiards-Engine/`. Upstream:
https://github.com/tailuge/billiards

## Background music

`SFSE/Plugins/OSFUI/views/starcade.arcade/launcher/audio/music/` contains 28
royalty-free 8-bit/chiptune tracks sourced from Pixabay, played as optional
looping background music on the library screen. Licensed under the Pixabay
Content License (https://pixabay.com/service/terms/): free for personal and
commercial use, no attribution legally required. Full per-track attribution,
the exact controlling license terms, and the "Standalone use" analysis for
why bundling these tracks as background music in a larger mod is permitted
are in `audio/music/SOURCE-AND-LICENSES.txt`.

## nlohmann/json

The native component uses nlohmann/json by Niels Lohmann and contributors,
distributed under the MIT License. Project source and license:

https://github.com/nlohmann/json

## spdlog

The native component uses spdlog, distributed under the MIT License. Project
source and license:

https://github.com/gabime/spdlog

## SFSE and Address Library

Starfield Script Extender and Address Library are required external projects.
They are not redistributed in the Starcade runtime archive and retain their
own copyright, licensing, authorship, and support terms.

## Bethesda Game Studios

Starfield, the Starfield Creation Kit, Papyrus, and all Bethesda names and
assets are property of their respective rights holders. Starcade is an
unofficial fan-made mod and is not endorsed by Bethesda Softworks or Bethesda
Game Studios.

## Game-code provenance

All shipped Starcade mini-game implementations were independently written for
Starcade OS except the separately identified GPL/BSD Freedoom application.
They use familiar rules or genre mechanics documented per game in
`NEXUS_DESCRIPTION.md`; no ROMs, commercial source code, copied sprites, music,
fonts, proprietary level data, or remote scripts are included.

## HTML/CSS/JavaScript Games reference collection

During development of the 1.7 expansion, X-2357 reviewed the MIT-licensed
`he-is-talha/html-css-javascript-games` collection by Talha Bin Yousaf as a
reference for common browser-game interaction patterns. The shipped Starcade
implementations use original code, Starfield-themed names, interfaces, level
logic, and canvas art. The upstream repository and its MIT license are retained
in the complete source archive for transparent provenance:

https://github.com/he-is-talha/html-css-javascript-games

## Hextris

Hextris is copyright its contributors, including Logan Engstrom, Garrett
Finucane, Noah Moroze, and Michael Yang, and is distributed under GNU GPL
version 3 or later. Starcade removes advertising, analytics, remote scripts,
the score beacon, store links, and social sharing, and adds an offline host
bridge. The editable modified source, upstream GPL text, and embedded
third-party notices are in `games/hextris/`.

Upstream: https://github.com/Hextris/hextris

## OpenMW

Starcade includes the 64-bit Windows OpenMW 0.52.0 development build from
commit `a042cd34d832625d251ddaf2ca730ad80dc7eff4`. OpenMW is distributed under
GNU GPL version 3 with separately identified component, font, and resource
licenses retained in its runtime tree. Exact corresponding source is supplied
as `Dependencies/OpenMW-0.52.0-a042cd3-source.zip` in the Starcade Complete
Source archive.

OpenMW contains no Morrowind game data. Starcade only supplies a local launcher
that detects a user's legal Steam installation and passes its Data Files path
to OpenMW. Bethesda/ZeniMax/Microsoft game assets are not redistributed.

Upstream: https://github.com/OpenMW/openmw
