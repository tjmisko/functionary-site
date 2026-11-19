#!/usr/bin/env bash
# Deploy the site: build main locally and put it live on the server.
#
#   ./deploy/deploy.sh             build, upload, install, verify
#   ./deploy/deploy.sh --dry-run   every check and the build; nothing leaves this machine
#   ./deploy/deploy.sh --rollback  put the previous build back
#
# Run it from a terminal: the install step asks for your sudo password on the
# server. How it works and why is in deploy/README.md.
#
# Environment (defaults in brackets):
#   DEPLOY_HOST  ssh target                    [tjmisko@sspi.world]
#   DEPLOY_ROOT  the site's checkout there     [/var/www/functionary-site]
#   DEPLOY_URL   the public site               [https://functionary.app]
set -euo pipefail

DEPLOY_HOST="${DEPLOY_HOST:-tjmisko@sspi.world}"
DEPLOY_ROOT="${DEPLOY_ROOT:-/var/www/functionary-site}"
DEPLOY_URL="${DEPLOY_URL:-https://functionary.app}"
# Where the build waits on the server, under the ssh account's home.
STAGE="functionary-site-deploy"
# Pages that exist for working on the site and must never be published.
INTERNAL=(hero-frame heroes)

mode="deploy"
case "${1:-}" in
"") ;;
--dry-run) mode="dry-run" ;;
--rollback) mode="rollback" ;;
*)
    echo "usage: deploy.sh [--dry-run | --rollback]" >&2
    exit 2
    ;;
esac

say() { echo "==> $*"; }
die() {
    echo "deploy: $*" >&2
    exit 1
}

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$repo_root"

# The install and the rollback ask for a sudo password on the server, which needs a terminal.
if [ "$mode" != "dry-run" ] && ! [ -t 0 ]; then
    die "run this from a terminal: sudo on the server has to ask for your password (stdin is not a terminal)"
fi

for tool in git npm npx rsync ssh curl; do
    command -v "$tool" >/dev/null || die "$tool is not installed"
done

# The status a URL answers with, or 000 when it does not answer.
status_of() { curl -s -o /dev/null -w "%{http_code}" --max-time 15 "$1" || true; }
# The revision the public site says it is.
live_revision() { curl -fsS --max-time 15 "$DEPLOY_URL/revision.txt?$(date +%s)" 2>/dev/null || true; }

remote_install() {
    rsync -a deploy/remote-install.sh "$DEPLOY_HOST:$STAGE/"
    # $HOME is expanded by the ssh account's shell, before sudo changes it.
    # shellcheck disable=SC2029
    ssh -t "$DEPLOY_HOST" "sudo sh \"\$HOME/$STAGE/remote-install.sh\" $*"
}

if [ "$mode" = "rollback" ]; then
    say "Rolling back $DEPLOY_URL on $DEPLOY_HOST (sudo on the server)"
    # shellcheck disable=SC2029
    ssh "$DEPLOY_HOST" "mkdir -p $STAGE"
    remote_install rollback "$DEPLOY_ROOT"
    say "Live revision is now: $(live_revision)"
    exit 0
fi

# ---- 1. what is being deployed: main, committed, pushed ---------------------
say "Checking the working tree"
[ "$(git rev-parse --abbrev-ref HEAD)" = "main" ] || die "not on main"
git diff --quiet HEAD || die "tracked files have uncommitted changes"
untracked="$(git status --porcelain -- src public astro.config.mjs package.json package-lock.json tsconfig.json)"
[ -z "$untracked" ] || die "uncommitted or untracked files would be built but are not in the commit:
$untracked"
git fetch --quiet origin main
rev="$(git rev-parse HEAD)"
[ "$rev" = "$(git rev-parse origin/main)" ] || die "HEAD is not origin/main; push (or pull) first, so the server's checkout can follow"
short="$(git rev-parse --short HEAD)"

# ---- 2. build ---------------------------------------------------------------
say "Type-checking"
npx astro check
say "Building $short"
npm run build

# ---- 3. the build is what we mean to publish --------------------------------
[ -s dist/index.html ] || die "the build has no index.html"
for page in "${INTERNAL[@]}"; do
    if [ -e "dist/$page" ] || [ -e "dist/$page.html" ]; then die "the build contains the internal page /$page"; fi
    if grep -rqs "/$page/" dist/sitemap-0.xml; then die "the sitemap lists the internal page /$page"; fi
done
echo "$rev" >dist/revision.txt

if [ "$mode" = "dry-run" ]; then
    say "Dry run: $short builds and passes every check. Nothing was uploaded."
    exit 0
fi

# ---- 4. upload, install, verify ---------------------------------------------
say "Uploading to $DEPLOY_HOST:~/$STAGE/dist"
# shellcheck disable=SC2029
ssh "$DEPLOY_HOST" "mkdir -p $STAGE/dist"
rsync -az --delete dist/ "$DEPLOY_HOST:$STAGE/dist/"

say "Installing on the server (sudo on $DEPLOY_HOST)"
remote_install install "$rev" "$DEPLOY_ROOT" "\"\$HOME/$STAGE/dist\""

say "Verifying $DEPLOY_URL"
live="$(live_revision)"
[ "$live" = "$rev" ] || die "the site reports revision '${live:-none}', not $rev. Roll back with: ./deploy/deploy.sh --rollback"
[ "$(status_of "$DEPLOY_URL/")" = "200" ] || die "the home page does not answer 200. Roll back with: ./deploy/deploy.sh --rollback"
for page in "${INTERNAL[@]}"; do
    [ "$(status_of "$DEPLOY_URL/$page/")" = "404" ] || die "the internal page /$page is reachable on the live site"
done

say "Done. $DEPLOY_URL is at $short."
