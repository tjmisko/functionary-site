# Functionary site — design decisions

The public site is the first Functionary surface that lives outside the product
canvas. The governing risk is that a marketing page drifts toward consumer-SaaS
gloss and disowns the product it describes. The whole approach is a response to
that: **bend the layout, hold the voice.** Open up the type, whitespace, and
reading rhythm so a first-time visitor isn't reading dense 12px monospace at a
wall, but keep the palette, the structural monospace, the restraint, and the
terse, declarative copy. The site should read like the product wrote it.

Rewritten 2026-10-30 against the F98 backend direction. The research behind the
copy is in `docs/research-2026-10-30/` (seven reports, a synthesis in the
founder's register, and an adversarial critique of that synthesis). Nothing
from the pre-F98 product (Sketch / Test / Graduate, JSON flows, the discretion
gradient, Agent Sketch cards) survives on the site.

## Locked decisions

| # | Decision | Choice |
|---|---|---|
| Aesthetic | Fidelity to the product | **Bend it**: softer, more open layout; same palette and voice. |
| Argument | The spine of the home page | **Customer value, in order.** Jobs (and the risk in each); provenance; canvas and source; steps; iteration; where it runs. The founder's internal framings (control from above, contamination, the concession) inform the copy but are not headers and are not quoted. |
| Hero | The centerpiece | **One flow, frameless, fitting one screen.** The weekly-scan flow drawn in the canvas grammar directly on the page, its table source shown as a spreadsheet card, with one pass of execution state (running, completed, parked at Review) that plays once and freezes under `prefers-reduced-motion`. No chrome, no caption, no rotating examples. |
| Spec | What the site describes | **The F98 specification as the product.** The seven kinds, origin on every wire, Check, procedures and the governed workspace are shown as what Functionary is, with no build-state badges. The task names are generic: Report QC, Source Validation, Dataset Assembly, Evidence Combing, Market Map, Document Revision. |
| Scope | Page count | **Small multi-page**: Home (the argument) / How it works (one job end to end) / Deployment + Blog. |
| Voice | The hard constraint | **Plain and short.** Every header is a direct noun or noun phrase ("Jobs", "Provenance", "Canvas and source", "Steps", "Iteration", "Where it runs"). No sentence headers, no slogans, no paired-clause taglines ("Delegate X. Stand behind Y."): those read as machine-written. The value is carried by the first sentence under the header, not the header. Paragraphs are two to four sentences; cut before adding. No marketing vocabulary, no em-dashes, no rhetorical questions, no triads for their own sake. Nothing is placed in quotation marks unless verbatim. Never lead with a negation of a benefit ("not capability"). No hedging asides to the reader. |
| Mode | Default theme | **Dark.** A light marketing site would feel disowned by a dark product. |
| Blog | Presence | **One quiet nav item.** No home feed, no popups, no email capture. RSS for those who want it. |
| CTA | Conversion | **See one job end to end.** No download, install or sign-up promise while distribution and licensing are unsettled. |

## Vocabulary

Public spine words: delegation, trust (for components: trusted steps, untrusted
agent), control from above, visible, contamination, "the flow is the program".
Endurance is "the process improves" (not "learns", which was June-era copy, and
never "hardens").

Never in public copy: harden, ossify, calcify, bureaucracy, principal-agent,
agency cost, moral hazard, enframing, Gestell, spider or web metaphor; unlock,
seamless, empower, supercharge, leverage, robust, game-changing.

Retired product vocabulary and its replacement: Sketch · Test · Graduate
(iterate, then stabilize; Test survives only as the dry run); Agent Sketch
(the sketch agent kind, not built); flows as JSON (restricted Rust source);
Document / Record as the two payloads (Document, Table, Record); HumanReview
(Review); ForEach (Map); Pivot (Reshape); Graduate / Promote / Publish
(Commit); discretion (origin). For the Associate path, avoid pin, versioning,
approval, roles, and Rust.

Do not name third-party tools as the foil, and do not name the founder's past
employers or projects. Jobs are named generically: Report QC, Source
Validation, Dataset Assembly, Evidence Combing, Market Map, Document Revision.

## How the design binds to the product

- **Palette is inherited verbatim.** `src/styles/tokens.css` is a vendored copy
  of the canvas design system. The site extends it in `src/styles/marketing.css`
  (which also adds the one token the vendored file lacks, `--cat-agent`, for the
  Agent kind) and never edits the base. No new accent, no promoted brand colour.
- **The canvas grammar is the app's.** `src/components/Canvas.astro` draws cards,
  pills, Jig regions, ports and wires to the measurements in the app's
  `web/src/style.css`: 8px radius, 1px `rgba(255,255,255,.12)` border on
  `rgba(28,33,40,.95)`, kind-coloured header, grey transform pills, translucent
  orange Jig regions, 10px port rings. Kind colours follow the decided map
  (D135, F104.25). Wire origins (D139) are drawn as Sourced and Computed plain,
  Generated dashed, Verified and Reviewed tinted.
- **Two voices, by typeface.** Monospace (JetBrains Mono) is the machine and the
  artifact: wordmark, chips, verbs, code, receipts. Inter is us explaining.
- **Restraint.** No gradients in chrome, no decorative icons, no emoji, no
  testimonials, no logo soup. Motion is limited to execution state on the hero
  and freezes under `prefers-reduced-motion`.

## Stack

- **Astro**, static output. `astro build` emits plain HTML/CSS/JS; deploy is
  rsync to nginx.
- **Scoped CSS** on top of the vendored token file. No CSS framework.
- **Blog posts are markdown files** in `src/content/blog/`. One RSS feed.
- Self-hosted fonts (weight axis only).

## Components

| File | Draws |
|---|---|
| `Canvas.astro` | A flow from `src/lib/flows.ts` in the canvas grammar: kind-coloured cards with per-verb line icons (`src/lib/icons.ts`), a model dot on blocks, error ports, transform pills, Jig regions with label and footer, a table source drawn as the product's spreadsheet card, origin-styled wires whose type shows on hover; optional run pass and legend. Drawn frameless on the page with `bare`. |
| `FlowSource.astro` | Flow source in the restricted Rust subset with light highlighting. |
| `Refusal.astro` | Code outside the subset and the checker diagnostics that refuse it. |
| `RunTable.astro` | Run outcomes per row or per occurrence path, with origin dots and failures kept as rows. |
| `Kinds.astro` | The palette: seven kinds and their verbs with icons, in the canvas's grouping and colours. |

## Mobile

The canvas is desktop-first. Below 1100px a drawing keeps a legible size and
scrolls sideways inside its frame instead of shrinking; the home hero carries a
one-line note that the product lives on a desktop. The argument sections are
prose and read fine on a phone.

## Pre-launch checklist

- Add `public/og.png` (1200×630) and restore the `og:image` / `twitter:image`
  tags in `BaseLayout.astro`.
- Add GitHub / Docs links to the footer once the repository is public and a docs
  site exists.
- Licensing block on the Deployment page once the OSS / commercial split is
  decided.
- Seed blog posts.
