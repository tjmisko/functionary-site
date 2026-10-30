# 05 — Product shape on integration/f98: an inventory a copywriter can trust

Worktree: `~/Projects/Functionary/.worktrees/integration/f98` (HEAD `f5b07c87`, 2026-10-30). All `ops/` paths are relative to that worktree. Status words: **BUILT** = code on `integration/f98` with tests; **DECIDED** = ruled in `ops/backend-refactor/decisions.md` or an authoritative doc, not built; **IDEA** = registered idea or open question.

Two caveats govern every BUILT claim:
- `integration/f98` has **not landed on `main`**. D126 #4: "Everything lands together. F99, F100 and F101 are finished on `integration/f98` before it lands on `main`." Legacy routes and crates are still present (F101.10, F101.11, F101.30 open). BUILT here means "works on the integration branch", not "shipped".
- `ops/planning/backend-ground-truth/implementation-status.md` is mostly a 2026-10-01 narrative. Only its last section ("2026-10-30 — Block ontology decided, not built") is current. The landing handoffs (`ops/planning/handoffs/2026-10-30 00:30 - f98-landing.md`, `2026-10-29 18:00 - f98-landing.md`) and the code are the live record.

---

## 1. The object model in plain words

Spine: `ops/planning/backend-ground-truth/glossary.md`.

