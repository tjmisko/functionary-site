# Angle 03: "Flows provide a stable, visible object for iteration and process learning across teams"

Worktree read: `~/Projects/Functionary/.worktrees/integration/f98` at `f5b07c87`. Paths below are relative to it. `ops/` = the planning submodule. Status labels: **BUILT** (code on integration/f98 with tests), **DECIDED** (ruled, not built), **IDEA** (registered/open).

## Bottom line

Four of the claim's five parts hold up in the record. "Visible" and "stable" are the product's founding invariant, and most of their machinery is built. "Iteration" is the explicit default loop. "Process learning" is the founder's own reason for the product. **"Across teams" does not hold.** The ledger never uses "team" as a concept. Multiplayer is a deferred seam (D27). The tenancy model is one person by default, with owner-plus-share grants inside one tenant (D120). Approve buttons, run history, review comments, alerting, revision diffs, and viewing a past revision on the canvas are all missing or unbuilt. The honest claim is about a **principal overseeing delegated work**: a person, or that person's agents, plus optional named reviewers. It is not about cross-team collaboration. The record also adds a nuance the claim misses. The object is stable only when the user asks for it. By decision, stability is opt-in (D132), and the default loop has "no versioning words" (`ops/planning/2026-10-29 - User Archetypes.md`).

---

## 1. Visible: the canvas is what runs

**Founder intent (current).** The goal paragraph in `ops/planning/2026-09-29 - Backend Guiding Principles.md` §1 says you "verify their composition of trusted components using the canvas, which maps directly to the code that will be executed". P7 there reads "The canvas is the verification step… maps one-to-one to the code that will run." The founder's 2026-10-19 message 17 (`ops/planning/2026-10-19 - What Functionary Is.md`, Appendix) is the iteration-relevant version: "you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing."

**Decided mechanics.**
- D42 (`ops/backend-refactor/decisions.md`): "The Rust source is canonical and the graph is derived, always". The rule is "One writer per fact": semantics live in source, values and display names in config, layout and style in separate stores, and the graph is "never a writable truth". The stated reason is "strict isomorphism is what makes 'code you see is what executes' verifiable."
- D06/D07/D32: a fail-closed Rust subset. The IR is derived on save, and rustc compiles on Test/Run. D46/D79 rule out invisible conversions ("Conversions are **never invisible**"; "No implicit conversions in v1").
- D116 #8 (user ruling): "**The canvas is sufficient; reviewers never read source.** A source view is an advanced feature built last, if at all; defending the canvas's sufficiency is the product."
- D139 (2026-10-29 ontology, DECIDED, F104.3 open) adds an **origin** axis on every wire: Sourced, Computed, Generated, Verified, Reviewed. The canvas draws it "before a run (P7)". Its ledger reason is that it is "the mechanism behind the contamination story in *What Functionary Is*". D135 gives seven kinds so that "the kinds should say what a thing is for". D143 procedures "expand on the canvas into visible steps; every step keeps its own identity, settings record and receipt". D153 removes Map `.broadcast` because it is "a side channel the canvas cannot show".

**Built.** The IR canvas renders the server projection (`crates/functionary-server/src/flow_source/projection.rs`; `web/src/canvas/irProjection/toFlow.ts`). Canvas edits are semantic ops posted to `/flows/{id}/edits` (`flow_source/mod.rs:1323`). Cross-document refactors are atomic clone-modify-swap transactions (`crates/functionary-flow-edit/src/txn.rs`). Layout lives beside the revision chain, never in it (`flow_source/store.rs` `LAYOUT_TABLE` comment: "layout is not flow logic, so a write here moves no revision and invalidates no review"). F101.137/F101.138 (done 2026-10-30) added stored card titles, accents, collapse and Jig-group labels, "with the binding name still visible as identity". Writes go to the layout store "as one undoable step that sends no source edit" (`ops/task-loop/tasks/F101.138.md`).

