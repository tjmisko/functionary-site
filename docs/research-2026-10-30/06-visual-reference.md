# 06 — Visual reference: how Functionary looks on the canvas

Worktree: `~/Projects/Functionary/.worktrees/integration/f98`. All paths are relative to it. Status tags: **BUILT** (code on integration/f98), **DECIDED** (ruled, not built), **IDEA**.

## 0. Three facts to read first

1. **What the restricted canvas draws today is not what was decided.** Every IR card is painted with the `set` placeholder's control orange. The cause is `PLACEHOLDER_BLOCK = { block_type: "set" }` in `web/src/canvas/irProjection/toFlow.ts:145`. F104.21 ("Canvas and palette by kind; stand-in colour fix (D135)") is **open**. F104.25 is **done**: it added the kind→colour function (`colorForCatalogKind`, `web/src/canvas/categoryColor.ts`), but the task file records `wiring_deferred: true`, and no card calls that function yet. A marketing page should draw the **DECIDED** colouring and should not reproduce today's all-orange cards.
2. **Most of the 33-verb ontology is DECIDED, not BUILT.** The implementer handoff says: "Nothing is built yet. The contract still declares Block / Transform / Jig only … and none of: Record wire type, Reviewable bound, origin axis, Compare, Quote, Notify, Apply, Check, Declassify, Redact, Aggregate, Reshape, Replicate" (`ops/planning/handoffs/2026-10-30 - Block Ontology Implementer Handoff.md` §1). Of the F104 tasks, only F104.23 and F104.25 are `done`.
   - Executable today: Source, TableSource, Summarize, Search (Row input), HumanReview, Write, Template, Field, the Format families, Map, Repeat, Refine, Branch and Retry.
   - Declared but refused by the production catalog: Judge, Coalesce, Filter, Sort and Select (`crates/functionary-flow-lower/src/descriptor.rs:83`).
3. **Origin on edges is DECIDED, not BUILT.** D139 and F104.35 are open, blocked on F104.33. Every IR edge is emitted with `verified: true` and draws as one grey solid wire (`toFlow.ts:533`).

## 1. Card anatomy

### 1.1 The card as built
Sources: `web/src/style.css` (`.functionary-node*`), `web/src/canvas/cards/NodeCard.tsx` and `web/src/canvas/reactFlow/ReactFlowNode.tsx`. The screenshots in `ops/backend-refactor/sources/*.png` show the same idiom on the legacy canvas.

- **Shell.** `min-width: 80px; max-width: 360px` when unsized. The fallback size is 220×100 (`NodeCard.tsx` PerimeterResize defaults). In `basic-functionality.png` a typical card is about 210 px wide and 70 px tall: a 30 px header plus a 28–40 px body.
  - Style: `border: 1px solid rgba(255,255,255,0.12); border-radius: 8px; background: rgba(28,33,40,0.95); box-shadow: 0 2px 12px rgba(0,0,0,.5)`.
  - Text colour `#ccc`, font monospace, 12 px.
- **Header** (`.functionary-node-header`): `padding: 6px 8px; border-radius: 7px 7px 0 0; background: <kind colour>; color:#fff; font-weight:bold`. One row, laid out left to right:
  - **Icon.** A 14 px monochrome line icon: 16×16 viewBox, stroke `currentColor`, stroke-width 1.5, round caps (`BlockIcon.tsx`). Source is a globe (`circle r6` plus meridians). Summarize is three left-aligned lines of decreasing length (`M3 4h10M3 7.5h8M3 11h5`). Format is `M3 4h10M3 8h10M3 12h6`.
  - **Title.** 13 px, `--fg-0`, bold, ellipsised. The title is the stored display title (F101.137) or the binding name.
  - **Subtitle.** Shown under a stored title: 9 px, normal weight, opacity .65. It carries the binding name, which is the card's identity. Titles are display only and never identity (F101.137 spec).
  - **Kind badge.** Right-aligned: 9 px, uppercase, letter-spacing .5px, opacity .7. Examples: `SOURCE`, `SYNTHESIS`, `ACTION`. IR cards show the catalog editor group here (`categoryLabel={data.irCard?.editor}`). When the header is too narrow, `useHeaderCategory` hides the badge first and then the title.
  - **Meta controls.** A config button, a collapse toggle (F101.138), a failure indicator and an output indicator.
