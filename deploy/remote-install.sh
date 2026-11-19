#!/bin/sh
# The server half of a deploy. deploy.sh uploads this file with the build and
# runs it as root; it is not meant to be run by hand.
#
#   remote-install.sh install  REV ROOT STAGE   put the build in STAGE live, and move ROOT's checkout to REV
#   remote-install.sh rollback ROOT             put the previous build back
#
# ROOT is a git checkout of the site (/var/www/functionary-site). nginx serves
# ROOT/dist. The build it replaced is kept beside it as ROOT/dist.prev.
set -eu

die() {
    echo "remote-install: $*" >&2
    exit 1
}

[ "$(id -u)" -eq 0 ] || die "must run as root"
action="${1:-}"

live_rev() {
    cat "$1/dist/revision.txt" 2>/dev/null || echo "unknown"
}

case "$action" in
install)
    [ $# -eq 4 ] || die "usage: install REV ROOT STAGE"
    rev="$2"
    root="$3"
    stage="$4"
    git_root() { git -c "safe.directory=$root" -C "$root" "$@"; }

    [ -d "$root/.git" ] || die "$root is not a git checkout"
    [ -f "$stage/index.html" ] || die "no index.html in $stage"
    [ "$(cat "$stage/revision.txt" 2>/dev/null)" = "$rev" ] || die "the build in $stage is not revision $rev"

    # Check the checkout can move to REV before anything is changed.
    git_root diff --quiet HEAD || die "the checkout at $root has local changes; resolve them first"
    git_root fetch --quiet origin main
    git_root cat-file -e "$rev^{commit}" 2>/dev/null || die "revision $rev is not on origin/main"
    git_root merge-base --is-ancestor HEAD "$rev" || die "the checkout at $root is not an ancestor of $rev; it needs a manual reset"

    was="$(live_rev "$root")"
    rm -rf "$root/dist.new"
    rsync -a --delete --chown=root:root --chmod=D755,F644 "$stage/" "$root/dist.new/"
    rm -rf "$root/dist.prev"
    if [ -d "$root/dist" ]; then mv "$root/dist" "$root/dist.prev"; fi
    mv "$root/dist.new" "$root/dist"

    git_root merge --quiet --ff-only "$rev"
    echo "installed $rev at $root/dist (was $was); checkout is at $(git_root rev-parse --short HEAD)"
    ;;
rollback)
    [ $# -eq 2 ] || die "usage: rollback ROOT"
    root="$2"
    [ -d "$root/dist.prev" ] || die "no previous build at $root/dist.prev"
    was="$(live_rev "$root")"
    rm -rf "$root/dist.new"
    mv "$root/dist" "$root/dist.new"
    mv "$root/dist.prev" "$root/dist"
    mv "$root/dist.new" "$root/dist.prev"
    echo "rolled back from $was to $(live_rev "$root"); the checkout at $root was left where it is"
    ;;
*)
    die "usage: install REV ROOT STAGE | rollback ROOT"
    ;;
esac
