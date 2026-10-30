#!/usr/bin/env bash
# Install a verified static release. Existing releases and WordPress are preserved.
set -euo pipefail

if [[ $EUID -ne 0 || $# -ne 2 ]]; then
    echo "Usage: sudo bash release.sh /absolute/path/release.tar.gz FULL_GIT_SHA" >&2
    exit 1
fi

archive=$(realpath -- "$1")
revision=$2
[[ $revision =~ ^[0-9a-f]{40}$ ]] || { echo "A full Git SHA is required" >&2; exit 1; }
[[ -f $archive ]] || { echo "Archive does not exist" >&2; exit 1; }
base=/var/www/hongsik-blogworld
release="$base/releases/$revision"

# The package is built locally; reject unsafe archive paths before extraction.
if tar -tzf "$archive" | grep -E '(^/|(^|/)\.\.(/|$))' > /dev/null; then
    echo "Unsafe archive path" >&2
    exit 1
fi
if [[ ! -d $release ]]; then
    install -d -m 755 "$base/releases" "$release"
    tar -xzf "$archive" -C "$release" --no-same-owner --no-same-permissions
fi
(
    cd "$release"
    sha256sum --quiet -c release-manifest.sha256
    python3 - "$revision" <<'PY'
import json, pathlib, sys
assert pathlib.Path('index.html').is_file()
assert json.loads(pathlib.Path('deployment.json').read_text())['sourceCommit'] == sys.argv[1]
PY
)
find "$release" -type d -exec chmod 755 {} +
find "$release" -type f -exec chmod 644 {} +
previous=""
if [[ -L $base/current && -d $base/current ]]; then
    previous=$(readlink -f "$base/current")
fi
if [[ -n $previous && $previous != "$release" ]]; then
    ln -sfn "$previous" "$base/previous.next"
    mv -Tf "$base/previous.next" "$base/previous"
fi
ln -sfn "$release" "$base/current.next"
mv -Tf "$base/current.next" "$base/current"
printf 'Active release: %s\n' "$revision"
printf 'Previous path: %s\n' "${previous:-none}"
