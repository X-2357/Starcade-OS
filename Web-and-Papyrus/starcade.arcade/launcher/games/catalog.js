"use strict";

const originalLicense = "Original Starcade game - released under the Starcade OS MIT License";

window.STARCADE_GAMES = [
  {
    id: "xeno-serpent", title: "Great Serpent", category: "arcade",
    description: "Guide the Great Serpent through the stars and consume the light of creation.",
    entry: "games/xeno-serpent/index.html", controls: "Arrow keys / D-pad",
    color: "#8df7c7", license: originalLicense
  },
  {
    id: "meteor-field", title: "Meteor Field", category: "arcade",
    description: "Survive a dense debris belt in a responsive vector spacecraft.",
    entry: "games/meteor-field/index.html", controls: "Arrows + Space / controller",
    color: "#7dc7ff", license: originalLicense
  },
  {
    id: "orbital-paddle", title: "Orbital Paddle", category: "arcade",
    description: "Defend the orbital relay in a high-speed paddle duel.",
    entry: "games/orbital-paddle/index.html", controls: "Up / Down - A to launch",
    color: "#c58cff", license: originalLicense
  },
  {
    id: "reactor-breaker", title: "Reactor Breaker", category: "arcade",
    description: "Clear unstable reactor cells before containment collapses.",
    entry: "games/reactor-breaker/index.html", controls: "Left / Right - A to launch",
    color: "#ff8d72", license: originalLicense
  },
  {
    id: "minefield-protocol", title: "Minefield Protocol", category: "puzzle",
    description: "Chart a safe route through a concealed orbital minefield.",
    entry: "games/minefield-protocol/index.html", controls: "D-pad - A to scan",
    color: "#f5e27b", license: originalLicense
  },
  {
    id: "lunar-descent", title: "Lunar Descent", category: "strategy",
    description: "Land a fragile survey craft using limited propellant.",
    entry: "games/lunar-descent/index.html", controls: "Left / Right - Up thrust",
    color: "#a8b9ff", license: originalLicense
  },
  {
    id: "memory-matrix", title: "Memory Matrix", category: "puzzle",
    description: "Restore corrupted navigation pairs in the ship memory core.",
    entry: "games/memory-matrix/index.html", controls: "D-pad - A select",
    color: "#ff9fc8", license: originalLicense
  },
  {
    id: "signal-relay", title: "Signal Relay", category: "puzzle",
    description: "Decode and repeat an increasingly complex alien transmission.",
    entry: "games/signal-relay/index.html", controls: "D-pad sequence - A to start",
    color: "#69e2ff", license: originalLicense
  },
  {
    id: "void-invaders", title: "Void Invaders", category: "arcade",
    description: "Defend the settled systems from descending formations of hostile craft.",
    entry: "games/void-invaders/index.html", controls: "Left / Right - A to fire",
    color: "#ff786f", license: originalLicense
  },
  {
    id: "starfall-blocks", title: "Starfall Blocks", category: "puzzle",
    description: "Stabilize falling cargo formations before the hold is overwhelmed.",
    entry: "games/starfall-blocks/index.html", controls: "D-pad move and rotate",
    color: "#b18cff", license: originalLicense
  },
  {
    id: "docking-vector", title: "Docking Vector", category: "strategy",
    description: "Match velocity and alignment with a moving orbital docking collar.",
    entry: "games/docking-vector/index.html", controls: "D-pad translation",
    color: "#75e0b7", license: originalLicense
  },
  {
    id:"space-racer",title:"Space Racer",category:"arcade",description:"Thread a high-speed ship through increasingly dangerous traffic.",entry:"games/space-racer/index.html",controls:"Left / Right",color:"#56c8ff",license:originalLicense
  },
  {
    id:"fleet-command",title:"Fleet Command",category:"strategy",description:"Complete a five-operation campaign using limited tactical sonar.",entry:"games/fleet-command/index.html",controls:"D-pad - A fire - X sonar",color:"#ff765f",license:originalLicense
  },
  {
    id:"missile-defense",title:"Missile Defense",category:"arcade",description:"Intercept incoming warheads before they reach the colony.",entry:"games/missile-defense/index.html",controls:"D-pad aim - A fire",color:"#ff8d72",license:originalLicense
  },
  {
    id:"checkers",title:"Orbital Checkers vs CPU",category:"strategy",description:"Play a complete tactical match against the Starcade computer.",entry:"games/checkers/index.html",controls:"D-pad - A select",color:"#e88c78",license:originalLicense
  },
  {
    id:"blackjack",title:"Red Mile Blackjack",category:"casino",description:"Play a six-deck table with surrender, five-card Charlie, and session records.",entry:"games/blackjack/index.html",controls:"D-pad - A select",color:"#d9ad5b",license:originalLicense
  },
  {id:"video-poker",title:"UC Video Poker",category:"casino",description:"Play Jacks-or-Better with a transparent table and optional hold advisor.",entry:"games/video-poker/index.html",controls:"D-pad card - A hold - X hint - Y draw",color:"#f2d28b",license:originalLicense},
  {id:"five-card-draw",title:"Red Mile Hold 'Em",category:"casino",description:"Play staged community-card poker against a betting Starcade CPU.",entry:"games/five-card-draw/index.html",controls:"Check / call, raise, or fold",color:"#d7a5ff",license:originalLicense},
  {id:"roulette",title:"Orbital Roulette",category:"casino",description:"Bet even-money, dozens, or exact numbers on an animated single-zero wheel.",entry:"games/roulette/index.html",controls:"Select wager - A spin",color:"#ff786f",license:originalLicense},
  {id:"slots",title:"Neon Constellation Slots",category:"casino",description:"Spin weighted virtual reels with wilds and a constellation bonus.",entry:"games/slots/index.html",controls:"Select wager - A spin",color:"#ffd66b",license:originalLicense},
  {id:"casino-dice",title:"Settled Systems Dice",category:"casino",description:"Play multi-roll pass line or clearly published single-roll contracts.",entry:"games/casino-dice/index.html",controls:"Select contract - A roll",color:"#87d9ff",license:originalLicense},
  {id:"high-low",title:"Celestial High / Low",category:"casino",description:"Build a risk-priced prediction streak, then cash out before it breaks.",entry:"games/high-low/index.html",controls:"Choose direction or cash out",color:"#8df7c7",license:originalLicense},
  {id:"red-mile-bets",title:"Red Mile Racing Book",category:"casino",description:"Back runners with distinct pace, stamina, and surge profiles.",entry:"games/red-mile-bets/index.html",controls:"Select runner - A bet",color:"#ef8b62",license:originalLicense},
  {id:"galactic-chess",title:"Galactic Chess vs CPU",category:"strategy",description:"Play White against a tactical Starcade chess opponent.",entry:"games/galactic-chess/index.html",controls:"D-pad - A select",color:"#c9b98a",license:originalLicense},
  {id:"constellation-codebreaker",title:"Constellation Codebreaker",category:"puzzle",description:"Decode people, places, technology, and threats from the Constellation archive.",entry:"games/constellation-codebreaker/index.html",controls:"D-pad - A decode - X clue",color:"#efc870",license:originalLicense},
  {id:"freedoom",title:"Freedoom: Phase 1",category:"arcade",description:"Play the complete Freedoom: Phase 1 campaign through Starcade's JavaScript-only Doom engine port.",entry:"games/freedoom/index.html",controls:"D-pad move - A fire - X use - LB run - Start menu",color:"#8df7c7",license:"DoomGeneric/Doom engine and Starcade asm.js changes: GPL-2.0. Freedoom: Phase 1 v0.13.0 game data: BSD-3-Clause. No proprietary Doom WAD, code, art, music, or other commercial Doom assets are included."
  },
  {id:"micropolis",title:"Micropolis",category:"strategy",description:"Build and manage a city in Starcade's port of Micropolis, Electronic Arts' open-source release of the original SimCity engine.",entry:"games/micropolis/index.html",controls:"Arrow keys pan the map - Tab/D-pad cycles menus and tools - mouse required to place zones and roads",color:"#f0b429",license:"GPLv3 with additional terms (code by Graeme McCutcheon, based on Electronic Arts' 2008 GPL-3 release of the original SimCity engine and data). The name \"Micropolis\" is used under the Micropolis Public Name License (Micropolis GmbH), included alongside. No proprietary SimCity/Micropolis assets beyond what Electronic Arts already released under GPL-3 are included."
  },
  {id:"hextris",title:"Hextris",category:"puzzle",description:"Rotate a six-sided core, match colors, and keep the reactor from overflowing.",entry:"games/hextris/index.html",controls:"Left / Right rotate - Down accelerates - A starts - X pauses",color:"#3498db",license:"Hextris and Starcade modifications: GNU GPL version 3 or later. Bundled third-party JavaScript and fonts retain their embedded permissive notices. All network-facing features are removed."},
  {id:"openmw",title:"OpenMW: Morrowind",category:"strategy",description:"Launch OpenMW using a legally installed Steam copy of The Elder Scrolls III: Morrowind.",external:"openmw",controls:"A launches detected installation - play in the OpenMW window",color:"#c8a76a",license:"OpenMW engine: GPL-3.0-or-later with separately identified bundled components. Morrowind game data is not included; Starcade only detects a user-owned Steam installation."},
  {id:"mahjong",title:"Mah Jong",category:"puzzle",description:"Clear a tiled board of matching pairs in Starcade's port of the open-source Mah Jong Solitaire game.",entry:"games/mahjong/index.html",controls:"Mouse selects matching tile pairs - Tab/D-pad navigates menus - Escape/B exits dialogs",color:"#9fd8cb",license:"MIT License (Copyright (c) 2016 ffalt). No proprietary assets are included; the upstream project describes itself as completely free, with no ads, tracking, or cloud dependency."},
  {id:"quadrilactic",title:"Quadrilactic",category:"arcade",description:"Bounce a character upward through procedurally generated platforms in this fast-paced HTML5 Canvas climber.",entry:"games/quadrilactic/index.html",controls:"A/D or Left/Right to move, W/Space/Up to jump, Enter/E to start",color:"#e0668c",license:"Apache License 2.0 (Ben Coveney)."},
  {id:"clumsy-bird",title:"Clumsy Bird",category:"arcade",description:"A Flappy Bird-style melonJS clone where tapping keeps a clumsy bird aloft between scrolling pipes.",entry:"games/clumsy-bird/index.html",controls:"Space or click flaps",color:"#f4b942",license:"Clumsy Bird and Starcade modifications: GNU GPL v3.0. No network calls; all assets are original to the upstream project."},
  {id:"billiards",title:"Billiards",category:"strategy",description:"Practice 9-ball in Starcade's port of an open-source 3D pool physics simulator, with several rack layouts to try.",entry:"games/billiards/practice.html",controls:"Mouse aims and strikes the cue ball",color:"#4a7c59",license:"GNU GPL version 3 (tailuge). Starcade disables the upstream project's online multiplayer, score-reporting, usage-tracking, and URL-shortening network calls; no physics or gameplay code was changed."}
];

