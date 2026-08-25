---
type: note
title: "Why discarding data needs its own block"
dek: "A design note for an explicit discard primitive; unpublished until the stock runtime and provenance behavior support it."
date: 2026-05-26
draft: true
---

This note records a design intention, not a currently shipped runtime guarantee. The schema includes a `Void` sink, but the stock executor does not yet provide a corresponding runtime implementation.

The intended design is to make deliberate discard a visible destination — filtered records, rejected items, and branches that end — so a reviewer can distinguish intentional termination from a missing edge. Visibility in the graph would be useful even before discard-specific provenance exists.

Today, branches can terminate without executing a Void block, including through human cancellation. The stronger rule therefore cannot be claimed yet.

The future principle is narrow: when the runtime supports it, an explicit sink should make intended discard legible. This note should remain unpublished until the implementation and provenance behavior match that claim.