- **Body** (`.functionary-node-body`): `padding: 6px 10px; border-top: 1px solid rgba(255,255,255,.06); font-size: 11px; color: #999`. It holds a **settings summary** in monospace, one or two lines. Examples from the screenshots: `https://tristanmisko.com`, `to plain_text`, *`no max length`* (in italic when it is a default), `folder choose a folder / relative path output.md`, `max length 500 / prompt Summarize errors and weakpoin…`.
  - Optional description strip above the body: 13 px, `#b8bec7`, on `rgba(18,22,28,.45)`.
- **IR decor below the body** (`IrCardDecor.tsx`, `irProjection.css`):
  - A collapsed Transform-chain list (`.ir-chain`, 12 px).
  - A **schema badge** per table output: 1 px border, radius 4, padding 6×8. It lists the refinement mode, `guaranteed` and `optional` field lists as `name type`, and the origin label (e.g. `gate:review`), followed by a disabled or enabled `Preview` button.
  - Diagnostic chips: `code construct`, 1 px `#566071` border, radius 4.
- **Ports** (`.functionary-port`). A 10 px circle with `border: 2px solid rgba(255,255,255,.3)` and fill `rgba(28,33,40,.95)`, centred on the card edge (`left:-5px` or `right:-5px`) at 50 % height.
  - **Named inputs** stack down the left edge, each with a 9 px label in `rgba(176,188,204,.85)` set 12 px inside the card. Examples are the Template's `input_1 … input_5` and a dashed "spare" `+ input_6`.
  - **Named outputs** stack on the right with right-aligned labels.
  - **Error port:** 8 px, border `rgba(220,80,80,.5)`, on the right edge 8 px above the bottom. Every non-Source card has one; in the screenshots it is the small red dot at each card's lower right.
  - The hit area is a 32 px circle.
  - Interaction states: hover-source glows `rgba(176,188,204,.9)` and scales to 1.3; a compatible target turns green `rgba(80,200,120,.9)`; an ineligible target turns red `rgba(230,64,51,.9)`.
- **Accent** (F101.137/138, BUILT). One of eight palette names stored in the layout store. It draws as a **4 px bar inset along the bottom of the header** (`box-shadow: inset 0 -4px 0 var(--card-accent)`) and leaves the kind colour alone. The values are slate `#94a3b8`, red `#f87171`, orange `#fb923c`, amber `#fbbf24`, green `#4ade80`, teal `#2dd4bf`, blue `#60a5fa` and violet `#a78bfa` (`web/src/canvas/reactFlow/react-flow.css`).
- **Collapsed card** (BUILT, F101.137). The header alone. Description, body, tags and IR decor are not mounted, and the ports and handles stay on the shorter card's edges.

### 1.2 States (BUILT, `style.css`)

| State | Drawing |
|---|---|
| selected | `outline: 2px solid rgba(255,140,40,.9); outline-offset: 2px; box-shadow: 0 0 14px rgba(255,140,40,.35)` |
| multi-selected | same shape in blue `rgba(100,160,255,.85)` + `0 0 12px rgba(100,160,255,.3)` |
| running | border `rgba(176,188,204,.7)`, 1 s `exec-pulse` alternating `0 0 4px` and `0 0 16px rgba(176,188,204,.6)` |
| completed | border and outline `1px #6aa681` |
| failed | border and outline `1px #d16e72`, plus a failure trigger chip in the header (`#362329` background, `#f1a2a5` icon) whose tooltip is `#241c21` with an `#855055` border |
| skipped | `NodeStatus` (`web/src/types/NodeStatus.ts`) includes `skipped`, but no card CSS for it was found; the runs view fades the untaken edge instead |
| parked / awaiting review | **no card style exists**. Parking is a run status (`awaiting_review`, `limit_paused`, `rate_wait`, `timer_wait`; `features/reviewed-flows/api.ts:84`) shown in the toolbar (`.toolbar-run-status-parked`, secondary text colour) |

The legacy run legend is a 9 px rounded square in each status colour (`.run-status-legend`). For a marketing illustration of a parked gate, a faithful choice is a Review card in the gate colour with the run-status text "awaiting review". Do not invent a glow for it.

### 1.3 Group label and Jig bodies

