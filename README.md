# functionary-site

Public marketing site for **Functionary**, an agent harness for the mechanical
parts of knowledge work. An agent writes the job as a flow, a program in a
restricted subset of Rust built from fixed blocks; a conventional runtime
executes it; every run is pinned and recorded so the work can be reproduced
and checked.

Separate from the main Functionary application repo on purpose: this is
human/design-maintained, statically built, and deployed independently to
nginx. It has no dependency on the Rust backend or the app frontend.

## Stack

- [Astro](https://astro.build) — build-time components/layouts, static HTML out.
- Scoped CSS over a vendored copy of the canvas design tokens
  (`src/styles/tokens.css`), extended in `src/styles/marketing.css`. No CSS
  framework.
- Self-hosted Inter + JetBrains Mono (a two-voice split: prose vs. machine).
- Blog posts are markdown files in `src/content/blog/`, rendered at build time;
  one RSS feed.

See [`docs/DESIGN.md`](docs/DESIGN.md) for the design decisions and rationale.

## Develop

```
npm install
npm run dev        # http://localhost:4321
npm run build      # → dist/
npm run preview    # serve the built dist/ locally
npm run check      # astro check (typecheck)
```

## Structure

```
src/
  layouts/BaseLayout.astro    # <head>, SEO/OG meta, header + footer
  components/                 # Header, Footer, Button, Chip, Pillar, CodeBlock,
                              # figures/ (RunTwice hero, SectionFigure, JobGlyph)
  pages/
    index.astro               # Home: the argument, a figure per section
    download.astro            # Builds, model connection, data, workspaces, license
    blog/index.astro          # type-filtered index
    blog/[...slug].astro       # per-type post layout
    rss.xml.ts                # RSS feed
  content/blog/*.md           # posts (essay | usecase | note)
  styles/                     # tokens.css (vendored) + marketing.css + global.css
  lib/release.ts              # the published release; fill in to publish builds
public/                       # favicon, robots.txt
deploy/                       # nginx.conf, deploy.sh, deploy instructions
```

## Deploy

Static build → rsync to nginx on the VPS. See [`deploy/README.md`](deploy/README.md).

## Pre-launch

See the checklist at the end of [`docs/DESIGN.md`](docs/DESIGN.md). The copy
rests on the product repo's `bleeding` branch and its `ops/` record as of
2026-11-17; `docs/research-2026-10-30/` is the earlier research and is
superseded where the two disagree.