- **Flow.** One automation: blocks wired together, plus Jigs. One flow is one Rust source file (glossary "Flow"). A flow belongs to a project and has a name (D116 #7). Every flow gets a per-project slug for imports (D131 #2; F101.121 done, F101.122 open).
- **Flow source (restricted Rust).** A coding agent writes the flow in a fixed subset of Rust. An allowlist checker accepts only block calls, Jigs, wires, configuration references and vetted helpers. It refuses agent-defined functions, macros, `for`/`if`/`match`, closures, naked file reads and hard-coded data (Backend Guiding Principles P1–P4; D06, D31, D78). The checker reads the graph statically. The agent's Rust is never run to discover it (P3). Real fixture form, `crates/functionary-flow-lower-harness/flows/map_body_format.rs`:
  `let urls = TableSource::new(public_urls); let rows = Map::new(map_settings).over(urls.table).map(each);`
- **Graph / IR / canvas.** On every save the checker derives a graph IR (`GraphIr`). It does this deterministically and without a compiler: CST → fail-closed screen → IR derivation → contract check (`crates/functionary-flow-check/src/lib.rs`; D07, D32). The canvas draws that graph. Edits on the canvas are written back to the source (glossary "Canvas"; D42 lossless editing). Canvas positions live in a separate layout store, not in source (D99 #13).
- **Block.** A trusted, versioned unit of work implemented by Functionary. Agents may set its configuration but may never see or edit its internal prompts (P6). Under D135, "Block" now means specifically a unit of *judgement*: every Block calls a model.
- **Jig.** A visible control structure around a body of blocks: Map, Repeat, Refine, Retry, Branch (and Replicate, decided). It is the only way loops and branches appear (P5, D57).
- **Transform.** A pure, bodyless, inlined operation with no receipt (D69, D77), e.g. Format, Filter, Template.
- **Module.** A flow packaged for reuse inside another flow, with typed parameters (glossary; D12, D35). Same-file modules work now. Cross-file `use flows::<slug>::<fn>;` imports are DECIDED (D131), and imports float by default (D132).
- **Revision.** Each saved edit is an immutable revision with a content hash. Run and review bind to the exact revision (`/api/restricted-backend/flows/{id}/revisions`; D99 #18).
- **Run.** One execution of a pinned revision, in mode **Test** (a dry run) or **Run** (D97). It is keyed per occurrence by `NodePath`: Jigs expand at run time, and each occurrence path records at most one result (D50, D58).
- **Outcome.** A node's terminal result: `Value | Failed(Causes) | Absent(AbsentCause)`. "Not-run is Absent, never Failed", and a legitimate empty is a domain value (D34). Pending, Paused and Cancelled live on a separate state layer.
- **Receipt.** The recorded confirmation that an operation or effect completed (glossary). Agent turns, review decisions and writes are all receipted (D82 #2). Multi-step blocks record sub-receipts per model step and tool call (`crates/functionary-flow-exec/src/sub_receipt.rs`).
- **Journal.** The run's state of record. Durability is replay of receipts, not live state (D44).
- **Knowledge base / table / commit.** The KB is Functionary's versioned store of tables, records and notes (glossary). A run table is free to view. **Committing** it is the explicit act that makes it an immutable `KnowledgeRevision` that outlives run retention (`crates/functionary-flow-exec/src/commit.rs`; D21, D40). A run reads the KB as of run start (firm-answers §9).
- **Record.** A first-class runtime value backed by a declared struct (D100, D105). A private model is a tenant-scoped, versioned struct registry (D101; F101.67–70).
- **Tenant.** The access and governance boundary. Its mode is **Personal** (the default) or **Governed** (D120 #4).
- **Project.** The container a flow lives in. A project carries flows, data, knowledge, models, runs, monitoring, security and the agent transcript (`web/src/ui/projects/ProjectWorkspace.tsx:639-677`).
- **Principals.** The *outer agent* writes flow source and is untrusted with private data. The *inner agent* runs inside a block with narrow context (glossary). The *sketch agent* is a canvas kind (D135, decided only).

## 2. The seven kinds (D135) and the thirty-three verbs

Source: `ops/backend-refactor/decisions.md` D135; `ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` §3; `ops/planning/2026-10-29 - Block Ontology Consolidation Proposal.md` §1.

**Kinds:** Ingress (Source, with modes), Block (judgement; every Block calls a model), Agent (the sketch agent: loosely typed, more permissions), Transform (pure, inlined), Jig (control), Gate (decides whether a value goes on), Egress (sends it out). "Gates and Egress are receipted and model-free; what separates them is role." D135 gives the user's reason: "the kinds should say what a thing is for: data in, judgement, control, pure work, decide, out."

The full list follows. Modes are taken from Proposal §1 and corrected by later rulings where they differ.

**Ingress (1)**
1. **Source**: file · document ref · url · table · csv · integration · pasted text · document units · knowledge query · data-chosen path.

**Blocks (7).** Model and Quote are the Extract class.
2. **Summarize**: effort one call · effort more reasoning / self-review inside the call.
3. **Search**: query (Text · Citation · Lead · Exemplar · any record) · where (files · knowledge · web · reference library · connector) · constraints (dates · source types · language · must / must-not; enforced by the tool layer) · effort preset.
4. **Judge**: verdict (accept / reject) · grade (rubric levels) · stance (supports / contradicts / not found, with quote).
5. **Model**: one record · many (nested table, then flatten). Schema presets are parked (D144).
6. **Quote**: passages for a question · claim · topic · within one document (Locate) · granularity sentence | paragraph.
7. **Compare**: identify duplicates · find differences · choose (best of N) · further modes open.
8. **Draft**: compose (from a brief) · revise (against a base, emits a ChangeSet).

**Agent (1)**
9. **Sketch agent**: blocks as tools · knowledge reads · emits a trace.

**Transforms (11)**
10. **Filter**: where · distinct · slice.
11. **Sort**: by key · + rank / percentile.
12. **Select**: columns (keep · rename · reorder · drop) · field.
13. **Mutate**: computed columns from whitelisted expression functions.
14. **Aggregate**: group by · compute (count by default; min · max · sum · median · majority · unanimous · dispersion · collect · components) · window (deferred, S40).
15. **Join**: inner · left · full · semi · anti · attach.
16. **Stack**: rows appended by name.
17. **Reshape**: longer · wider · nest · flatten.
18. **Format**: HtmlToText · TableToMarkdown · TextToTable · TextToJson · TableToJson · redline.
19. **Template**: named inputs into one text.
20. **Coalesce**: first available of two.

**Jigs (6)**
21. **Map**: per row. Proposal §1 still lists "+ broadcast", but D153 / S43 retired it: "no broadcast, use the row."
22. **Replicate**: n runs with diversity (model · effort · seed · modes).
23. **Repeat**: k rounds, state threaded.
24. **Refine**: body + check, stop at first accept.
25. **Retry**: attempts · + delay / rate.
26. **Branch**: two arms on a Bool or Verdict · default arm.

**Gates (4)**
27. **Review**: approve / reject · sample · by exception · all (tables) · approve with edits · comments port · on a wire (today) · on a block (idea) · named branches · timeout · assignee.
28. **Check**: schema (Conform) · predicate · quote is a substring · hash matches.
29. **Declassify**: lower a label under release authority.
30. **Redact**: human-performed (now) · mask; automated later under the same name.

**Egress (3)**
31. **Write**: file · integration record · knowledge (Commit) · knowledge commit set (several tables, one revision).
32. **Notify**: email · chat (Slack, Teams) · push · desktop.
33. **Apply**: destination adapter (docx tracked changes · Google Docs suggestions · Markdown revision) · on conflict fail / skip op / ask.

**Status of the ontology: DECIDED, barely BUILT.** Handoff §1 says: "Nothing is built yet. The contract still declares Block / Transform / Jig only, Template, Field and Coalesce as blocks, PivotLonger and PivotWider, `HumanReview`, a Row-input Search…" Since then:
- **F104.23 (done):** a `Kind` enum carries the seven kinds on every declaration, and the served catalog groups by it (`crates/functionary-flow-contract/src/lib.rs` `BLOCKS`: Source and TableSource = Source, Summarize/Search/Judge = Block, HumanReview = Gate, Write = Egress, Field/Coalesce/Template tagged Transform as a SPEC_GAP interim).
- **F104.25 (done):** web catalog types accept the seven kinds. Its colour map is not called yet (`wiring_deferred`).
- **F104.24 (checker `kind_of`) is parked.** F104.21 (canvas painted by kind) and every other F104 child are open (`ops/task-loop/tasks/F104.*`).

## 3. The 20 procedures (Consolidation Proposal §2; D143)

A procedure is "a named, goal-oriented composition of verbs and Jigs that appears in the palette as one thing and expands on the canvas into visible steps" (D143). **None is built.** The procedure palette object is F104.17, and the prototypes are F103.

| # | Procedure | Status | Verbs |
|---|---|---|---|
| 1 | Consolidate | ruled (S13, S15, S35) | Mutate, Aggregate, Compare |
| 2 | Match (same thing or not) | ruled (S22) | Join, Map, Compare, Aggregate, Review |
| 3 | Weigh the argument | reworked | Source, Map, Model, Reshape, Join, Filter, Aggregate, Mutate, Sort |
| 4 | Independent judges | ruled (S12, S26) | Replicate, Judge, Aggregate, Check, Branch |
| 5 | Best of N | approved (S14, S34) | Replicate, Draft, Compare, Select |
| 6 | Reviewed summary | proposal | Replicate, Summarize, Map, Judge, Filter, Format, Check |
| 7 | Adversarial review | approved (S14) | Refine, Draft, Judge, Format, Review |
| 8 | Checklist | parked (S16; a UI view, not a construct) | Map, Judge, Check, Aggregate, Branch |
| 9 | Split | approved (S14) | Filter (two Filters over one predicate) |
| 10 | Check citations | reworked (D130) | Source, Model, Map, Refine, Judge, Stack, Review, Join, Format, Mutate, Aggregate, Write |
| 11 | Explore (find the sources) | idea | Refine, Map, Search, Reshape, Stack, Select, Join, Check, Compare, Review, Write |
| 12 | Atomize a document | reworked; "Prototype; no v1 promise" | Source, Format, Model, Join, Map, Reshape, Check, Review, Write |
| 13 | Verify against evidence | idea | Map, Select, Search, Source, Format, Quote, Model, Reshape, Judge, Sort, Review |
| 14 | Relate claims | idea | Mutate, Join, Map, Model, Filter, Write |
| 15 | Reconcile revisions | idea | Join, Mutate, Filter, Compare, Stack |
| 16 | Revise a document | idea | Source, Draft, Format, Review, Apply, Write |
| 17 | Classify and route | approved (S14) | Map, Model, Filter, Branch, Notify, Write |
| 18 | Recover from failure | ruled (D80) | Retry, Summarize, Coalesce |
| 19 | Snapshot sources | planned (F100 MVP decision 1) | Map, Source, Write |
| 20 | Discover themes | idea | Map, Quote, Reshape, Compare, Summarize, Format, Aggregate, Review |

The implementer handoff groups 6, 11–16 and 3 as "Prototypes (F103)". Under D146 every F103 golden compares three arms: one call, one call at high effort, and the procedure.

## 4. Typing

- **Value types, as wired today (BUILT):** `WireType` = Text, Number, Bool, Verdict, Json, Table, Document, DocumentRef, Receipt, Failure, Row, and the input-only wildcard `Writable` (`crates/functionary-flow-contract/src/lib.rs:45-73`). Records are a runtime value with checker-typed field access (D100; harness flows `record_build.rs`, `record_field.rs`, `record_nested.rs`). There are no implicit conversions; a wrong wire is a compile error at the authored span (D79, D99 #16).
- **Three layers (DECIDED, D137/D155):**
  - The value type says what a thing is: Document, Table, Record.
  - Nominal schemas give `Table<Candidate>` an identity. A block declares the schema it emits (D138).
  - Trait bounds say what may be done: `Writable` (built) and `Reviewable` (decided).
  - `Record(name)` becomes a wire type. Content refinements (`Text<Markdown>`, `Document<media>`, Ordinal) live in the checker, "never as new scalars".
  - Source will emit `Document`; it emits text today (`crates/functionary-flow-blocks/src/source.rs:1`: "as text").
- **Nested tables (DECIDED, D138):** a Map body returning a table yields one nested cell per row. Reshape flatten keeps a placeholder row with `outer_status` for failed or empty outer rows.
- **Origin axis (DECIDED, D139; F104.3 open):** every wire carries `(type, label, origin)`. Origin is **Sourced, Computed, Generated, Verified (Check), Reviewed (Review)**. Generated is sticky. Only Check and Review discharge it, and both are receipted. Commit to knowledge requires Verified or Reviewed unless the destination opts out. D139 says this is "the mechanism behind the contamination story in *What Functionary Is*". **Not built.**
- **Privacy labels (BUILT):** labels join through the graph, a LocalOnly value is refused at a remote block before dispatch, and a label never goes down except through a Declassified record (`crates/functionary-flow-exec/src/label_ledger.rs`; harness `label_join.rs`, `label_remote.rs`). Compartments and locality on the new graph (F98.17) are blocked.

## 5. Runtime: how a flow runs

1. **Save:** the checker derives the IR; no compiler runs (D07, D32; `functionary-flow-check`).
2. **Test or Run:** the checked IR is lowered to async Rust (`crates/functionary-flow-lower/src/lib.rs`: "deterministic, offline async Rust"). It is compiled by `rustc` directly, "no `cargo`", inside a `bwrap` sandbox with no network and `prlimit` caps, against prebuilt runtime rlibs, and cached by key (`crates/functionary-flow-compile/src/lib.rs`). The flow then runs in a fresh sandbox. Independent branches run in parallel (`futures_util::join!` in the emitted code). **BUILT.**
3. **Pinning:** the run pins its definition at start: flow meaning, block and module versions, schemas, table revisions, policies (D82; `PinnedRun`). **BUILT.**
4. **Jigs expand at run time,** one result per occurrence path (D50). Map over a table computed earlier in the same run is BUILT (F100.12–14).
5. **Test is a dry run** of the same artifact (D97). The only difference is persistence: `Write` produces a dry-run receipt and no commit is admitted. **Source reads and provider calls still happen in Test** (D97 #2). Copy must not say "nothing leaves the machine in Test". `ops/planning/2026-10-29 - User Archetypes.md` says roughly that, and D97 contradicts it. A completed Test can be **escalated** to Run without repeating reads and model calls (D97 #3; route `/runs/{run}/escalate`). **BUILT.**
6. **Durable park and resume, pause, cancel:** review waits are durable (`crates/functionary-flow-exec/src/waits.rs`). Pause lets started calls finish and save, then parks. Cancel is durable and terminal (D44; F98.262 done, "pause and cancel durable for a parked, non-live run"). Routes: `/runs/{run}/pause|resume|cancel|recover|status`. **BUILT.** Gaps:
   - Timer and Rate waits are not wired (F98.231, F98.240 open).
   - "Resume as the starter, re-authorised" (D132 #2) is partly built: F98.261, which records the starter, is done; F98.263, the re-authorised resume, is open.
7. **Replay:** after a crash, recorded receipts are returned and calls are not re-dispatched. A bare intent is "uncertain" and escalates rather than retrying blindly. A changed request is `OperationMismatch` (D44, D82; process-kill tests described in implementation-status.md F98.4 increments). **BUILT.**
8. **Budgets and admission:** provider-operation budgets with `budget_paused` and budget review (`/runs/{run}/budget/review`), bounded fair admission, and HTTP 429 on saturation (implementation-status.md F98.4). **BUILT.**
9. **Failure:** continue-and-flag. Failure is path-local, a failed Map row is a failed cell, and Retry re-runs ordinary failures only (D10, D33, D121 #5). Coalesce, the fallback for failure, is declared but not executable.

**What actually executes in production today** (`crates/functionary-flow-lower/src/v1.rs` `V1Catalog::production`; test `production_blocks_are_executable` in `descriptor.rs`):
- Source, TableSource, Field, Search, Summarize, Template, HumanReview, Write.
- Format: HtmlToText, TableToMarkdown, TextToJson, TextToTable, TableToJson.
- Jigs: Map, Repeat, Retry, Refine, Branch.

**Declared but not executable** (test `unsupported_operations_are_not_executable`): Judge ("no production implementation yet", v1.rs), Coalesce, Filter, Sort, Select. Mutate, PivotLonger and PivotWider are declared in `TRANSFORMS` with no production lowering.

Inner agents use only DeepSeek V4.1 Flash on OpenRouter, with data collection denied (D156 #4). Search runs a Functionary-owned Rust agent loop with a closed tool vocabulary (D61).

## 6. Integrations, ingress and egress actually built

- **Source modes BUILT:** `file`, `document_ref`, `url`, `integration` (`crates/functionary-flow-blocks/src/settings.rs:156-173`). TableSource modes are `table` and `csv`. URL mode accepts http and https only and allows localhost. Private addresses are allowed by default, and a tenant allow/deny list goes through one network-policy seam (D124). **DECIDED, not built:** pasted text, document units, knowledge query, data-chosen path.
- **Integration Source readers** (F101.34–F101.40, all done): 21 providers registered in `IntegrationRegistry::standard()` (`crates/functionary-server/src/flow_source/integrations/mod.rs`):
  - Mail: Gmail, Outlook, IMAP/SMTP
  - Calendar: Google Calendar
  - Storage: Google Drive, OneDrive
  - Chat and video: Slack, Teams, Zoom
  - Project tools: Jira, Asana, Linear, Notion
  - CRM: Salesforce, HubSpot
  - Finance: Stripe, QuickBooks
  - E-signature: DocuSign
  - Databases: Postgres, MySQL, Airtable
  
  Caveats for copy:
  - The readers are **read-only** and tested **offline** against mocked transports ("offline tests" in F101.36–40 commits).
  - **Postgres and MySQL are driver stubs.** A production read "fail[s] with 'driver not wired (SPEC_GAP F41.10)'" (`ops/task-loop/tasks/F101.40.md`, wiring_deferred_note).
  - Twilio is not present.
  - Output is canonical JSON text, and the table shape is open (F101.4).
  - The Source block's provider picker is built (F101.41), with its connect target deferred.
- **Write BUILT, narrowly.** The server's `KbWrite` writes the value as a **knowledge-base note** titled by `dest`, with source `flow:{id} run:{id}`, and returns `kb:{note_id}` as the receipt (`crates/functionary-server/src/flow_source/host.rs:270-350`). The comment there reads: "Flows never touch a filesystem path". **DECIDED, not built:** file, integration-record and commit-set destinations (D150).
- **Commit run tables to knowledge BUILT:** `/runs/{run}/tables/{table}/commit` produces an immutable revision that pins its dependency closure, marks itself `partial` if any cell failed, and forks on repair (commit.rs).
- **Notify:** DECIDED (D150), not built. **Apply/ChangeSet:** DECIDED (D151), not built.
- **Triggers** (F101.43 start at a pinned revision; F101.44 bindings; F101.45 schedule, webhook and email dispatch; F101.46 manual fire): **BUILT on the backend** (routes `/api/flows/{flow_id}/trigger-bindings`, `/api/trigger-bindings/{id}/fire|repin|metrics`). **No web UI** calls them: `web/src` has only types and `net/api.ts`. F101.8 (parent) and F101.47 (stale-pin rule) are open. D134: "keep what's built. we'll design automator later." The legacy publish route is retired (D133 #2).

## 7. Governance

- **Tenants:** Personal (the default) or Governed (D120). `GovernancePolicy` holds mode, view/edit/run/answer_reviews access, named editors/runners/reviewers/admins, `agent_runs`, `agent_fixtures`, `revision_approval` and the Source network policy (`crates/functionary-schema/src/governance.rs:207-249`). **BUILT**, with UI under project → Security (`ProjectSecurityView.tsx`).
- **Roles are optional.** "A single person can create, edit, run and review", and "hyperformalism … is an anti-pattern" (D120 #1). Self-review is allowed (D90 #4).
- **Agents are workers with credentials:**
  - The server identifies an agent by credential, never by what the client says.
  - An agent is never a flow owner (D120 #2), never deletes a flow (D122 #2), and never approves a revision (D129 #6).
  - By default agents may only start Test runs (D122 #1).
  - An agent credential does not inherit its human's review-disclosure grant (D121 #4).
  
  BUILT: F98.207, `agent_credentials.rs`.
- **Pins:** module pins and table pins are built (D110, D112, D113). Imports float by default and pinning is opt-in (D131 #4–5, D132 #1; mostly unbuilt). The Associate "never see[s] the word 'pin'" (User Archetypes).
- **Strict mode (D129):** `revision_approval: Off | Unattended | AllRuns`, default Off. The policy option and per-revision approvals are BUILT (F101.97, F101.96). **Enforcement at every Run-capable start is not wired** (F101.98 open; the F101.96 notes say defer-wiring).
- **Approvals of outputs:** a HumanReview approval binds content identity plus behavioural provenance, under the cadence policy `Always | OnChange | Once | Off` (default OnChange). Review decisions are receipts and are never re-asked on replay (D81). **BUILT.**
- **Composition is never signed off.** The only composition-level check is the automated authority/disclosure screen (D83).
- **Settings ownership (D84):** every setting has one owner: a step, a record shared within a flow, a resource chosen by name, or an organisation rule. Organisation rules "never supply a value; they only constrain". There is no inheritance. One settings record per block (D116 #2). Sharing settings between flows stays copy-only (D125).

## 8. The authoring agent and the sketch agent

- **Authoring (outer) agent, BUILT:** the in-app project agent edits restricted flows through restricted-route tools with agent credentials (F98.225 done). It arranges, titles and styles cards (F101.136). Its conversation history is readable on the new routes (F101.132/133; `/projects/:id/agent/transcript`). It may create and edit a flow in a user's name, start Tests, and propose knowledge edits. Run, Escalate and knowledge edits need tenant opt-in (D122 #1, D128 #8). The legacy JSON-model tools are removed (D133 #3). The canvas agent's own turn loop is retired (D122 #4). Outer agents may also be the user's own Claude Code or Codex (glossary "Agent (outer)").
- **Sketch agent: DECIDED as a kind (D135), design open.** It is a placeable node with more permissions than a block, "able to flout the type rules", whose block-call trace a flow is "stabilized out of". Everything downstream is Generated until discharged. F101.5 (policy: where a sketch runs, authority grant, effect-bearing blocks), F101.89 (host) and F104.19 (node; split to F104.71–73) are open and wait on the user's answers (handoff 2026-10-30 00:30, "Decisions Needed"). The old canvas "sketches" are retired (D121 #8).

## 9. Knowledge base and provenance: what "trace every piece of data back to its source" means today

**BUILT:**
- Every occurrence has a receipt keyed by `NodePath`, and agent steps and tool calls have sub-receipts, so a run record shows which block run produced which output from which inputs (D50, D82; `sub_receipt.rs`).
- A committed table is an immutable revision. It pins every outcome row, carried cell and nested table it depends on, rechecks authority, and records `partial` when cells failed (commit.rs).
- A `Write` note carries `source = flow:{id} run:{id}` (host.rs).
- Label provenance has an append-only ledger (label_ledger.rs).
- Review approvals are keyed on inputs, not on text. D81's example: an approval for contract A cannot cover the identical sentence produced for contract B.
- Map keeps one row per input, and a failed row is a failed cell rather than a blank (D14, D18, D34). So "found nothing" and "didn't look" stay distinct at the cell level.

**DECIDED, not built:**
- Origin on every wire (D139).
- Anchor on every harvested value: source reference plus location by source type (offsets with quote, page, section path, table cell, speaker and time, url fragment, time range), with quotes checked as exact substrings (D144, D148).
- Hand edits that carry "edited by" while untouched cells keep their run origin (D128 #9; F101.91–95 open).

Copy can promise run-level and cell-level lineage. It cannot yet promise per-quote anchoring or "model-written vs checked" marks on the canvas.

## 10. Status table

| Capability | Status | Evidence |
|---|---|---|
| Restricted Rust flow source, allowlist checker, IR on save | BUILT | `functionary-flow-check`, `flow-cst`, `flow-ir`; D07, D32 |
| Compile on Test/Run (sandboxed `rustc`, cached) | BUILT | `functionary-flow-compile/src/lib.rs` |
| Canvas editing written back to source; undo/redo; card titles, accents, collapse, group labels | BUILT | `web/src/canvas/irFlow/*`; F98.228; F101.135–138 |
| Executable: Source, TableSource, Field, Search, Summarize, Template, HumanReview, Write, Format×5, Map, Repeat, Retry, Refine, Branch | BUILT | `v1.rs` production; `descriptor.rs` tests |
| Judge, Coalesce, Filter, Sort, Select, Mutate, Pivot | Declared, not executable | `unsupported_operations_are_not_executable`; F100.31 open |
| Seven kinds on declarations and catalog | BUILT (partial) | F104.23, F104.25 done; F104.24 parked; F104.21 open |
| Model, Quote, Compare, Draft, Check, Declassify gate, Redact, Notify, Apply, Aggregate, Join, Stack, Reshape, Replicate | DECIDED | D140–D154; F104.*; F100.3/.4 blocked |
| Procedures (20) | DECIDED / IDEA | D143; F104.17; F103.* |
| Origin axis, `Record(name)` wire, Reviewable, nested tables, Anchor | DECIDED | D137–D139, D144; F104.2/.3/.5/.15 open |
| Records runtime value; private model registry | BUILT | D100/D105; F101.67–70 |
| Model block | DECIDED | F101.16, F101.71–73 open |
| Source URL / file / document_ref / integration | BUILT | `settings.rs`; D124 |
| 21 integration readers (offline-tested; Postgres and MySQL stubbed) | BUILT | F101.34–40; `integrations/mod.rs` |
| Write → KB note; commit run tables | BUILT | `host.rs` KbWrite; `commit.rs` |
| Write to files or integrations; commit sets | DECIDED | D150 |
| Triggers (schedule, webhook, email, manual) | BUILT backend, no UI | F101.43–46; D134 |
| Test dry run, Escalate | BUILT | D97; `/escalate` route |
| Pause, cancel, resume, recover; replay; budgets | BUILT | F98.262; D44, D82; F98.4 |
| Timer/Rate waits; resume-as-starter re-authorised | DECIDED | F98.231, F98.240, F98.263 open |
| Personal/Governed tenants, agent credentials, sharing | BUILT | `governance.rs`; F98.207; `sharing.rs` |
| Strict mode | BUILT policy, enforcement unwired | F101.96/97 done; F101.98 open |
| Knowledge hand-edit (`set_cell` etc.) | DECIDED | D128; F101.92–95, F101.116–120 open |
| Note edits with expected revision | BUILT | F101.114/115 |
| Cross-file imports | DECIDED (syntax only built) | D131; F101.121 done, F101.122–131 open |
| Paste transcript → reproduction flow | DECIDED | D130; F100.38–42 open |
| Sketch agent | DECIDED kind, design open | D135; F101.5, F104.19 |
| Standalone binary / eject | IDEA | `Block Ontology/src/data-more.js:200` status "idea"; P8 "v2 concern" |
| Custom blocks, Script blocks | Not v1 | P9; S31 "planned but deferred" |
| Alerting, few-shot example gallery | Not built | User Archetypes "Gaps today" |
| Live co-editing of knowledge | DECIDED later | D128 #12 |
| Horizons | Parked | D127 |

## 11. Retired list: must not appear in new copy

| Concept | Retired by |
|---|---|
| Sketch → Test → Graduate as the product spine | D121 #8 (sketches retired from the canvas); D133 #4 (graduate/promote routes retire); D123 #1 (graduation tests deleted). The spine now is **iterate → stabilize** (User Archetypes). "Test" survives only as the dry run (D97). |
| Flows as readable JSON; JSON as the ownership story | D126 #1 ("the new backend is the only backend"); D133 (JSON-model surfaces retire); `legacy_retirement.rs`. Flows are restricted Rust (P2, P8). |
| Document / Record as *the two* payload types | D137/D155: three value types (Document, Table, Record) plus scalars, nominal schemas and bounds |
| "Agent Sketch" block / card | D121 #8; replaced by the sketch agent *kind* (D135), which is not built |
| Discretion gradient; enframement | No F98 decision mentions them. They come from pre-F98 planning (`ops/planning/2026-06-19 - Discretion Roadmap…`, `2026-06-01 Trust Thesis` interview). Superseded by `2026-10-19 - What Functionary Is.md` and `2026-10-29 - User Archetypes.md` (which "Supersedes the legacy personas"). |
| "Pen it in" | No occurrence anywhere in `ops/`; site-only phrasing. Drop. |
| Checklist Jig / Checklist procedure | D143 / S16: a view, parked; Implementer Handoff §8 "Do not build … a Checklist Jig" |
| HumanReview, HumanGate | D147: the gate is **Review** (HumanReview kept as an alias for one release) |
| PivotLonger / PivotWider / Pivot | D153: **Reshape** |
| ForEach / ForEachRow | D14: **Map** |
| Collect | D16: Format replaces it |
| Map broadcast | D153 / S43: Join attach |
| Partition Jig | D143: Split procedure (two Filters) |
| Recover Jig | D80: Retry + handler + Coalesce |
| Independent Judges Jig | D142: Replicate + Judge + Aggregate |
| Match block, Cluster, Extract block | D145, D144 |
| Materiality, Rank blocks | D140 |
| "Blind" / Blind reviewer step | D149: Redact (gate) plus a per-block withhold setting |
| Comments block | D147: a Review option with an output port |
| "summarize" as the table verb | D152: Aggregate (the AI Summarize keeps its name) |
| Publish (legacy) | D133 #2 |
| Canvas agent turn loop; lasso selection | D122 #4; D123 #4 |
| Horizons | D127 |
| Single-reviewer model; mandatory roles | D120 #1 |
| Plan tracing as how flows are read | P3, Principles §3 |
| WebSource, Merge, Table block, CheckClaims | Proposal §3 "rejected" (D88 #6, D64, D130 #1) |
| Old personas (Analyst, Ops Lead, Technical Founder) | User Archetypes header |
| "Free" model tier | D156 #2 |

## 12. Surfaces that exist in the web app

Routes (`web/src/App.tsx:96-106`):
- `/projects`, plus project subroutes (`ProjectWorkspace.tsx:639-677`): overview, flows, data, knowledge, models, runs, monitoring, security, agent/transcript.
- `/models`: model connections.
- `/flows/:flowId`: the flow editor, `FlowEditorShell` (`web/src/ui/FlowEditorShell.tsx`). It contains:
  - the IR canvas, `IrBlockPalette`, `JigPalette` and `IrFuzzyFinder`
  - the per-block `ConfigPanel`, `EdgeDetailPanel`, `HistoryPanel` and `InspectPanel`
  - `HumanReviewPanel`, `RunInspector` and `LiveView`
  - a Toolbar with Test, Run and Escalate.
- `/ir-flows/:flowId`: the IR canvas route.
- `/reviewed-flows/:artifactId`: exact source beside the canvas.
- `/flows/:flowId/data`.
- `/runs`, `/runs/:flowId/:runId`: run history.
- A project-agent companion drawer on every page (`AgentCompanionLayout`).
- The knowledge tables view lists tables and commits them (`features/knowledge/KnowledgeTablesView.tsx`; F98.197). It does not edit cells.

Copy must not promise these:
- Monitoring and project Runs read legacy run records and telemetry (`ProjectMonitoringView.tsx` imports `listExecutionRuns`, `getTelemetryDashboard` from `net/api`), so they do not show new-backend runs reliably.
- There is no trigger or schedule UI.
- There is no source-code view in the editor ("a source view is built last, if at all", `parked/README.md` re D116 #8). Only the reviewed-flows page shows source.
- There is no paste-a-transcript UI.
- There is no template or few-shot gallery (`ui/Templates.tsx` is parked).
- There is no file preview (parked).
- There is no Notify, Apply or redline UI.
- There is no alerting.

## Founder quotes (verbatim)

- "The new backend makes it possible to compose a safe subset of Rust Programs using an untrusted coding agent. You don't trust their implementation of details, which are costly to check. Rather, you verify their composition of trusted components using the canvas, which maps directly to the code that will be executed. The only thing agents can do is wire together blocks." (`ops/planning/feedback/2026-09-29 14:07 - Backend prototype drift correction.md`, current)
- "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." (same file, current)
- "you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing." (`ops/planning/2026-10-19 - What Functionary Is.md`, Appendix #17, current)
- "the knowledge base then makes it possible to trace back where every piece of data came from, from original source ingestion through transformation by agents to the thing you're looking at and relying on to produce your output." (same, #27, current; only run-level and cell-level lineage is built, §9)
- "no broadcast, use the row." (`ops/planning/2026-10-29 - Block Ontology Decisions Log.md` S43)
- "Anchor is good; should be polymorphic to handle anchoring to multiple source types" (same, S46)
- "keep what's built. we'll design automator later." (`ops/backend-refactor/decisions.md` D134)
- "for that adjust and run iteration loop, there shouldn't be versioning friction. Users ask for that friction when they want to stabilize and formalize." (decisions.md D131)
