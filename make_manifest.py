#!/usr/bin/env python3
"""Build the github.py push manifest for the Moon Trees project.
Walks the project dir, skipping node_modules (symlink), out/, and __pycache__.
Usage: make_manifest.py [message] — writes manifest.json next to this script."""
import json, os, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
SKIP = {"node_modules", "out", "__pycache__", ".git", "staging"}

files = []
for dirpath, dirnames, filenames in os.walk(ROOT):
    dirnames[:] = [d for d in dirnames if d not in SKIP and not os.path.islink(os.path.join(dirpath, d))]
    for fn in sorted(filenames):
        full = os.path.join(dirpath, fn)
        if os.path.islink(full):
            continue
        rel = os.path.relpath(full, ROOT)
        files.append({"path": rel, "file": full})

manifest = {
    "owner": "WhyClips",
    "repo": "why-clips-render",
    "branch": "moon-trees",
    "message": sys.argv[1] if len(sys.argv) > 1 else "Grigware Short",
    "files": files,
}
with open(os.path.join(ROOT, "manifest.json"), "w") as fh:
    json.dump(manifest, fh, indent=1)
print(f"{len(files)} files")
for f in files:
    print(" ", f["path"], os.path.getsize(f["file"]))