const sourceOrigins = {
  "xeno-serpent": "Original X-2357 implementation inspired by the familiar grid-based Snake genre; no external Snake source code was copied.",
  "meteor-field": "Original X-2357 vector-physics implementation inspired by classic asteroid-field arcade mechanics; no external game code or assets were copied.",
  "orbital-paddle": "Original X-2357 implementation based on the general two-paddle ball-game concept popularized by early arcade games; all code and presentation were written for Starcade.",
  "reactor-breaker": "Original X-2357 implementation based on the general brick-and-paddle arcade genre; no Breakout clone or third-party source was imported.",
  "minefield-protocol": "Original X-2357 implementation of the familiar neighboring-mine deduction rules; no Minesweeper source, graphics, or assets were copied.",
  "lunar-descent": "Original X-2357 implementation inspired by the general lunar-lander thrust-and-velocity genre; physics, scoring, and drawing code were written for Starcade.",
  "memory-matrix": "Original X-2357 implementation of the traditional concentration/matching-pairs concept; symbols, interface logic, and scoring were created for Starcade.",
  "signal-relay": "Original X-2357 implementation of the traditional repeat-the-sequence memory-game concept; no commercial sequence-game code or audiovisual assets were used.",
  "void-invaders": "Original X-2357 implementation inspired by the general descending-formation shooter genre; no Space Invaders source, sprites, audio, or level data were copied.",
  "starfall-blocks": "Original X-2357 falling-block implementation using independently written movement, rotation, collision, row-clear, and scoring code; no Tetris source or assets were copied.",
  "docking-vector": "Original X-2357 orbital-position and velocity-matching game designed specifically for Starcade.",
  "space-racer": "Original X-2357 lane-dodging racer designed specifically for Starcade using independently written spawning, collision, and speed-progression logic.",
  "fleet-command": "Original X-2357 hidden-grid targeting game inspired by traditional naval guessing games; no Battleship-branded code, board data, or assets were used.",
  "missile-defense": "Original X-2357 implementation inspired by the general expanding-interceptor defense genre; no Missile Command source, art, audio, or level data were copied.",
  "checkers": "Original X-2357 implementation of standard Checkers movement and capture rules with a custom CPU opponent that prioritizes legal captures.",
  "blackjack": "Original X-2357 implementation of standard casino Blackjack rules, dealer behavior, hand valuation, and Starfield-credit wagering; no third-party game code or assets were used.",
  "video-poker": "Original X-2357 implementation of familiar five-card video-poker rules and an independently authored payout table.",
  "five-card-draw": "Original X-2357 Texas Hold 'Em implementation with independently written seven-card hand evaluation, staged community cards, and CPU betting logic.",
  "roulette": "Original X-2357 implementation of public-domain single-zero roulette rules using only independently written code and presentation.",
  "slots": "Original X-2357 three-reel probability and payout implementation; no commercial machine code, artwork, sounds, or branding were used.",
  "casino-dice": "Original X-2357 implementation of traditional two-die over, under, and seven wagers.",
  "high-low": "Original X-2357 implementation of the traditional higher-or-lower card prediction concept.",
  "red-mile-bets": "Original X-2357 fictional race simulation, runner names, odds, visuals, and wagering logic designed for Starcade.",
  "galactic-chess": "Original X-2357 implementation of traditional chess movement concepts with independently written CPU move evaluation and Galactic presentation.",
  "constellation-codebreaker": "Original X-2357 word deduction implementation and original Starfield-themed clue set. Talha Bin Yousaf's MIT-licensed Hangman example was reviewed as a genre reference.",
  "freedoom": "GPL-2.0 DoomGeneric engine adapted from ading2210/DoomPDF's non-WebAssembly Emscripten fastcomp port. Starcade replaces the PDF renderer/input with an opaque RGBA Canvas 2D framebuffer and keyboard/controller input, and embeds BSD-3-Clause Freedoom: Phase 1 v0.13.0.",
  "micropolis": "graememcc/micropolisJS, an independent HTML5/JavaScript port of Micropolis (Electronic Arts' 2008 GPL-3 open-source release of the original SimCity engine and data). Starcade removes the upstream Twitter-widget network call and 30-minute donation-nag popup and adds the shared Starcade host/input bridge; no gameplay code was changed.",
  "hextris": "Hextris by Logan Engstrom, Garrett Finucane, Noah Moroze, Michael Yang, and contributors. Starcade removes all network-facing features and adds a local host bridge without changing core gameplay.",
  "openmw": "Optional external launcher for an independently installed OpenMW engine and the user's legally installed Morrowind data; neither OpenMW nor Morrowind data is bundled in Starcade.",
  "mahjong": "ffalt/mah, an independent MIT-licensed Angular Mah Jong Solitaire implementation. Starcade adds the shared Starcade host/input bridge; no gameplay code was changed.",
  "quadrilactic": "bencoveney/quadrilactic, an independent Apache-2.0-licensed TypeScript/Canvas arcade game. Starcade adds the shared host/input bridge and removes two Google Fonts network requests for offline compliance; no gameplay code was changed.",
  "clumsy-bird": "ellisonleao/clumsy-bird, an independent GPL-3.0 Flappy Bird-style clone built on the melonJS engine. Starcade adds the shared Starcade host/input bridge; no gameplay, art, or audio was changed.",
  "billiards": "tailuge/billiards, an independent GPL-3.0 3D pool/billiards physics simulator. Starcade disables four upstream network call sites (usage tracking, online score reporting, URL shortening) that conflict with Starcade's offline design, and adds the shared host/input bridge; no physics or rendering code was changed."
};