- **IR canvas, BUILT.** A Jig body is a generic `.node-group`: `background: rgba(80,120,200,.08); border: 1px dashed rgba(80,120,200,.25); border-radius: 10px`. Its header is 28 px tall with 4×10 padding and holds a collapse chevron and a label: 11 px bold uppercase, letter-spacing .5px, colour `#88a`. The default label is `${jig.name}: ${role}` (e.g. `MAP: BODY`), which a stored label replaces (`toFlow.ts:444`). Parameter and return render as terminal cards inside the group.
- **Legacy and reference rendering of a Map** (`jig-tests.png`, `row-template.png`; `.node-group-for-each`). This is the richer picture a marketing page will want:
  - Orange brackets: `stroke #d9a441`, width 2.5, round caps, drawn as a `{`…`}` pair around the body.
  - A faint fill `rgba(217,164,65,.025)` and a top label `— For each row in Public URLs` in `#e8bd68`, 11–12 px.
  - Entry chip `{ } row` with the caption `one item` and exit chip `{ } output` with the caption `once`: brown fill, orange border, `#e8bd68` text.
  - A footer in `#cfa556` 11 px: `7 rows · Parallel · up to 4 · input order` on the left and `Produces: Markdown document` on the right.
  - The jig card in the artifact is `border: 1.5px solid color-mix(var(--cat-control) 72%, transparent); border-radius: 10px; background: linear-gradient(135deg, rgba(217,164,65,.16), rgba(217,164,65,.04)), rgba(20,23,28,.6)`, with an uppercase name at letter-spacing .08em in `#e8bd68` (`ops/planning/2026-10-29 - Block Ontology/src/shell.html:123-130`).
- **Table source as a card** (`row-template.png`). A wide card with a blue Source header (`▶ Public URLs`, subtitle `Table`, badge `SOURCE`). The body is an inline spreadsheet: `#`, `Name` and `URL` columns, 1 px row rules, mono 12–13 px, and a `+` column-add cell.

### 1.4 Reference rendering by kind (the F104.21 target)
The Block Ontology artifact (`ops/planning/2026-10-29 - Block Ontology/src/shell.html`, `questions-and-app.js:542-566`) is named as "the reference rendering of what each declaration must look like" (`ops/task-loop/tasks/F104.21.md`). It uses three shapes:

- **Card** for Ingress, Block, Gate and Egress. It is the canvas card without ports, at radius 4.
  - Header `.ch`: padding 7×9, background the kind colour, white bold 12 px, title at 13 px, badge 9 px uppercase at opacity .7.
  - Signature line beneath: mono 9 px, `#9aa0a8`, e.g. `Text -> Text`.
- **Pill** for a Transform: `background: var(--bg-3); border: 1px solid var(--border-1); border-radius: 14px; padding: 5px 12px 5px 8px; font-weight: 600`. It has no kind-coloured header. Input ports are 7 px circles with a 1.5 px `--fg-2` border, stacked at the left, one per input.
- **Translucent orange region** for a Jig (the CSS above).
- **"Calls a model" dot.** A 6 px white dot with `box-shadow: 0 0 6px rgba(255,255,255,.8)` after the title. A hollow ring means "may". On a pill the dot is `--fg-1` with no glow; on a Jig it is `#f5c96b`.

## 2. Edge anatomy

### 2.1 BUILT (`web/src/canvas/bezier.ts`, `reactFlow/ReactFlowEdge.tsx`)
- **Path.** A cubic bezier with horizontal tangents, from the right-edge output port to the left-edge input port. The legacy geometry is `C (src.x+off, src.y) (dst.x-off, dst.y)` with `off = max(|dx|·0.5, 50)`. The React Flow canvas uses `@xyflow/react` `getBezierPath`, which gives the same S-curve.
- **Stroke.** 2 px, `fill:none`, **no arrowhead** (`markerEnd` is undefined in tests), and **no type label on the wire**. The type and payload appear on hover or click in the edge inspector (`EdgeInspectionProvider`, `EdgePayloadShape.tsx`, `edge-inspector.css`).
- **Style table** (`EDGE_COLORS` / `EDGE_DASH`):

| style | colour | dash | when |
|---|---|---|---|
| solid | `rgba(180,180,200,.6)` | none | every IR edge today |
| unverified | `rgba(204,153,51,.6)` | `4 4` | checker pending / needs attention; a round `!` badge sits at the midpoint |
| error | `rgba(230,64,51,.7)` | none | wire from or to an error port |
| hazy | `rgba(170,150,210,.45)` | `2 6` | adjacent to an Agent node (legacy F55.6) |
| synthesis | `rgba(160,120,220,.7)` | `4 4` | legacy |
| executed | `rgba(106,166,129,.95)` | none | runs view: carried data |
| untaken | `rgba(140,140,150,.22)` | `4 5` | runs view: branch not taken |

