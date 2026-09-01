# Building Starcade OS from source

This repository contains the complete corresponding source for Starcade OS: the native SFSE plugin, Papyrus scripts, the web-based game launcher, and the adapted open-source game engines it bundles.

## Native plugin (`Starcade.dll`)

Prerequisites:
- Visual Studio 2022 Build Tools, C++ desktop development workload
- [xmake](https://xmake.io/)

The native build depends on [osf-ui](https://github.com/ozooma10/osf-ui) as a **sibling checkout** (this repo's `Native/xmake.lua` references it via a relative `../osf-ui` path) - it is not vendored into this repository since it's a separate third-party project with its own license and release cycle.

```
# From the parent directory that contains this repo's own folder:
git clone https://github.com/ozooma10/osf-ui.git
cd osf-ui
git submodule update --init --recursive
cd ..

# Then, from this repo's Native/ folder:
cd "starcade-os/Native"
xmake f -p windows -a x64 -y
xmake
```

This produces `Native/build/windows/x64/releasedbg/Starcade.dll`. Must be run from PowerShell, not Git Bash - Git Bash's bundled MinGW gets auto-detected instead of MSVC otherwise.

## Papyrus scripts

Source is at `Web-and-Papyrus/Source/*.psc`. Compile with Starfield Creation Kit's PapyrusCompiler against Starfield's own script source/import folders. **Note:** this repository does not include the compiled `.pex` files or the `x2357starcade.esm` plugin - those ship only in the installable release archive on the mod page, since they're build outputs rather than source.

## Web launcher and games

The launcher shell (`Web-and-Papyrus/starcade.arcade/launcher/index.html`/`main.js`/`style.css`) and Starcade's ~25 original games are plain HTML/JS/CSS - no build step, used as-is.

The adapted third-party engines each have their own toolchain and are vendored with their already-built output committed directly under `Web-and-Papyrus/starcade.arcade/launcher/games/<name>/`, so rebuilding them isn't required to verify or run Starcade itself. To rebuild one from source, see that engine's own folder and its `README.md`/`SOURCE-AND-LICENSES.txt`:
- `Freedoom-Engine/` (asm.js, DoomGeneric-derived)
- `Micropolis-Engine/` (webpack)
- `Mah-Engine/` (Angular CLI)
- `Billiards-Engine/` (yarn/webpack)

## Validating a build

```
npm install
tools/validate.ps1
node tests/ui-audit.mjs
```

`tools/validate.ps1` checks catalog integrity and JS syntax; `tests/ui-audit.mjs` headlessly loads every game and checks for console/page errors (starts its own local HTTP server - do not test over a raw `file://` URL, ES-module games will fail to load under Chromium's opaque-origin restriction).
