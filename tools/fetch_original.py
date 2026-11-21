#!/usr/bin/env python3
"""Download original numbered archive parts into a single hash-checked tar.gz.
No code is executed or extracted. Uses only Python standard library.
"""
import argparse
import hashlib
from pathlib import Path
import urllib.request

BASE = "https://alpo.ge/lean.tar.gz.part"
EXPECTED = "9631b4f020199e580ba86178cb56c6e9b09f690c2369a80dc4334aa93f49c7fc"
SIZE = 239_275_554  # published mirror-reported compressed size


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--out", type=Path, default=Path("lean.tar.gz"))
    args = ap.parse_args()
    if args.out.exists():
        ap.error(f"Refusing to overwrite existing file: {args.out}")
    temp = args.out.with_name(args.out.name + ".partial")
    if temp.exists():
        ap.error(f"Refusing to overwrite existing file: {temp}")
    sha = hashlib.sha256()
    total = 0
    try:
        with temp.open("wb") as output:
            for i in range(1, 15):
                url = BASE + f"{i:02d}"
                req = urllib.request.Request(url, headers={"User-Agent": "RH-Archive-Integrity-Check/1.0"})
                print(f"Retrieving original part {i}/14: {url}", flush=True)
                with urllib.request.urlopen(req, timeout=90) as response:
                    if response.status != 200:
                        raise RuntimeError(f"HTTP {response.status} for part {i}")
                    while chunk := response.read(1024 * 1024):
                        total += len(chunk)
                        if total > SIZE:
                            raise RuntimeError("Downloaded bytes exceed published archive size")
                        output.write(chunk)
                        sha.update(chunk)
        digest = sha.hexdigest()
        if total != SIZE or digest != EXPECTED:
            raise RuntimeError(f"Archive integrity mismatch. Bytes={total} SHA256={digest}; expected {SIZE} / {EXPECTED}")
        temp.rename(args.out)
        print(f"Verified archive saved: {args.out} ({total} bytes) SHA256 {digest}")
    except Exception:
        temp.unlink(missing_ok=True)
        raise


if __name__ == "__main__":
    main()
