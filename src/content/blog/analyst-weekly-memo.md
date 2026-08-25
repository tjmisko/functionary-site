---
type: usecase
title: "The analyst's weekly memo, as a flow"
dek: "A linear pipeline that turns a week of source material into a reviewed, sent memo — with a human sign-off in the middle."
date: 2026-05-22
template: "Analyst Weekly Memo"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

An analyst writes a weekly memo from a recurring pile of source material: reports, feeds, meeting notes. Done by hand, it is slow and the output varies week to week — what gets cited, how findings are framed, which sources made the cut. A private chat may accelerate one memo, but it does not create a shared, repeatable process. The useful first run should become evidence for the next one.

## The flow

The bundled starter contains six blocks in order. It does not currently include a scheduled trigger; add one when the flow is ready to recur:

- `Regularize` — takes the incoming material and normalizes it into a consistent shape, so the downstream blocks see one format instead of five.
- `Extract Insights` — reads the normalized material and emits structured findings that can carry model-supplied supporting passages.
- `Gate` — pauses the run. The analyst reviews the extracted findings before any prose exists. Nothing past this point runs until they approve.
- `Summarize` — condenses the approved findings.
- `Draft` — writes the memo from the summary and findings.
- `Send` — delivers the finished memo.

## Key decisions

The `Gate` sits before `Summarize` and `Draft`, not after. The analyst reviews the findings — the claims and their sources — while they are still cheap to correct, before the model spends effort turning them into prose. Catching a bad finding here is one edit; catching it after the memo is written is a rewrite.

`Extract Insights` can attach source passages to the structured findings reviewed at the `Gate`. Downstream `Summarize` and `Draft` outputs retain execution lineage — their inputs, configuration, prompt, and model — but the finished prose is not currently guaranteed to retain a passage for every claim. Review source-grounded findings before synthesis when that distinction matters.

After the contracts are validated and a trigger is added, the same graph can run against each week's inputs. Its declared structure stays legible; model-backed extraction and synthesis remain nondeterministic and should keep the evaluations and review appropriate to the memo's stakes.

## What it teaches

This is a useful sequential pattern: normalize, extract structured findings, review them, synthesize, and deliver. It can begin with an agent-backed Sketch and graduate toward these narrower blocks as repeated runs reveal the stable process. The same pattern fits a research digest, market brief, or internal status report.

## Start from this template

Open the **Analyst Weekly Memo** starter and point it at your own sources. Resolve the currently unverified `Summarize` → `Draft` contract and Test the flow before adding a schedule or approving an external `Send`. Then refine it incrementally: tighten the extraction schema, add another human pause, or change the output action.