**Gaps against "visible".**
- The block ontology is **not built**. Per `ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` §1: "Nothing is built yet… none of: Record wire type, Reviewable bound, origin axis, Compare, Quote, Notify, Apply, Check, Declassify, Redact, Aggregate, Reshape, Replicate." The canvas still paints every restricted card with the placeholder orange (`handoffs/2026-10-29 - Block Ontology Session Handoff.md` §5; F104.21 open).
- Horizons, the old named boundary around a region of the canvas, are parked. D127 records the user's words: "we can park horizons, bring them back if ever useful."
- Presentation is deliberately not in the revision chain (layout table). A card's title is therefore not part of the flow's recorded history. The one thing a human writes to explain a step leaves no history trail.

## 2. Stable: identity, revisions, pins, approvals

**Identity across edits (BUILT).** D36: the Rust identifier is the key within a revision. Across revisions, identity is a conservative reconciliation (exact identifier, then a unique structural fingerprint, otherwise new). "Ambiguity always yields a new identity and invalidates review rather than risking mis-reattachment." This is implemented in `crates/functionary-flow-ir/src/reconcile.rs` (module doc: "it never guesses") and tested (`crates/functionary-flow-check/tests/reconcile.rs`, `functionary-flow-ir/tests/pins.rs`). Stable ids persist per revision in `flow_source_identities` (`flow_source/store.rs`). D108 #2 keys pins by stable identity, "not the label path", so "a rename or a wrapper must not silently reset adoption."

**Revision chain (BUILT, thin).** `flow_source_revisions` stores `seq, revision (sha256), parent, source, subject, actor, created_at, reconciliation, review_invalidated` (`flow_source/store.rs` SCHEMA). `GET /flows/{id}/revisions` (`mod.rs:1883-1914`) returns that metadata. `web/src/ui/HistoryPanel.tsx` shows #seq, actor, time, hash, the reconciler's change list ("changed node X") and a "review invalidated" flag. Undo/redo is built on the server (F98.228, `flow_source/undo_routes.rs`, `crates/functionary-server/tests/flow_source_undo.rs`). Concurrency is compare-and-swap with typed 409 conflicts (`txn.rs`). The D43 text-CRDT for agent edits is not built; no CRDT code appears in `functionary-flow-edit` or `flow_source`.

What the chain lacks:
- **No "why".** No revision carries a message, rationale, or link to the run or review that prompted it. The Archetypes line "the revision history is the record of why it looks the way it does" is therefore aspirational. The history records *who/when/what*, never *why*.
- **Config edits are not revisions.** `store.rs` (PinnedRevision doc): "A config-only edit changes the flow's settings without a new revision." `flow_source_config_writes` records only `version, subject, actor, written_at`, with no content. Tightening a filter threshold is exactly the Automator's typical correction, and it leaves no reconstructable history in the chain. Undo holds before/after config but is capped at depth 100 (`ops/planning/backend-ground-truth/open-questions.md`, "Undo and redo").
- **No way to open or diff a past revision.** The only revision routes are list and revise (`mod.rs:1319-1322`). No route returns an old revision's source or projection, and `web/src/canvas/irFlow`, `irProjection` and `features/reviewed-flows` contain no revision diff. A restored identical source "does not restore that review" (open-questions.md, undo defaults, provisional).

**Pins, snapshots, imports (mixed).** D110 #1 says "Adoption records… 'what you saw.' A pin commits the call site to an exact module version: 'what you'll run.'" D110 #3: snapshots are written at pin time. D132 #1 then **superseded** D108 #3's refusal of floating call sites "as a bad idea". Its recorded reason: "the common case is a flow built, adjusted, run, adjusted, run, then rarely used again; that loop must carry no versioning friction." D131 #4–5: imports float by default, and pinning is an explicit opt-in. Built: module pins and snapshots (`flow_source_module_pins`, `flow_source_module_snapshots`), pinned revisions for triggers (`flow_source_pinned_revisions`, F101.43 done; `tests/flow_source_pinned_start.rs`), adoption dropped (`store.rs`: "Adoption is gone (F98.254, D132 #1)"), and the import resolution table. Open: slugs plus rename-rewrites-importers (F101.100), the import picker (F101.101), and the explicit pin/unpin route (F101.128).