- **Interaction.** Hover changes the stroke to `rgba(255,255,255,.8)` at width 3. Selected is `rgba(255,140,40,.9)` at 2.5. The splice target is orange `rgba(249,115,22,.95)` at width 3, with a 10 px glow.

### 2.2 Origin on the wire (DECIDED: D139; task F104.35 open)
- "Every wire carries `(type, label, origin)`. Origin is a small lattice the checker computes from the graph … and the canvas draws on the edge" (`ops/backend-refactor/decisions.md` D139). There are five origins:
  - **Sourced**: from a Source or a person.
  - **Computed**: a pure transform of Sourced inputs.
  - **Generated**: a model somewhere in the lineage. It is sticky through Transforms, Template and Map.
  - **Verified**: Check against a Sourced value.
  - **Reviewed**: a person approved it.
- Verified and Reviewed are the only discharges.
- F104.35 requires the renderer to tell **Generated apart from Computed** "and from Sourced, Verified and Reviewed, through the existing edge-style path", with "more than colour alone, for example a dash pattern or a marker plus a label or title".
- S9 adds a consequence: "an unverified Generated value reaching [a floored egress] is a red wire before the run" (`ops/planning/2026-10-29 - Block Ontology Decisions Log.md` S9).
- **No concrete styling has been chosen.** For a marketing drawing, label any style as illustrative. A mapping that stays inside the existing vocabulary:
  - Sourced: solid grey.
  - Computed: solid grey with a small `ƒ` or none.
  - Generated: dashed `4 4` in the synthesis violet `rgba(160,120,220,.7)` with a tiny `AI` tag.
  - Verified: solid, with a check marker in `--success #5fa777`.
  - Reviewed: solid, with a marker in the gate yellow `#f2d14d`.
  - Floor violation: solid `rgba(230,64,51,.7)`.
  - This mapping is my proposal, not a ruling.

## 3. Palette and grouping by kind

### 3.1 Kind → colour (DECIDED D135; function BUILT in F104.25, not wired)
Source: `web/src/canvas/categoryColor.ts` `KIND_CATEGORY` and the `--cat-*` tokens in `web/src/style.css`.

| Kind (palette label) | Verbs (D135 / handoff §3) | Token | rgba / hex |
|---|---|---|---|
| Ingress | Source (modes) | `--cat-source` | `rgba(77,128,230,.9)` / `#4d80e6` |
| Block | Summarize, Search, Judge, Model, Quote, Compare, Draft | `--cat-synthesis` (`--cat-extraction` for an extraction editor; SPEC_GAP, Q9) | `#a66bd9` (`#66c76b`) |
| Agent | Sketch agent | `agent` (no CSS token; artifact defines `--cat-agent`) | `rgba(214,92,171,.9)` / `#d65cab` |
| Transform | Filter, Sort, Select, Mutate, Aggregate, Join, Stack, Reshape, Format, Template, Coalesce | `--cat-transformation` | `#40b8bf` |
| Jig | Map, Replicate, Repeat, Refine, Retry, Branch | `--cat-control` | `#eb9e40` |
| Gate | Review, Check, Declassify, Redact | `--cat-human` | `#f2d14d` |
| Egress | Write, Notify, Apply | `--cat-action` | `#e05961` |

All are at alpha 0.9 over `--bg-0`. Caveats:
- The artifact's page-local `--k-agent` maps to extraction green (`shell.html:35`), but its `VERB_GROUPS` and the code use magenta. **Use magenta.**
- Legacy screenshots colour Human Review yellow and Write File red with the badge `ACTION`. That agrees with the decided map.

### 3.2 Palette grouping
- **DECIDED.** F104.21 groups the palette as "Ingress, Blocks, Agents, Transforms, Jigs (own dialog, D118 #5), Gates, Egress, Procedures". The artifact's `VERB_GROUPS` uses the same order and labels.
- **BUILT** (F104.25). `IrBlockPalette.tsx` renders `<optgroup>`s by raw kind name (`source`, `block / synthesis`, …) as a fixed chip at top-left: `.ir-block-palette`, 12 px inset, bg-2, 6 px radius, 13 px text. Jigs are excluded and use their own picker.
- **Procedures** (D143, F104.17 open) appear in the palette as one thing and "expand on the canvas into visible steps; every step keeps its own identity, settings record and receipt."

