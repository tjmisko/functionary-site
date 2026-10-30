# 01 — The founder's voice: what Functionary is, who it is for, why it exists

Worktree read: `~/Projects/Functionary/.worktrees/integration/f98` (paths below are relative to it). Read-only; nothing edited.

## 0. Source notes and what counts as verbatim

| Short | Path | What it holds | Verbatim? |
|---|---|---|---|
| WFI | `ops/planning/2026-10-19 - What Functionary Is.md` | Body is a cleaned-up account; **Appendix msgs 1–34 are the raw chat** | Appendix only |
| US | `ops/backend-refactor/sources/user-steering.md` | U01–U24, 2026-10-06/07 syntax session | Yes |
| DRIFT | `ops/planning/feedback/2026-09-29 14:07 - Backend prototype drift correction.md` | Hand-written by the user | Yes |
| BSS | `ops/planning/feedback/2026-09-29 - Backend session statements.md` | S1–S7 quoted | Yes (block quotes) |
| CLOSE | `ops/planning/feedback/2026-10-15 - F98 closure review rulings.md` | Rulings "in the user's words where given" | Quoted fragments only |
| GF | `ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/sources/user-steering.md` | U1–U7 | Yes |
| BOL | `ops/planning/2026-10-29 - Block Ontology Decisions Log.md` | S1–S47 | Ruling bodies are agent-written; only the quoted fragments inside `Ruling (user: "…")` are verbatim |
| DEC | `ops/backend-refactor/decisions.md` | D01–D155 | Only `The user's words:` / quoted `Reason (user)` fragments |
| TH | `ops/planning/2026-10-02 - Technical History and Design Judgements.md` | First-person retrospective, owner's judgements | First-person passages; retrospective, partly superseded |
| TT | `ops/planning/interviews/2026-06-01 - Trust Thesis and Positioning Conversation.md` | HISTORICAL (Arachne era); "user's words are preserved closely" | Near-verbatim only |
| CABT / OBS | `ops/planning/ideas/custom-agents-with-blocks-as-tools.md`, `ops/planning/ideas/flow-observation-channel.md` | "The user's statement (… verbatim)" | Yes |

Not usable as voice: the WFI body (Claude-cleaned; e.g. "A missing player nobody notices is missing is the real failure" is the cleaned text, not a message); `User Archetypes.md` ("Written from the user's direction", no quotes); the Pi Workflow Layer "Decisions (2026-10-19, user)" block (`ops/planning/2026-10-19 - Pi Workflow Layer.md:205–215`) is operational only (supervisor model, checkpoint cadence, host location) and says nothing about the product.

Status column: **current** = 2026-09-29 onward and not overruled; **historical-but-consistent** = older or retrospective, but the claim still holds; **superseded** = overruled later (the overruling source is named).

## 1. Quote bank (72 quotes)

Original spelling, typos and lowercase are kept as written.

### 1.1 The work it is for

1. "yeah i mean almost anything that an early career consultant, research assistant, data analyst, etc. does." (WFI msg 1, 2026-10-19, current)
2. "comb through these 1000 documents to find evidence/counterevidence for X/Y/Z claim" (WFI msg 1, 2026-10-19, current)
3. "run qc on this work product against the original sources and surface and inconsistencies" (WFI msg 1, 2026-10-19, current)
4. "these are fairly straightforward tasks that ai has had the capacity to do for like 2 years" (WFI msg 2, 2026-10-19, current)
5. "but the problem for an organization is that the process is really messy" / "and not easy to fix when something goes wrong" (WFI msgs 3–4, 2026-10-19, current)
6. "for each of the above tasks the basic shape is that there are dozens to hundreds of things happening, none of which are hard in isolation, but errors can creep in" (WFI msg 8, 2026-10-19, current)
7. "because basically the principals on the projects have no idea what was happening down below and they're constantly worried about little errors creeping in" (WFI msg 10, 2026-10-19, current)
8. "hence the footnote checking and the costly replications of the sspi" (WFI msg 11, 2026-10-19, current)
9. "One example from consulting is doing fact checking and argument mapping inside a large report." (GF, 2026-10-09, current)
10. "think hard about tasks you could give juniors and interns across fields; what extraction work could anyone do; generalize into testable implementations; the uniting thread is harvesting relevant information from sources and keeping the tie back to the original source clean" (BOL, Extract-class study, 2026-10-29, current)
11. "If your human is following a script and moving information from place to place, that is something that should be easy to automate." (TT, opening note 3, 2026-06-01, historical-but-consistent)