**Approvals and strict mode (partly built).** The record moved in three steps:
1. D60/D83: composition is "never finally signed off". The user's words were "It might always change later." D99 #1: "there is no human approval of a flow revision."
2. D129 (2026-10-29) amends that. A tenant may opt in to `GovernancePolicy.revision_approval: Off | Unattended | AllRuns`, default Off. Approvals are stored per revision, agents never approve, and "Approval still commits module pins."
3. Built: the policy field and its UI select (F101.97 done; `crates/functionary-schema/src/governance.rs`; `web/src/features/tenants/GovernanceSettings.tsx`), and per-revision approvals with a gate that judges the executed snapshot (F101.96 done). **Not built:** wiring the gate into Run starts (F101.98 open) and an **approve button** (F101.99 open). `rg "revisions/.*review" web/src` finds no caller. The F101.19 prep confirms it: "There is no approve button." `ops/planning/2026-10-29 - F101.19 Strict mode… Decision Prep.md` fact 8.

**Review freshness (BUILT).** The review key hashes the trivia-free CST, the run definition, contracts and lowering versions, module interface versions, labels, and behavioural settings (`crates/functionary-flow-review/src/key.rs`). Credential and limit fields are excluded (D116 #6). D81's ruling: an approval is keyed "on the inputs that produced the output, not on its text." The "contract A / contract B" example in D81 is the clearest stability guarantee in the record.

## 3. Iteration and process learning

**The founder's story (current, verbatim, 2026-10-19).** Message 12: "the process that the people doing the implementation are taking to do things wasn't clear and visible from above to the principal". Message 25: "in that cleanup process you go through and track down what the hell went wrong that we missed this crucial detail and then you setup the system so that we never make the same mistake again." Message 26: "which is not really doable with a freestyle agent." This is the process-learning claim in the founder's own voice. It describes a correction cycle in an organisation that sells research ("you're selling good words"). It does not describe teams co-editing.

**Archetypes (current).** The Associate's loop is "build → run → adjust → run… no versioning words, no approvals". Archetype 1 says "They never see the word 'pin'." The Automator section is the closest text to this angle: "The canvas is a stabilizing artifact. They run the process for real, watch it make mistakes, and change the flow in response… the revision history is the record of why it looks the way it does." Both archetypes are one person: "the same person can be an Associate on Monday and an Automator by Friday."

**Mechanisms that make a correction stick.**
- **Origin floors (DECIDED, D139):** "Commit to knowledge requires Verified or Reviewed unless the destination opts out." This writes a past contamination failure into the type system: unverified Generated output reaching a trusted sink "is a red wire before the run" (Block Ontology Log S9).
- **Check gate (DECIDED, D148)** and **Quote/Anchor (DECIDED, D144):** each quote is checked as an exact substring. This is the "we missed this crucial detail" fix turned into a reusable step.
- **Procedures (DECIDED, D143):** a fix found once (e.g. Consolidate's deterministic-then-semantic dedupe) becomes a named palette object that expands into visible steps. This is the closest thing in the record to *transferable* process learning.
- **Sketch agent → stabilized flow (DECIDED kind D135; F101.5 open; F101.85 done):** "the on-ramp whose trace a flow is stabilized out of" (S42). The learning path from freestyle to formal is ruled but not built.
- **Measurement is open.** F102.2 ("Node evaluation history, studies and graduation evidence are rebuilt on the flow-exec run and outcome store, tied to formalization measurement") is open. `open-questions.md` §11 Formalization (enforcement, panel, analysis service) is entirely open.

**Historical framing (label: HISTORICAL-but-consistent).** `ops/planning/2026-06-01 - Trust Thesis and Messaging Synthesis.md` §7 Move 4 says "The process learns from real failures — your agents stay forgetful, your process gets better." Its Move 3, "Verify the process once; stop checking every run", is **SUPERSEDED** by D60/D83 ("never finally signed off"). D81 (review is output-bound, on change) amends it further: review moves to outputs, with cadence set by `ReviewPolicy`.

## 4. Knowledge as the team's source of truth

- **Commit (BUILT):** `POST /flows/{id}/runs/{run}/tables/{table}/commit` writes an immutable revision to one tenant-level store (`flow_source/knowledge_routes.rs` doc; D112 #1). D40 rules that a commit is atomic and conditional on the expected source revision ("conflict, no auto-merge"). User (U23, `ops/backend-refactor/sources/user-steering.md`, 2026-10-07): "Commmit might be better than Promote. Sounds more databasey, more git-like."
- **Pinned table revisions bind review (BUILT):** D112/D113 #4. A changed bound table revision invalidates approval.
- **Hand edits (DECIDED, mostly not built):** D128 says "an edit is a batch of ops on one table that produces a new immutable revision"; "Agents propose; a human applies"; pinned flows "do not follow" and show "newer revision" with a cell diff. The user's words: "Let's do B for now, with C built later." Built: notes revision through `Reviser` (F101.114/.115 done). Open: table ops (F101.92, F101.108, F101.109), routes (F101.112), UI editing (F101.117), the newer-revision chip (F101.118) and agent proposals (F101.113/.119). Live co-editing is F102.1, future. `rg set_cell` hits only `crates/functionary-agent/src/tool.rs`.
- **Commit sets (DECIDED, D150; F104.12 open):** a Write to knowledge "commits them as **one revision**, so a reader pins once and never sees edges without their claims." The user's words (S44): "consistency is good, let's make sure we can do consistent sets".
- **Write with intention marker (BUILT):** F98.69/.73/.74 done. "An explicit Write persists any wire type into the knowledge base, tagged as an intentional write… distinct from recorded execution state."

Knowledge is the record's strongest candidate for the *shared* object. Tables are tenant-scoped (D112 #1) rather than flow-scoped, so several flows and people in one tenant read the same revisions. The editing path is the part still missing.

## 5. "Across teams": tenancy, roles, agents

**What exists (BUILT).** `GovernancePolicy` (`crates/functionary-schema/src/governance.rs`) has `mode: Personal | Governed`, plus view, edit, run and answer_reviews access, `reviewer_not_author`, `named_editors/runners/reviewers/admins`, `agent_runs`, `agent_narrowing`, and `revision_approval`. Flow and project share routes exist (`flow_source/sharing.rs`), as do review grants (`flow_source/clearance.rs`). Agents are a modelled principal identified by credential and are "never a flow owner" (D120 #2; F98.207–F98.210 done; `tests/governance_routes.rs`, `tests/flow_source_named_reviewers.rs`). D122 #1: agents start Test runs only unless the tenant allows more. D132 #2: a parked run resumes as its starter, re-authorized. F98.263 is still **open**, as is its audit-event clause.

**What the record says about scale of collaboration.**
- D120 #1: "A single person can create, edit, run and review… **hyperformalism — mandatory roles, sign-offs or separations nobody asked for — is an anti-pattern**." `ops/planning/2026-10-26 - Roles Are Optional…`, Warning: "Do not add a role, approval, sign-off or separation-of-duties gate as the default."
- D27: "Leave a path to multiplayer… **not v1**." User (U23, 2026-10-07): "We also should think about multiplayer support (not v1, but eventually)---multiple users and multiple agents editing the canvas at once.  We should be able to scale to this without a total redesign."
- D125 closes sharing settings between flows as copy-only. The user's words: "All of this is hypothetical … let's just move forward with something reasonable. I don't care right now." The ruling adds "Revisit on a real case. When a user actually has several flows that must follow one style".
- D131 #6: imports are "same-project scope in v1". D102 #5: "No cross-tenant content-addressed sharing." The ledger's only "Teams" is Microsoft Teams as a Notify channel (D150).
- The legacy Lamport/LWW co-editing (`ops/planning/2026-10-02 - Technical History…` "Editor and collaboration") is **HISTORICAL**. D133 #4 retires the `/api/ws` CRDT rooms, and D128 #12 says "The legacy JSON-flow CRDT is not reused."
- `open-questions.md` "Roles and access policy" lists sharing role order, whether tenant owners see all flows, and whether review grants fold into sharing. All are **provisional, not decided**.

**Collaboration surfaces that are missing.**
- **Run history:** the restricted backend has no run-list route; `/flows/{id}/runs` is POST-only (`run_routes.rs:67`). `web/src/parked/README.md`: "A run of the restricted backend is not in that history."
- **Review answers:** the only answer is `{ decision: approved | rejected }` "and nothing else" (`flow_source/review_routes.rs` doc). No comment or reason is recorded. The comments port is DECIDED only (D147; F104.11 open).
- **Review views:** User Archetypes, "Gaps today": "**Custom review views** for `HumanReview` are not specified." Review-on-a-block is IDEA (S28/D147). The user's process-review wish (U6, quoted in D60) remains deferred: "Review gates might also want to review what was done in addition to what the output was. We'll need to think hard about review, approval and 'replay.' defer for now."
- **Alerting:** "not built on the new backend" (Archetypes, Gaps). Notify is DECIDED only (D150). The Automator setup path is deferred: D134, "keep what's built. we'll design automator later"; F102.4 open.
- **Audit:** `rg -i audit crates/functionary-server/src/flow_source` finds only "The chain stays for audit" on deleted flows (`store.rs:1103`). No audit read surface exists.

## 6. Durable runs, replay, journal (BUILT core)

D82: "The run pins its definition at start… Replay returns recorded receipts and never re-dispatches." D99 #2: "The journal-derived state is authoritative." Built and tested: the durable outcome store and atomic publish (F98.77–F98.79), crash-mid-Map replay with tenant isolation (F98.80), the run harness (F98.81), durable pause/cancel for parked runs (F98.262), and inner-agent steps as replayable sub-receipts (F99.5). D81 makes review decisions receipts, "never re-asked on replay". D97/D99 #4: Test is a dry run that escalates over the same pinned artifact. This makes a *run* a stable, replicable object, which answers founder message 19's "easy to replicate as exactly as possible". It is per run and has no cross-run browsing UI (see run history above).

---

## SUPPORT

1. Visibility is the founding invariant, not a feature. Guiding Principles §1/P7, D42 ("strict isomorphism"), D116 #8 ("The canvas is sufficient"), founder message 17. All the mechanisms are BUILT: source-canonical, derived IR, semantic edit ops, presentation kept separate.
2. Stable identity across edits is BUILT and conservative (D36; `reconcile.rs`): ambiguity produces new identity and invalidates review. Approvals cannot slide onto changed work (D81 contract A/B).
3. The founder names the contamination-then-correction cycle as the reason the product exists (messages 18–26). The Automator archetype calls the canvas a "stabilizing artifact".
4. Corrections can be encoded as structure, not prompts: origin floors (D139), Check (D148), Quote/Anchor (D144), procedures (D143). All are DECIDED 2026-10-29 with build tasks seeded (F104, F103).
5. Durable runs, journal and receipts are BUILT (F98.77–81, F98.262, F99.5). Pinned run definitions and receipts make runs replicable (D82).
6. Knowledge commits are immutable, tenant-scoped revisions (BUILT), and review binds pinned table revisions (D113 #4). Commit sets are DECIDED (D150).
7. Optional formalization ladder: per-revision approvals and the tenant `revision_approval` policy are BUILT in the store and policy. Pins, snapshots and trigger-pinned revisions are BUILT. Named reviewers in Governed tenants are BUILT.

## COUNTEREVIDENCE

1. **"Across teams" is unsupported.** The ledger has no team concept. Multiplayer is "not v1" (D27). The default is one person (D120). Sharing between flows is copy-only and "hypothetical" (D125). Imports are same-project (D131 #6). Cross-tenant sharing is forbidden (D102 #5). The founder's frame is principal over implementers (message 12), not peer teams.
2. **Stability is opt-in by decision.** D132 calls mandatory pinning "a bad idea". The Associate "never see[s] the word 'pin'". A flow that floats on imports and knowledge revisions is, by design, not a stable object until someone pins it.
3. **The history records who and what, not why.** Revisions carry no message or rationale. Config-only edits are not revisions and store no content (`store.rs`). A past revision cannot be opened or diffed on the canvas. Titles and labels sit outside the chain.
4. **Composition is "never finally signed off" (D60/D83).** The record resists treating the flow as an approved artifact. Strict mode is an opt-in organisation rule (D129) whose run-gate wiring (F101.98) and approve button (F101.99) are unbuilt.
5. **The block ontology that makes the canvas tell the contamination story is unbuilt.** That includes origin on wires, Check, Review comments and procedures (Implementer Handoff §1: "Nothing is built yet").
6. **Team-facing surfaces are missing:** restricted run history, review comments or reasons, custom review views, alerting, audit read, resume-as-starter (F98.263 open), knowledge hand-edit (F101.92 and others open), and formalization measurement (F102.2, open-questions §11).

## WHAT WE NEED TO DO BETTER

1. **Give revisions a "why".** Add an optional reason to each revision, plus links to the run, review rejection, or failed Check that prompted it. Without this the Automator's "record of why it looks the way it does" is false. The cheapest version: a free-text note on `revise`/`edits`, and a "caused by run X / review Y" field filled in when an edit follows a failed run.
2. **Put config edits in history.** Store config content per write, or make behavioural config edits revisions. Today the most common correction (tightening a setting) leaves no reconstructable trail beyond undo depth 100.
3. **Ship the read side of stability:** open revision N on the canvas, a canvas diff between N and M (reconciliation changes are already computed), and a restricted-backend run list per flow, with each run linked to the revision it executed.
4. **Finish the approval loop** for those who opt in: F101.98 (gate wiring) and F101.99 (approve button and refusal explanation). F98.263 (resume-as-starter, with an audit event).
5. **Make the correction cycle visible in the ontology build.** Prioritize F104.3 (origin on wires), F104.10 (Check) and F104.11 (Review comments port), because these turn "we never make the same mistake again" into a red wire before the run.
6. **Decide what "shared" means before claiming it.** Either scope the claim to a principal and their agents and reviewers in one tenant, or open the D27 seam and a D125 revisit with a concrete multi-person case. Do not let marketing outrun D125's "hypothetical".
7. **Measure learning.** F102.2 and open-questions §11 are the only route to evidence that "the process learns". Until something is built there, "learning" is a narrative claim.

## Five candidate formulations the record supports

1. "The flowchart you approve is the program that runs. Functionary keeps the canvas and the executed code identical, so you supervise a process by looking at it." (P7, D42, D116 #8, message 17)
2. "When something goes wrong, you fix the process, not the prompt. A correction becomes a visible step on the canvas, and every later run inherits it." (messages 25–26; D139/D148 decided, not yet built. Use future tense or scope to built Check-like steps until F104 lands.)
3. "Iterate freely, then lock it down when it matters. Pin the versions, require approval for unattended runs, and every run records exactly what it ran." (D132, D131 #5, D129, D82)
4. "Every run is durable and replayable. Agent steps, reviews and receipts are recorded, so a resumed run returns what happened instead of guessing again." (D81, D82, F98.77–81, F99.5)
5. "One person can run the whole loop; an organisation can add named reviewers, approvals and agent limits when it needs them. The same flow, with stricter settings." (D120, D122, D129, `governance.rs`). Do not use "across teams" until revision rationale, run history, review comments and a sharing model beyond copy-only presets exist.
