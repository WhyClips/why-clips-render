"""Create branch therealwhy-template on WhyClips/why-clips-render as an ORPHAN
branch (empty-tree commit) — NOT from main's head.

Why: main's root is the Matisse-era project (src/videos/{henry,island,spam},
its own package.json). The push helper overlays onto the base tree, so a
branch from main would leave ~40 Matisse files in src/ and the template's
`tsc --noEmit` (include src/**) would typecheck them against the template's
deps. An empty-tree commit gives the template a clean root.

Uses the custom.github helper's authenticated api() — same credential path.
"""
import sys

sys.path.insert(0, "/home/hatch/workspace/custom-connectors/custom.github/bin")
import github  # noqa: E402

OWNER, REPO, BRANCH = "WhyClips", "why-clips-render", "therealwhy-template"

# 1. blob for the README, then a tree with only that file (GitHub rejects a
# truly empty tree array with 422, so the orphan root starts with one file)
import base64
with open("/home/hatch/workspace/ricks-clone/therealwhy-project/README.md", "rb") as fh:
    b64 = base64.b64encode(fh.read()).decode()
status, blob = github.api("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                          {"content": b64, "encoding": "base64"})
print("readme blob:", status, blob["sha"][:12])
status, tree = github.api("POST", f"/repos/{OWNER}/{REPO}/git/trees",
                          {"tree": [{"path": "README.md", "mode": "100644",
                                     "type": "blob", "sha": blob["sha"]}]})
print("tree:", status, tree["sha"])

# 2. commit with no parents
status, commit = github.api(
    "POST",
    f"/repos/{OWNER}/{REPO}/git/commits",
    {"message": "TherealWhy template: empty root", "tree": tree["sha"], "parents": []},
)
print("commit:", status, commit["sha"])

# 3. branch ref -> that commit
status, ref = github.api(
    "POST",
    f"/repos/{OWNER}/{REPO}/git/refs",
    {"ref": f"refs/heads/{BRANCH}", "sha": commit["sha"]},
)
print("branch:", status, ref.get("ref"))
