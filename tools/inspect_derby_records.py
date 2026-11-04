"""Read-only record evidence for property-free Derby reward lookup. No CK edits."""
import argparse
import json
from pathlib import Path
import struct
import zlib


def records(path, wanted):
    with path.open('rb') as f:
        def walk(end):
            while f.tell() < end:
                h = f.read(24)
                assert len(h) == 24
                size = struct.unpack_from('<I', h, 4)[0]
                if h[:4] == b'GRUP':
                    yield from walk(f.tell() + size - 24)
                    continue
                if h[:4] not in wanted:
                    f.seek(size, 1)
                    continue
                d = f.read(size)
                if struct.unpack_from('<I', h, 8)[0] & 0x40000:
                    d = zlib.decompress(d[4:])
                yield h[:4], struct.unpack_from('<I', h, 12)[0] & 0xffffff, d
        yield from walk(path.stat().st_size)


def subs(data):
    pos = 0
    while pos < len(data):
        sig, size = struct.unpack_from('<4sH', data, pos)
        pos += 6
        if sig == b'XXXX':
            size = struct.unpack_from('<I', data, pos)[0]
            pos += 4
            sig = data[pos:pos + 4]
            pos += 6
        yield sig, data[pos:pos + size]
        pos += size
    assert pos == len(data)


def quest(path):
    rows = [(fid, list(subs(d))) for _, fid, d in records(path, {b'QUST'}) if b'x2357StarcadeStartupQuest\0' in d]
    assert len(rows) == 1
    fid, row = rows[0]
    assert fid == 0x809
    assert (b'ALST', struct.pack('<I', 0)) in row
    vmad = next(d for sig, d in row if sig == b'VMAD')
    assert b'x2357starcadePlayerAlias' in vmad and b'StarcadePad' in vmad
    # Calibrate against a known-bad local id/alias, not just a positive substring.
    assert fid != 0x806 and (b'ALST', struct.pack('<I', 99)) not in row
    return vmad


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--esm', required=True)
    parser.add_argument('--vanilla', required=True)
    args = parser.parse_args()
    root = Path(__file__).resolve().parents[1]
    assert quest(root / 'CreationKit/x2357starcade.esp') == quest(Path(args.esm)), 'Generated quest VMAD differs'
    found = {}
    for sig, fid, data in records(Path(args.vanilla), {b'ALCH', b'MISC'}):
        if (sig, fid) not in ((b'ALCH', 0xabf9), (b'MISC', 0xf)):
            continue
        edid = next(d.rstrip(b'\0').decode('ascii') for tag, d in subs(data) if tag == b'EDID')
        found[hex(fid)] = edid
    assert found == {'0xf': 'Credits', '0xabf9': 'Aid_MedPack'}, found
    print(json.dumps({'quest_local': '0x809', 'alias': 0, 'editing_generated_vmad_equal': True,
                      'vanilla': found, 'evidence': 'record inspection only; no inventory grant executed'}, indent=2))


if __name__ == '__main__':
    main()
