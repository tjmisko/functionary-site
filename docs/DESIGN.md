# Functionary site — design decisions

The public site describes a product that changes daily. The governing risk is
that the page describes last month's product. The approach is a response to
that: **state structural commitments in prose, and draw nothing that the
product draws.** The palette, the monospace machine voice, and the terse copy
still come from the product.

Rewritten 2026-11-17 against the `bleeding` branch of the product repo and its
`ops/` record (Agent Mode Equivalence 2026-11-15, Flow Language Rulings v3
2026-11-16, Cross-Platform Release Epic F112, the Locality ruling). The
2026-10-30 rewrite embedded renderings of the canvas, flow source, checker
diagnostics and run tables; each went stale within weeks and all were removed.

## Locked decisions

| # | Decision | Choice |
|---|---|---|
| Argument | The spine of the home page | **Reproducibility is what makes agent work trustworthy.** To trust work you did not do, you need to know how it was done: what it relied on, and how you would reproduce it (the user's wording, 2026-11-17; "you have to be able to reproduce it" was rejected as too strong). A freely working agent leaves a transcript; Functionary gives the work a fixed process: a program, a pinned run, a complete record. Sections in order: Process, Trust, Reproducibility; Jobs, Program, Run record, Bounds, Origin, Iteration, Where it runs. |
| Framing | Who it is written for | **A technical reader evaluating a tool.** Pins, revisions, receipts, the checker and the restricted Rust subset are the evidence for the claim and are named plainly. |
| Hero | The centerpiece | **The lifecycle of a flow, animated, about fifteen seconds** (`figures/Lifecycle.astro`): you, agent, `flow.rs`, execution, results, and the loop back as the person reacts to the results and the process. It starts with no flow (the agent finds sources and does the job its own way), then two revisions of `flow.rs`; each leaves less to a free Agent and writes more as explicit, wired blocks (progressive formalization). Node shapes follow the app canvas language at the level of shape and colour only. Review sits after the Map, never inside it, and fans out to several actions. It ends by tilting the finished flow into a stack of replicated runs (Replicate), one agent-coloured functionary per run, with a per-run results grid joined across runs (Join) and the rows where runs disagree ringed; colleagues then appear beside you, pointing at the same stabilized flow. The ending must not claim that anyone would reach the same conclusion: each run is a different, similarly trained functionary, the flow constrains process and framing, and the variation across runs is the information (user, 2026-11-17). Plays once and holds; Replay button; last frame only under `prefers-reduced-motion`. Still being iterated; earlier candidates are on `/heroes`. |
| Figures | Pictures on the page | **One schematic per section** (`figures/SectionFigure.astro`) and a pictogram per job (`figures/JobGlyph.astro`), drawn on the app's graph-paper ground in its category colours. They explain mechanisms. Prose left, figure right. |
| Depiction | What the site may show | **Schematics only. No rendering of the canvas, flow source, diagnostics, or run views.** No verbatim flow snippet, no block or verb list, no count of blocks. The seven kinds and five origins may be named in prose. |
| Level | What may be claimed | **Only what is built on `bleeding`, at the level of structure.** A decided-but-unbuilt thing is left out, not badged. Details that are being re-ruled (flow syntax, block names, node faces, outcome types) are not mentioned. |
| Scope | Page count | **Home / Download / Blog.** The walkthrough page was removed with the diagrams. |
| Download | The release page | **A shell driven by `src/lib/release.ts`.** Until a release exists it lists the six planned targets as "At release" and offers no link, version, command, date or license. |
| Voice | The hard constraint | **Plain and short.** Headers are nouns or noun phrases. The value is in the first sentence under the header. Paragraphs are two to four sentences. No marketing vocabulary, no em-dashes, no rhetorical questions, no paired-clause taglines. Never lead with a negated benefit. No hedging asides to the reader. |
| Mode | Default theme | **Dark, slate.** Neutrals and the single steel accent are the app's. |
| Blog | Presence | **One quiet nav item.** No home feed, no popups, no email capture. RSS for those who want it. |
| CTA | Conversion | **Download.** The page it leads to says plainly whether a build exists. |

## What "reproduce" means here

Claims the copy may make, all built:

- A run pins the flow revision, block versions and table revisions it executes.
- Every block call is recorded with its settings and result; every model call
  leaves a receipt.
- Recorded results are reused: an interrupted run continues from its record,
  and a Test escalated to a Run writes the results the Test recorded.
- A conventional runtime executes the flow; the agent does not.

"Reproduce" is the claim (user ruling, 2026-11-17). Re-executing a finished run
and comparing two runs is not built; it is stubbed as F121.0 in the product
repo's ops. Until it lands, do not describe a re-run or run-diff feature.

Also claimable by ruling the same day, ahead of the code: a flow starts on a
schedule, a webhook or an inbound email.

Claims it may not make: that a fresh run returns identical model output; that
the knowledge base refuses unverified model output (not built and not
planned); that any third-party system is a readable source.

## Vocabulary

Spine words: reproduce, trust, program, flow, block, runtime, pinned, record,
receipt, origin, check, review, bounds.

Product terms: **block** and **block call** (not step or card); **Agent** (not
Sketch agent); **Test** and **Run**; **flow**; origins **Sourced, Computed,
Generated, Verified, Reviewed**; **personal** and **governed** workspace.

Never in public copy: harden, ossify, calcify, bureaucracy, principal-agent,
agency cost, moral hazard, enframing, Gestell, spider or web metaphor; unlock,
seamless, empower, supercharge, leverage, robust, game-changing; "desktop
tool" (it is a local server with a browser UI and a terminal client).

Do not name third-party tools as the foil. Jobs are named generically: Report
QC, Source Validation, Dataset Assembly, Evidence Collection, Market Map,
Document Revision. They are the kind of work the tool is for, not shipped
templates.

## How the design binds to the product

- **Palette is inherited.** `src/styles/tokens.css` is a vendored copy of the
  app's tokens; the accent, status and selection values were re-vendored on
  2026-11-17 from `web/src/style.css`. The site extends it in
  `src/styles/marketing.css` and never edits the base otherwise.
- **Two voices, by typeface.** Monospace (JetBrains Mono) is the machine and
  the artifact: wordmark, labels, table data. Inter is us explaining.
- **Restraint.** No gradients, no decorative icons, no emoji, no testimonials,
  no logo soup. The only motion is the hero's runs drawing once.

## Stack

- **Astro**, static output. `astro build` emits plain HTML/CSS/JS; deploy is
  rsync to nginx.
- **Scoped CSS** on top of the vendored token file. No CSS framework.
- **Blog posts are markdown files** in `src/content/blog/`. One RSS feed.
- Self-hosted fonts (weight axis only).

## Keeping it current

Before a deploy, re-check the home and download pages against `bleeding`. The
sentences most exposed to change are: the Agent sandbox's network default, the
model connection kinds on the Download page, the six release targets, and the
governed-workspace controls.

## Pre-launch checklist

- Choose a hero from `/heroes`, then delete `src/pages/heroes.astro` and the
  unused figures.
- Fill `src/lib/release.ts` when a release exists (version, date, build URLs,
  checksums, license).
- Add `public/og.png` (1200×630) and restore the `og:image` / `twitter:image`
  tags in `BaseLayout.astro`.
- Add docs links to the footer once a docs site exists.
- Seed blog posts.
