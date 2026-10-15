"""Rebuild the October 6 audio-only overlay from tracked files; Python stdlib only."""
import argparse
import hashlib
import json
from pathlib import Path
import zipfile


def build(output):
    root = Path(__file__).resolve().parents[1]
    manifest = json.loads((root / "Docs/MUSIC_BATCH_2026-10-06.json").read_text(encoding="utf-8"))
    rows = [row for row in manifest["rows"] if row["status"] == "added"]
    music = root / "Web-and-Papyrus/starcade.arcade/launcher/audio/music"
    prefix = "Data/SFSE/Plugins/OSFUI/views/starcade.arcade/launcher/audio/music/"
    assert len(rows) == 21 and len({row["file"] for row in rows}) == 21
    payloads = []
    for row in rows:
        name = row["file"]
        if Path(name).name != name or not name.endswith(".mp3"):
            raise ValueError(f"Invalid manifest filename: {name}")
        data = (music / name).read_bytes()
        if hashlib.sha256(data).hexdigest() != row["sha256"]:
            raise ValueError(f"Source hash mismatch: {name}")
        payloads.append((prefix + name, data))
    output = output.resolve()
    if output.exists():
        raise FileExistsError(f"Choose a new output path: {output}")
    output.parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output, "x", zipfile.ZIP_DEFLATED) as archive:
        for name, data in payloads:
            info = zipfile.ZipInfo(name, date_time=(2026, 10, 6, 0, 0, 0))
            info.compress_type = zipfile.ZIP_DEFLATED
            archive.writestr(info, data)
    with zipfile.ZipFile(output) as archive:
        assert set(archive.namelist()) == {name for name, _ in payloads}
        assert archive.testzip() is None
        for name, data in payloads:
            assert archive.read(name) == data
    print(json.dumps({"archive": str(output), "tracks": len(rows),
                      "sha256": hashlib.sha256(output.read_bytes()).hexdigest()}))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", required=True, type=Path)
    build(parser.parse_args().output)