### 1.2 Contamination and "selling good words"

12. "the difference between coding tasks and these squishier white collar tasks is that in general creative solutions that refactor things to make them work are really helpful in code. but when unauthorized/unvetted language or sourcing creeps into the pipeline in one of these white collar tasks, it can contaminate the whole thing." (WFI msg 18, 2026-10-19, current)
13. "if you're automating a research task, it's quite important that you check things exhaustively. it's not hard to remember to ask, but it's easy to forget" (WFI msg 18, 2026-10-19, current)
14. "if you're delegating into a bigger agent where the research is just one of many steps, it's hard to know whether the big agent properly asked the little agent which of the sources we were able to see." (WFI msg 18, 2026-10-19, current)
15. "the risk of contamination (your results are actually invalid because the agents skipped a step in the process and papered over or lost track of that detail) gets bigger." (WFI msg 18, 2026-10-19, current)
16. "if you care about the output, i.e. if you're exposed (reputationally or otherwise) to that kind of contamination risk, then what you'd want are durable artifacts, strong audit trails, clear process, with clear permissions management at each step, easy to replicate as exactly as possible, and easy to adjust if and when catastrophic contamination errors occur." (WFI msg 19, 2026-10-19, current)
17. "because at the end of the day there's no real world product" / "you're selling good words" / "and if it becomes clear the words aren't good" / "then you have nothing" (WFI msgs 21–24, 2026-10-19, current)
18. "so anyway in that cleanup process you go through and track down what the hell went wrong that we missed this crucial detail and then you setup the system so that we never make the same mistake again." (WFI msg 25, 2026-10-19, current)
19. "As soon as we need to rely on it in its exactness---if our professional reputation depends on the quality of the output, e.g.---then we need to at least have visibility into the details and choices of the process, to know that it's doing something reasonable, and to tune it as the situation changes." (TH §AI in the product, 2026-10-02, historical-but-consistent)
20. "We should distinguish between Permission and Failure." (CLOSE ruling 12, 2026-10-15, current)

### 1.3 Control from above; cheap micromanagement

21. "and the problem in each case is that the process that the people doing the implementation are taking to do things wasn't clear and visible from above to the principal" (WFI msg 12, 2026-10-19, current)
22. "now, the conventional argument is that well we'll replace those people who were doing the implementing with agents who are doing the implementing" / "and that's reasonable as a first thing to build" (WFI msgs 13–14, 2026-10-19, current)
23. "but actually having automated agents makes it much easier to control the process from above" (WFI msg 15, 2026-10-19, current)
24. "it's no longer costly to micromanage everything the agent does because you can just instruct a coding agent to do the micromanaging for you, then observe that the micromanged process the coding agent output looks reasonable. it's very easy to tell when it's not reasonable---you just see it immediately, in the same way if somebody tells you their plan to do something and it has wholes you just kinda know." (WFI msg 16, 2026-10-19, current)

### 1.4 Invariants; what you see is what runs

25. "but for all this micromanaging to work, you need pretty strong invariants. you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing." (WFI msg 17, 2026-10-19, current)
26. "The new backend makes it possible to compose a safe subset of Rust Programs using an untrusted coding agent. You don't trust their implementation of details, which are costly to check. Rather, you verify their composition of trusted components using the canvas, which maps directly to the code that will be executed. The only thing agents can do is wire together blocks." (DRIFT, "High Level Goal", 2026-09-29, current; also §1 of `2026-09-29 - Backend Guiding Principles.md`)
27. "Our goal is to reduce agent cleverness to zero by restricting the creative methods it could employ using simple checking and rust." (DRIFT item 7, 2026-09-29, current)
28. "The agent writes the very particular subset of rust we tell it to, and until it does, we deny." (DRIFT item 7, 2026-09-29, current)
29. "Centrally: the graph is produced from the simple Rust the agent writes." (DRIFT, closing line, 2026-09-29, current)
30. "All loops and branches are expressible as Jigs, visible at the macro level on the canvas." … "I don't want a double execution model." (BSS S2, 2026-09-29, current)
31. "Literals are almost never allowed. It must either be data from the knowledge base or from configuration options the agent or user can set, which under the hood may also live in the knowledge base." (BSS S4, 2026-09-29, current)
32. "Real Rust, subsetted, with extra checking. This is where the value comes from. Fail-closed is absolutely the model we're going for." (US U14, 2026-10-06, current)
33. "Every choice not to handle an error is a choice that the agent should make explictly (as in `.unwrap()`) in normal Rust." (US U14, 2026-10-06, current)
34. "Agree, don't crash. Do not proceed silently either." (US U22 item 5, 2026-10-07, current)
35. "Flow composition isn't something we ever fully sign off on. It might always change later. What's important is that the flow as composed is mapped durably to any data it produces, which we handle through provenance. Reviewers should never review the same output twice." (GF U4, 2026-10-09, current)
36. "Different provenance should be re-reviewed." (CLOSE, Also settled F99.6, 2026-10-15, current)
37. "Agent written helper functions are not permitted." (DRIFT item 2, 2026-09-29, **superseded** by US U13 item 2, 2026-10-06: "P2 was too restrictive. Agents may write functions, but we screen them to make sure they only contain the primatives we allow.")

