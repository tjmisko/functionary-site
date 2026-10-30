# Angle 04 — "Functionary provides a pit of success for setting up agent flows that don't deviate"

Root for every path: `~/Projects/Functionary/.worktrees/integration/f98` (HEAD `f5b07c87`, 2026-10-30). Status tags: **BUILT** (code on integration/f98 with tests), **DECIDED** (ruled, not built), **IDEA** (registered or open).

## 0. Verdict in one paragraph

The claim holds for the part that is built: **the agent cannot make the flow do something other than what the canvas shows.** A fail-closed screen, a two-literal allowlist, rustc over typed markers, one execution model, a dry-run Test and a closed inner-agent tool vocabulary are all built and tested. The claim does not yet hold for the part the founder cares about most: **values must not drift silently from their sources.** The mechanisms for that are the origin axis, Check, origin floors, Quote/Anchor and the substring self-check. They were ruled on 2026-10-29 (D135–D155), and none of them is built. The implementer handoff says "Nothing is built yet" (`ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` §1). Even after they land, the design makes deviation *visible*, not *impossible*: floors are optional per destination, Notify has none, and a sketch agent's output is fenced only where a floor exists. The ergonomic half (the authoring agent gets it right easily) has one good datum: 10/11 first-attempt passes on 11 synthetic tasks with one model. The in-product authoring agent gets no grammar instructions or few-shots for the restricted backend, and the trial palette is hand-written and has already drifted once.

## 1. What the founder says the product is for

The founder's own framing, which any wording has to carry:

- Strong invariants, not discouragement: "for all this micromanaging to work, you need pretty strong invariants. you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing." (`ops/planning/2026-10-19 - What Functionary Is.md`, Appendix msg 17)
- Why creativity is harmful here: "in general creative solutions that refactor things to make them work are really helpful in code. but when unauthorized/unvetted language or sourcing creeps into the pipeline in one of these white collar tasks, it can contaminate the whole thing." (same, msg 18)
- What the alternative is: "which is not really doable with a freestyle agent. you can just beg it in your markdown file not todo stupid things and hope for the best" (msg 26). Also: "i basically just have to go with it on pure vibes and trust that what it did was reasonable" (msg 34, on Claude workflows).
- The mechanism goal: "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." and "The agent writes the very particular subset of rust we tell it to, and until it does, we deny." (`ops/planning/feedback/2026-09-29 14:07 - Backend prototype drift correction.md`, item 7)
- One execution model: "I don't want a double execution model." (`ops/planning/feedback/2026-09-29 - Backend session statements.md` S2)
- The founder already used the phrase, with a limit attached: "Well, sure, but the canvas can't do everything, it can only provide a pit of success." (`ops/planning/ideas/identity-authority-intent.md` §4.6, a limpid comment; §4 says these "are the user's words"; 2026-10-19)
- The positioning in the founder's retrospective: the product "does not make the agents trustworthy; it limits their scope and information, and segments their judgements into atomically evlauable steps." and "sternly instructing it not to make the same mistake again in a markdown file is not a solution." (`ops/planning/2026-10-02 - Technical History and Design Judgements.md` lines 44–45)
- The honest caveat: "at least in theory" (What Functionary Is, msg 28), followed by "building all those custom agents to live in blocks is messy and hard and slightly ocean-boily" (msg 29).

"Don't deviate" therefore has two meanings in the record, and they need different evidence:
(a) **execution fidelity**: the run is the composition shown;
(b) **content fidelity**: no unvetted language or sourcing enters a trusted output unmarked.

Most of (a) is BUILT. Almost all of (b) is DECIDED.

## 2. Mechanisms that make deviation impossible (execution fidelity)

### 2.1 The fail-closed screen and literal allowlist: BUILT

