import type { CanvasFlow } from "./canvas";

/**
 * The flows the site draws, written against the F98 grammar and the
 * 2026-10-29 block ontology: seven kinds, origin on every wire, procedures
 * as compositions.
 */

/**
 * A weekly scan that reports only what changed: each site's page is compared
 * with the last snapshot committed for it, this week's text
 * is written as the new snapshot, the differences are drafted into a report,
 * and the reviewed report is written to a file and summarized for a table of
 * recipients.
 */
export const siteScan: CanvasFlow = {
  id: "site-scan",
  pitch: 100,
  aria:
    "A flow: a table of sites and a table of last week's page snapshots are joined by site. A Map runs per site: one line fetches the page and formats it to text, the other selects the snapshot path and reads last week's text from that file; this week's text is written to a new snapshot file, which next week's run reads as its baseline, and a Compare finds the differences. The changes are drafted into this week's report; a person reviews it, it is written to a file, and a summary of it is sent to each person in a table of recipients.",
  nodes: [
    {
      id: "sites",
      kind: "source",
      verb: "Source",
      title: "Sites to scan",
      col: 0,
      lane: 0,
      table: {
        columns: ["Site", "URL"],
        widths: [2, 3],
        rows: [
          ["Vendor", "vendor.example/pricing"],
          ["Competitor", "competitor.io/changes"],
          ["Partner", "partner.example/terms"],
        ],
        total: 12,
      },
    },
    {
      id: "last",
      kind: "source",
      verb: "Source",
      title: "Last week's snapshots",
      col: 0,
      lane: 1,
      table: {
        columns: ["Site", "Snapshot"],
        widths: [2, 3],
        rows: [
          ["Vendor", "vendor/10-23.txt"],
          ["Competitor", "competitor/10-23.txt"],
          ["Partner", "partner/10-16.txt"],
        ],
        total: 12,
      },
    },
    { id: "join", kind: "transform", verb: "Join", mode: "by site", col: 1, lane: 0.5 },
    { id: "map", kind: "jig", verb: "Map", mode: "one site at a time", foot: "12 sites · parallel · up to 4", col: 2, lane: 0, body: ["url", "fetch", "text", "ref", "before", "diff", "snapshot", "section"] },
    { id: "url", kind: "transform", verb: "Select", mode: "url", col: 2, lane: 0.2 },
    { id: "fetch", kind: "source", verb: "Source", query: "{url}", mode: "url", col: 3, lane: 0.2 },
    { id: "text", kind: "transform", verb: "Format", mode: "html → text", col: 4, lane: 0.2 },
    { id: "ref", kind: "transform", verb: "Select", mode: "snapshot", col: 2, lane: 0.8 },
    { id: "before", kind: "source", verb: "Source", query: "snapshots/{snapshot}", mode: "file", col: 3, lane: 0.8 },
    { id: "diff", kind: "block", verb: "Compare", title: "what changed", mode: "differences", col: 5, lane: 0.85 },
    { id: "snapshot", kind: "egress", verb: "Write", mode: "file", col: 5, lane: 0 },
    { id: "section", kind: "transform", verb: "Template", mode: "markdown", template: ["## {{site}}", "", "{{changes}}"], col: 6, lane: 0.5 },
    { id: "draft", kind: "block", verb: "Draft", title: "this week's report", mode: "compose", col: 7, lane: 0.5 },
    { id: "review", kind: "gate", verb: "Review", col: 8, lane: 0.5 },
    { id: "write", kind: "egress", verb: "Write", query: "reports/{week}.md", mode: "file", col: 9, lane: 0.1 },
    { id: "summary", kind: "block", verb: "Summarize", title: "what changed this week", col: 9, lane: 0.9 },
    {
      id: "recipients",
      kind: "source",
      verb: "Source",
      title: "Recipients",
      col: 0,
      lane: 1.925,
      table: {
        columns: ["Name", "Channel"],
        widths: [2, 3],
        rows: [
          ["Priya", "#market-watch"],
          ["Sam", "sam@acme.co"],
        ],
      },
    },
    { id: "notify", kind: "egress", verb: "Notify", title: "each recipient", mode: "message", col: 10, lane: 1.6 },
  ],
  edges: [
    { from: "sites", to: "join", origin: "sourced", label: "Table" },
    { from: "last", to: "join", origin: "sourced", label: "Table" },
    { from: "join", to: "url", origin: "sourced", label: "Row" },
    { from: "join", to: "ref", origin: "sourced", label: "Row" },
    { from: "ref", to: "before", origin: "sourced", label: "Text" },
    { from: "url", to: "fetch", origin: "sourced", label: "Text" },
    { from: "fetch", to: "text", origin: "sourced", label: "Document" },
    { from: "text", to: "diff", origin: "computed", label: "Text" },
    { from: "text", to: "snapshot", origin: "computed", label: "Text" },
    { from: "before", to: "diff", origin: "sourced", label: "Text" },
    { from: "diff", to: "section", origin: "generated", label: "Table<Change>" },
    { from: "section", to: "draft", origin: "computed", label: "Table" },
    { from: "draft", to: "review", origin: "generated", label: "Document" },
    { from: "review", to: "write", origin: "reviewed", label: "Document" },
    { from: "review", to: "summary", origin: "reviewed", label: "Document" },
    { from: "summary", to: "notify", origin: "generated", label: "Text" },
    { from: "recipients", to: "notify", origin: "sourced", label: "Table" },
  ],
};

