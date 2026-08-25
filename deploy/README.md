# Deploying to the VPS (nginx)

The site is a pure static build (`dist/`). Deployment is: build locally (or in
CI), then `rsync` the output into the nginx web root.

## One-time VPS setup

1. Point DNS at the VPS:

   - `A` records for `functionary.app` and `www.functionary.app`
   - `AAAA` records only if nginx is reachable over IPv6 on this VPS

   Wait until both names resolve publicly before requesting the certificate.

2. If this server does not already have nginx and Certbot, install them using
   the method appropriate for its OS. On a server that already uses Certbot for
   other nginx sites, use the existing installation.

3. Create the web root. Replace `deploy:deploy` with the SSH account that will
   run `deploy/deploy.sh`:

   ```
   sudo install -d -o deploy -g deploy -m 0755 /var/www/functionary-site
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

5. Deploy the site once so nginx has content to serve (see **Each deploy**
   below).

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

## Each deploy

From a machine with SSH key access to the VPS:

```
DEPLOY_HOST=deploy@vps.example.com ./deploy/deploy.sh
```

That builds `dist/` and rsyncs it to `/var/www/functionary-site/` (override the
remote path with `DEPLOY_PATH`). The SSH account in `DEPLOY_HOST` must be able
to write that directory; nginx only needs read access.

## Optional: push-to-deploy via GitHub Actions

Add a workflow that runs `npm ci && npm run build` and rsyncs over an SSH
deploy key (stored as a repo secret). Skipped for now — the manual
`deploy.sh` is enough until the cadence justifies CI.

## Production domain

`functionary.app` is configured in:
- `astro.config.mjs` (`site:`)
- `public/robots.txt`
- `deploy/nginx.conf`