- Pipeline: `CST -> fail-closed screen -> IR derivation -> declaration-driven contract check`, with rustc as a separate, agent-pulled stage (`crates/functionary-flow-check/src/lib.rs` header; D32).
- `crates/functionary-flow-check/src/screen.rs` refuses these keywords wherever they appear: `for`, `while`, `loop`, `if`, `match`, `macro`, `unsafe`, `impl`, `trait`, `async`, `await`, `return`, `static` and others. It also refuses `!` and `#`, so macro invocations and attributes are out, along with arithmetic and comparison punctuation (`FORBIDDEN_KEYWORDS`, `FORBIDDEN_PUNCT`). Trusted generics are capped at `MAX_GENERIC_DEPTH = 3`.
- `crates/functionary-flow-check/tests/screen.rs` holds 70 tests, among them `should_deny_a_closure`, `should_deny_unsafe`, `should_deny_a_string_literal`, `should_deny_arithmetic`, `should_deny_non_builder_method_calls`, `q01_table_unsupported_call_rejects` (`std::fs::read_to_string`, the founder's "naked file read" case), and the recursion and aliasing denials. A naked `for` over blocks is rejected in `tests/trial_tasks.rs:255`.
- D78 admits exactly two literal forms: slot indices and config refs. D121 #1 later admitted a third, the `.input("name", x)` Template name (`screen.rs` comment "The one string literal a flow may carry"). D78 still reads "exactly two" and has not been amended to match.
- D05 and D31 amend P2. Agents *may* define body and module functions, but those functions pass the same screen (`should_deny_a_caller_name_captured_by_a_module_body`, `should_deny_mutual_module_recursion`). Cross-file `use` is a screened subset (D131; `should_deny_aliasing_when_an_import_is_not_the_ruled_form`).

### 2.2 Wrong wire is a compile error; no implicit conversions: BUILT, with one leak

- Typestate ports and rustc over generated markers (D03, D32); `type_check` is a required stage for all 11 trial tasks (`experiments/backend-flow-forms/tasks/manifest.json`: 11 × `"type_check": "required"`).
- D79 says "A type mismatch is a compile/bind error, never a silent coercion"; D99 #16 applies "the same rule for agents and humans". Tests: `should_reject_an_implicit_conversion`, `should_reject_a_typed_body_over_an_unrefined_table` (D66, no `Table → typed element` coercion).
- **Leak:** D121 #2 says "A table may feed a Template input directly; it renders as markdown with the same rendering as `Format:TableToMarkdown`". That is a block-owned implicit conversion, which D79 defers and D46 forbids unless it is visible. It needs either a visible chip or a reversal.

### 2.3 One execution model, graph read from source: BUILT

- P3 ("The agent's Rust is never run to discover the graph"). D07: compile on Test and Run, on the trusted backend. D92 #3: a per-run sandboxed runner, with effects returned to the host over a typed protocol.
- The sketch crate keeps P3 for agent traces: `SketchTrace` "is read, never run", and `stabilize` goes "only through the same doors any other edit uses … and a final `check_save`" (`crates/functionary-sketch/src/stabilize.rs`).

### 2.4 Test is a dry run; strict mode; agents can't Run by default: BUILT

- D97: Test and Run execute the same artifact, and "Mode is a field, not a parallel path". `DryRunWrite` is in `crates/functionary-flow-exec/src/sinks.rs:62`.
- D129 strict mode (`revision_approval: Off | Unattended | AllRuns`) is built (F101.19 `status: done`; `crates/functionary-server/src/flow_source/revision_review.rs`, `tests/flow_source_pinned_start.rs`). It defaults to `Off`.
- D122 #1: an agent's Run and Escalate default to **Test only**. D116 #6: eight `Credential`-class fields, such as `MapSettings.window` and budget limits, cannot be written by agents. D118 #4: Repeat and Refine rounds are Credential-class ("agents cannot raise them").

### 2.5 Inner agents on a closed tool vocabulary: BUILT

- D61, in the founder's words: "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER. I need to be able to say confidently that the ONLY thing this agent can do is read the file system, look for the document, read its input context, etc. That is the product." (`ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/sources/user-steering.md:50`)
- `crates/functionary-agent/src/lib.rs`: the tool schemas and the parser come from one enum; an unknown call "is an error message returned to the model; nothing is dispatched"; "The model never decides what is accepted" (the reserved submit tool plus the block's deterministic `accept`); replay is strict. Search runs on it (`crates/functionary-flow-blocks/src/search_resources.rs`). The sketch crate's single `call_block` tool refuses Jigs and effect-bearing blocks before a session exists.
- D61 limits the claim to actions: "The guarantee bounds **actions**, not information flow". It says nothing about the quality of the answer.

### 2.6 Receipts, replay, output-bound review: BUILT (core)

- D82: the run pins its definition at start; every non-deterministic effect has a receipt; "Replay returns recorded receipts and never re-dispatches". `OperationMismatch` is in `crates/functionary-flow-exec/src/boundary.rs` and tested in `tests/connected_effects.rs`.
- D81: an approval binds content plus behavioural provenance. The founder's contract-A/contract-B example: an approval for A "cannot cover B — this is structurally impossible". There is a known gap: D96 records that `HumanReview` "still builds an unkeyed subject", so model provenance does not yet reach the approval key.

### 2.7 Failure is a value, path-local, never silently dropped: BUILT

- D34 `Outcome<T> = Value | Failed | Absent`: "not-run is `Absent`, never `Failed`", and "emptiness can never hide a failure" (`crates/functionary-flow-exec/src/outcome.rs`). D10/D33: independent paths continue. D71: a handler "cannot swallow a cause". D76: Filter's default `on_nonvalue` is `Mark`, so "Absent rows are never silently dropped by default." Refine exhaustion pauses for review instead of passing (firm-answers "v1 Jigs and Refine exhaustion"; D118 #4).

## 3. Mechanisms that make content deviation visible: DECIDED, not built

The ontology session is the most direct answer to the founder's contamination story. It is design only. `ops/planning/backend-ground-truth/implementation-status.md` (2026-10-30): "D135–D155 fix the kinds (seven), the verb set (thirty-three) and the procedures model; none of it is in `functionary-flow-contract` yet."

What is built from F104: **F104.23** (a `Kind` enum on every declaration: `crates/functionary-flow-contract/src/lib.rs:265`, with HumanReview as `Kind::Gate` and Write as `Kind::Egress`) and **F104.25** (web palette colours by kind). The other 72 F104 task files are `status: open`.

| Mechanism | Decision | Status | Code fact |
|---|---|---|---|
| Origin axis Sourced/Computed/Generated/Verified/Reviewed on every wire | D139 (S9) | DECIDED; F104.3, .33–.36 open | no origin type in contract or checker (`rg origin` hits only module/refinement origins) |
| Origin floors on Egress | D139, D150 | DECIDED; F104.34 open | the floor is "may declare"; the default for Sourced and Computed is a `SPEC_GAP`; the opt-out is "open" (F104.34 Spec) |
| Check (schema/predicate/quote/hash) as the only Verified producer | D148 (S18) | DECIDED; F104.10 open | no `Check` or `Conform` declaration in the contract |
| "A stopping rule is a Bool from Check, never a Verdict from a model" | D139, D148; handoff §5 | DECIDED | Refine and Branch take only `WireType::Verdict` (`contract/src/lib.rs` JIGS), and `Judge` is removed from production (`crates/functionary-flow-lower/src/v1.rs:61-63`), so production has no condition producer at all |
| Model self-check: "propose, verify substring, one bounded repair, then fail the field" | D144, D104 | DECIDED; F104.69 open | no substring routine in `functionary-flow-blocks` or `functionary-agent` |
| Quote + Anchor on every harvested value | D144 (S45, S46) | DECIDED; F104.15 open | none |
| Search with access status (reached/denied/robots/timeout) | D141 | DECIDED; F104.13 open | `search.rs` is still Row-input with fixed claim columns (`SEARCH_COLUMNS`, SPEC_GAP) and no access column |
| No Map broadcast; Join attach | D153 (S43, "no broadcast, use the row.") | DECIDED; F104.8/.60 open | D31's one-parameter body is BUILT, so `.broadcast` was never admissible anyway |
| Procedures as one-click expanded compositions | D143 | DECIDED; F104.17 open | none |
| Reshape flatten keeps placeholder rows (coverage survives) | D138 | DECIDED; F104.9 open | none |
| Sketch agent node, Generated downstream | D135, D139 | DECIDED; F104.19/.71/.72/.73 open; F101.5 policy open | `functionary-sketch` vocabulary/trace/stabilize BUILT (F101.85 done) |

The design is right for the founder's claim. S9 says origin "Promotes the legacy provenance `SourceType` … from a field nobody checks to a type the checker enforces; this is the mechanism behind the contamination story in *What Functionary Is*" (`ops/planning/2026-10-29 - Block Ontology Decisions Log.md`). Until F104.3 and F104.10 land, nothing marks a model-written value differently from a sourced one on the wire.

## 4. The ergonomic side: does the authoring agent succeed easily?

### Evidence for

- **Trial result.** pilot-02 (`benchmarks/backend-flow-forms/pilot-02/README.md`, 2026-10-16, frozen `e06c928c`): 10/11 first attempt, 11/11 within two repairs; parse/screen/type_check first failures 0; one `contract` failure (`unresolved_value`), which passed on retry. That is a long way from the founder's account of the older DSL: "they would just fail several turns trying to get the syntax right etc." (What Functionary Is msg 33).
- **Grammar chosen for agents, not taste.** "We need to see via A/B testing what agents are actually good at writing." (S4, 2026-09-29). Implementation-status records the 2026-09-30 correction: "Human source preferences are not a selection criterion." D126 #3 settles the grammar ("iterated on until reasonable").
- **Real Rust instead of a new language.** The founder's own words: "Real Rust subset + checker is the way to go." and "Fail-closed is absolutely the model we're going for." (`ops/backend-refactor/sources/user-steering.md` U14). The agent's existing Rust knowledge is the ergonomic lever.
- **Symbolic, span-attributed diagnostics** that echo no values (`screen.rs` header; D37). These are repair signals the agent can act on.

### Evidence against

- **The sample is tiny and old-vocabulary.** One model (Sonnet; Codex was out of quota, D93), one repetition, 11 synthetic tasks, written against the pre-ontology palette (Summarize, Template, Judge, Coalesce). The README itself says it does "not measure" runtime behaviour, output quality, readability or canvas editing. None of the 33 verbs, procedures or origin rules has been trialled.
- **Instruction drift has already broken the harness once.** pilot-01 scored 5/11 because "The instructions documented the retired `input` port" and an oracle used the wrong node name (D94). D94's lesson: "any contract rename has to sweep the instructions in the same change." `experiments/backend-flow-forms/instructions/common.md` is still a hand-written 40-line palette. F100.43 records that it "does not list Join, Mutate, Format or CheckCitation" and asks for a palette "derived from the production catalog … so it cannot drift from what the checker accepts". The ontology will rename HumanReview to Review, Pivot* to Reshape and Field to Select-field. The same failure will recur unless the palette is generated.
- **The in-product authoring agent has no grammar guidance.** D122 #4: "The canvas agent has no turn loop (retired)". The project agent is the live authoring surface. Its system prompt still tells the model that "edit_flow changes a flow through the audited Silk write path" and appends the `CANVAS_FIRST_AUTHORING_CONTRACT` built around `add_canvas_sketch` (`crates/functionary-server/src/project_agent/turn.rs:2753`, `:2857ff`). The restricted tools are described as "Rust-subset flow source that the server checks; they are separate from the canvas flows above". They take only `name/source/bindings` and carry no grammar, palette or example (`project_agent/restricted_client.rs:366ff`). D126 #1 says "The restricted backend is THE backend, and the only one", but the product's authoring agent has not been switched over.
- **Few-shots don't exist.** User Archetypes: "Examples and few-shots matter more than features … Good few-shot examples, for the authoring agent and for the user, are the main lever on whether they succeed." The same doc lists, under "Gaps today": "Few-shot examples and templates for Associate jobs do not exist as a product surface." D116 #8 parks "templates".
- **The compiler check is pulled, not pushed.** D32: "the typestate/type check is **pulled by the agent, not pushed by the system**". An agent that skips `restricted_check_flow` leaves a flow that save accepts and rustc later rejects. That is caught before Run, but it is not easy.
- **Shortcuts are built or decided only in part.** Presets are BUILT as copy-on-load (D116 #2, D125, `flow_source/presets.rs`). Procedures (D143), the feature that would make "Adversarial review" or "Consolidate" one click with visible steps, are not built. Model schema presets, the "batteries" that the Extract study says make extraction "a pit of success", were **parked** because "the user did not like the presets as proposed" (D144).

## 5. Counterevidence: where flows can still deviate, or the claim overreaches

1. **Sketch agent (D135, S42).** It is "able to flout the type rules", and F104.19 gives it "input and output ports typed Any". Its only fence is origin: "the checker marks everything downstream Generated and unverified until a gate or Check discharges it (S9), which keeps freestyle output out of trusted destinations **without forbidding it**." The fence closes only at a *floored* destination. F104.34's acceptance includes "A non-floored destination accepts a Generated value", and D150 gives Notify no floor. A sketch agent → Notify (email to a client) is therefore valid by design, and the only marking is a red-tinted edge, which itself depends on F104.35 (unbuilt). The built sketch crate is stricter than the ontology ruling: it refuses Jigs and effect-bearing blocks, and it refuses agent-typed inputs during stabilization (`functionary-sketch/src/lib.rs`, `stabilize.rs`, "F101.5 question 5, open"). F101.5, which decides where it runs, how authority is granted and whether it may call effectful blocks, is open.
2. **Floors are opt-in and their policy is open.** D139 says egress "*may* declare an origin floor". Commit to knowledge requires Verified or Reviewed "unless the destination opts out". Who may opt out, and whether Sourced or Computed meet the floor, are both open (F104.34). A floor that an agent-editable setting can switch off would undo D139. Today an Associate's file Write has no floor, so "Generated" is information, not a guarantee.
3. **The model is still inside every Block.** D135: "every Block calls a model". Origin marks model output; it does not make it correct. D146: self-review "does not change origin". Only Check and Review discharge. Check discharges only *substring, schema, hash, predicate* claims. A model's *verdict*, *grade*, *summary* or *Compare duplicates* grouping stays Generated forever unless a human reviews it (D143: semantically merged rows are "Generated and a Review sample discharges them"). For the founder's evidence-combing job, the classification (evidence vs counterevidence) is never machine-verifiable. The product makes that visible. It does not prevent it.
4. **Stopping rules today.** The handoff invariant is "A stopping rule is a Bool from Check, never a Verdict from a model". The contract declares only `condition: Verdict` on Branch and a Verdict-checked Refine, and production has no Judge (`v1.rs:61-63`; `descriptor.rs` test `unsupported_operations_are_not_executable` lists Judge, Coalesce, Filter, Sort and Select). In production today a flow cannot branch or stop on any condition at all. Q7 is also open: Refine's check returns only a Bool or Verdict, so an adversarial-review loop cannot hand its findings to the next round, and the proposed fix is `check: T -> (Bool | Verdict, T)`.
5. **D130 against D148.** The reproduction MVP computes `quote_found` with "a visible Mutate" (D130 #5). Under D139 a Mutate over a Generated quote stays Generated, while D148 says the quote substring check is Check's job and is what produces Verified. F100's flagship flow is specified in a form the ontology would classify as undischarged. This should be reconciled before F100.8 lands.
6. **Floating imports and no default approval.** D131 #4 and D132 #1: imports "float by default", and Run needs no pin. D99 #1: "no human approval of a flow revision exists" by default. Each run pins and records what it resolved (D82), so a single run cannot deviate. Between runs, an Associate's flow can change underneath them through an exporter edit with no review step, unless the tenant turns on strict mode. That is a deliberate trade ("that loop must carry no versioning friction", D132 #1), and the "don't deviate" wording must not imply otherwise.
7. **Literals moved, not removed.** D70: "Literals are allowed in an expression because it is config data". Filter predicates and Mutate expressions carry data, visible in the config dialog and part of the review key (D74), but not in source. P4 holds for source text. It does not hold for "flow logic" broadly.
8. **Escape hatches.** D63: `Text` and `Json` exist "so no workflow is blocked by a missing type — only less checked". D130 #5's CheckCitation returns a Json record. Every Json port is a place where nominal schemas (D138) don't bind.
9. **Coverage of the vocabulary.** Custom blocks are not in v1 (P9, S5: "Let's defer custom blocks for now"), and Script blocks are deferred (S31). When the 33 verbs can't express a job, the user has two options: the sketch agent (loosely typed) or nothing. The founder anticipates this: "The point of the tool is to provide tools for all of the automations you want and need that don't need a ton of custom behavior." (drift correction item 4). The Extract study found 12 of 24 intern tasks covered, 8 partial and 4 gaps (Decisions Log, Extract-class study). The decisions log also registers that "every Extract fold is a hypothesis until tested" (segmentation).
10. **Open questions that touch the claim.** Q4: whether Inspect can gate, and what a block must `expose` for review on a block. Q7: Refine's check state. Q9: further Extract verbs and the formal adoption of the D155 admission test. Q10: legacy variants, with Q-STATE, Q-COMPLY and Q-CRATES unruled (`ops/planning/backend-ground-truth/open-questions.md`, last section).
11. **The founder's own limit.** "the canvas can't do everything, it can only provide a pit of success" (identity-authority-intent §4.6) and "at least in theory" (What Functionary Is msg 28). Copy that claims impossibility outruns the person who designed it.

## SUPPORT

- **The agent can only wire trusted blocks, and anything else is refused**: BUILT. Allowlist screen, two-literal rule, no closures, macros, loops or naked I/O, screened functions and imports (`functionary-flow-check`, 70 screen tests).
- **What runs is the composition shown**: BUILT. One execution model, graph from source, compile on Test and Run in a sandboxed runner (P3, D07, D92 #3), and the same rule for humans and agents (D99 #16).
- **Wrong wire = compile error; no silent coercion**: BUILT. One exception: D121 #2.
- **Inner agents can do only what their closed tool enum names, and the block, not the model, decides acceptance**: BUILT (`functionary-agent`, D61).
- **Failures and gaps can't hide**: BUILT. Outcome/Absent/Failed, Filter `Mark`, path-local failure, handlers can't swallow causes, Refine exhaustion pauses.
- **Replay never re-dispatches; review binds content and provenance**: BUILT (D81, D82), with the D96 provenance-threading gap.
- **Safe defaults**: BUILT. Test is a dry run, agents are Test-only by default, budgets and windows are Credential-class, strict mode is available.
- **The authoring agent can learn the surface**: weak evidence. 10/11 first-attempt on 11 synthetic tasks with one model.

## COUNTEREVIDENCE

- Content fidelity (origin, Check, floors, Quote/Anchor, the substring self-check, Search access status) is DECIDED and **unbuilt**. Today nothing on the wire marks a model-written value.
- When it lands, deviation will be **visible, not prevented**: floors are optional, the opt-out and the Sourced/Computed default are open, Notify has no floor, and a sketch agent's typed-Any output can reach any unfloored egress.
- Production today has no Judge, no Check and no deterministic table verbs (Filter, Sort and Select are not executable). Refine and Branch can't be driven by a deterministic rule.
- Model output inside every Block is marked, never verified, except for its quotes. Judgements stay Generated unless a person reviews them.
- Ergonomics: no in-product grammar instructions or few-shots for the restricted backend. The project agent still speaks Silk. The trial palette is hand-written and has drifted before (D94). Procedures and Model presets are unbuilt or parked.
- Small inconsistencies in the record: D78 vs D121 #1 (string literal), D79 vs D121 #2 (table→markdown), D130 #5 vs D148 (`quote_found` as Mutate).

## WHAT WE NEED TO DO BETTER

1. **Land F104.3, F104.33–.36 and F104.10 before any public "don't deviate" claim.** Origin plus Check is the content-fidelity guarantee. Without it, only execution fidelity can be claimed.
2. **Rule the floor policy.** Default floors on every durable Egress (Write file and integration as well as knowledge). The opt-out should be Credential-class or org-rule only, never agent-writable. Decide whether Notify to an external recipient gets a floor. Without these, the sketch-agent fence is advisory.
3. **Ship Check predicate mode, and a production Judge or nothing.** Make Refine and Branch accept `check.bool` (D148), so that the invariant "a stopping rule is a Bool from Check" is true in code. Resolve Q7 (`T -> (Bool | Verdict, T)`) so adversarial review can be expressed.
4. **Reconcile D130 #5 with D148.** `quote_found` should be Check quote (Verified), not a Mutate (Generated).
5. **Fix the two conversion and literal leaks.** D121 #2 should render a visible Format step or a marked wire (D46). D78's text should record D121 #1's named-input literal.
6. **Switch the authoring agent to the restricted backend, with a generated palette and few-shots.** Derive the palette from `production_catalog()` (F100.43's rule) for both the trial harness and the project agent prompt. Retire the Silk `edit_flow` path from the prompt per D126 #1. Push, rather than pull, the rustc check after every agent edit, or make `restricted_edit_flow` return `type_check` diagnostics.
7. **Build canonical example flows as a product surface** (User Archetypes, "Instructions for agents"). These are the Associate's real on-ramp and the authoring agent's few-shots.
8. **Re-run the trial on the ontology vocabulary**, with two models, the held-out tasks, and at least one task each for Check, Quote, Join attach and a procedure, scored on the Q02 lifecycle. Add a held-out task where the obvious solution is a sketch agent and score whether the agent reaches for typed verbs instead.
9. **Build F104.17 procedures** so the safe composition (Consolidate, Adversarial review, Verify against evidence) is one click. Revisit Model presets in a framing the user accepts, since D144's reason is that Model alone "gives no pit of success".
10. **Thread model provenance into the review key** (D96 deferred item). Otherwise D81's "structurally impossible" holds only for inputs, not for the model that produced the output.

## Five candidate formulations the record supports

1. **"The flowchart you see is what runs. Problems don't get solved by improvisation behind your back."** Founder msg 17, nearly verbatim. Supported today by BUILT execution fidelity. The second sentence needs origin and Check (DECIDED) to be fully true.
2. **"Agents wire together trusted blocks. Until the source is exactly the subset we allow, it doesn't run."** Drift correction item 7 ("until it does, we deny") and the P1 high-level goal. BUILT.
3. **"Stop begging your agent in a markdown file."** Founder msg 26 and Technical History line 44. A contrast line rather than a guarantee. Safe to use now.
4. **"Every value a model wrote stays marked until a check or a person clears it."** D139 and D148. DECIDED, not built. Hold this until F104.3, .10 and .35 ship, and say "marked", not "blocked", unless floors become defaults.
5. **"The safe way to build a flow is the easy way: the agent composes, the blocks do the work, and the canvas shows you exactly what will happen."** This is the founder's "pit of success" idea in plain words (identity-authority-intent §1.12 and §4.6, P1, P7). The "easy" half needs the generated palette, few-shots and procedures (items 6, 7 and 9 above) before it is honest.
