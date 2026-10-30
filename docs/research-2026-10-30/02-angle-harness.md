# Angle 02: "Functionary is the agent harness for knowledge work"

Worktree: `~/Projects/Functionary/.worktrees/integration/f98`. Paths below are relative to it. Status tags: **BUILT** (code on integration/f98 with tests), **DECIDED** (ruled, not built), **IDEA** (registered or open). Founder quotes are verbatim.

## 1. Verdict in one paragraph

The record backs a narrow version of the claim and works against the broad one. The broad version is "Functionary is to analysts what Claude Code is to programmers". The record never uses "harness" for the product. It treats coding harnesses (Claude Code, Codex, Claude's Workflow tool) either as the **comparator that fails** for research work or as **outer agents that write into Functionary**. The narrow version is "Functionary is the constrained environment in which agents do knowledge work, with a closed action set, receipts, and a readable plan". That version is the founder's thesis nearly word for word, and most of its machinery is DECIDED. The pieces most like a "harness" are the closed-vocabulary agent loop and the receipts. Those are BUILT, but only one production inner agent uses them (filesystem Search). The authoring agent a user would actually talk to still runs on the legacy JSON-model prompt.

## 2. What "harness" means here vs a coding harness

### 2.1 The founder's comparison

The founder states the comparison in *What Functionary Is* (`ops/planning/2026-10-19 - What Functionary Is.md`, Appendix, 2026-10-19).

**Workflow tool as the failure case** (msg 34):
> "the closest things i've used to this are claude's workflow tools, and those have the auditing problem---all i get out are transcripts and a workflow.js that does the plumbing, which essentially just amounts to calling each subagent as agent(prompt) at the right time. there's almost no guarantee about what actually happened."

**Why code and white-collar work differ** (msg 18):
> "the difference between coding tasks and these squishier white collar tasks is that in general creative solutions that refactor things to make them work are really helpful in code. but when unauthorized/unvetted language or sourcing creeps into the pipeline in one of these white collar tasks, it can contaminate the whole thing."

**Freestyle agents** (msg 26):
> "which is not really doable with a freestyle agent. you can just beg it in your markdown file not todo stupid things and hope for the best"

So a Functionary "harness" inverts the coding-harness contract:

| Axis | Coding harness (Claude Code, Codex, workflow.js) | Functionary (record) | Status |
|---|---|---|---|
| What the agent may write | Arbitrary code, shell, edits | Restricted Rust subset; "The only thing agents can do is wire together blocks" (Backend Guiding Principles §1, P1–P2) | BUILT: checker/IR/lowering in `crates/functionary-flow-check`, `-flow-ir`, `-flow-lower` |
| Creative repair | Welcome | Denied: "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." (`ops/planning/feedback/2026-09-29 14:07 - Backend prototype drift correction.md`, item 7) | BUILT (allowlist checker) |
| What the reviewer reads | Transcript + diff, after the fact | Canvas that maps 1:1 to the code that runs (P7; D116 #8, "the canvas is sufficient") | BUILT (restricted canvas) |
| Subagent actions | Whatever tools the CLI ships | Closed Rust enum; unknown call = error to the model; capability handles; OS confinement (D61) | BUILT: `crates/functionary-agent/src/lib.rs:1-36`, `tool.rs`, `runner/` |
| Record of a step | Transcript text | Receipted sub-step `…/step[i]/call[j]`; strict replay; a resume never creates new output to review (D60, D61) | BUILT: `functionary-agent/src/journal.rs`, `functionary-flow-blocks/src/agent_journal.rs` |
| Was this written by a model? | Not tracked | Origin axis on every wire: Sourced, Computed, Generated, Verified, Reviewed; only Check/Review discharge (D139) | DECIDED (F104.3, not built: `implementation-status.md` "2026-10-30 — Block ontology decided, not built") |
| Who runs it | The agent | Agents Test only by default; Run needs a human unless the tenant enables it (D122 #1); an agent is never a flow owner (D120 #2) | BUILT (governance policy) |

### 2.2 The three agents (four if you count the outer coding agent you bring)

The glossary (`ops/planning/backend-ground-truth/glossary.md:9-17, 154-157`) and D135 separate them.

1. **Outer / authoring agent.** "A coding agent (Claude Code, Codex, the in-app project agent) that writes flow source. It is untrusted with private data." It only composes (P1). It never edits a block's internal prompts (P6). Disclosure to it needs a specific grant (firm-answers §2).
   - **BUILT, in-app: the project agent.** Code: `crates/functionary-server/src/project_agent/`. Web: `web/src/ui/projects/ProjectAgentPanel.tsx`, whose doc comment calls it "a project-owned coding-agent conversation".
   - **Retired: the canvas agent's turn loop** (D122 #4).
   - **BUILT, external:** the `functionary` CLI talks to `/api/restricted-backend/` (`crates/functionary-cli/src/client.rs:17-255`), including starting Test runs. Firm-answers §15 says "Users may point their own Claude Code at the flow repository if configured properly". It also calls today's in-app agent a stopgap, "not a statement of product direction".
2. **Inner / block agents.** AI inside a block, on the Functionary-owned loop (D61). Its definition lives in the block's crate (D62). It runs on DeepSeek V4.1 Flash only, through OpenRouter with data collection denied (D156 #4). It is invisible to the outer agent (firm-answers, Golden Flow 04 table).
   - **BUILT: one production instance.** Filesystem Search: `crates/functionary-search/src/tools.rs:70-85` (`index_query`, `list_dir`, `find_files`, `read_text`, `search_text`), wired through `crates/functionary-flow-blocks/src/search_resources.rs:1-17`. LocalOnly sessions run in the confined runner.
   - **Other blocks:** Summarize, Judge and the rest are single model calls, not loops.
3. **Sketch agent** (D135, S42). "Its own kind on the canvas … more permissions than a block, able to flout the type rules; the on-ramp whose trace a flow is stabilized out of." Everything downstream of it is Generated until a Review or Check discharges it (D139). It realizes the founder's 2026-10-02 direction (`ops/planning/ideas/custom-agents-with-blocks-as-tools.md`):
   > "We will build custom agents with blocks as tool calls. The custom agent will then call blocks in an order and reason about what context needs to go where, creating a trace that enables us to easily extract a good ordering of blocks to use. This is how we will bridge the progressive formalization gap and satisfy the product goal of turning transcripts of agents freestyling into repeatable, inspectable, and extensible flows that make sense to users."
   - **Status: partly BUILT.**
     - Vocabulary: `crates/functionary-sketch/src/lib.rs:267-286` has `call_block`, `list_knowledge_tables`, `read_knowledge_page` and `open_knowledge_table`.
     - Done tasks: trace (F101.87), stabilize-to-checked-flow (F101.88), KB tools (F101.86).
     - Not production-wired. F101.85's completion note: "No non-test caller exists". Only Source, Summarize and Template are dispatchable; Write, HumanReview and Jigs are refused.
     - Still open: the host (F101.89), the canvas node (F104.19), docs (F101.90), and F101.5's three policy questions (where a sketch runs, how authority is granted, effectful blocks), listed in `ops/planning/handoffs/2026-10-30 00:30 - f98-landing.md:23`.
4. **The developer's own harness** (`ops/planning/2026-10-19 - Pi Workflow Layer.md`). It ports Claude's Workflow tool to pi agents and adds `checkpoint()` review/drift steps. It is **not product**: "Non-goals: replacing Functionary; exposing this to end users". It is evidence of the founder's view that orchestrated agents need explicit review checkpoints, and that this is "the addition the Claude tool lacks".

### 2.3 What the harness guarantees, in the founder's words

From `ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/sources/user-steering.md`, U4 (2026-10-09), recorded as D61:
> "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER. I need to be able to say confidently that the ONLY thing this agent can do is read the file system, look for the document, read its input context, etc. That is the product."

This is the strongest support for the word "harness" in the record. It applies to **inner** agents, and the founder has used the word in exactly that sense: "fine-tune an open weight model for it inside the custom harness, which we'll need to design" (same file, initial steering). Fine-tuning is out for v1 ("v1 trains and fine-tunes nothing", `firm-answers.md` §1). D61 replaced the framework option with a Rust loop: Golden Flow 08 records that it "rejected" LangChain, OpenCode and CLI providers for inner agents.

D146 (two kinds of review) completes the inner-harness picture:
- **Internal review:** self-review inside the call, bought by the effort level. It stays Generated and has one receipt.
- **Independent review:** a separate step with its own context and its own receipt.

The two are told apart by how context moves, and only Check or Review discharges Generated. A coding harness has no equivalent distinction.

## 3. Where the record rejects or sidelines "harness" framing

1. **The word is absent from product framing.** A grep of the current authoritative docs finds "harness" only for:
   - test harnesses (`lower-harness`, the e2e harness);
   - the Associate archetype, defined by *not* using one: "They rarely or never use agent harnesses, terminals or code editors" (`ops/planning/2026-10-29 - User Archetypes.md:37`);
   - an older reviewer note that "a cleared agent must run in a confined harness" (`feedback/2026-09-16 20:20 …:288`).
2. **Coding harnesses are clients of Functionary, not what it is.** The glossary lists Claude Code and Codex as outer agents. The principles goal ("compose a safe subset of Rust Programs using an untrusted coding agent", Backend Guiding Principles §1) makes Functionary the **target language and verifier** a harness writes into. Calling Functionary itself the harness collapses that boundary.
3. **The in-app agent is explicitly a stopgap.** firm-answers §15: "not a statement of product direction". D122 #4 retired the canvas agent's turn loop.
4. **Agents are the means, control is the point.** The founder (msg 15–16, 2026-10-19):
   > "it's no longer costly to micromanage everything the agent does because you can just instruct a coding agent to do the micromanaging for you, then observe that the micromanged process the coding agent output looks reasonable."

   The doc's own sharpening: the product's job is to make the process "cheap to control from above".
5. **The value lives in blocks, not in agent cleverness.** P1: "The value of a flow comes from the blocks, which are trusted implementations, not from agent cleverness." D155's admission test makes each AI Block "one delegable job a junior could be handed", with a tuned prompt the agent never edits.
6. **The founder concedes the incumbents may be right** (msg 5–7):
   > "now maybe nothing will ever go wrong in an agent + adversarial review loop" … "or maybe the mess is just fine and these costs are trivial compared to benefits" … "that seems to be what most people think and they may well be right"
7. **Older positioning denies "making agents trustworthy"** (`ops/planning/2026-10-02 - Technical History and Design Judgements.md`, "My positioning"): the product "does not make the agents trustworthy; it limits their scope and information, and segments their judgements into atomically evlauable steps." A harness claim that sounds like "makes agents reliable" contradicts this.

## 4. The knowledge-work jobs the record names

- **What Functionary Is (founder, 2026-10-19), five jobs:** secondary market research, combing 1,000 documents for evidence and counterevidence, Excel model building from CapIQ/Bloomberg/10-Ks, data sourcing and cleaning, QC against sources. "almost anything that an early career consultant, research assistant, data analyst, etc. does."
- **`ops/examples/`, seven stories:** market research, evidence combing, model building, data sourcing and cleaning, QC against sources, document revision, market consolidation. The README frames each as a test of "can the block primitives compose this process?" and as "a worked example for the authoring agent and a candidate eval fixture".
- **User Archetypes (2026-10-29).**
  - Associate jobs: competitor pricing into one table; 30 expert-call notes into claims; "Check every citation in this ChatGPT answer against the source" (F100/D130); dedupe a vendor list.
  - Automator jobs: intake queues, reconciliations, compliance pipelines, monitoring sweeps.
- **Block Ontology Consolidation Proposal §2b (2026-10-29):** 24 "what juniors and interns are asked to harvest" tasks across 20 fields. Examples: termination clauses, literature notes, fact-checking a draft, filing figures, lease abstracts, control evidence for audit. Each maps to a verb composition, and each row is marked covered or partial. This is the record's best evidence that the verb set spans knowledge work. It is DECIDED, and the verbs (Quote, Compare, Check) are not built.
- **F100 (transcript reproduction), A6** (`ops/planning/2026-10-15 - F100 Transcript Reproduction MVP.md`): "An agent writes the reproduction flow from the block palette. The checker accepts it, the user approves it on the canvas, and it runs. A canned flow is the fallback." D130 #10 (2026-10-29) adds a paste UI. F100.0 and F100.10 are open.

## 5. What the code says today (integration/f98)

1. **The closed-vocabulary loop is real** (`crates/functionary-agent`):
   - `tool_set!` generates the schemas and the parser from one enum;
   - the `submit` tool goes through `AgentSpec::accept`;
   - `StepJournal` gives strict replay;
   - Linux has a confined runner (F99.4).

   This is the most defensible "harness" in the codebase.
2. **One inner agent uses it in production:** filesystem Search, which takes a claim Row as input. D141's query-shaped Search with modes and sources (web, knowledge, connectors) is DECIDED. Web and exhaustive search are IDEA (`ideas/exhaustive-coverage-search.md`).
3. **The sketch agent is a tested library with no caller** (F101.85 notes; F101.89 open).
4. **The project agent, the authoring agent users meet, is out of date with the restricted backend:**
   - Its static system prompt is the legacy `CANVAS_FIRST_AUTHORING_CONTRACT` (`crates/functionary-server/src/project_agent/turn.rs:2753-2850`). It teaches `add_canvas_sketch`, `update_canvas_sketch.enable_agent`, Silk `edit_flow`, the Downloads-sorter recipe, and "There is no authorable Agent block". Each of these conflicts with D121 #8 (sketches retired from the restricted canvas), D133 #3 (legacy JSON-model tools removed; F101.10 still open) and D135 (Agent is now a kind).
   - It offers seven restricted tools: list, create, read, edit, check, read_layout, arrange (`restricted_client.rs:57-80`; F101.136 done 2026-10-30). It has **no restricted Test tool**. The legacy `test_flow` returns the `legacy_flow_tests_retired` blocker (`tools.rs:110-114`). D122 #1 says agents may start Test runs, but in-app they cannot on restricted flows. The external CLI can.
   - No restricted-Rust grammar guidance or few-shot flow examples are injected into the prompt. A grep for flow-source idioms in `project_agent/` finds none. The founder's earlier failure mode was exactly this: "coding agents didn't understand the little dsl syntax to build the backend super well" (msg 32).
5. **The outer agent's provider is the Claude CLI.** D156 #4 keeps "the Claude plan … with outer agents through the `claude_cli` sidecar". The sidecar spawns `claude -p --output-format stream-json …` with only model, session and memory-disabling settings (`crates/functionary-llm-sidecar/src/cli_runner.rs:262-279, 74-112`). Tools are parsed from fenced text (`crates/functionary-llm/src/provider.rs:73-130`). No flag restricting the CLI's built-in tools is passed. I did not verify what the CLI exposes in print mode. D61's "providers that carry their own tool sets … are excluded" applies to inner agents only, but a "harness" claim invites the question for the outer agent too.

## 6. What is missing for the claim to be true

From the archetype "Gaps today" list (`User Archetypes.md`) and the open records:

- **Few-shot examples and templates** "do not exist as a product surface". Yet the archetype doc calls them "the main lever on whether they succeed". There is a tension with `firm-answers.md` §1: "v1 trains and fine-tunes nothing, so agents must write moderately complex flows correctly without examples."
- **Custom blocks:** not in v1 (P9; open-questions §14).
- **Hooks:** not designed. **Alerting:** not built on the new backend. **Triggers:** pieces built, the Automator path designed later (D134: "keep what's built. we'll design automator later.").
- **Custom review views:** not specified. **Review on a block**, the window into an inner agent's transcript and tool calls, is IDEA (D147). **Review of process as well as output** is deferred (D60, U6: "defer for now").
- **The block ontology that carries the contamination story:** origin, Check, Quote, Anchor, Compare and Review-as-generic are all DECIDED, none BUILT (F104 epic, `ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` §1: "Nothing is built yet").
- **Building the inner agents.** The founder (msg 29): "the problem is that building all those custom agents to live in blocks is messy and hard and slightly ocean-boily". One exists.
- **Sketch agent policy:** F101.5 Q1–3 unruled.

## 7. SUPPORT (cited)

1. The founder's thesis is a constrained agent environment for white-collar work: msg 17–19, 27 (`What Functionary Is`). For example: "the restrictions on the flow code are such that the agent can only string together blocks of pre-written code that call out to subagents to do very specific, easily evaluable tasks, and use built-in control flow structures."
2. The founder names coding harnesses and Claude's Workflow tool as the comparator that fails for research: msg 34.
3. The founder calls tool control "the product": D61; Golden Flow `sources/user-steering.md` U4.
4. A Functionary-owned agent loop with a closed vocabulary, receipts, strict replay and OS confinement exists and is tested: `crates/functionary-agent/src/lib.rs:1-36`; Search wired in `functionary-flow-blocks/src/search_resources.rs`.
5. Agents-with-blocks-as-tools is a ruled canvas kind with a built vocabulary, trace and stabilizer: D135, S42, F101.85–88.
6. Model output is typed as Generated until checked: D139, D148. This answers the founder's question of whether "the big agent properly asked the little agent which of the sources we were able to see" (msg 18) and is carried by Search's access-status column (D141).
7. Delegable-junior framing is formal: D155's admission test; the 24-task Extract study.
8. Agent authority is modelled: D120 #2 (an agent is never an owner), D122 #1 (Test only by default), D132 #2 ("An agent can never resume a run as a human"), D121 #4 (no inherited review disclosure).

## 8. COUNTEREVIDENCE (cited)

1. "Harness" is not product vocabulary anywhere current. The Associate is defined as someone who does not use harnesses (`User Archetypes.md:37`).
2. The glossary names Claude Code and Codex as outer agents that write into Functionary. Functionary is their target and verifier, not a peer (`glossary.md:9-10`; P1–P7).
3. The in-app agent is a stopgap, "not a statement of product direction" (firm-answers §15). The canvas agent loop is retired (D122 #4).
4. The value is placed in blocks and in the readable plan, not in the agent (P1, P6, P7, D155). The founder's own 2026-10-02 positioning: it "does not make the agents trustworthy".
5. The live authoring agent's prompt teaches the retired model, has no restricted Test, and has no grammar examples (`turn.rs:2753-2850`, `tools.rs:110-114`, `restricted_client.rs:57-80`).
6. Most distinguishing mechanisms are DECIDED, not BUILT (F104). Only one inner agent runs. Web search is an idea.
7. The founder allows that "agent + adversarial review loop" incumbents "may well be right" (msg 5–7).
8. Automator needs (hooks, alerting, custom blocks) are explicit gaps. A "harness for knowledge work" read as "automate the back office" overclaims.

## 9. WHAT WE NEED TO DO BETTER (prioritized)

1. **Make the authoring agent match the restricted backend.**
   - Finish F101.10: delete the legacy project-agent tools and replace `CANVAS_FIRST_AUTHORING_CONTRACT` with a restricted-Rust authoring contract that covers the verbs, P1–P5 and D153's "no broadcast, use the row".
   - Add a restricted **Test** tool, since D122 #1 already permits agents to Test.
   - Inject canonical flow examples from `crates/functionary-flow-lower-harness/flows/` and `ops/examples/`.

   Without this, "agent harness" describes a surface that teaches the wrong model.
2. **Ship few-shot flows as a product surface** for the Associate jobs: the archetype gap, and the "examples are a product surface, not test data" instruction in `User Archetypes.md`. Settle the conflict with firm-answers §1's "without examples" premise in one ruling.
3. **Land F104.1–F104.3, F104.10 and F104.15** (kinds, Record, origin, Check, Quote/Anchor). The origin axis and Check are the concrete difference from a coding harness. Until they are built, "receipts and verified quotes" is a claim about the plan.
4. **Rule F101.5 Q1–3 and build F101.89 and F104.19**, so the sketch agent, the freestyle-to-flow on-ramp, has a production caller. This is the one place Functionary actually behaves like a harness the user drives.
5. **Make the external-harness path first-class.** firm-answers §15 expects users to point Claude Code at flows. Package the CLI's restricted commands, the grammar and the checker diagnostics as an agent-facing kit. Then the honest claim "use your harness; Functionary constrains what it can build" is demonstrable.
6. **Constrain or document the outer agent's own tool surface on the `claude_cli` sidecar** (`cli_runner.rs:262-279`), so the "closed tool vocabulary" story does not stop at inner agents.
7. **Build the second and third inner agents** (Quote, Compare) on `functionary-agent`, with goldens (F103's three-arm comparison, D146). One agent is a demo, not a harness.
8. **For Automators: alerting, then hooks, then a custom-block design.** Until then, keep the claim to attended knowledge work.

## 10. Five formulations the record supports

1. "Functionary lets an agent build a research or analysis process as a flowchart that is exactly the code that runs, so you check the plan, not the transcript."
2. "Agents in Functionary can only wire together trusted, single-purpose blocks; every agent inside a block has a closed list of actions and leaves a receipt for each step."
3. "In code, an agent's creative fix is a feature; in research it is contamination. Functionary is built for the second case: nothing a model wrote counts as checked until a quote check or a person checks it." (The last clause is DECIDED, D139/D148.)
4. "Micromanage an agent's process at the cost of reading a diagram: instruct, look at the flow it built, adjust, run again."
5. "Let an agent work freely with trusted blocks as its tools, then turn what it did into a repeatable flow you can inspect and rerun." (Sketch agent: DECIDED, partly BUILT.)
