# functionary-site

Public marketing site for **Functionary**: an agent writes research and
analysis work as a flow of trusted steps in a restricted subset of Rust; the
canvas is that program, drawn; you read it, run it as a Test, and fix the step
that was wrong.

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
                              # Canvas (flow drawings), FlowSource, Refusal,
                              # RunTable, Kinds, Status
  pages/
    index.astro               # Home: the argument, with one real flow as the hero
    how-it-works.astro        # One job end to end
    self-hosting.astro        # Deployment: where it runs, what leaves
    blog/index.astro          # type-filtered index
    blog/[...slug].astro       # per-type post layout
    rss.xml.ts                # RSS feed
  content/blog/*.md           # posts (essay | usecase | note)
  styles/                     # tokens.css (vendored) + marketing.css + global.css
  lib/flow.ts                 # the seven kinds, origins and run states → tokens
  lib/canvas.ts               # data model for a drawn flow
  lib/flows.ts                # the flows the site draws (built or designed)
public/                       # favicon, robots.txt
deploy/                       # nginx.conf, deploy.sh, deploy instructions
```

## Deploy

Static build → rsync to nginx on the VPS. See [`deploy/README.md`](deploy/README.md).

## Pre-launch

See the checklist at the end of [`docs/DESIGN.md`](docs/DESIGN.md). The research
the copy rests on is in `docs/research-2026-10-30/`; re-caption "designed"
drawings as the F104 block-ontology tasks land.