/** The body of the weekly scan's Map, on its own: what the canvas shows for `fn scan`. */
export const scanBody: CanvasFlow = {
  id: "scan-body",
  aria: "The Map body: Field selects the URL, a Source fetches the page, a Format turns it to text, a Summarize writes the issues.",
  nodes: [
    { id: "map", kind: "jig", verb: "Map", mode: "scan", foot: "one row in, one row out", col: 0, lane: 0, body: ["url", "fetch", "text", "issues"] },
    { id: "url", kind: "transform", verb: "Field", mode: "url", col: 0, lane: 0 },
    { id: "fetch", kind: "source", verb: "Source", title: "fetch the page", mode: "url", col: 1, lane: 0 },
    { id: "text", kind: "transform", verb: "Format", mode: "html → text", col: 2, lane: 0 },
    { id: "issues", kind: "block", verb: "Summarize", title: "issues on this page", col: 3, lane: 0 },
  ],
  edges: [
    { from: "url", to: "fetch", origin: "sourced", label: "Text" },
    { from: "fetch", to: "text", origin: "sourced", label: "Document" },
    { from: "text", to: "issues", origin: "computed", label: "Text" },
  ],
};

/** A model-written table heading for the knowledge base, unchecked. */
export const unchecked: CanvasFlow = {
  id: "unchecked",
  aria: "A Model block's output passes through a Format into a Write with no check between them.",
  nodes: [
    { id: "doc", kind: "source", verb: "Source", title: "the filing", mode: "file", col: 0, lane: 0 },
    { id: "model", kind: "block", verb: "Model", title: "figures with quotes", extraction: true, col: 1, lane: 0 },
    { id: "fmt", kind: "transform", verb: "Format", mode: "table → markdown", col: 2, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "the model", mode: "knowledge", col: 3, lane: 0 },
  ],
  edges: [
    { from: "doc", to: "model", origin: "sourced", label: "Document" },
    { from: "model", to: "fmt", origin: "generated", label: "Table<Figure>" },
    { from: "fmt", to: "write", origin: "generated", label: "Text" },
  ],
};

/** The same flow with a Check gate: each quote verified as an exact substring of the filing. */
export const checked: CanvasFlow = {
  id: "checked",
  aria: "The same flow with a Check gate after the Model: each quote is verified as an exact substring of the filing before the Write.",
  nodes: [
    { id: "doc", kind: "source", verb: "Source", title: "the filing", mode: "file", col: 0, lane: 0 },
    { id: "model", kind: "block", verb: "Model", title: "figures with quotes", extraction: true, col: 1, lane: 0 },
    { id: "check", kind: "gate", verb: "Check", title: "quote is in the filing", mode: "quote", col: 2, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "the model", mode: "knowledge", col: 3, lane: 0 },
  ],
  edges: [
    { from: "doc", to: "model", origin: "sourced", label: "Document" },
    { from: "model", to: "check", origin: "generated", label: "Table<Figure>" },
    { from: "check", to: "write", origin: "verified", label: "Table<Figure>" },
  ],
};

/** Report QC: check every citation in a draft against the source it cites. */
export const checkCitations: CanvasFlow = {
  id: "check-citations",
  aria:
    "A draft is split by a Model into claims and sources, reviewed by a person, then a Map over each claim-source pair fetches the source, formats it to text, judges its stance with a quote, and checks that the quote is in the page; results are aggregated per claim and written to knowledge.",
  nodes: [
    { id: "paste", kind: "source", verb: "Source", title: "the draft report", mode: "file", col: 0, lane: 0 },
    { id: "split", kind: "block", verb: "Model", title: "claims and sources", extraction: true, col: 1, lane: 0 },
    { id: "edit", kind: "gate", verb: "Review", title: "fix the claim list", mode: "edit", col: 2, lane: 0 },
    { id: "map", kind: "jig", verb: "Map", mode: "each claim, each source", foot: "38 pairs · parallel", col: 3, lane: 0, body: ["fetch", "text", "stance", "quote"] },
    { id: "fetch", kind: "source", verb: "Source", title: "fetch the source", mode: "url", col: 3, lane: 0 },
    { id: "text", kind: "transform", verb: "Format", mode: "html → text", col: 4, lane: 0 },
    { id: "stance", kind: "block", verb: "Judge", title: "supports or contradicts", mode: "stance", col: 5, lane: 0 },
    { id: "quote", kind: "gate", verb: "Check", title: "quote is on the page", mode: "quote", col: 6, lane: 0 },
    { id: "agg", kind: "transform", verb: "Aggregate", mode: "per claim", col: 7, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "citation ledger", mode: "knowledge", col: 8, lane: 0 },
  ],
  edges: [
    { from: "paste", to: "split", origin: "sourced", label: "Document" },
    { from: "split", to: "edit", origin: "generated", label: "Table<Claim>" },
    { from: "edit", to: "fetch", origin: "reviewed", label: "Row" },
    { from: "fetch", to: "text", origin: "sourced", label: "Document" },
    { from: "text", to: "stance", origin: "computed", label: "Text" },
    { from: "stance", to: "quote", origin: "generated", label: "Record" },
    { from: "quote", to: "agg", origin: "verified", label: "Table" },
    { from: "agg", to: "write", origin: "verified", label: "Table" },
  ],
};

