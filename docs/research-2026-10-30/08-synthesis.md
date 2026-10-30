# 08 Synthesis: Functionary, described from the F98 direction

Root for every `ops/`, `crates/`, `web/`, `benchmarks/` path: `~/Projects/Functionary/.worktrees/integration/f98` (HEAD `f5b07c87`, 2026-10-30). Read-only; nothing was modified.

Sources: the seven research reports (`01`–`07` in this folder), plus a direct re-check of the founder messages, the decisions ledger and the code for every point where the reports disagreed (see §4.3).

Status words:
- **BUILT** means the code is on `integration/f98` with tests. That branch has not landed on `main` (D126 #4).
- **DECIDED** means ruled in `ops/backend-refactor/decisions.md` or the 2026-10-29 Block Ontology Decisions Log, and not built.
- **IDEA** means registered, parked, or not v1.

Short names used throughout:

| Short | Path |
|---|---|
| WFI | `ops/planning/2026-10-19 - What Functionary Is.md` (Appendix msgs 1–34 are verbatim) |
| BOL | `ops/planning/2026-10-29 - Block Ontology Decisions Log.md` |
| DEC | `ops/backend-refactor/decisions.md` |
| ARCH | `ops/planning/2026-10-29 - User Archetypes.md` |
| IAI | `ops/planning/ideas/identity-authority-intent.md` (its `limpid comment` blocks are "the user's words", §4 header line 242) |
| DRIFT | `ops/planning/feedback/2026-09-29 14:07 - Backend prototype drift correction.md` |
| BSS | `ops/planning/feedback/2026-09-29 - Backend session statements.md` |
| GF | `ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/sources/user-steering.md` |
| US | `ops/backend-refactor/sources/user-steering.md` |
| CLOSE | `ops/planning/feedback/2026-10-15 - F98 closure review rulings.md` |
| TH | `ops/planning/2026-10-02 - Technical History and Design Judgements.md` |
| HANDOFF | `ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` |

TH is a compiled retrospective, but its "Data model" and positioning bullets are first person and keep the founder's typos ("evlauable", "abouut").

---

## 1. What Functionary is

These paragraphs are written in Tristan's voice. They are built from WFI msgs 1–34, DRIFT, TH, GF U4 and the 2026-10-29 rulings. Nothing here is in quotation marks, because no passage is verbatim from start to finish. The sentences that are close to verbatim appear in §6 with their sources. Bracketed numbers point to the source notes after the prose. Paragraph [10] and parts of [11] describe DECIDED work; they use "will", and copy must keep that tense until the work ships.

**The work.** Functionary is for almost anything an early-career consultant, research assistant or data analyst does. Do secondary research on a market and find the major players. Comb through a thousand documents for evidence and counterevidence on a claim. Put together a model from market data and filings. Find data sources, filter them for quality on five criteria, clean them, and populate the model. Run QC on a work product against the original sources. These are fairly straightforward tasks. AI has been able to do them for about two years. [1]

The problem for an organization is that the process is really messy, and it isn't easy to fix when something goes wrong. Each of those tasks is dozens to hundreds of things happening. None of them is hard in isolation, and errors creep in. I've watched this happen on research projects I've worked on. The principals had no idea what was happening down below, and they were constantly worried about little errors creeping in. So they paid for footnote checking and for costly replications. [2]

**Process, not capability.** In each case the process the people doing the implementation were following wasn't clear and visible from above. The conventional answer is to replace the people doing the implementing with agents doing the implementing. That's a reasonable first thing to build, but it leaves the visibility problem where it was. Maybe nothing will ever go wrong in an agent plus adversarial review loop. Maybe the mess is fine and the costs are trivial next to the benefits. Most people seem to think so, and they may well be right. Functionary is for the people who are exposed if they're wrong. [3]

**Contamination.** In code, a creative solution that refactors something to make it work is usually a help. In research it's how things go bad. When unvetted language or sourcing creeps into the pipeline, it can contaminate the whole thing. If you're automating research, you have to check things exhaustively. It's not hard to remember to ask whether the agent could even reach the sources. It's easy to forget. When the research is one step inside a bigger agent, it's hard to know whether the big agent asked the little agent which sources it could actually see. The longer the chain, the harder it is to tell what happened, and the bigger the chance your results are invalid because an agent skipped a step and papered over it. [4]

Organizations whose reputation rests on research output go through this all the time. There's no real-world product. You're selling good words. If it becomes clear the words aren't good, you have nothing. So you track down what went wrong and which detail got missed, and you set up the system so you never make that mistake again. You can't really do that with a freestyle agent. You can beg it in your markdown file not to do stupid things and hope for the best. [5]

**Control from above, made cheap.** Automated agents make it much easier to control the process from above. Micromanaging used to be expensive. Now you instruct a coding agent to do the micromanaging for you, then look at the process it wrote out and check that it's reasonable. It's easy to tell when it isn't. You see it immediately, the same way you can tell a plan has holes when someone walks you through it. [6]

**What has to be true.** For that to work you need strong invariants. The flowchart you're looking at has to be what gets executed, and problems can't get handled by improvised solutions without you knowing. So the goal is to reduce agent cleverness to zero. The agent writes the particular subset of Rust we tell it to, and until it does, we deny. Fail-closed. The rules:
- No loops or branches outside the visible control structures.
- No hard-coded data.
- No file read that isn't a step on the canvas.
- One execution model.

Failures are values. A step that didn't run says so, an empty result is different from a failed one, and nothing gets dropped quietly. Don't crash. Don't proceed silently either. [7]

**How it's built.** A coding agent writes the flow in that restricted subset of Rust. The checker reads the graph straight from the source without running it, and the canvas draws that graph one to one. When you edit on the canvas, the edit goes back into the source. You never have to read the source; the canvas is sufficient. [8]

The agent can only string together pre-written steps and built-in control structures. Everything on the canvas is one of seven kinds:
- **Sources** bring data in.
- **Blocks** make judgements.
- **Transforms** do pure work like filtering and joining tables.
- **Jigs** are the visible loops and retries.
- **Gates** decide whether a value goes on.
- **Egress** sends it out.
- **Agent** covers the one free-form step.

A Block is a delegable unit of judgement. Every Block calls a model, and each one is a job you could hand to anybody at an org: summarize while keeping track of the source text, judge this source against these criteria, search, pull the passages that bear on a question. Each takes a lot of design, testing and tweaking to do its one job well. It carries a tuned prompt the agent never edits, and the model inside it can do only what the block lists. [9]

Every wire will carry its origin: from a source, computed from a source, written by a model, checked, or reviewed. A model-written value stays marked through everything downstream, and only two things clear it. A Check compares it deterministically against the source, for example that a quote is an exact substring of the document. A Review is a person approving it. A block's self-check doesn't count: more effort buys a better first draft, not an independent look. A destination like the knowledge base will be able to refuse anything nobody cleared. Search will report, for each source, whether it was reached, denied or timed out, because permission and failure are different things. [10]

Every model call, tool call, review decision and write leaves a receipt. A run pins exactly what it will run when it starts. If it stops halfway, it resumes from its receipts and doesn't ask the model again. Results land in knowledge tables, and committing a table makes an immutable revision. A set of related tables will commit as one revision, so nobody reads the edges without their claims. Test is a dry run of the same program: everything runs except the writes, including the reads and the model calls. When the Test looks right, you escalate it to a Run without redoing the work. [11]

**Who it's for.** Two people, often the same person in the same week. The Associate works in a browser and doesn't think of themselves as technical. They paste a transcript, upload a file, or point at a list of URLs. An agent builds the flow. They look at it, change a setting or delete a step, and run it again. They never see the word pin. The Automator runs a process for real, watches it make mistakes, and changes the flow until it can run unattended. Most flows get built, adjusted, run, adjusted, run, and then rarely used again. That loop carries no versioning friction. You ask for the friction (pins, approvals, named reviewers) when you want to stabilize. From then on the process learns: every fix is a change to a visible step, and every later run inherits it. [12]

**What it isn't.** It isn't a chatbot. It isn't n8n with an AI node, which draws the plumbing and leaves the judgement in a black box. It isn't a coding harness either. The closest thing I've used is Claude's workflow tools. All I get out is transcripts and a workflow.js that calls each subagent at the right time. In a codebase, later review usually turns up the problems. For research I end up going with it on pure vibes. And Functionary doesn't make agents trustworthy. It limits their scope and information, and it splits their judgements into steps you can evaluate one at a time. The model doesn't improve. The process learns. [13]

### Source notes for §1

1. WFI msgs 1–2.
2. WFI msgs 3–4, 8–11. The founder names SSPI and BRG. **Ask before naming either in public copy** (report 07, row 19).
3. WFI msgs 5–7, 12–14.
4. WFI msg 18.
5. WFI msgs 19–26. The markdown-file line also appears in TH line 44 ("sternly instructing it … is not a solution").
6. WFI msgs 15–16.
7. WFI msg 17; DRIFT High Level Goal and item 7; US U14 ("Fail-closed is absolutely the model"); BSS ("I don't want a double execution model"); US U22 ("don't crash. Do not proceed silently either"). Mechanisms BUILT: `crates/functionary-flow-check/src/screen.rs` (70 tests in `tests/screen.rs`); D78 literal allowlist; D34 `Outcome = Value | Failed | Absent`; D76 Filter `Mark` default.
8. P3, P7 (`ops/planning/2026-09-29 - Backend Guiding Principles.md`); D42; D116 #8 ("The canvas is sufficient; reviewers never read source"). BUILT: `functionary-flow-check`, `flow_source/projection.rs`, the edits route.
9. WFI msg 27; D135 (seven kinds, DECIDED; the `Kind` enum is BUILT, F104.23; the canvas is not yet painted by kind, F104.21 open); D155 admission test; P6; D61 closed tool vocabulary (BUILT, `crates/functionary-agent/src/lib.rs`).
10. D139 (origin), D146 (two kinds of review), D148 (Check), D150 (floors on Commit), D141 (Search access status), CLOSE #12 ("distinguish between Permission and Failure"). **All DECIDED; F104.3, F104.10, F104.13, F104.34 open.**
11. D82, D44 (receipts, pinned run, replay: BUILT, F98.77–81, F99.5); D40 and `crates/functionary-flow-exec/src/commit.rs` (commit: BUILT); D150 commit sets (DECIDED, F104.12); D97 (Test dry run and Escalate: BUILT). D97 #2 says reads and provider calls do run in Test.
12. ARCH (Associate, Automator); D120 #1; D131 (user's words on versioning friction); D132 #1; D129 strict mode (policy BUILT, enforcement F101.98 open).
13. WFI msg 34; TH line 45 ("does not make the agents trustworthy … The process improves, not the model"). The n8n contrast comes from the 2026-06 interview (HISTORICAL). Keep it to one line.

---

## 2. The three angles

### 2(a) "Functionary is the agent harness for knowledge work"

**Verdict: partly.** The narrow sense is supported: Functionary is the constrained place where agents do knowledge work, with a closed action set, receipts and a readable plan. The broad sense, "Claude Code for analysts", overclaims.

**Strongest support**
1. The founder's thesis is a constrained agent environment for white-collar work, set against coding harnesses. WFI msg 27: "the agent can only string together blocks of pre-written code that call out to subagents to do very specific, easily evaluable tasks". WFI msg 34 calls the workflow-tool comparison "almost no guarantee about what actually happened".
2. Tool control is "the product". GF U4: "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER … That is the product." This is recorded as D61. The founder used "harness" in this sense for inner agents ("inside the custom harness", GF initial steering).
3. The closed-vocabulary loop is BUILT:
   - `crates/functionary-agent/src/lib.rs`: schemas and parser come from one enum; an unknown call is returned to the model as an error; acceptance is decided by the block, not the model; replay is strict.
   - Filesystem Search uses it in production (`crates/functionary-flow-blocks/src/search_resources.rs`).
4. Agents compose and never implement. DRIFT says "The only thing agents can do is wire together blocks." The allowlist checker that enforces this is BUILT (`crates/functionary-flow-check/src/screen.rs`).
5. Agent authority is modelled and BUILT (F98.207, `governance.rs`):
   - An agent is never an owner (D120 #2).
   - It runs Test only by default (D122 #1).
   - It never approves a revision (D129 #6).
   - It does not inherit its human's review-disclosure grant (D121 #4).
6. The internal vs independent review split exists in the ledger and nowhere in a coding harness. D146 is DECIDED.

**Counterevidence**
1. "Harness" is not product vocabulary. ARCH line 37 defines the Associate as someone who "rarely or never use[s] agent harnesses, terminals or code editors".
2. The glossary makes Claude Code and Codex *outer agents that write into* Functionary (`ops/planning/backend-ground-truth/glossary.md:9-17`). Functionary is the language they target and the verifier that checks them, not a peer.
3. The authoring agent a user actually meets teaches the retired model. **Verified:**
   - `crates/functionary-server/src/project_agent/turn.rs:2753` defines `CANVAS_FIRST_AUTHORING_CONTRACT`, which opens with `add_canvas_sketch`, and `:2881` appends it to every system prompt.
   - `restricted_client.rs:57-70` offers seven restricted tools (list, create, read, edit, check, read_layout, arrange) and **no Test tool**.
   - F101.10, which removes the legacy tools, is open.
4. Only one inner agent runs. Judge is removed from the production catalog (`crates/functionary-flow-lower/src/v1.rs:61-63`).
5. firm-answers §15 calls the in-app agent a stopgap, "not a statement of product direction". D122 #4 retired the canvas agent's loop.
6. The founder concedes the incumbents "may well be right" (WFI msgs 5–7). TH line 45 says the product "does not make the agents trustworthy".
7. The Automator gaps (hooks, alerting, custom blocks) are explicit (ARCH "Gaps today"; D134; P9).

**What we need to do better, ranked**
1. **Switch the authoring agent to the restricted backend.**
   - Finish F101.10.
   - Replace `CANVAS_FIRST_AUTHORING_CONTRACT` with a restricted-Rust contract covering P1–P5 and D153.
   - Add a restricted Test tool; D122 #1 already permits it.
   - Generate the palette from `production_catalog()`, following F100.43's rule.
2. **Ship few-shot flows as a product surface** (ARCH "Gaps today"). Settle the conflict with firm-answers §1 ("without examples") in one ruling.
3. **Land F104.3, F104.10 and F104.15** (origin, Check, Quote/Anchor). These are what make Functionary concretely different from a coding harness.
4. **Rule F101.5 Q1–3, then build F101.89 and F104.19,** so the sketch agent, the freestyle on-ramp, has a production caller.
5. **Package the external-harness path.** Expose the CLI's restricted commands (`crates/functionary-cli/src/client.rs`), the grammar and the checker diagnostics as an agent-facing kit (firm-answers §15).
6. **Document or constrain the outer agent's tool surface** on the `claude_cli` sidecar (`crates/functionary-llm-sidecar/src/cli_runner.rs:262-279`).
7. **Build Quote and Compare on `functionary-agent`,** with F103 three-arm goldens (D146).

**What the record supports.** Do not lead with "harness" for the Associate. Use:
- "An agent builds the process. It can only wire together trusted steps, and each step's model can only do what that step lists. You check the plan, not the transcript." (DRIFT; D61; P7)
- The founder's line: "The only thing agents can do is wire together blocks." (DRIFT, 2026-09-29)
- For technical readers, after item 5 above: "Bring your coding agent. Functionary decides what it is allowed to build."

### 2(b) "Flows provide a stable, visible object for iteration and process learning across teams"

**Verdict: partly.** "Visible", "iteration" and "process learning" are supported. "Stable" is opt-in by design. "Across teams" overclaims.

**Strongest support**
1. **Visibility is the founding invariant,** and it is BUILT:
   - P7 makes the canvas the verification step.
   - D42: source is canonical and the graph is derived, because "strict isomorphism is what makes 'code you see is what executes' verifiable".
   - D116 #8 makes the canvas sufficient on its own.
   - The founder's version is WFI msg 17.
2. **Identity is conservative across edits** (D36; `crates/functionary-flow-ir/src/reconcile.rs`, "it never guesses"). When matching is ambiguous, the step gets a new identity and its review is invalidated.
3. **Approvals cannot slide onto changed work.** D81 keys approval on the inputs behind the output, not on its text (the contract A/contract B example).
4. **The founder names the correction cycle as the product's reason to exist.** WFI msg 25: "setup the system so that we never make the same mistake again". ARCH calls the canvas, for the Automator, "a stabilizing artifact".
5. **Runs are stable objects** (BUILT): D82 pins the definition at start; receipts, replay and durable pause/cancel are F98.77–81 and F98.262.
6. **Knowledge commits are immutable revisions scoped to the tenant** (BUILT, D112 #1, `commit.rs`). Review binds pinned table revisions (D113 #4).
7. **The formalization ladder exists as policy:**
   - Strict-mode policy and per-revision approvals are BUILT (F101.96, F101.97).
   - Named reviewers in Governed tenants are BUILT.
   - Trigger-pinned revisions are BUILT (F101.43).

**Counterevidence**
1. **"Across teams" has no basis in the record:**
   - Multiplayer is "not v1" (D27; US U23).
   - The default is one person (D120 #1).
   - Sharing between flows is copy-only, and the founder said "All of this is hypothetical … I don't care right now" (D125).
   - Imports are same-project (D131 #6), and cross-tenant sharing is forbidden (D102 #5).
   - The founder's frame is a principal over implementers (WFI msg 12), not peer teams.
2. **Stability is opt-in by decision.** D132 #1 calls mandatory pinning a bad idea, and the Associate "never see[s] the word 'pin'" (ARCH).
3. **The history records who and what, never why.** `flow_source_revisions` has no message field. Config-only edits are not revisions (`crates/functionary-server/src/flow_source/store.rs`, PinnedRevision doc). There is no route to open or diff a past revision.
4. **Composition is "never finally signed off"** (GF U4; D60/D83).
5. **The approve flow is incomplete:** gate wiring (F101.98) and the approve button (F101.99) are both open.
6. **Team-facing surfaces are missing:**
   - Restricted run history (`/flows/{id}/runs` is POST-only, `run_routes.rs:67`).
   - Review comments (the answer is approve or reject "and nothing else", `review_routes.rs`; D147 comments port DECIDED, F104.11 open).
   - Alerting (ARCH "Gaps").
   - Audit read.
   - Knowledge hand edit (F101.92 and others open).
   - Formalization measurement (F102.2 open).

**What we need to do better, ranked**
1. **Give each revision a "why":**
   - an optional note on `revise` and `edits`;
   - a "caused by run X / review Y / failed Check Z" link, filled in automatically when an edit follows a failure.

   Without this, ARCH's "the revision history is the record of why it looks the way it does" is false.
2. **Put behavioural config edits into history.** Today the Automator's most common fix, tightening a setting, leaves only an undo entry, and undo is capped at depth 100 (`open-questions.md`, "Undo and redo").
3. **Ship the read side of stability:**
   - open revision N on the canvas;
   - diff N against M (the reconciler already computes the changes);
   - a restricted-backend run list per flow, with each run linked to its revision.
4. **Make "never the same mistake again" structural:** F104.3 (origin on wires), F104.10 (Check), F104.11 (Review comments port).
5. **Finish opt-in strictness:** F101.98, F101.99, and F98.263 (resume-as-starter, with an audit event).
6. **Decide what "shared" means before claiming it.** Either scope the claim to one principal plus their agents and reviewers, or revisit D27 and D125 with a real multi-person case.
7. **Measure learning** (F102.2; `open-questions.md` §11). Until then, "the process learns" is a narrative claim backed by revisions, not by data.

**What the record supports**
- "The flowchart is the record of how the work gets done. When something goes wrong, you fix the step, and every later run inherits the fix." (WFI msg 25; D82; D36)
- "Iterate without ceremony. When it matters, pin it, require approval, and every run records exactly what it ran." (D132 #1, D131 #5, D129, D82)
- "One person can run the whole loop. An organization can add named reviewers and approvals when it needs them." (D120, `crates/functionary-schema/src/governance.rs`)
- Founder words: "for that adjust and run iteration loop, there shouldn't be versioning friction. Users ask for that friction when they want to stabilize and formalize." (D131, 2026-10-29)
- Replace "across teams" with "from above": the principal, and the people and agents doing the work.

### 2(c) "Functionary provides a pit of success for setting up agent flows that don't deviate"

**Verdict: partly.** Execution fidelity is BUILT: the run is the composition shown. Content fidelity (no unvetted model output reaches a trusted output unmarked) is DECIDED and unbuilt. Even when it ships, the design makes deviation visible, not impossible. "Don't deviate" overclaims. "Can't deviate without it showing" is the earnable version, once F104 lands.

The founder already used the phrase, with a limit attached. IAI §4.6, line 334: "Well, sure, but the canvas can't do everything, it can only provide a pit of success."

**Strongest support**
1. **A fail-closed screen** refuses `for`, `while`, `if`, `match`, closures, macros, `unsafe` and naked I/O (`screen.rs`, 70 tests including `q01_table_unsupported_call_rejects` for `std::fs::read_to_string`). D78 limits literals.
2. **One execution model:**
   - The graph comes from source without running it (P3).
   - Code compiles on Test/Run in a `bwrap` sandbox with no network (D07, D92 #3; `crates/functionary-flow-compile/src/lib.rs`).
   - The same rules apply to agents and humans (D99 #16).
3. **A wrong wire is a compile error,** with no silent coercion (D79; `should_reject_an_implicit_conversion`).
4. **Failures cannot hide.** D34 `Absent` vs `Failed`; D71 a handler cannot swallow a cause; D76 Filter marks rather than drops; Refine exhaustion pauses for review (D118 #4).
5. **Safe defaults:**
   - Test is a dry run (D97).
   - Agents are Test-only (D122 #1).
   - Budgets and windows are Credential-class, so agents cannot raise them (D116 #6, D118 #4).
6. **Inner agents** can do only what their enum names (D61; `functionary-agent`).
7. **Ergonomics, one datum:** pilot-02 passed 10/11 tasks on the first attempt and 11/11 within two repairs (`benchmarks/backend-flow-forms/pilot-02/README.md:55`). Compare the founder's account of the old DSL: agents "would just fail several turns trying to get the syntax right" (WFI msg 33).

**Counterevidence**
1. **Nothing on the wire yet marks a model-written value.** HANDOFF §1 says "Nothing is built yet". F104.3, F104.10 and F104.15 are open (verified in `ops/task-loop/tasks/`).
2. **Floors are optional and their policy is open:**
   - D139 says a destination "may declare" a floor.
   - F104.34's spec leaves the Sourced/Computed default as `SPEC_GAP` and the opt-out unbuilt.
   - D150 gives Notify no floor.
3. **The sketch agent is "able to flout the type rules"** (D135). Its output is fenced only at a floored destination. F101.5, the policy on where it runs and what it may call, is open.
4. **Production cannot branch on any condition today.** Judge is removed (`v1.rs:61-63`), and Check does not exist. `descriptor.rs:82-91` asserts that Judge, Coalesce, Filter, Sort and Select are not executable.
5. **Judgements stay model-written forever unless a person reviews them.** Check discharges only substring, schema, hash and predicate claims (D148). For the founder's evidence-combing job, the evidence/counterevidence call is never machine-verified.
6. **The record has inconsistencies** (from report 04; the ledger lines were not re-read here):
   - D121 #2 (table into Template renders as markdown) is an implicit conversion, against D79 and D46.
   - D78 still says "exactly two" literal forms after D121 #1 added a third.
   - D130 #5 computes `quote_found` with a Mutate, which D139/D148 would leave as model-written rather than checked.
7. **Between runs, a flow can change underneath an Associate.** Imports float (D131 #4, D132 #1), and there is no revision approval by default (D99 #1).
8. **The ergonomic evidence is thin.** pilot-02 used one model, one repetition and 11 tasks in the pre-ontology vocabulary. The trial palette is hand-written and has drifted before (D94; F100.43). The in-product agent gets no grammar or examples (see 2(a)).
9. **Vocabulary coverage is incomplete.** The Extract study scored 24 intern tasks: 12 covered, 8 partial, 4 gap (BOL line 363). Custom blocks are not v1 (P9; BSS "Let's defer custom blocks for now").
10. **The founder hedges this themselves:** "at least in theory" (WFI msg 28); "slightly ocean-boily" (msg 29).

**What we need to do better, ranked**
1. **Land the content-fidelity guarantee** before any public "don't deviate" claim: F104.3, F104.33–36 and F104.10.
2. **Rule the floor policy:**
   - default floors on every durable Egress;
   - the opt-out set only by a Credential-class field or an org rule, never by an agent;
   - a decision on Notify to external recipients.
3. **Make "a stopping rule is a Bool from Check" true in code:**
   - Check predicate mode;
   - Refine and Branch take `check.bool`;
   - resolve Q7 (`T -> (Bool | Verdict, T)`) so adversarial review can be expressed.
4. **Reconcile D130 #5 with D148,** so `quote_found` is a Check.
5. **Close the D121 #2 conversion leak** with a visible Format step, and amend D78's text.
6. **Generate the authoring palette and push the type check after every agent edit** (D32 currently makes the check pulled), using the generated palette from 2(a) item 1.
7. **Build canonical example flows** (ARCH "Instructions for agents").
8. **Re-run the authoring trial on the ontology vocabulary:**
   - two models, held-out tasks;
   - tasks for Check, Quote, Join attach and a procedure;
   - one task where a sketch agent is the tempting answer.
9. **Build F104.17 procedures** so the safe composition is one click. Revisit Model presets in a framing the founder accepts (D144: they were parked).
10. **Thread model provenance into the review key** (D96 deferred item).

**What the record supports**
- Now: "The flowchart is the program. If the agent writes anything outside the allowed steps, it doesn't run." (DRIFT item 7: "until it does, we deny"; P3; BUILT)
- Now: "Instructions in a markdown file are advice. Functionary puts the rules in the structure." (WFI msg 26; TH line 44)
- After F104.3, F104.10 and F104.35: "Anything a model wrote stays marked until a check or a person clears it." Say "marked", not "blocked", unless floors become defaults.
- The founder's own framing, for an essay: "the canvas can't do everything, it can only provide a pit of success." (IAI §4.6, 2026-10-19)

---

## 3. The other angles

### Surviving

1. **Control from above, made cheap.** An agent can write out a process in full at almost no cost, and a person judges a written-out plan at a glance. This is the sharpest current framing.
   > "it's no longer costly to micromanage everything the agent does because you can just instruct a coding agent to do the micromanaging for you, then observe that the micromanged process the coding agent output looks reasonable." (WFI msg 16)
2. **Contamination / selling good words.** In research, one unvetted source invalidates the deliverable. This is the lead story for the Associate.
   > "you're selling good words" (WFI msg 22)

   The mechanism is DECIDED (D139). Describe the problem now; promise enforcement later.
3. **The flowchart is the program.** Use the copy line "what you see is what runs", but do not attribute it to the founder. Keep the founder's hedge.
   > "whatever flowchart you're seeing is more or less exactly what gets executed" (WFI msg 17)
4. **A block is a job you could hand to a junior.** Each step's model has a closed tool list and a checkable contract (D61, D155).
   > "examples are steps you could delegate to anybody at an org" (WFI msg 27)
5. **Trust the parts the way you trust software.** The hard part is general-purpose agents, so you read their wiring off the canvas.
   > "We all already know how to trust a piece of software to do something---I'm doing it right now as I type into this interface. What's difficult is general purpose agents, and that's the trust problem we're interested in solving." (IAI line 321)
6. **Small checkable judgements beat one big task.**
   > "You can tell when a summarize has failed to summarize." (IAI line 278)

   Also TH: "It is much easier to judge whether this AI agent summarized this particular document correctly … than it is to throw a large, underspecified task at an agent".
7. **The process learns, not the model.** Fixes become structure, with history. Do not imply that it improves itself.
   > "you setup the system so that we never make the same mistake again." (WFI msg 25)
8. **"Found nothing" is not "didn't look".** Coverage has to be visible from above (BOL line 90; D138 placeholder rows, DECIDED). Search@v1 searches granted local files only, so do not promise exhaustive web coverage.
   > "We should distinguish between Permission and Failure." (CLOSE #12)
9. **The tie back to the source.** Run-level and cell-level lineage are BUILT. Anchor and quote checks are DECIDED (D144, D148).
   > "the uniting thread is harvesting relevant information from sources and keeping the tie back to the original source clean" (BOL line 363, user direction)
10. **Agents compose; they don't implement.** BUILT.
    > "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." (DRIFT item 7)
11. **Instructions are not enforcement.** Keep the founder's nuance: memory files help, but they are not a guarantee.
    > "you can just beg it in your markdown file not todo stupid things and hope for the best" (WFI msg 26)
12. **Against coding harnesses and workflow tools.** This is now the primary foil. Name the category; name Claude only with the founder's approval.
    > "i basically just have to go with it on pure vibes and trust that what it did was reasonable" (WFI msg 34)
13. **Iterate, then stabilize** (progressive formalization). D120, D132.
    > "Users ask for that friction when they want to stabilize and formalize." (D131)
14. **Two kinds of review, and sampling.** Self-review shares the agent's blind spots; an independent step does not (D146, DECIDED). Replicate is DECIDED. There is no clean founder line on internal vs independent review, because BOL S20's ruling body is agent-written. For sampling:
    > "when things really matter, you should sample many times and get a sense of the shape of the distribution of possible answers" (IAI line 250)
15. **Positive reproduction.** Paste a chat answer and check each claim against its source. Partly built (F100.12–15); the paste UI (F100.10) is open. Frame it as "what we're building".
    > "Showing the process by which \"just anyone\" reaches a conclusion is the express goal of Functionary." (`ops/planning/ideas/consume-reproduce-integrate-chatgpt-claude-transcripts.md`, 2026-10-15)
16. **A flow is a function** (D12, D131 modules).
    > "A flow is basically a function, which is the whole idea behind modules anyway, at the end of the day (Functionary is the name of the product...)" (US U14)
17. **Blocks manage upward.** The flow's goal travels with each task, and a block can flag what bears on it. IDEA (observation channel); essay only.
    > "We allow the little functionary blocks to manage upward if they want." (IAI line 280)
18. **The origin story: footnote checks and replications.** Strong essay material, but ask before naming SSPI or BRG.
    > "the principals on the projects have no idea what was happening down below and they're constantly worried about little errors creeping in" (WFI msg 10)

### Retire

| Angle | Reason |
|---|---|
| "Verify the process once; stop checking every run" | GF U4: "Flow composition isn't something we ever fully sign off on." D60, D81, D83. |
| Compile to a standalone binary / take it anywhere | D49 (no export in v1); P8 ("v2 concern"). WFI msg 27 says it, but that sits under "at least in theory". |
| "Functionary makes agents trustworthy" | Contradicts TH line 45. |
| Collaboration "across teams", multiplayer | D27, D120, D125, D131 #6. |
| Nothing leaves the machine in Test; local-first as no egress | D97 #2 (reads and provider calls run in Test); D62 (OpenRouter); F99.17 (local inner-agent model blocked). |
| Exhaustive coverage of every source | `ops/planning/ideas/exhaustive-coverage-search.md` is an IDEA, and it says itself that this cannot be promised; Search@v1 is local files. |
| Discretion gradient, enframement, Sketch → Test → Graduate, Agent Sketch, Freestyle | D121 #8, D133 #4, D123 #1; superseded by ARCH. |
| Flows as readable JSON | P8, D126 #1, D133. |
| Organizational control (Philosophical Claims §9) | D120 rejects imposed formalism, and the claim is on the banned vocabulary edge. |
| ASI not required / technology as a tool | No benchmark evidence (report 07, row 23). |
| Trust visualization, void block, unverified-wire mechanism | 2026-06 mechanisms, HISTORICAL. Origin (D139) replaces them. |
| n8n as the primary foil | The 2026-10 founder messages never mention n8n. Keep one line at most. |

---

## 4. Status honesty

### 4.1 What copy must respect

BUILT means on `integration/f98`, which has not landed on `main` (D126 #4). Distribution and licensing are undecided (`ops/planning/STATUS.md:559-564`), and the worktree has no LICENSE.

| Capability | Status | Evidence |
|---|---|---|
| Restricted Rust, fail-closed checker, graph read from source on save | BUILT | `functionary-flow-check`; D07, D32 |
| Sandboxed `rustc` on Test/Run; parallel async execution | BUILT | `functionary-flow-compile`; `functionary-flow-lower` |
| Canvas from source; edits written back; undo/redo; card titles, accents, collapse | BUILT | F98.228; F101.137, F101.138 |
| Executable: Source (file, document_ref, url, integration), TableSource, Field, Search (local files, Row input), Summarize, Template, HumanReview, Write (to a knowledge note), Format ×5, Map, Repeat, Retry, Refine, Branch | BUILT | `v1.rs` production; `descriptor.rs` |
| Judge, Coalesce, Filter, Sort, Select | declared, **not executable** | `descriptor.rs:82-91`; `v1.rs:61-63` |
| Closed-vocabulary inner-agent loop; strict replay; one production instance (Search) | BUILT | `functionary-agent`; D61 |
| Receipts, sub-receipts, pinned run, replay, durable pause/cancel/resume, budgets | BUILT | D44, D82; F98.77–81, F98.262, F99.5 |
| Test as dry run (reads and model calls do run); Escalate | BUILT | D97 |
| Outcome Value / Failed / Absent; path-local failure | BUILT | D34, D10, D33 |
| Commit run tables to knowledge as immutable revisions | BUILT | `commit.rs`; D40 |
| Records as runtime values; private model registry | BUILT | D100, D101 |
| Privacy labels and locality; OpenRouter `data_collection: deny`; inner agents on DeepSeek V4.1 Flash only | BUILT | D37, D62, D156 #4 |
| Personal/Governed tenants; agent credentials; agents Test-only by default | BUILT | D120, D122; F98.207 |
| Strict mode | policy and approval store BUILT; **run gate and approve button not built** | F101.96, F101.97 done; F101.98, F101.99 open |
| Seven kinds | `Kind` enum BUILT (F104.23); checker `kind_of` committed (`c93aa5ce`, `derive.rs:1515`); canvas still paints every card orange | F104.21 open; `toFlow.ts:145` |
| 21 integration readers | BUILT, read-only and offline-tested; Postgres and MySQL are driver stubs | F101.34–40 |
| Triggers (schedule, webhook, email, manual) | BUILT backend, no UI | F101.43–46; D134 |
| Project agent | BUILT with seven restricted tools; **legacy prompt, no Test tool** | `turn.rs:2753`; `restricted_client.rs:57-70`; F101.10 open |
| Sketch-agent library (vocabulary, trace, stabilize) | BUILT library, **no caller** | F101.85–88; F101.89 open |
| Model, Quote, Compare, Draft; Check, Declassify, Redact; Notify, Apply; Aggregate, Join, Stack, Reshape, Mutate lowering; Replicate | DECIDED | D140–D154; F104.* |
| Origin axis, floors, red wire before the run | DECIDED | D139; F104.3, F104.33–36 |
| Anchor on every harvested value; quote substring check | DECIDED | D144, D148; F104.15, F104.10, F104.69 |
| Query-shaped Search with modes and per-source access status | DECIDED | D141; F104.13 |
| Nested tables; flatten keeps placeholder rows | DECIDED | D138; F104.5, F104.9 |
| Commit sets; Write to file or integration | DECIDED | D150; F104.12 |
| 20 procedures (Best of N, Adversarial review, Consolidate…) | DECIDED / IDEA | D143; F104.17; F103 |
| Review comments port, approve with edits, timeout, assignee | DECIDED | D147; F104.11 |
| Internal vs independent review; effort presets | DECIDED | D146; F104.18 |
| Knowledge hand edits | DECIDED | D128; F101.92, F101.112, F101.117 |
| Cross-file imports | DECIDED (slug syntax only built) | D131; F101.121 done, F101.122–131 open |
| Paste-a-transcript reproduction | DECIDED, partly built | D130; F100.12–15 done; F100.10, F100.8, F100.9 open |
| Sketch-agent node | DECIDED kind, policy open | D135; F104.19; F101.5 |
| Resume as starter, re-authorised; Timer and Rate waits | DECIDED | D132 #2; F98.263, F98.231, F98.240 |
| Review on a block; exhaustive/web search; observation channel; blocks manage upward | IDEA | D147/S28; `ideas/` |
| Standalone binary or export | IDEA (v2) | D49; P8 |
| Custom blocks, Script blocks | not v1 | P9; BOL "planned but deferred" |
| Multiplayer; sharing beyond copy | not v1 | D27; D125 |
| Alerting, hooks, few-shot or template gallery | not built | ARCH "Gaps today" |
| Model schema presets; Horizons; Checklist | parked | D144; D127; BOL S16 |
| Restricted run history UI; source view in editor; trigger UI; Notify/Apply/redline UI | not built | report 05 §12; D116 #8 |

### 4.2 Retired vocabulary

**Never in public copy** (Trust Thesis §4; site memory): harden, hardening, ossify, calcify, bureaucracy, principal-agent, agency cost, moral hazard, adverse selection, enframing, enframement, Gestell, ready-to-hand, context engineering, spider or web metaphor.

**Retired product vocabulary**, with what replaces each:

| Retired | Replacement | Ruling |
|---|---|---|
| Sketch · Test · Graduate | iterate → stabilize; Test survives only as the dry run | D121 #8, D133 #4, D97 |
| Agent Sketch (block or card) | sketch agent (Agent kind), not built | D135 |
| Freestyle (as a product word) | (none) | rejected 2026-06-19 |
| discretion, discretion gradient | origin | D139 |
| Graduate, Promote, Publish | Commit | D133 #2; US U23 |
| Flows are readable JSON | restricted Rust source | P8, D133 |
| Document / Record as the two payloads | Document, Table, Record | D137, D155 |
| HumanReview, HumanGate | Review | D147 |
| PivotLonger, PivotWider, Pivot | Reshape | D153 |
| ForEach, ForEachRow | Map | D14 |
| Collect | Format | D16 |
| Merge | Template | IAI line 256 |
| Map broadcast | Join attach | D153 |
| Partition Jig | Split procedure | D143 |
| Recover Jig | Retry + Coalesce | D80 |
| Independent Judges Jig | Replicate + Judge + Aggregate | D142 |
| Match block, Cluster, Extract block | Compare, Quote, Model | D144, D145 |
| Materiality, Rank | table verbs | D140 |
| Blind | Redact plus a per-block withhold setting | D149 |
| Comments block | Review option | D147 |
| "summarize" as the table verb | Aggregate | D152 |
| channels | modes | BOL S10 |
| Horizons | (parked) | D127 |
| Checklist Jig | (parked view) | BOL S16 |
| Production approval as the default | opt-in strict mode | D99 #1, D129 |
| Canvas agent; "the agent works on the same canvas you do" | (retired) | D122 #4 |
| "Free" model tier | (dropped) | D156 #2 |
| Old personas (Analyst, Ops Lead, Technical Founder) | Associate, Automator | ARCH |
| "Pen it in" | (site-only phrase; drop) | |

**Keep away from the Associate path:** pin, versioning, approval, roles, Rust, hyperformalism (ARCH; D120). "Replicate" is a disliked name (BOL), and "Model" is provisional (D106).

### 4.3 Where the researchers disagreed, checked at source

| Point | Claims | Checked | Who was right |
|---|---|---|---|
| F104.24 checker `kind_of` | 05: "parked"; 07: landed | `git log -S` finds `c93aa5ce feat(functionary-flow-check): F104.24 kind_of …`; `derive.rs:1515`. The task file still says `status: open` (the ops submodule was not bumped). | 07 on code; 05 read the stale task file |
| Project agent starting Tests | 05: "may … start Tests"; 02: no Test tool | `restricted_client.rs:57-70` lists seven tools, none of them Test; legacy `test_flow` is blocked | 02. D122 #1 allows it by policy only; the external CLI can do it |
| Judge in the production catalog | 07 §2 lists Judge as production | `v1.rs:61-63` `catalog.inner.remove("Judge")`; `descriptor.rs:83` | 05 and 06 |
| Strict mode "built" | 04: built (F101.19 done); 03 and 05: enforcement unwired | F101.98 and F101.99 `status: open` | 03 and 05. 04 overstates |
| Test is safe because nothing leaves the machine | ARCH line 70 vs 05 | D97 #2: "Source reads, provider calls, Jigs, `HumanReview` — runs as in Run" | 05. **ARCH line 70 is wrong and should be corrected** |
| D139's "mechanism behind the contamination story" | 03, 04, 05, 07 treat it as the ruling | The ledger marks the ruling "(user; S9)", but the Reason line is not marked user | It is the recorder's sentence, not a founder quote |
| TH as founder voice | 01: first person | The TH header says "retrospective summary … compiled", but the bullets keep the founder's typos | Usable as near-verbatim; date it 2026-10-02 and do not overweight it |
| The "pit of success" phrase | 04: founder's words | IAI line 334, in a limpid comment ("the user's words", line 242) | 04 |
| Map broadcast | Proposal §1 lists "+ broadcast" | BOL line 355 and D153: retired | 05 |

I did not re-read the ledger text for D78, D121 #1/#2 or D130 #5. Those inconsistencies rest on report 04.

---

## 5. Pitch structure proposals

**Register rules for all three:**
- Tight and specific. No abstraction-speak.
- None of these words: unlock, seamless, empower, supercharge, game-changing, robust, leverage, "in today's fast-paced".
- No em-dashes, no rhetorical questions, no triads for their own sake, and nothing from the banned list.
- Use "the process learns" for endurance.

**Visual rules for all three:**
- Draw the DECIDED kind colours (D135; report 06 §3), not today's all-orange cards (`toFlow.ts:145`).
- Edges are grey 2 px S-curves with no arrowheads.
- An origin styling has not been chosen. Any origin-marked wire must be captioned as design, not shipped.

### Structure A: the argument

**Thesis:** "Agents can do the junior work. Functionary lets you see how it got done."

| # | Heading | Job | Visual | Archetype |
|---|---|---|---|---|
| 1 | Hand off the work. Keep the process in view. | State the product in one line and show one real flow. | Site issue scan (`crates/functionary-flow-exec-oracle/flows/jig_tests.rs`, BUILT): TableSource → Map{Field → Source → Format → Summarize} → Format → Summarize → Review → Write. | Associate |
| 2 | None of it is hard. Any of it can go wrong. | The failure story: hundreds of small steps, a source nobody reached, a footnote nobody checked. | None. Prose carries it, which also suits mobile. | Associate and the principal above them |
| 3 | You're selling good words. | Contamination: a creative fix helps code and quietly spoils research. | One wire tinted "AI-written" running into a deliverable, captioned "planned: origin on every wire" (D139). | Associate |
| 4 | The agent writes the plan. You read it. | Control from above made cheap: the flowchart is the program, the agent can only wire approved steps, and anything else is refused. | The same flow plus a checker diagnostic chip on a refused `for` loop (`screen.rs`). | Both |
| 5 | Each step is a job you could hand to a junior. | Blocks, closed tool lists, receipts, Test as a dry run. | A Search card with its granted folder, beside the Run Inspector's per-row outcomes (`RunInspector.tsx`), with one failed row shown as a failed cell. | Associate |
| 6 | Fix the step, and the process learns. | Iterate → stabilize; history; opt-in pins and approvals for unattended runs. | History panel entries (`HistoryPanel.tsx`) and the Test / Run / Escalate toolbar. | Automator |
| 7 | What works today. | Honest status and the call to action; route mobile readers to desktop. | A two-column list: works now / being built. | Both |

### Structure B: the canvas first

**Thesis:** "The flowchart is the program."

| # | Heading | Job | Visual | Archetype |
|---|---|---|---|---|
| 1 | The flowchart is the program. | Show that the canvas and the executed code are one object. | Five-site digest (`basic_functionality.rs`, BUILT): three Source → Format → Summarize rows into Template → Summarize → Review → Write. | Both |
| 2 | Seven kinds of step. | Teach the palette: data in, judgement, pure work, control, decide, out. | Palette legend in kind colours (D135). | Associate |
| 3 | An agent builds it. It can only wire. | The agent composes trusted steps; the checker refuses anything else. | Diagnostic chip on a refused edit. | Both |
| 4 | Every model call leaves a receipt. | Receipts, pinned runs, replay without asking the model again. | Run Inspector outcomes per occurrence path (`/map/0/write`). | Automator |
| 5 | Test runs everything but the writes. | Dry run, then Escalate. | Toolbar plus a dry-run receipt for Write. | Associate |
| 6 | Results are tables. | Knowledge tables and commits as revisions. | `KnowledgeTablesView` row with a commit receipt. | Both |
| 7 | Add rules when the flow earns them. | Strict mode and named reviewers as opt-ins. | Governance select (`GovernanceSettings.tsx`). | Automator |

### Structure C: one job, end to end

**Thesis:** "Give it the list. Get back a table you can check."

| # | Heading | Job | Visual | Archetype |
|---|---|---|---|---|
| 1 | Start from what you have. | The Associate brings a list of URLs; no blank canvas. | A TableSource card with an inline spreadsheet body (report 06 §1.3). | Associate |
| 2 | An agent drafts the flow. | The agent turns the request into visible steps. | Canvas assembling left to right. | Associate |
| 3 | Run it as a Test. | Everything runs; nothing is written. | Running and completed card states. | Associate |
| 4 | Look at every row. | Per-row results; a page that didn't load shows as a failed row, not a blank. | `ForEachRunInspector` list: `row N · status`. | Associate |
| 5 | Approve what matters. | Review where you choose. | `HumanReviewPanel` modal ("Execution is paused. Review this output to continue."). | Associate |
| 6 | Run it again next week. | Same flow, new inputs; fixes stay fixed. | History entry plus a second run. | Associate moving toward Automator |
| 7 | When it has to run without you. | Pins, approvals and triggers, stated as what exists and what is coming (trigger UI is not built). | Short text list. | Automator |

### Recommendation: Structure A

1. It argues the way the founder argues: a concrete failure first, then the concession, then the mechanism (report 01 §3). It is also the only one of the three that carries "selling good words" and "control from above", the two framings that are both current and distinctive.
2. It works on a phone. The canvas is unusable at phone width (memory: `arachne-product-desktop-first`), and A's sections 2 and 3 carry the case in prose.
3. It handles build status cleanly. Every mechanism claim in sections 4–6 is BUILT. The DECIDED origin story is confined to one captioned visual in section 3 and to section 7.

Two parts of the other structures are worth keeping:
- B's palette legend can sit inside A §5.
- C works well as the "How it works" page. Swap its example to transcript reproduction once F100.10 ships, because that job is the founder's own QC task.

---

## 6. Quote bank: the 40 best for copy, current first

All quotes are verbatim, including typos and lowercase. Ellipses are not used inside quotes unless the source has them.

**2026-10-29**
1. "no broadcast, use the row." (BOL line 355; DEC D153)
2. "consistency is good, let's make sure we can do consistent sets" (BOL line 374, S44)
3. "Quote is good, add to extract" (BOL line 378)
4. "Anchor is good; should be polymorphic to handle anchoring to multiple source types" (BOL line 384)
5. "the uniting thread is harvesting relevant information from sources and keeping the tie back to the original source clean" (BOL line 363)
6. "Aggregate, that's very clear, with group by and compute." (DEC D152, line 2804)
7. "I don't want bad examples in the repo" (`ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/README.md:12`)
8. "keep what's built. we'll design automator later." (DEC D134, line 2458)
9. "for that adjust and run iteration loop, there shouldn't be versioning friction. Users ask for that friction when they want to stabilize and formalize." (DEC D131, lines 2366–2367)

**2026-10-19**
10. "almost anything that an early career consultant, research assistant, data analyst, etc. does" (WFI msg 1)
11. "these are fairly straightforward tasks that ai has had the capacity to do for like 2 years" (WFI msg 2)
12. "but the problem for an organization is that the process is really messy" (WFI msg 3)
13. "there are dozens to hundreds of things happening, none of which are hard in isolation, but errors can creep in" (WFI msg 8)
14. "the principals on the projects have no idea what was happening down below and they're constantly worried about little errors creeping in" (WFI msg 10)
15. "the process that the people doing the implementation are taking to do things wasn't clear and visible from above to the principal" (WFI msg 12)
16. "but actually having automated agents makes it much easier to control the process from above" (WFI msg 15)
17. "it's no longer costly to micromanage everything the agent does because you can just instruct a coding agent to do the micromanaging for you, then observe that the micromanged process the coding agent output looks reasonable. it's very easy to tell when it's not reasonable---you just see it immediately" (WFI msg 16)
18. "you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing." (WFI msg 17)
19. "in general creative solutions that refactor things to make them work are really helpful in code. but when unauthorized/unvetted language or sourcing creeps into the pipeline in one of these white collar tasks, it can contaminate the whole thing." (WFI msg 18)
20. "it's not hard to remember to ask, but it's easy to forget, and worse, if you're delegating into a bigger agent where the research is just one of many steps, it's hard to know whether the big agent properly asked the little agent which of the sources we were able to see." (WFI msg 18)
21. "what you'd want are durable artifacts, strong audit trails, clear process, with clear permissions management at each step, easy to replicate as exactly as possible, and easy to adjust if and when catastrophic contamination errors occur." (WFI msg 19)
22. "because at the end of the day there's no real world product" / "you're selling good words" / "and if it becomes clear the words aren't good" / "then you have nothing" (WFI msgs 21–24)
23. "track down what the hell went wrong that we missed this crucial detail and then you setup the system so that we never make the same mistake again." (WFI msg 25)
24. "which is not really doable with a freestyle agent. you can just beg it in your markdown file not todo stupid things and hope for the best" (WFI msg 26)
25. "the agent can only string together blocks of pre-written code that call out to subagents to do very specific, easily evaluable tasks, and use built-in control flow structures." (WFI msg 27)
26. "examples are steps you could delegate to anybody at an org" (WFI msg 27)
27. "each block requires a bunch of design, testing, tweaking etc. to make it work reliably and to do its one job well." (WFI msg 27)
28. "all i get out are transcripts and a workflow.js that does the plumbing, which essentially just amounts to calling each subagent as agent(prompt) at the right time. there's almost no guarantee about what actually happened." (WFI msg 34)
29. "i basically just have to go with it on pure vibes and trust that what it did was reasonable" (WFI msg 34)
30. "We all already know how to trust a piece of software to do something---I'm doing it right now as I type into this interface. What's difficult is general purpose agents, and that's the trust problem we're interested in solving." (IAI line 321)
31. "You can tell when a summarize has failed to summarize." (IAI line 278)
32. "Well, sure, but the canvas can't do everything, it can only provide a pit of success." (IAI line 334)

**2026-10-15**
33. "We should distinguish between Permission and Failure." (CLOSE #12)
34. "Showing the process by which \"just anyone\" reaches a conclusion is the express goal of Functionary." (`ops/planning/ideas/consume-reproduce-integrate-chatgpt-claude-transcripts.md:27`)

**2026-10-09**
35. "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER. I need to be able to say confidently that the ONLY thing this agent can do is read the file system, look for the document, read its input context, etc. That is the product." (GF U4)
36. "Reviewers should never review the same output twice." (GF U4)

**2026-10-06 and 2026-10-07**
37. "Fail-closed is absolutely the model we're going for." (US U14, line 185)
38. "Agree, don't crash. Do not proceed silently either." (US U22, line 328)

**2026-10-02**
39. "sternly instructing it not to make the same mistake again in a markdown file is not a solution." (TH line 44)

**2026-09-29**
40. "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." / "The agent writes the very particular subset of rust we tell it to, and until it does, we deny." (DRIFT item 7)

**Reserve** (verbatim, for essays or specific sections):
- "the product \"does not make the agents trustworthy; it limits their scope and information, and segments their judgements into atomically evlauable steps.\" The process improves, not the model." (TH line 45)
- "you verify their composition of trusted components using the canvas, which maps directly to the code that will be executed. The only thing agents can do is wire together blocks." (DRIFT, High Level Goal)
- "I don't want a double execution model." (BSS)
- "A flow is basically a function, which is the whole idea behind modules anyway, at the end of the day (Functionary is the name of the product...)" (US U14, line 205)
- "We allow the little functionary blocks to manage upward if they want." (IAI line 280)
- "when things really matter, you should sample many times and get a sense of the shape of the distribution of possible answers" (IAI line 250)
- "turning transcripts of agents freestyling into repeatable, inspectable, and extensible flows that make sense to users." (`ops/planning/ideas/custom-agents-with-blocks-as-tools.md`, 2026-10-02)
- "Flow composition isn't something we ever fully sign off on. It might always change later." (GF U4)
- "The point of the tool is to provide tools for all of the automations you want and need that don't need a ton of custom behavior." (DRIFT item 4)
- "now maybe nothing will ever go wrong in an agent + adversarial review loop" / "or maybe the mess is just fine and these costs are trivial compared to benefits" / "that seems to be what most people think and they may well be right" (WFI msgs 5–7)

**Hedges that must travel with the claims they qualify:**
- "at least in theory" (WFI msg 28), attached to the provenance, export and knowledge base paragraph.
- "slightly ocean-boily" (msg 29), on building the inner agents.
- "more or less exactly" (msg 17).
