# Deploying to the VPS (nginx)

The site is a static build. One command builds it here and puts it live:

```
./deploy/deploy.sh
```

Run it from a terminal: the install step asks for your sudo password on the
server. Everything else needs only your ssh key.

## How the server is laid out

- Host: `tjmisko@sspi.world`. nginx serves `functionary.app` from
  `/var/www/functionary-site/dist` (see `deploy/nginx.conf`).
- `/var/www/functionary-site` is a root-owned git checkout of this repository.
  Nothing is built on the server; the checkout is kept at the deployed commit
  so the source beside the build always matches it.
- `/var/www/functionary-site/dist.prev` is the build the last deploy replaced.
- `~/functionary-site-deploy/` (in the ssh account's home) is where an upload
  waits before it is installed.

## What `deploy.sh` does

1. **Checks what is being deployed.** You must be on `main`, with nothing
   uncommitted that the build would pick up, and `HEAD` must equal
   `origin/main`. The server's checkout follows the same commit, so it has to
   be pushed first.
2. **Builds.** `astro check`, then `npm run build`, using the `node_modules`
   already installed.
3. **Checks the build.** It must have an `index.html` and must not contain
   the internal pages (`/hero-frame`, `/heroes`; they live in `src/dev-pages/`
   and only the dev server routes them). The commit is written to
   `dist/revision.txt`.
4. **Uploads** `dist/` and `deploy/remote-install.sh` to the staging folder.
5. **Installs, as root, in one sudo call.** `remote-install.sh` confirms the
   upload is the expected commit and that the checkout can fast-forward to it,
   copies the build to `dist.new`, moves `dist` to `dist.prev` and `dist.new`
   to `dist`, then fast-forwards the checkout. If a check fails, nothing on
   the server has changed.
6. **Verifies the live site.** `https://functionary.app/revision.txt` must
   report the commit, the home page must answer 200, and the internal pages
   must answer 404.

`./deploy/deploy.sh --dry-run` runs steps 1 to 3 and stops: nothing leaves
this machine.

## Rolling back

```
./deploy/deploy.sh --rollback
```

This swaps `dist` and `dist.prev` (sudo again), so running it twice returns to
where you were. Only one previous build is kept. The checkout is left at the
newer commit; the next deploy puts the two back in step.

## Settings

`DEPLOY_HOST`, `DEPLOY_ROOT` and `DEPLOY_URL` override the host, the checkout's
path and the public address. The defaults are the production values above.

## Agents and the commodore hook

An agent session cannot ssh to `sspi.world` unless this repository is listed
under `[fleet] exempt_projects` in `~/.config/commodore/policy.toml`. An agent
can run `--dry-run` and the read-only checks, but not the install: that needs
a terminal for the sudo password.

## One-time VPS setup

1. Point DNS at the VPS:

   - `A` records for `functionary.app` and `www.functionary.app`
   - `AAAA` records only if nginx is reachable over IPv6 on this VPS

   Wait until both names resolve publicly before requesting the certificate.

2. If this server does not already have nginx and Certbot, install them using
   the method appropriate for its OS. On a server that already uses Certbot for
   other nginx sites, use the existing installation.

3. Clone this repository as the web root (root-owned; nginx only reads it):

   ```
   sudo git clone https://github.com/tjmisko/functionary-site /var/www/functionary-site
   ```

4. Copy `deploy/nginx.conf` from this repository to the VPS and enable it:

   ```
   sudo cp deploy/nginx.conf /etc/nginx/sites-available/functionary-site
   sudo ln -s /etc/nginx/sites-available/functionary-site /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

   The `cp` command assumes the repository is present on the VPS. Otherwise,
   copy that file to the VPS first and use its temporary path as the source.

5. Deploy the site once so nginx has content to serve (`./deploy/deploy.sh`
   from your own machine).

6. Provision TLS and enable the HTTP-to-HTTPS redirect:

   ```
   sudo certbot --nginx --redirect -d functionary.app -d www.functionary.app
   ```

   Certbot will add the port 443 certificate directives and the port 80
   redirect to the installed server block. Do not paste the port 443 block from
   another site: certificate paths are domain-specific.

7. Validate nginx and certificate renewal:

   ```
   sudo nginx -t
   sudo systemctl reload nginx
   sudo certbot renew --dry-run
   curl -I https://functionary.app/
   curl -I https://functionary.app/definitely-not-a-page
   ```

   The first request should return `200`; the deliberately missing page should
   return `404`.

## Optional: push-to-deploy via GitHub Actions

Not set up. It would need a deploy account that can write the web root without
a password; the manual `deploy.sh` is enough until the cadence justifies it.

## Production domain

`functionary.app` is configured in:
- `astro.config.mjs` (`site:`)
- `public/robots.txt`
- `deploy/nginx.conf`
