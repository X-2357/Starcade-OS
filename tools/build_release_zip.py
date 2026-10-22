#!/usr/bin/env python3
"""Build the Starcade OS MO2/Vortex runtime zip from a tested MO2 install folder.

The runtime archive is not buildable from the git repo alone (the compiled
Starcade.dll, .pex scripts, .esm and the bundled OpenMW files are not tracked),
so the tested install folder is the source of truth for those, and the repo
supplies the documentation and the few files that must be current.

Rules (each one cost real time when broken, see CLAUDE.md 2026-09-15):
  * the zip's ONLY top-level entry is Data/
  * forward-slash entry names (Python zipfile, never a Windows archiver)
  * no meta.ini (it leaks the author's local path), no loose docs beside Data/
  * nothing Starcade does not own (no AISS seed, no saved game state)

Usage:
  python tools/build_release_zip.py --install <MO2 mod folder> --out <zip path>
"""
import argparse
import hashlib
import os
import sys
import zipfile

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VIEW = 'SFSE/Plugins/OSFUI/views/starcade.arcade/'

# Files taken from the repo instead of the install folder: (zip-relative path, repo path)
OVERRIDES = {
    VIEW + 'launcher/index.html': 'Web-and-Papyrus/starcade.arcade/launcher/index.html',
    VIEW + 'launcher/audio/music/SOURCE-AND-LICENSES.txt':
        'Web-and-Papyrus/starcade.arcade/launcher/audio/music/SOURCE-AND-LICENSES.txt',
}

# Loose files at the install root: not shipped beside Data/. Documentation goes
# inside Data/ (AISS convention); meta.ini is dropped entirely.
ROOT_DOCS = ['CHANGELOG.md', 'README.md', 'THIRD_PARTY_NOTICES.md', 'LICENSE',
             'LICENSE-GPL-3.0.txt', 'LICENSE-MIT.txt', 'LICENSE-REFERENCE-HTML-GAMES-MIT.txt']
DOCS_DIR = 'SFSE/Plugins/Starcade/Docs/'
DROP_ROOT = {'meta.ini'}

# Byte-identical duplicate download that was excluded on purpose (see CHANGELOG).
DUPLICATE = VIEW + 'launcher/audio/music/enlia-cozy-cyberpunk-8bit-music-571630(1).mp3'
KEEP_OF_DUPLICATE = VIEW + 'launcher/audio/music/enlia-cozy-cyberpunk-8bit-music-571630.mp3'

FORBIDDEN_NAMES = ('starcade.ini', 'meta.ini')
STORED_EXT = ('.mp3', '.png', '.jpg', '.jpeg', '.zip')


def sha(path):
    m = hashlib.sha256()
    with open(path, 'rb') as f:
        for block in iter(lambda: f.read(1 << 20), b''):
            m.update(block)
    return m.hexdigest()


def collect(install):
    entries = {}  # zip name (under Data/) -> source path
    for d, _, files in os.walk(install):
        for name in files:
            full = os.path.join(d, name)
            rel = os.path.relpath(full, install).replace(os.sep, '/')
            if rel in DROP_ROOT:
                continue
            if rel in ROOT_DOCS:
                continue
            entries[rel] = full
    for doc in ROOT_DOCS:
        src = os.path.join(REPO, doc)
        if not os.path.isfile(src):
            sys.exit('missing repo doc: ' + doc)
        entries[DOCS_DIR + doc] = src
    for rel, repo_rel in OVERRIDES.items():
        src = os.path.join(REPO, repo_rel)
        if not os.path.isfile(src):
            sys.exit('missing repo override: ' + repo_rel)
        entries[rel] = src
    if DUPLICATE in entries:
        if sha(entries[DUPLICATE]) != sha(entries[KEEP_OF_DUPLICATE]):
            sys.exit('duplicate mp3 is NOT byte-identical to its sibling; refusing to drop it')
        del entries[DUPLICATE]
    return entries


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--install', required=True)
    ap.add_argument('--out', required=True)
    args = ap.parse_args()

    entries = collect(args.install)
    bad = [n for n in entries if os.path.basename(n).lower() in FORBIDDEN_NAMES
           or n.endswith('.tmp') or '\\' in n]
    if bad:
        sys.exit('forbidden entries: %s' % bad[:5])

    os.makedirs(os.path.dirname(os.path.abspath(args.out)), exist_ok=True)
    if os.path.exists(args.out):
        sys.exit('refusing to overwrite existing ' + args.out)
    with zipfile.ZipFile(args.out, 'w') as z:
        for name in sorted(entries):
            comp = zipfile.ZIP_STORED if name.lower().endswith(STORED_EXT) else zipfile.ZIP_DEFLATED
            z.write(entries[name], 'Data/' + name, compress_type=comp)

    # Read-back: roots, separators, and every entry's bytes against its source.
    with zipfile.ZipFile(args.out) as z:
        names = z.namelist()
        roots = {n.split('/')[0] for n in names}
        assert roots == {'Data'}, roots
        assert not any('\\' in n for n in names)
        assert not any(os.path.basename(n).lower() in FORBIDDEN_NAMES for n in names)
        assert z.testzip() is None
        mism = 0
        for name, src in entries.items():
            h = hashlib.sha256()
            with z.open('Data/' + name) as f:
                for block in iter(lambda: f.read(1 << 20), b''):
                    h.update(block)
            if h.hexdigest() != sha(src):
                mism += 1
        assert mism == 0, mism
    print('built', args.out)
    print('entries', len(names), 'size MB', round(os.path.getsize(args.out) / 1e6, 1))
    print('top-level roots', sorted(roots))
    print('every entry re-read and hash-matched its source')


if __name__ == '__main__':
    main()
