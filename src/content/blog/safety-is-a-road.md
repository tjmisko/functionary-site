---
type: essay
title: "Agents need roads — and real guardrails"
dek: "Legible structure helps agents stay on course. Capability roots, Test-mode stubbing, and Production approval also enforce boundaries they cannot cross."
date: 2026-06-01
draft: false
relatedHref: /philosophy
relatedLabel: "Philosophy"
---

It would be a lie to call an AI agent unconditionally safe. A capable model asked to do real work is nondeterministic, and on any given run it might do something no one intended. A trustworthy system has to expose that uncertainty and enforce meaningful limits around it.

What you *can* do is change the terrain the agent moves through. You can't promise a driver won't crash. You can build a road.

## The road

A road makes the intended route easy to follow. It gives ambiguous work a visible shape before every detail is known.

A flow can do the same. An Agent-backed Sketch names where open discretion lives and gives it instructions, tool allowlists, and turn ceilings. Typed blocks narrow the contract further. Connections say what may pass and declared effects show which work can touch the outside world. The first move is making authority and discretion visible.

## The markings

Road markings don't physically stop you crossing them. They make the intended path obvious, and they make a deviation visible.

Functionary's markings are its types. A connection that doesn't typecheck shows up as an unverified edge on the canvas *before* anything runs — a painted line you can see you're about to cross. The lane is legible, which means wandering out of it is legible too. You are not trusting the agent to stay between the lines on faith; you can see where the lines are, and so can it.

## The signs

Signs constrain by telling you what the road expects right here. A Gate is a stop sign: the flow holds, and a person decides. A validator is a weight limit: data that doesn't meet the spec doesn't get waved through. A declared effect is the sign that warns this exit leaves the protected area and touches the outside world — posted before you take it, not discovered after.

Some controls are markings. Others are walls. Capability roots and allowlists can deny access. Hidden exclusions stay out of listings, traces, and agent context. Test mode stubs durable external writes, and the server refuses Production without approval bound to the exact reviewed snapshot.

## The line you can finally see

Put the road, the markings, and the signs together and something useful happens to the hardest question in this whole field: where is the line between good behavior and bad?

With a bare agent, the line is often invisible. It lives in a prompt, ambient machine access, and a model's runtime choices. In Functionary, the canvas paints part of the line and enforced policy supplies the barrier: what tools are available, what roots they can reach, whether an effect is stubbed, and who can approve Production.

That is the point of bounding agent work: prevent the actions the runtime can forbid, make the remaining discretion legible, and preserve evidence when an allowed action still produces a bad result.

## A smaller promise, and a truer one

This remains a smaller promise than "safe." A flow can be designed badly, a policy can grant too much, and an allowed model output can still be wrong. But structure, enforced authority, Test-first execution, human pauses, and captured runs each remove a different class of silent failure.

The useful question is not whether one metaphor guarantees safety. It is whether every layer says what it controls, enforces the limits it can, and leaves enough evidence to improve the rest.