### 1.5 Blocks as delegable units

38. "the restrictions on the flow code are such that the agent can only string together blocks of pre-written code that call out to subagents to do very specific, easily evaluable tasks, and use built-in control flow structures." (WFI msg 27, 2026-10-19, current)
39. "examples are steps you could delegate to anybody at an org: e.g. do a summary that keeps track of source text, evaluate the reliability of this source using these criteria, do an exhaustive search, etc. each block requires a bunch of design, testing, tweaking etc. to make it work reliably and to do its one job well." (WFI msg 27, 2026-10-19, current)
40. "The whole point of functionary is that the provided block ontology is good enough for most tasks." (BSS S1, 2026-09-29, current)
41. "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER. I need to be able to say confidently that the ONLY thing this agent can do is read the file system, look for the document, read its input context, etc. That is the product." (GF U4, 2026-10-09, current)
42. "The actual implementation for blocks like Extract is an ai engineering task for a custom trusted internal agent which has very tightly scoped permissions and context, and which is highly evaluable." (GF, 2026-10-09, current; the golden-flow Extract block itself is retired by BOL S45/D144)
43. "Flows are compositions of small, easily evaluable judgements made by agents. It is much easier to judge whether this AI agent summarized this particular document correctly, or extracted the most relevant details correctly, or transformed this piece of data correctly, than it is to throw a large, underspecified task at an agent and evaluate after-the-fact how it went off the rails." (TH, 2026-10-02, historical-but-consistent)
44. "We want blocks to capture user intention and align it to agent-restricted capabilities, and we need that intention to be preserved in the execution" (US U14, 2026-10-06, current)
45. "if you're writing custom blocks to execute, you're doing software engineering, and you assume all the responsibilties that a software engineer should assume. It's not my problem if you go around my safeguards knowingly and willingly." (DRIFT item 4, 2026-09-29, current; custom blocks deferred past v1 per BSS S5)
46. "The point of the tool is to provide tools for all of the automations you want and need that don't need a ton of custom behavior." (DRIFT item 4, 2026-09-29, current)
47. "Within each block (where relevant), the inner agent should be able to surface things it observes that don't fit the schema." (OBS, 2026-10-04, current as IDEA)

### 1.6 Why not freestyle agents or Claude workflows

48. "now maybe nothing will ever go wrong in an agent + adversarial review loop" / "or maybe the mess is just fine and these costs are trivial compared to benefits" / "that seems to be what most people think and they may well be right" (WFI msgs 5–7, 2026-10-19, current)
49. "which is not really doable with a freestyle agent. you can just beg it in your markdown file not todo stupid things and hope for the best" (WFI msg 26, 2026-10-19, current)
50. "the closest things i've used to this are claude's workflow tools, and those have the auditing problem---all i get out are transcripts and a workflow.js that does the plumbing, which essentially just amounts to calling each subagent as agent(prompt) at the right time. there's almost no guarantee about what actually happened." (WFI msg 34, 2026-10-19, current)
51. "it's true that later review usually turns that up. but this is all in the context of a codebase, where errors are less subtle." (WFI msg 34, 2026-10-19, current)
52. "i basically just have to go with it on pure vibes and trust that what it did was reasonable" (WFI msg 34, 2026-10-19, current)
53. "When an agent doesn't do what you want, it's tricky to figure out why and how things went awry, and sternly instructing it not to make the same mistake again in a markdown file is not a solution." (TH, 2026-10-02, historical-but-consistent)
54. "like i originally built a much simpler backend, but the problem was that coding agents didn't understand the little dsl syntax to build the backend super well" / "they would just fail several turns trying to get the syntax right etc." (WFI msgs 32–33, 2026-10-19, current)
55. "Arachne does not make the agents trustworthy; it limits their scope and information, but makes it easy to assemble many such limited agents." (TT Round 1, 2026-06-01, historical-but-consistent; near-verbatim per the record. Restated in TH 2026-10-02 as: the product "does not make the agents trustworthy; it limits their scope and information, and segments their judgements into atomically evlauable steps.")

