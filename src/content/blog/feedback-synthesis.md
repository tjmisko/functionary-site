---
type: usecase
title: "Synthesizing feedback from many sources"
dek: "A fan-in pipeline that merges several feedback streams, extracts entities, compares across sources, and validates before it writes."
date: 2026-05-12
template: "Feedback Synthesis"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

Feedback about the same thing arrives from several sources at once: a survey export, a stack of support threads, a handful of interview notes. Each comes in a different shape. Someone reconciles them by hand, reading across all three, deciding what agrees and what conflicts, and writing it up.

It is slow, and the result is hard to defend. When a stakeholder asks where a conclusion came from, the trail is in the synthesizer's head, not on the page.

## The flow

The `Feedback Synthesis` starter is a fan-in. Two source paths run in parallel and converge.

Each source enters its own `Regularize` block, which normalizes that source's shape into a common form. The survey and the support threads do not share a structure, so they do not share a path.

Each normalized stream feeds its own `Extract Entities` block. These pull structured items out of the text — themes, complaints, requests — and can attach model-supplied source passages to them.

The two extraction paths meet at `Compare`. This is the convergence point. `Compare` reconciles the items across sources, surfacing where they agree and where they disagree.

`Validate` checks the merged result against declared rules. `Draft` produces the written synthesis. `Write` records it as an artifact.

## Key decisions

Each source gets its own `Regularize` and `Extract Entities` path because the sources are not comparable until they have been normalized separately. Merging early would mean reconciling raw shapes; merging at `Compare` means reconciling structured items.

`Validate` sits before `Write`, not after. A bad merge is cheaper to catch as a failed check than as a published artifact. Nothing is written until the rules pass.

Execution lineage is load-bearing here. Extraction can attach source passages to structured items, while `Compare`, `Validate`, and `Draft` record which inputs and configurations produced their outputs. The current synthesis path does not guarantee a source passage for every line of the final report, so source-sensitive review belongs at the extracted-item stage or requires an additional citation-preserving implementation.

## What it teaches

This is a useful fan-in pattern: multiple inputs, parallel extraction, cross-source comparison, and validation before output. It generalizes to work that reconciles several sources into one report — product research, incident retrospectives, or notes from several reviewers.

## Start from this template

Open the `Feedback Synthesis` starter and inspect its contracts before running it: several extraction-to-comparison and validation-to-draft edges are currently unverified. Once those shapes are resolved, add source paths as more feedback streams appear and tighten `Validate` as you learn what a good merge looks like in your data.