/** Best of N: three drafts, one chosen with a reason, one editor. */
export const bestOfN: CanvasFlow = {
  id: "best-of-n",
  aria:
    "A brief feeds a Replicate jig that drafts three times; a Compare block chooses the best with a reason; a Select picks the chosen text; a Review holds it; a Write sends it.",
  nodes: [
    { id: "brief", kind: "source", verb: "Source", title: "the brief", mode: "file", col: 0, lane: 1 },
    { id: "rep", kind: "jig", verb: "Replicate", mode: "3 runs, 3 models", foot: "one row per run", col: 1, lane: 0, body: ["d1", "d2", "d3"] },
    { id: "d1", kind: "block", verb: "Draft", title: "memo from the brief", mode: "compose", col: 1, lane: 0 },
    { id: "d2", kind: "block", verb: "Draft", title: "memo from the brief", mode: "compose", col: 1, lane: 1 },
    { id: "d3", kind: "block", verb: "Draft", title: "memo from the brief", mode: "compose", col: 1, lane: 2 },
    { id: "pick", kind: "block", verb: "Compare", title: "best, with a reason", mode: "choose", col: 2, lane: 1 },
    { id: "sel", kind: "transform", verb: "Select", mode: "the chosen draft", col: 3, lane: 1 },
    { id: "review", kind: "gate", verb: "Review", title: "editor", col: 4, lane: 1 },
    { id: "write", kind: "egress", verb: "Write", title: "memo", mode: "file", col: 5, lane: 1 },
  ],
  edges: [
    { from: "brief", to: "d1", origin: "sourced" },
    { from: "brief", to: "d2", origin: "sourced", label: "Text" },
    { from: "brief", to: "d3", origin: "sourced" },
    { from: "d1", to: "pick", origin: "generated" },
    { from: "d2", to: "pick", origin: "generated", label: "Table<Draft>" },
    { from: "d3", to: "pick", origin: "generated" },
    { from: "pick", to: "sel", origin: "generated", label: "Record" },
    { from: "sel", to: "review", origin: "generated", label: "Text" },
    { from: "review", to: "write", origin: "reviewed", label: "Text" },
  ],
};

/** Source Validation: find candidate sources, score each against the criteria, keep what passes. */
export const sourceValidation: CanvasFlow = {
  id: "source-validation",
  aria:
    "A table of criteria and a topic feed a Search; a Map over the candidates fetches each, quotes the passages that bear on the criteria, and grades the source; a Filter keeps the passing sources; a Review samples them; a Write commits the table.",
  nodes: [
    { id: "topic", kind: "source", verb: "Source", title: "topic and criteria", mode: "table", col: 0, lane: 0 },
    { id: "search", kind: "block", verb: "Search", title: "candidate sources", mode: "web · files", extraction: true, col: 1, lane: 0 },
    { id: "map", kind: "jig", verb: "Map", mode: "each candidate", foot: "64 candidates · parallel · up to 8", col: 2, lane: 0, body: ["fetch", "quote", "grade"] },
    { id: "fetch", kind: "source", verb: "Source", title: "fetch the source", mode: "url", col: 2, lane: 0 },
    { id: "quote", kind: "block", verb: "Quote", title: "passages per criterion", extraction: true, col: 3, lane: 0 },
    { id: "grade", kind: "block", verb: "Judge", title: "against the criteria", mode: "grade", col: 4, lane: 0 },
    { id: "keep", kind: "transform", verb: "Filter", mode: "grade ≥ B", col: 5, lane: 0 },
    { id: "review", kind: "gate", verb: "Review", title: "sample what passed", mode: "sample", col: 6, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "validated sources", mode: "knowledge", col: 7, lane: 0 },
  ],
  edges: [
    { from: "topic", to: "search", origin: "sourced", label: "Record" },
    { from: "search", to: "fetch", origin: "generated", label: "Row" },
    { from: "fetch", to: "quote", origin: "sourced", label: "Document" },
    { from: "quote", to: "grade", origin: "sourced", label: "Table<Passage>" },
    { from: "grade", to: "keep", origin: "generated", label: "Table" },
    { from: "keep", to: "review", origin: "generated", label: "Table" },
    { from: "review", to: "write", origin: "reviewed", label: "Table" },
  ],
};