### 1.7 Who it is for

56. "The basic use case of a single user running this on their machine just wants local settings to blocks, and some flow level settings as well … The layering is more for organizations and regulatory compliance: an organization can make it impossible for certain settings to be changed … The goal is as simple as possible but no simpler." (CLOSE ruling 9, 2026-10-15, current; D84)
57. "\"spaghetti\" for the flow, but isn't really spaghetti at all if it makes it clear what is happening to a user who just needs to automate these summaries and a few other things in their day to day work" (DRIFT item 1, 2026-09-29, current)
58. "I think tables are a nicer way to think about this, however, for most users." (US U19, 2026-10-07, current)
59. "keep what's built. we'll design automator later." (DEC D134, 2026-10-29, current)
60. "Kind of a scripting tool: setting up the scripts that would be too expensive to write and maintain as code (not going to hire an engineer), but still eminently scriptable tasks." (TT opening note 3, 2026-06-01, historical-but-consistent)

### 1.8 Progressive formalization: iterate, then stabilize

61. "We will build custom agents with blocks as tool calls. The custom agent will then call blocks in an order and reason about what context needs to go where, creating a trace that enables us to easily extract a good ordering of blocks to use. This is how we will bridge the progressive formalization gap and satisfy the product goal of turning transcripts of agents freestyling into repeatable, inspectable, and extensible flows that make sense to users." (CABT, 2026-10-02, current as IDEA; the sketch-agent kind is DECIDED, D135/S42)
62. "Configurable setting to fail the block if anything is missing (part of progressive formalization)." (US U18 item 12, 2026-10-07, current)
63. "Run tables should be able to produce user visible knowledge, this artifact is a key one in progressive formalization." (US U21, 2026-10-07, current)
64. "Capabilities are taken away as the right process becomes clear, not granted." (TH, 2026-10-02, historical-but-consistent)
65. "A flow is basically a function, which is the whole idea behind modules anyway, at the end of the day (Functionary is the name of the product...)" (US U14, 2026-10-06, current)
66. "The model is not improving — that's not my job — but the process in which the agent engages is." (TT Round 8, 2026-06-01, historical-but-consistent; near-verbatim)

### 1.9 What drives users away (and what the founder refuses to build)

67. "I'm feeling like what I'm really doing is designing another, agent-safe language here. Is Rust even the right thing? I don't want to write a new language, just use a safe subset, but this business about hiding `async` and using IR has me worried about scope creep." (US U14, 2026-10-06, current)
68. "User might unwire port 3, but ports 4, 5 and 6 are still there. We should be robust to that case, and still be able to execute." (US U13 item 4, 2026-10-06, current)
69. "All of this is hypothetical … let's just move forward with something reasonable. I don't care right now." (DEC D125, 2026-10-28, current)

### 1.10 Naming and taste rulings

