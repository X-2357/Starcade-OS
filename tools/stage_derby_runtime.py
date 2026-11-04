"""Stage explicitly compiled Derby DLL/PEX and bind them to current source hashes.

Run only after native and the three Papyrus compile commands succeed. This is a
build receipt, not proof that a game executed the scripts or granted inventory.
"""
import argparse
import hashlib
import json
from pathlib import Path
import shutil

ROOT = Path(__file__).resolve().parents[1]
NAMES = ('x2357StarcadeNative', 'x2357StarcadePlayerAlias', 'x2357StarcadeDerbyPrizes')


def sha(p):
    return hashlib.sha256(p.read_bytes()).hexdigest()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--runtime', required=True)
    args = parser.parse_args()
    runtime = Path(args.runtime).resolve()
    assert not (runtime / 'build-receipt.json').exists(), 'Preserve previous receipt; use a new runtime directory'
    for name in NAMES:
        assert (runtime / 'Scripts' / (name + '.pex')).is_file(), name + ' not compiled'
    dll = runtime / 'SFSE/Plugins/Starcade.dll'
    dll.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(ROOT / 'Native/build/windows/x64/releasedbg/Starcade.dll', dll)
    source = list((ROOT / 'Native/src').glob('*.cpp')) + list((ROOT / 'Native/src').glob('*.h'))
    source += list((ROOT / 'Native/include').glob('*.h')) + [ROOT / 'Native/xmake.lua']
    source += [ROOT / 'Web-and-Papyrus/Source' / (name + '.psc') for name in NAMES]
    required = [dll] + [runtime / 'Scripts' / (name + '.pex') for name in NAMES]
    receipt = {'version': '1.7.4', 'evidence': 'compiled/staged; Starfield inventory acceptance pending',
               'runtime': {p.relative_to(runtime).as_posix(): sha(p) for p in required},
               'source': {p.relative_to(ROOT).as_posix(): sha(p) for p in source}}
    (runtime / 'build-receipt.json').write_text(json.dumps(receipt, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(receipt, indent=2))


if __name__ == '__main__':
    main()
