# 09 Critique of 08-synthesis

Root for every path: `~/Projects/Functionary/.worktrees/integration/f98` (HEAD `f5b07c87`, 2026-10-30, confirmed). Read-only. Every quote in the 08 quote bank (§6, items 1–40 and the reserve) was searched with `rg` and found verbatim, with the exceptions in findings 18 and 19. Ranked most severe first.

## Findings

**1. Old foil, put in the founder's voice (a, c)**
- Offending: "It isn't n8n with an AI node, which draws the plumbing and leaves the judgement in a black box." (§1 [13])
- Problem: n8n is the 2026-06 Arachne-era foil. 08's own retire table says to keep it to one line at most, and §1 presents this sentence as Tristan speaking. The "black box" contrast also cuts against the founder: he accepts blocks as black boxes.
- Evidence: `rg -i n8n` returns 0 hits in WFI, BOL, ARCH and `decisions.md`. IAI line 278 (limpid comment, "the user's words" per line 242): "it may also be a black box, fine with that."
- Corrected: delete the sentence. Keep "It isn't a coding harness either." and the workflow-tools paragraph that follows it.

**2. Unsourced first-person lines in §1 (c)**
- Offending: "It isn't a chatbot." / "That's a reasonable first thing to build, but it leaves the visibility problem where it was." / "Functionary is for the people who are exposed if they're wrong." / "You never have to read the source; the canvas is sufficient."
- Problem: §1 is labelled "Tristan's voice", so copywriters will lift these sentences as founder lines. None of them is his.
  - The founder never says "chatbot" in the current record. The closest is the consume-reproduce idea note: "The agent's / chatbot's process is not very legible".
  - His turn after msg 14 is msg 15 ("but actually having automated agents makes it much easier to control the process from above"), not a "visibility problem" sentence.
  - "The canvas is sufficient" is ledger wording (D116 #8, `decisions.md:2006`), not a `user's words` passage (report 01 §1.11).
- Corrected: title §1 "Draft in the founder's register, for his approval; not quotable", or move it to third person. For [3], use the turn he actually made: "That's reasonable as a first thing to build. But automated agents actually make it much easier to control the process from above."

**3. Naming Claude without approval (c)**
- Offending: "The closest thing I've used is Claude's workflow tools." (§1 [13])
- Problem: 08 §3 #12 says "name Claude only with the founder's approval", and §1 does it anyway in first person.
- Evidence: WFI msg 34 does say it (line 300), but it was said in a private chat.
- Corrected: "The closest thing I've used is a coding agent's workflow tools. All I get out is transcripts and a script that calls each subagent at the right time." Swap the name back in only with approval.

**4. Seven kinds and the Agent step stated as current (b)**
- Offending: "Everything on the canvas is one of seven kinds" … "**Agent** covers the one free-form step." (§1 [9], present tense; 08 says only [10] and [11] carry DECIDED work)
- Problem: the kinds are DECIDED. The canvas does not draw them, and the Agent kind does not exist.
- Evidence:
  - D135 (`decisions.md:2475`).
  - F104.21 "Canvas and palette by kind" is `status: open`.
  - Every IR card is drawn with a placeholder `set` block (`web/src/canvas/irProjection/toFlow.ts:145`; `web/src/parked/README.md:65`).
  - Sketch agent: F104.19, F101.5 and F101.89 are open. HANDOFF line 21: "Nothing is built yet."
- Corrected: "Every step will be one of seven kinds: … The seventh, a free-form agent step whose output stays marked until checked, is designed but not built." Add [9] to the list of paragraphs that must keep "will".

**5. Example jobs and Transform examples that do not run (b)**
- Offending: "summarize while keeping track of the source text, judge this source against these criteria, search, pull the passages that bear on a question" and "**Transforms** do pure work like filtering and joining tables." (§1 [9])
- Problem: two of the four Block examples and both Transform examples are not executable.
- Evidence:
  - Judge is removed from production (`crates/functionary-flow-lower/src/v1.rs:61-63`).
  - Judge and Filter are both asserted not executable (`crates/functionary-flow-lower/src/descriptor.rs:82-91`, `unsupported_operations_are_not_executable`).
  - Quote is DECIDED (D144, BOL S45 line 378; F104.15 open).
  - Join is DECIDED (D153).
- Corrected: "…summarize while keeping track of the source text, or search the files you granted it. More are designed: judge a source against criteria, pull the passages that bear on a question." For Transforms: "**Transforms** do pure work, like turning a page into text or a table into markdown."

**6. "Nothing gets dropped quietly" rests on a block that does not run (b)**
- Offending: "an empty result is different from a failed one, and nothing gets dropped quietly." (§1 [7]). Note 7 lists "D76 Filter `Mark` default" under "Mechanisms BUILT". §2(c) support #4 says "D76 Filter marks rather than drops; … D71 a handler cannot swallow a cause".
- Problem: Filter is not executable, so its Mark default is a rule with nothing to apply to. D71's handler and Coalesce fallback are not executable either.
- Evidence: `descriptor.rs:82-91` lists Filter and Coalesce. D80 (`decisions.md:894`) leaves Recover "not adopted". D34 Absent/Failed is BUILT, and so is a failed Map row as a failed cell (D14, D34; report 05 §9).
- Corrected: "Failures are values. A step that didn't run is marked as not run, a failed one as failed, and a failed row stays in the table as a failed cell, not a blank." Move D76 and D71 into the DECIDED column.

**7. Paste-a-transcript described as available (b)**
- Offending: "They paste a transcript, upload a file, or point at a list of URLs." (§1 [12])
- Problem: the paste screen does not exist.
- Evidence: F100.10 "Paste a transcript and turn it into a reproduction flow", F100.38 and F100.40 are all `status: open`. 05 §12: "There is no paste-a-transcript UI." ARCH line 63 itself tags the item "(F100.10)".
- Corrected: "They upload a file or point at a list of URLs. Pasting a chat transcript is being built."

**8. Approvals described as something you can turn on (b)**
- Offending:
  - "You ask for the friction (pins, approvals, named reviewers) when you want to stabilize." (§1 [12])
  - "When it matters, pin it, require approval, and every run records exactly what it ran." (§2(b) copy)
  - "An organization can add named reviewers and approvals when it needs them." (§2(b) copy)
  - Structure A §6: "opt-in pins and approvals for unattended runs".
- Problem: a revision approval is stored, but nothing enforces it yet, and there is no approve button. Pinning cross-file imports is also mostly unbuilt.
- Evidence: F101.98 "Wire the approval gate into every Run-capable start" and F101.99 "Approve action … in the editor" are both `status: open`. F101.96's `wiring_deferred_note`: "authorize_run and RunGate have no non-test caller by design". Import pins: D131 #5, with F101.122–131 open.
- Corrected: "When it matters, pin the data it reads and name who reviews its outputs. Requiring an approved version before every run is being wired in."

**9. Automator path stated as working (b, e)**
- Offending: "The Automator runs a process for real, watches it make mistakes, and changes the flow until it can run unattended." (§1 [12])
- Problem: there is no screen for setting up an unattended run and no alerting. The founder explicitly put the Automator's design off.
- Evidence: D134 (`decisions.md:2458`): "keep what's built. we'll design automator later." Triggers are backend-only with no web UI (F101.43–46; 05 §6). ARCH "Gaps today": alerting not built.
- Corrected: "The Automator runs a process for real, watches it make mistakes, and changes the flow until it's ready to run on its own. Scheduling exists on the server; the screens for it come later."

**10. "The process learns" is June-era copy, and the synthesis promotes it (a, e)**
- Offending:
  - "From then on the process learns" (§1 [12]) and "The process learns." (§1 [13]).
  - Register rule: "Use 'the process learns' for endurance."
  - Structure A §6 heading: "Fix the step, and the process learns."
- Problem: the phrase comes from the 2026-06 Arachne messaging, where it was paired with the now-retired "verify once". "Learns" also implies the self-improvement that 08 §3 #7 warns against, and 08 §2(b) #7 admits the claim is unmeasured.
- Evidence: `ops/planning/2026-06-01 - Trust Thesis and Messaging Synthesis.md:202,217`; `2026-06-01 - Site Copy Update Plan.md:25,29` ("verify once → the process learns"). The founder's current wording is TH line 45: "The process improves, not the model." F102.2 (measuring formalization) is open.
- Corrected: "The process improves, not the model." Heading: "Fix the step once. Every later run uses the fix."

**11. The founder's hedge narrowed to one clause (e)**
- Offending: "'at least in theory' (WFI msg 28), attached to the provenance, export and knowledge base paragraph."
- Problem: msg 27 is one message covering the whole technical structure: restricted Rust, one-to-one canvas, blocks, async execution, binary, knowledge base and provenance. Msg 28 follows all of it. Tying the hedge to the last clauses leaves the core mechanism claim unhedged. Msg 30 is a second hedge on the runtime, and it is missing from the list.
- Evidence: WFI lines 286–292; msg 30: "just getting the whole execution environment properly written is fairly hard and subtle".
- Corrected: "'at least in theory' (msg 28) follows the whole of msg 27 and cannot be assigned to one clause. Add msg 30 to the hedges."

**12. Knowledge-base floor misread as optional (b, read in the other direction)**
- Offending:
  - "Floors are optional and their policy is open: D139 says a destination 'may declare' a floor" (§2(c) counter #2).
  - "Say 'marked', not 'blocked', unless floors become defaults."
  - "A destination like the knowledge base will be able to refuse anything nobody cleared." (§1 [10])
- Problem: D139 already makes the knowledge-commit floor the default. Only two things are open: whether Sourced and Computed values clear it, and who may opt out. "Anything nobody cleared" also wrongly sweeps in source data.
- Evidence: `decisions.md:2569-2570`: "Commit to knowledge requires Verified or Reviewed unless the destination opts out". F104.34 goal: the flow "fails the save check … before any run". F104.34 lines 41–43 mark Sourced/Computed as `SPEC_GAP` and leave the opt-out unbuilt.
- Corrected: "Once origin ships (F104.3, F104.34), the knowledge base will refuse model-written values nobody checked or reviewed. The flow fails its check before it runs. Other destinations show the mark."

**13. D125 quoted out of context; sharing that is built goes unmentioned (c, e)**
- Offending:
  - "'Across teams' has no basis in the record: … Sharing between flows is copy-only, and the founder said 'All of this is hypothetical … I don't care right now' (D125)." (§2(b) counter #1)
  - §4.1 row: "Multiplayer; sharing beyond copy | not v1 | D27; D125".
- Problem:
  - D125 is about settings presets shared between flows, not people working together.
  - Sharing a flow or a project with named tenant members is BUILT.
  - D27 says "Leave a path to multiplayer", and the founder said "multiplayer support (not v1, but eventually)".
- Evidence: `decisions.md:2213-2219` (D125 title: "Settings shared between flows"). `crates/functionary-server/src/flow_source/sharing.rs:1-6` (F98.208 `status: done`: "Per-tenant governance policy and sharing grants"). `decisions.md:380-383`. `ops/backend-refactor/sources/user-steering.md:344`.
- Corrected: "Within one organization, you can share a flow or a project with named colleagues as editors, runners or reviewers. Live co-editing is not in v1 (D27). Settings copied between flows stay independent (D125)." Copy: "Share the flow with whoever reviews the work", not "across teams".

**14. "Every mechanism claim in sections 4–6 is BUILT" is false, and the visual rule draws unbuilt UI (b)**
- Offending:
  - "Every mechanism claim in sections 4–6 is BUILT." (§5 recommendation)
  - "Draw the DECIDED kind colours (D135; report 06 §3), not today's all-orange cards (`toFlow.ts:145`)."
  - "B's palette legend can sit inside A §5."
- Problem:
  - Kind colours are DECIDED and not wired (F104.21 open; report 06 §3.1 "not wired").
  - A §6's approvals are unwired (finding 8).
  - A §6's history panel cannot say why a step changed (08's own §2(b) counter #3).
  - The visual rule depicts unbuilt UI without a caption, which contradicts 08's own caption rule for origin wires.
  - "All-orange" is unverified. `toFlow.ts:145` defines `PLACEHOLDER_BLOCK` (a `set` block), and accents are per-card stored tokens (`toFlow.ts:116`).
- Corrected: "Sections 4 and 5 are BUILT, except the kind colours, which must be captioned as design. Section 6's approval step is being wired. Show history entries only."

**15. Structure C visuals come from the old product (a)**
- Offending: Structure C §4 "`ForEachRunInspector` list: `row N · status`". Structure C §1 "A TableSource card with an inline spreadsheet body (report 06 §1.3)".
- Problem: both images show components a restricted flow never reaches.
- Evidence: `web/src/parked/README.md:65`: ForEachRunInspector is parked, "a restricted flow reaches neither". It is imported only by `web/src/ui/RunNodeInspector.legacy.tsx:17`. Report 06 §1.3 files the spreadsheet card under "Legacy and reference rendering" (`row-template.png`). "ForEach" is also retired vocabulary (D14).
- Corrected: §4 visual: "`RunInspector.tsx` per-occurrence outcomes, one failed row shown as a failed cell". §1 visual: "the IR TableSource card".

**16. Transcript reproduction described as "partly built" (b)**
- Offending: "Partly built (F100.12–15); the paste UI (F100.10) is open." (§3 #15). §4.1 row: "DECIDED, partly built".
- Problem: F100.12–15 are general Map and Format plumbing, not the reproduction feature. Every reproduction-specific task is open.
- Evidence:
  - Done: F100.12 "Host expands a deferred Map's row permits", F100.13, F100.14 "Server plans a computed-table Map", F100.15 "Lower Format TextToTable".
  - Open: F100.8 (reproduction flow), F100.9 (report), F100.38, F100.39 (server actions), F100.40, F100.41, F100.42 (web).
- Corrected: "What it runs on is built: a Map over a table computed in the same run. The reproduction flow and the paste screen are not."

**17. Agents never approving is listed as BUILT (b; PLAUSIBLE)**
- Offending: "It never approves a revision (D129 #6)." This sits under "Agent authority is modelled and BUILT (F98.207, `governance.rs`)" (§2(a) support #5).
- Problem: the build citation cannot cover this ruling, and I found no code that enforces it.
- Evidence: F98.207 was decided 2026-10-26; D129 is dated 2026-10-29. `rg -i agent crates/functionary-server/src/flow_source/revision_review.rs` finds no agent refusal. F101.99 (the approve action) is open.
- Corrected: "An agent never approves a revision (D129 #6, DECIDED; the approve action is not built yet)."

**18. Ellipses and truncation inside quotes (c)**
- Offending:
  - GF U4 "DEALBREAKER … That is the product." (§2(a) support #2).
  - TH "sternly instructing it … is not a solution" (§1 note 5).
  - TH "correctly … than it is" (§3 #6).
  - TH "does not make the agents trustworthy … The process improves" (§1 note 13).
  - §6 #17 ends at "you just see it immediately". The source goes on: ", in the same way if somebody tells you their plan to do something and it has wholes you just kinda know." No mark shows the cut.
- Problem: 08 §6 says "Ellipses are not used inside quotes unless the source has them." None of these sources has the ellipsis.
- Evidence: `ops/planning/2026-10-09 - Golden Flow - Report Claim Atomization and Stress Test/sources/user-steering.md:50`; TH lines 43–45; WFI line 264.
- Corrected: quote the full sentence, or mark the cut "[…]" and keep that mark in copy.

**19. Weak attribution on two quotes (c; low)**
- §6 #34, "Showing the process by which "just anyone" reaches a conclusion…": the file is a first-person user story (frontmatter `date`/`time` only), but nothing marks it as the user's words. Report 01 does not list it as a verbatim source. Confirm authorship before attributing it.
- §3 #8: "Coverage has to be visible from above (BOL line 90)". BOL line 86 heads that block "agent assessment, recorded for the user's decision". Cite only CLOSE #12 as the founder's line.

**20. The "markdown files help" nuance is from June (a)**
- Offending: "Keep the founder's nuance: memory files help, but they are not a guarantee." (§3 #11)
- Problem: the "they help" half comes only from the 2026-06 TT interview (Round 8, HISTORICAL, near-verbatim; report 01 §4). The October lines are flatly negative.
- Evidence: WFI msg 26: "beg it in your markdown file not todo stupid things and hope for the best". TH line 44: "is not a solution".
- Corrected: "Instructions in a markdown file are not a control mechanism."

**21. Unverifiable competitor claim (e)**
- Offending: "The internal vs independent review split exists in the ledger and nowhere in a coding harness." (§2(a) support #6)
- Problem: nothing in the record surveys coding harnesses.
- Corrected: "The ledger separates review inside a step from review by an independent step (D146, DECIDED)."

**22. Pilot result reported without its limits (e)**
- Offending: "pilot-02 passed 10/11 tasks on the first attempt and 11/11 within two repairs" (§2(c) support #7).
- Problem: the counterevidence (#8) gives some limits, but leaves out the main one: nothing was run. Passing means the flow cleared the checker stages, not that it produced the right output.
- Evidence: `benchmarks/backend-flow-forms/pilot-02/README.md:19-22`: "Nothing was executed; each candidate was scored on the Q02 lifecycle (`parse`, `screen`, `contract`, `type_check`, `composition`)". 9 public tasks and 2 held-out. One model; the second arm was deferred under D93 (line 13).
- Corrected: "In a pilot, one model wrote 10 of 11 flows that passed the checker on the first try and all 11 within two repairs. The flows were checked, not run, and two tasks were held out."

**23. Small present-tense slip (b; low)**
- Offending: "Results land in knowledge tables, and committing a table makes an immutable revision." (§1 [11])
- Problem: results land in run tables, and committing to knowledge is a separate, explicit step. Write today stores a knowledge-base note.
- Evidence: 05 §6; `crates/functionary-server/src/flow_source/host.rs:270-350`.
- Corrected: "Results land in run tables. Committing one to the knowledge base makes an immutable revision."

**24. Em-dashes carried in quoted material (d; low)**
- Offending: §4.3 quotes D97 #2 with a literal "—". §3 #5, §6 #17 and §6 #30 carry the founder's `---`, which most typographic renderers turn into an em-dash.
- Corrected: in copy, break at the dash: "We all already know how to trust a piece of software to do something. What's difficult is general purpose agents…", with the cut marked as in finding 18. Leave the raw form in research files only.

No banned word (harden, ossify, calcify, bureaucracy, principal-agent, agency cost, moral hazard, enframing, Gestell, spider, unlock, seamless, empower, supercharge, leverage, robust, game-changing) appears in 08's prose. They appear only inside its own banned lists (lines 331, 391, 451).

## What the synthesis got right (lean on these)

1. **Status discipline on the hard cases.** All verified:
   - `integration/f98` has not landed on main (D126 #4).
   - Judge is removed from production (`v1.rs:61-63`).
   - Strict mode is policy only, with F101.98 and F101.99 open.
   - Test runs reads and model calls (D97 #2, `decisions.md:1351-1353`), and ARCH line 70's "nothing leaves the machine" is wrong.
   - `kind_of` landed (`c93aa5ce` is an ancestor of HEAD; `derive.rs:1515`).
   - The authoring agent still carries `CANVAS_FIRST_AUTHORING_CONTRACT` (`turn.rs:2753`, appended at `:2881`). That contract orders `add_canvas_sketch`, a tool missing from its seven restricted tools (`restricted_client.rs:55-70`).
2. **The quote bank is clean.** All 40 numbered quotes and the reserve were found verbatim. Exceptions are the truncation in #17 and the attribution question on #34. The "pit of success" line is genuinely the founder's (IAI line 334, inside a limpid block that line 242 marks as the user's words), and it carries its own limit.
3. **The D139 catch is correct.** The ruling is "(user; S9)", but its "**Reason:**" line, "the mechanism behind the contamination story", is not marked user (`decisions.md:2568-2569`). Never quote it as the founder.
4. **Report 04's inconsistencies are now confirmed.** 08 did not re-check them, so here they are at source:
   - D78 says "exactly two literals" (`decisions.md:868-872`), but D121 #1 admits `.input("summary", x)`.
   - D121 #2 renders a table into Template as markdown, against D79.
   - D130 #5 says "`quote_found` is a visible Mutate".
5. **The lead framings are current, verbatim and distinctive:**
   - control from above, made cheap (WFI msgs 15–17);
   - "you're selling good words" (msgs 21–24);
   - contamination (msg 18);
   - the concession "they may well be right" (msgs 5–7);
   - "TIGHT CONTROL OVER AVAILABLE TOOLS is a DEALBREAKER … That is the product." (GF U4, line 50; quote it in full or mark the cut);
   - "Fail-closed is absolutely the model" (US line 185);
   - "The only thing agents can do is wire together blocks." (DRIFT line 22).
6. **Verdicts that copy should keep:**
   - "harness" is not Associate vocabulary (ARCH line 36);
   - "Can't deviate without it showing" beats "don't deviate";
   - "Verify once", "makes agents trustworthy" and the standalone binary stay retired (GF U4 line 48; TH line 45; D49).
7. **Structure A's order** (failure story, concession, mechanism) matches how the founder argues. Its prose-led sections 2 and 3 suit the desktop-first constraint, once findings 10 and 14 are fixed.