window.STARCADE_GAMES.forEach((game) => {
  game.origin = sourceOrigins[game.id];
  game.source = game.id === "freedoom"
    ? "Complete corresponding source is supplied in the separate Starcade Freedoom asm.js source archive; runtime notices and upstream attribution are in games/freedoom/SOURCE-AND-LICENSES.txt."
    : game.id === "micropolis"
    ? "Complete corresponding source (including Starcade's two small changes) is in Micropolis-Engine/ at the Complete Source archive root; runtime notices and upstream attribution are in games/micropolis/SOURCE-AND-LICENSES.txt."
    : game.id === "hextris"
    ? "Complete editable corresponding source and runtime notices are included in games/hextris/."
    : game.id === "openmw"
    ? "Starcade's GPL native launcher source is included in Native/src/main.cpp. OpenMW is not redistributed; obtain its source and binaries from https://openmw.org/."
    : game.id === "mahjong"
    ? "Complete corresponding source (including Starcade's one small change) is in Mah-Engine/ at the Complete Source archive root; runtime notices and upstream attribution are in games/mahjong/SOURCE-AND-LICENSES.txt."
    : game.id === "quadrilactic"
    ? "Complete corresponding source is public upstream at https://github.com/bencoveney/quadrilactic under Apache 2.0; runtime notices are in games/quadrilactic/SOURCE-AND-LICENSES.txt."
    : game.id === "clumsy-bird"
    ? "Complete editable corresponding source and runtime notices are included in games/clumsy-bird/."
    : game.id === "billiards"
    ? "Complete corresponding source (including Starcade's four network-disabling changes) is in Billiards-Engine/ at the Complete Source archive root; runtime notices are in games/billiards/SOURCE-AND-LICENSES.txt."
    : `SFSE/Plugins/OSFUI/views/starcade.arcade/launcher/${game.entry.replace("index.html", "game.js")}`;
});