## 4. Run view (BUILT, minimal styling)
- **On the canvas.** Cards take the running, completed and failed treatments in §1.2. In a runs view, edges that carried data turn green (`executed`), and an untaken branch fades to a faint dashed line.
- **Run inspector** (`web/src/ui/RunInspector.tsx`). A side panel headed `Run`, with `Refresh` and `x` buttons. It shows `label/value` rows in the config-panel idiom (10 px uppercase labels):
  - `run id`.
  - `status`: one of `queued, running, recoverable, paused, limit_paused, awaiting_review, rate_wait, timer_wait, complete, failed, cancelled`, with underscores shown as spaces.
  - `mode`: `Run` or `Test (effects withheld)`.
  - `escalated from`.
  - `definition`: the compile key's first 12 hex characters, plus "(compiled before)".
  - An `Allowance` section (budget, "Raised by …") and the limits report.
  - An **`Outcomes`** section.
- **Outcomes** (`RunNodeInspector.tsx`, `runValue/RunValueView.tsx`). Results are grouped per node under an uppercase section title. A node that ran several times (inside a Jig) lists each occurrence by path, e.g. `/map/0/write`. Each value renders "in the words of its kind", never as JSON:
  - text: a `<pre>` clipped at 2000 characters, with the note "Showing the first 2,000 of N characters."
  - spilled text: "Text stored separately: 12,345 bytes, digest `abc123def456…`", with a disabled `Load` button.
  - table: a chip `table #id`.
  - document: `html document, N bytes`.
  - receipt: the receipt's text.
  - verdict: **Accepted**/**Rejected**: reason.
  - record: a bold name and a `dl` of field/value rows.
  - erased: "Withheld: the owner erased this value."
- **Outcome states.** A failure is a `Failed` block listing root and contributing causes as `message (origin)`. An absent outcome reads "Did not run: {cause}." in italics at .75 opacity.
- **Map run inspector** (`features/jigs/ForEachRunInspector.tsx`). A row list with `row N · status` for each iteration and a per-row step list. Selecting a row shows that row's step executions.
- **Run tables** (`features/knowledge/KnowledgeTablesView.tsx`). One row per run table: node path, status badge, row count, `source revision N`, and a Commit control that returns a receipt line.
- The panels are functional and lightly styled (`runValue.css` sets layout only). A marketing "receipt" visual is therefore an extrapolation; keep it to these fields.

## 5. Review gate view (BUILT, `web/src/ui/HumanReviewPanel.tsx`)
- **Dialog.** A Radix modal over a backdrop. Its title is the gate's occurrence path (e.g. `/review`), its description reads "Execution is paused. Review this output to continue.", and a `Run details` disclosure holds `run 1a2b3c4d · complete view`.
- **Fields.** One list item per field: a bold name and a `<pre>` of its text. A field above the viewer's clearance shows "withheld: above your clearance".
- **Partial view.** The note reads "N fields are withheld from you (a, b), so this review cannot be approved." Approve is hidden in that case.
- **Read-only.** When policy forbids answering: "This flow's access policy does not let you answer this review. You can read it, and the run stays parked until someone who may answers it."
- **Buttons.** `Review later`, `Reject` and `Approve`.
- **Parked reviews list.** On the reviewed-flow page it appears as "Parked reviews (N)" with one button per review (`ReviewedFlowPage.tsx:618`).
- **DECIDED, not built** (D147). Review gains a `comments` output port, table modes (sample, by exception, all), approve-with-edits, named branches, a timeout and an assignee. "Review on a block" is an **IDEA**.

## 6. The flow-Rust authoring grammar, with four real fixtures

The grammar:
- `let x = Verb::new(config_ref).input(y.port);`. Bare lowercase identifiers are host-declared config refs, and there are no literals.
- Jigs are `Map::new(s).over(t).map(f)` and `Repeat/Retry::new(s).state(x).body(f)`.
- Template is `Template::new(s).slot(n, v)` or `.input("name", v)`.
- Bodies are `fn` with one parameter and a `struct` return of `Outcome<…>` fields.
- **No fixture exists for Model, Replicate, Refine's `.check()`, Search, Quote or Check** (handoff §7: "Refine's `.check()` and Replicate's `.runs()` have no fixture yet"). The closest real fixtures follow.

**(a) Map over a table with a model block in the body.** Source: `crates/functionary-flow-exec-oracle/flows/jig_tests.rs`. Summarize is the model block; Model does not exist yet.
```rust
struct ScanOut {
    issues: Outcome<Text>,
}

fn scan_row(row: Row) -> ScanOut {
    let url = Field::new(url_column).input(row);
    let fetched = Source::new(source_settings).input(url.text);
    let html = Format::new(format_settings).input(fetched.text);
    let issues = Summarize::new(issue_summary).input(html.text);
    ScanOut { issues: issues.text }
}

fn flow() {
    let urls = TableSource::new(public_urls);
    let scanned = Map::new(map_settings).over(urls.table).map(scan_row);
    let report = Format::new(markdown_settings).input(scanned.table);
    let digest = Summarize::new(digest_summary).input(report.text);
    let review = HumanReview::new(review_settings).input(digest.text);
    let write = Write::new(destination).input(review.text);
}
```
*Caption: scan every URL in a pinned table for issues, then digest, review and write.*
- Canvas, as in `jig-tests.png`: `urls` (Ingress card with a table body) —table→ a Map region containing `row` chip → `url` (Field) —Text→ `fetched` (Source) —Text→ `html` (Format) —Text→ `issues` (Summarize) → `output` chip.
- Then, outside the region: —Table→ `report` (Format: TableToMarkdown) —Text→ `digest` (Summarize) —Text→ `review` (gate) —Text→ `write` (egress).

**(b) A Review gate before a Write.** Source: `crates/functionary-flow-exec-oracle/flows/basic_functionality.rs`, with the repeated chain bodies elided; the `...` lines are my elision. The file spells all five Source/Format/Summarize chains out.
```rust
fn flow() {
    let s1 = Source::new(site_1);
    let s2 = Source::new(site_2);
    ...
    let f1 = Format::new(plain_text).input(s1.text);
    ...
    let n1 = Summarize::new(per_site).input(f1.text);
    ...
    let combined = Template::new(template_settings)
        .slot(1, n1.text)
        .slot(2, n2.text)
        .slot(3, n3.text)
        .slot(4, n4.text)
        .slot(5, n5.text);
    let digest = Summarize::new(final_summary).input(combined.text);
    let review = HumanReview::new(review_settings).input(digest.text);
    let write = Write::new(destination).input(review.text);
}
```
*Caption: five sites summarized, joined, summarized again, approved by a person, written.*
- Canvas (`basic-functionality.png`): five rows of Source (blue) → Format (teal) → Summarize (violet). Their outputs fan into the Template's `input_1…input_5` ports, with a dashed spare `+ input_6`. Then Summarize → Human Review (yellow) → Write File (red).

**(c) Bounded repetition.** Source: `crates/functionary-flow-lower-harness/flows/retry.rs`. This is the closest fixture to Refine or Best-of-N; neither has one.
```rust
fn retry_body(item: Text) -> Text {
    let draft = Summarize::new(rewrite_settings).input(item);
    draft.text
}
fn flow() {
    let read = Source::new(source);
    let attempted = Retry::new(retry_settings).state(read.text).body(retry_body);
}
```
*Caption: retry a fallible model step up to N attempts.*
- Canvas: `read` (Ingress) —Text→ a Retry region labelled `RETRY: BODY` containing parameter `item` → `draft` (Summarize) → return. The region's output goes to the terminal.
- `repeat.rs` is identical with `Repeat`. `repeat_review.rs` puts a `HumanReview` in a Repeat body.

**(d) Map → Template → Write.** Source: `crates/functionary-flow-lower-harness/flows/template_journey.rs`. There is no Search→Quote→Check fixture; this is the closest end-to-end chain.
```rust
fn scan_row(row: Row) -> Text {
    let url = Field::new(url_column).input(row);
    let issues = Summarize::new(per_row).input(url.text);
    issues.text
}

fn flow() {
    let urls = TableSource::new(public_urls);
    let scanned = Map::new(map_settings).over(urls.table).map(scan_row);
    let page = Template::new(template_settings).input("report", scanned.table);
    let write = Write::new(destination).input(page.text);
}
```
*Caption: a table wired straight into a Template's named input renders as Markdown and is saved.*
- Canvas: `urls` —Table→ Map{`url` Field → `issues` Summarize} —Table→ `page` (Template, named input `report`) —Text→ `write`.

## 7. Typography and spacing (`ops/design/2026-04-27/colors_and_type.css`, README)
- **Type.** Monospace everywhere: `ui-monospace, "JetBrains Mono", Menlo, Consolas, monospace`. The README says "do not substitute a sans-serif". The Block Ontology artifact uses Inter for prose and JetBrains Mono for UI, via Google Fonts.
  - Scale: 9 (badges), 10 (eyebrow labels), 11 (secondary), 12 (body), 13 (button, card title), 14 (panel title), 15, 16 (section), 20 (metric), 28 (onboarding), 36 (wordmark, 6 px tracking).
  - Weights are 400, 600 and 700 only. Line heights are 1.2, 1.4 and 1.5.
  - Eyebrows are 10 px uppercase with .5 px tracking in `--fg-2`. Metrics use tabular numerals.
- **Surfaces.** `--bg-0 #0b0d10` (canvas), `--bg-1 #14171c`, `--bg-2 #1c2128`, `--bg-3 #262d36`, `--bg-4 #2f3741`.
  - Text: `--fg-0 #e6e9ee`, `--fg-1 #b8bdc7`, `--fg-2 #8a909a`, `--fg-3 #5b6068`.
  - Borders: `#2a2f37` and `#3a4049`. Accent: `#8a9ab2`.
  - State: success `#5fa777`, warn `#c9a55a`, danger `#c66060`.
  - Canvas grid: dots at `rgba(230,233,238,.04)`. The screenshots show a dot lattice at about 20 px.
- **Spacing.** A 4 px base: 2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 32 and 40. Panel padding is 8–12. Toolbars are 44 px. Fixed panels sit at a 16 px inset.
  - Radii: 4 for inputs, 6 for buttons and chips, 8 for cards, 10 for modals and groups, 12 for containers.
  - Shadows are dark and downward only; colour appears only in state glows.
- **Motion.** 80, 120, 150 and 200 ms, eased with `ease`. No bounce and no fade on mount. Pulses run 1–2 s.
- **Iconography.** Icon-light. Unicode `▶` for Run. Line icons at 14 px with a 1.5 stroke. **Never emoji.**
- **Voice.** Terse, declarative, "No marketing words ('supercharge', 'magic', 'AI-powered')" (README, Content fundamentals).

## 8. Six candidate flows for the marketing site

Wire types use the DECIDED vocabulary (D137: Source emits `Document<media>`, which Format turns into Text) and fall back to the BUILT form where they differ. Origins follow D139. Kinds and colours follow §3.

**F1. Site issue scan.** BUILT; the exec-oracle fixture `jig_tests.rs`, shown in `jig-tests.png`.
1. TableSource `urls` [Ingress] —`Table` (Sourced)→
2. Map `scanned` [Jig region]. The body runs `row: Row`→
   - Select/Field `url` [Transform] —Text (Sourced)→
   - Source `fetched` [Ingress] —Document<Html> (Sourced)→
   - Format `html` [Transform] —Text (Computed)→
   - Summarize `issues` [Block] —Text (**Generated**)→ return.
3. Map output —`Table<ScanOut>` (Generated)→ Format `report` [Transform] —Text<Markdown> (Generated)→
4. Summarize `digest` [Block] —Text (Generated)→
5. Review [Gate] —Text (**Reviewed**)→
6. Write [Egress] → `Receipt`.

This is the best single hero diagram: real, legible, and it shows the Generated→Reviewed discharge.

**F2. Five-site digest.** BUILT; `basic_functionality.rs`. Draw three chains with "…×5" for legibility.
- Source → Format → Summarize, three times —Text (Generated)→ Template [Transform] with named inputs `input_1..3`.
- Then —Text (Generated)→ Summarize —Text→ Review [Gate] —Text (Reviewed)→ Write [Egress] → Receipt.

**F3. Best of N.** DECIDED: D143 approved; D142 Replicate; D145 Compare `choose`. Planned lower-harness flow F104.65 ("Replicate → Compare choose → Select").
1. Source brief [Ingress] —Text (Sourced)→
2. Replicate `n = 3` [Jig region]. Body: Draft `compose` [Block] → `Table<Draft>`, one row per run (Generated)→
3. Compare `choose` [Block] —Record (Generated)→
4. Select `field` [Transform] —Text (Generated)→
5. Review [Gate] —Text (Reviewed)→ Write [Egress].

Status: Replicate, Compare and Draft are not built. Label the diagram "designed".

**F4. Adversarial review.** DECIDED: D143 approved. Refine is BUILT, Judge is declared but not executable, Draft is not built. Q7 is open on handing issues to the next round.
1. Source [Ingress] —Text→
2. Refine `rounds = 3` [Jig region, with two labelled bodies].
   - `REFINE: BODY`: Draft `revise` [Block].
   - `REFINE: CHECK`: Judge [Block] with adversarial instructions —Verdict (Bool, Generated)→ the loop.
3. Refine output —Text (Generated)→ Review [Gate]. Review also catches exhaustion: "pause with the last draft (D118)".
4. Review —Text (Reviewed)→ Write [Egress].

**F5. Match / Consolidate search results.** DECIDED: D143, D145, D152, D153. Join, Aggregate and Compare are open tasks F104.7, F104.8 and F104.14.
1. TableSource candidates [Ingress] —`Table<Candidate>`→
2. Mutate `canonical identity` [Transform] —Table (Computed)→
3. Aggregate `group by canonical` [Transform] —Table (Computed)→
4. Join `self-join blocked on shared keys` [Transform] —Table of pairs→
5. Map [Jig]. Body: Select left, Select right → Compare `duplicates` [Block] —Record{same, evidence} (Generated)→
6. Aggregate `components` [Transform] —Table (Generated)→
7. Review `sample` [Gate] —Table (Reviewed)→ Write `knowledge` [Egress].

This flow shows "deterministic before semantic" (handoff §5) visually: all-teal work first, then one violet card inside a loop.

**F6. Check citations / transcript reproduction.** DECIDED: D130 (F100). The procedure page is marked "reworked" (user sketch 2026-10-29); Check is D148.
1. Source pasted transcript [Ingress] —Text (Sourced)→
2. Model `claims and sources` [Block] —Table (Generated)→
3. Review `edit the claims and sources` [Gate] —Table (Reviewed)→
4. Map over (claim, source) pairs [Jig]. Body:
   - Source `url → snapshot` [Ingress] —Document<Html>→
   - Format HtmlToText [Transform] —Text→
   - Judge `stance` [Block] —Record{stance, quote} (Generated)→
   - Check `quote is a substring` [Gate] —Bool (**Verified**).
5. Map output → Aggregate `per claim` [Transform] —Table→ Write `knowledge` [Egress]. The origin floor applies: an un-Verified or un-Reviewed value would draw a red wire.

This is the most on-message flow for the contamination thesis. Mark it "designed" and keep the step text from `procedures.js` `p-check-citations`.

**Drawing note for all six.** Lay out left to right, with 80–120 px gutters between cards and Jig regions wrapping their bodies.
- Ports sit at mid-height. Edges are 2 px grey S-curves with no arrows.
- Type labels belong in a hover or caption layer, not on the wire. The BUILT canvas shows none, and P7 ("The canvas maps one-to-one to the code that will run", `ops/planning/2026-09-29 - Backend Guiding Principles.md`) argues against decoration the code does not carry.

## 9. Founder voice on what the canvas is for (verbatim)
- "it corresponds one-to-one with what's shown on the canvas." (`ops/planning/2026-10-19 - What Functionary Is.md`, Appendix msg 27, 2026-10-19)
- "you need to feel confident that whatever flowchart you're seeing is more or less exactly what gets executed, and that problems that emerge don't get handled creatively by improvised solutions without you knowing." (same file, msg 17)
- "it's very easy to tell when it's not reasonable---you just see it immediately" (same file, msg 16)
- "the kinds should say what a thing is for: data in, judgement, control, pure work, decide, out." (`ops/backend-refactor/decisions.md` D135, Reason (user), 2026-10-29)
- "keep the verb set small but expressive; compositions should be visible, not opaque blocks." (decisions.md D143, Reason (user), 2026-10-29)
- "How can we map between all the info the flow needs visually and the code, which handles the connection. How do they stay in sync?" (`ops/backend-refactor/sources/user-steering.md` U18, 2026-10-07)
