---
type: usecase
title: "Intake triage with routing and escalation"
dek: "A branching pipeline that classifies incoming requests, routes by urgency, and escalates the hard cases to a person."
date: 2026-05-18
template: "Intake Triage"
relatedHref: /how-it-works
relatedLabel: "How it works"
---

## Situation

A team receives a stream of incoming requests: support tickets, applications, referrals. Each one has to be sorted, routed, and answered. Done by hand, the sorting is uneven. Two similar requests land in different queues depending on who picked them up. And when someone asks why a request went where it did, there is no record. The decision lived in a person's head and is gone.

## The flow

The `Intake Triage` starter contains seven blocks across three routed paths.

`Regularize` takes the raw incoming request and normalizes it into a consistent shape, so a terse one-line ticket and a long email arrive at the next block looking the same.

`Classify` assigns a category and an urgency to the normalized request. This is the only block that judges the content.

`Router` reads the `category` field and maps `urgent`, `normal`, and `low-priority` to separate destinations. The mapping lives in the Router configuration and the paths are visible as separate canvas edges.

The urgent path reaches a `Gate` assigned to an operations lead. The normal path reaches `Manual Input`. Low-priority work goes directly to `Write` for archival.

`Manual Input` represents a separate human-input path; it is not nested inside the Gate.

`Write` records the low-priority path in the configured archive destination.

`Send` follows the Gate and Manual Input paths, although the Manual Input → Send edge is currently unverified and must be resolved before that path is runnable.

## Key decisions

Classification happens before routing. `Classify` emits the category; `Router` maps that field to a destination. Splitting them keeps the model-backed judgment separate from the mechanical route table.

Only the urgent path hits a `Gate`; normal items request manual input and low-priority items are archived. These are starter categories, not a claim that the template measures confidence or applies a configurable urgency threshold at the Gate.

The routing logic is declared in the `Router` block and visible through its outgoing edges. It is not buried inside the classification prompt.

Successful blocks retain execution lineage, including their inputs and configurations. That supports reconstruction of the route, but the current starter does not promise that category, urgency, model rationale, and a human note are all embedded as exhaustive decision provenance.

## What it teaches

This is a useful routing pattern: model-backed classification, a mechanical route map, multiple output paths, and selective human participation. It generalizes to many sort-and-route intake processes.

## Start from this template

Open `Intake Triage` and adapt the categories on `Classify` and mappings on `Router` to your own queues. Resolve the unverified Manual Input → Send contract and Test every path. When repeated evidence shows a category needs different handling, change the route or add the appropriate human pause.