70. "Repeated call boilerplate is ugly." … "I do not like the three argument .connect() syntax." (US U04, 2026-10-06, current; the call/nodes A/B is superseded per D126 #3)
71. "I don't like the `Publish` language" (US U22 item 7, 2026-10-07) and "Commmit might be better than Promote. Sounds more databasey, more git-like." (US U23, 2026-10-07, current)
72. Block-ontology session fragments, 2026-10-29, all current: "Quote is good, add to extract" (BOL S45); "Anchor is good; should be polymorphic to handle anchoring to multiple source types" (BOL S46); "Aggregate, that's very clear, with group by and compute." (DEC D152); "what does broadcast even mean? check the golden flow and decide whether it is written correctly" and "no broadcast, use the row." (BOL S43); "let's make sure we can do consistent sets" (BOL S44); "we can just invent a forcing case now; we will need to build this; not yet" (BOL S40); "I want to clean up the Extract column in the record tab based on what we actually need" (BOL S47); "I don't want bad examples in the repo." (BOSH §1); "We should rename ForEach->Map explicitly. Explode is a separate jig; we should probably call it something less exciting though" (US U20, 2026-10-07).

### 1.11 Rulings recorded in the ledger's own words (not verbatim; cite as DECIDED, never quote)

- Block = "a delegable unit of agent judgement" (BOL S27; DEC D135, Reason (user): "the kinds should say what a thing is for: data in, judgement, control, pure work, decide, out"). Agent-written wording.
- "Model feels right but is too flexible for a basic user and gives no pit of success" (DEC D144 Reason (user)). Agent paraphrase of the user.
- Floating module calls: "the common case is a flow built, adjusted, run, adjusted, run, then rarely used again; that loop must carry no versioning friction" (DEC D132 #1 Reason (user)). Paraphrase.
- "hyperformalism — mandatory roles, sign-offs or separations nobody asked for — is an anti-pattern" (DEC D120 #1; repo `CLAUDE.md:605`). Ledger wording.
- "The canvas is sufficient; reviewers never read source … defending the canvas's sufficiency is the product." (DEC D116 #8). Ledger wording.
- The Archetypes' "What would drive them away" lists (`ops/planning/2026-10-29 - User Archetypes.md:89–94, 155–160`): versioning prompts, being asked to read Rust/CLI/config, role ceremony, "Silent wrongness"; for the Automator, silent behaviour change, runs that "die quietly", "Hitting a ceiling". Written from the user's direction, not quotes.

## 2. Build status of the claims the quotes make

| Founder claim | Status | Evidence |
|---|---|---|
| Restricted Rust subset; graph read from source; canvas ↔ source one-to-one | BUILT (landing) | Crates `functionary-flow-{check,cst,ir,lower,exec,edit,contract}` present; D126 #1 "The restricted backend is THE backend, and the only one" |
| Fail-closed checker, denied macros/literals | BUILT in substance | `crates/functionary-flow-check/src/rustc_check.rs`, `trial.rs` (compiles against the generated marker library) |
| Seven kinds: Ingress, Block, Agent, Transform, Jig, Gate, Egress | DECIDED (D135); partly BUILT | `F104.23` (Kind enum on declarations) and `F104.25` (palette grouping) are `status: done`; the other ~72 F104 tasks are `open` |
| Origin lattice (Sourced/Computed/Generated/Verified/Reviewed), the mechanism behind "contamination" | DECIDED (D139/S9), not built | No origin axis in `functionary-flow-check/src`; the contract declares no origin |
| Quote, Compare, Notify, Apply, Redact, Declassify, Aggregate, Reshape | DECIDED (D144–D153), not built | Contract `name:` list in `crates/functionary-flow-contract/src/lib.rs` is still: Branch Coalesce Field Filter Format HumanReview Judge Map Mutate PivotLonger PivotWider Refine Repeat Retry Search Select Sort Source Summarize TableSource Template Write |
| Exhaustive coverage search; "found nothing" vs "didn't look" | Partly DECIDED (S10/S36/S37: access column, leads); Explore is an IDEA | BOL S6, S10; `ops/planning/ideas/exhaustive-coverage-search.md` |
| Review on a block; observation channel; custom agents with blocks as tools | IDEA | BOL S28; OBS; CABT |
| Custom blocks | Deferred past v1 | BSS S5; BOL S31 |
| Automator path (triggers, strict mode) | Partly BUILT (trigger pieces F101.43–46 kept), design deferred | DEC D134 |

Site copy must not present the origin lattice, Quote, Compare or the seven-kind palette as shipped.

## 3. The founder's register

**Two modes, one voice.**

- **Chat mode** (WFI appendix, GF, block-ontology fragments): lowercase, no capitals at sentence start, a thought split across several messages, each message a clause ("you're selling good words" / "and if it becomes clear the words aren't good" / "then you have nothing"). Sentences run 5–15 words, then a single 150-word run-on when the founder is explaining mechanism (msg 18, msg 27). Fillers like "so anyway", "like", "basically", "kinda" ("you just kinda know"), and one swear ("what the hell went wrong", "some sspi crap").
- **Steering mode** (US, DRIFT, CLOSE): numbered replies that track the agent's numbered points ("1. … 2. + 3. Agree that …"). Short verdicts open each item: "Agree.", "Yes, this is central", "Sure.", "Agree on hard screen." Then a "but" or a question. Typos stay in ("primatives", "explictly", "Commmit", "porrts").

**Favoured words and phrases.** clear / clearly / visible ("clear and visible from above"); from above; principal; process; messy; creep / creeps in; contaminate / contamination; exhaustively; reasonable ("looks reasonable", "trust that what it did was reasonable"); trusted blocks; compose / wire together; safe subset; deny; fail-closed; invariants; provenance; durable; easily evaluable; delegate; "the whole point of"; "at the end of the day"; "basically"; "essentially"; "we need to think (really) hard about"; "as simple as possible but no simpler"; "right?" as a tag on a technical proposal ("Each block should basically output a `Result`, right?"); "Let's" + verb.

**Words they avoid or have ruled out.** bureaucracy in public ("nobody likes bureaucracy", TT Round 6), harden (memory: arachne-positioning-vocabulary), Publish and Promote (became Commit), channels (became "modes", BOL S10), flatmap and broadcast ("the word is array-programming jargon", BOL S43/D153), Blind (became Redact), Explode ("something less exciting"), Replicate (disliked, not yet renamed), the `::of` keyword. No marketing superlatives anywhere in the corpus. They don't claim the agent is "smart" or "trustworthy". Agents are "untrusted", "freestyle" or "little agents".

**How they argue.**

1. **Concrete failure story first.** SSPI replications, BRG principals, footnote checking (msgs 9–11); the SSPI source-check workflow run "on pure vibes" (msg 34); the agent that "deleted 7,659 lines of UI to silence TypeScript errors" (TH); the `for topic in [...]` loop that the canvas cannot edit (DRIFT item 1).
2. **Concede the other side, then turn.** "they may well be right" (msg 7) → "but actually…" (msg 15). "that's reasonable as a first thing to build" (msg 14) → "but".
3. **Name the failure precisely.** The defining unit is a missed detail that nobody saw: "skipped a step in the process and papered over or lost track of that detail". The cleaned WFI body turns this into the "X is the failure" sentence pattern. That pattern is the agent's tidy form of the founder's idea. The founder's own phrasing is "the problem in each case is…" (msg 12) and "the problem is that…" (msgs 29, 32).
4. **Plain declaratives for invariants, questions for open design.** Rules: "The only thing agents can do is wire together blocks." "Literals are almost never allowed." Open design: "Can this be done cleanly?" "What good is tracing here?"
5. **Analogy from software engineering, not from AI.** `unwrap()`, safe/unsafe Rust, git commit, dplyr/jq/stata, compilers. The 2026-06 interview pulled in philosophy (Gestell, Zuhandenheit). That vocabulary is gone by October.
6. **Capitals for one non-negotiable.** "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER" … "That is the product."

**Ten sentences that sound like them** (constructed, built from the corpus's words and rhythm):

1. The agent builds the flow. You look at it and you can tell whether it's reasonable.
2. None of these steps is hard. The problem is that one of them gets skipped and nobody upstairs finds out.
3. You're selling good words. If a source slipped in that nobody vetted, the words aren't good anymore.
4. What you see on the canvas is what runs. If the agent improvises, it doesn't run.
5. "Found nothing" and "didn't look" have to be different things you can see from above.
6. Each block does one job you could hand to an intern, and you can check whether it did it.
7. Writing "please don't do stupid things" in a markdown file is not a process.
8. Most flows never get formal. You run it, fix a step, run it again.
9. When something goes wrong, you trace it to the step, fix the step, and it doesn't happen again.
10. It's not about making the agent trustworthy. It's about making what it did visible and cheap to check.

**Five sentences that do not sound like them:**

1. "Harness the power of AI to supercharge your research workflows." (superlatives, hype verbs)
2. "Functionary makes your AI agents trustworthy." (contradicts quote 55 directly)
3. "Build a robust bureaucracy for your agents and harden your processes." (both banned public words)
4. "Our cutting-edge platform leverages a novel Rust-based DSL to deliver enterprise-grade compliance." (stack-first, jargon. The founder leads with the failure, not the stack, and the Associate never sees Rust: Archetypes l.92)
5. "Simply describe your goal and let our autonomous agents handle everything end to end." (this is the freestyle-agent model the founder argues against, msgs 26, 34)

## 4. How the voice changed: 2026-06 trust thesis → 2026-10 F98

**2026-06 (TT; HISTORICAL; product named Arachne).** The frame is abstract and positional. "trust is the focus word, and the product is a thesis about where trust comes from in the world of working with agents whom you cannot trust" (TT Round 2). Supporting ideas: compositional trust, the spider-silk web, a "legible and mutable bureaucracy" and the principal-agent problem (kept private), "enframing context, then aggregating across" (Round 7), Heidegger. Positioning is against n8n/Make/Zapier ("I'm definitely in the ring with n8n", Round 4). The canvas is "where agents and people collaborate"; Document vs Record is the type seam. All of this is SUPERSEDED as product description. The block model is now seven kinds (D135), and the Document/Record split is gone (09-14 feedback; S7: Source emits `Document<media>`, records are `Record(name)` wire types, S3).

**2026-09-29 → 10-07 (DRIFT, BSS, US).** The voice turns into a builder correcting drift: "I'm detecting significant drift from my intentions, and I want it fixed. I have been extremely clear in my ops files on this subject." (DRIFT preamble, 2026-09-29). Mechanism words take over: subset, deny, checker, fail-closed, IR, `Result`. Trust becomes a property of components ("trusted blocks", "untrusted coding agent"), no longer a thesis.

**2026-10-19 (WFI).** The account goes back to *why*. It doesn't use the June abstractions. It uses the founder's own work history (SSPI, BRG) and a new pair of ideas: **contamination** and **control from above / cheap micromanagement**. The WFI doc itself marks this as the sharpening: "the product's job is not only to make AI *auditable* but to make the process **cheap to control from above**" (WFI §How this sits against the existing record). "Micromanage" takes the place of the private "bureaucracy" lens. It's a plain word for the same principal-agent idea, said from the principal's chair.

**2026-10-29 (BOL).** The founder rules on names and kinds in very short messages ("Yes, log S4 and apply it", BOSH §1). They test everything against a non-programmer: "the verb set must stay small enough for non-programmers" (BOSH §1). Taste rulings cut ink and jargon.

**Constant across all eras:**

- **Agents are not made trustworthy; their scope is bounded.** TT Round 1 (06-01) → TH (10-02) → DRIFT "untrusted coding agent" → WFI msg 27 "very specific, easily evaluable tasks".
- **Markdown-file instructions are not a control mechanism.** TT Round 8: context-window advice "should be done as well, but cannot be fully trusted" (near-verbatim) → TH "sternly instructing it … in a markdown file is not a solution" → WFI msg 26 "beg it in your markdown file not todo stupid things and hope for the best".
- **The process learns, not the model.** TT Round 8 → TH "Capabilities are taken away as the right process becomes clear" → WFI msg 25 "setup the system so that we never make the same mistake again" → progressive formalization (D120, D132).
- **Small checkable judgements beat one large task.** TT Round 8 "asking them to do small tasks we can check" → TH quote 43 → WFI msg 27 → BOL S6 "Why not one block: an opaque ExhaustiveSearch would hide the frontier…".
- **The canvas makes wrongness visible at a glance.** TT Round 1 ("make it visually obvious whether the process is right — which is not true when working with Claude Code in the CLI") → WFI msg 16 ("you just see it immediately").
- **Scripted, information-moving work is the target.** TT note 3 ("moving information from place to place") → Archetypes "moving information, then sorting and filtering it" → WFI msg 1.

**What shifted:**

- *Abstract to concrete.* "Trust thesis" became failure stories and a mechanism (origin lattice, D139, built to carry "the contamination story in *What Functionary Is*", BOL S9).
- *Positioning target.* June measured against n8n/Zapier. October measures against "just asking agents" and Claude's workflow tools (msgs 31, 34).
- *Who builds.* June: "agents and people collaborate" on the canvas. October: an agent builds and the Associate looks and adjusts. Reviewers never read source (D116 #8).
- *Formalization default.* June talked about hardening the process. October rejects friction by default ("hyperformalism … is an anti-pattern", D120; "no versioning friction", D132), and formalization is opt-in for the Automator.
- *Public vocabulary.* "delegation" and "trust" were locked in June. October's own words are "control", "visible from above", "contaminate", "good words". "Trust" in October mostly describes components ("trusted blocks"). In WFI msg 34 it appears once, negatively: "trust that what it did was reasonable".
