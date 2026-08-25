---
type: note
title: "Retries should fail closed around side effects"
dek: "Pure work can retry freely. External writes need an explicit replay protocol, because a crash can leave the truth unknowable."
date: 2026-05-16
---

"Exactly once" sounds like the obvious promise. Across a boundary that can fail — a network call, or a crash between doing the work and recording that it was done — the runtime may not be able to tell whether the effect happened. Retrying blindly can duplicate it. Refusing to retry can leave it unfinished.

Functionary does not turn that ambiguity into a blanket guarantee. Retry policies are explicit and bounded. Pure computation may be safe to repeat, but a model call can still vary and an external write can happen twice. When all configured attempts are exhausted, the step fails.

Crash replay is stricter. An effectful step is denied by default unless its adapter owns a protocol that can resolve the uncertainty — for example, a stable idempotency key or a durable journal. `Move File` currently provides such a journal. A normal retry acknowledgement is not enough to prove that an interrupted external effect is safe to repeat.

The principle is narrower and more useful: make replay safety a property of a specific effect implementation, not a slogan attached to the whole runtime. Where the system cannot know, it should fail closed and ask for a deliberate recovery decision.
