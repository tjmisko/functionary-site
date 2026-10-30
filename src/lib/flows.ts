import type { CanvasFlow } from "./canvas";

/**
 * The flows the site draws. Each one is either a fixture that runs on
 * integration/f98 today (marked `built`) or a procedure the 2026-10-29 block
 * ontology decided and has not built yet (marked `designed`). Pages caption
 * them accordingly; a designed flow is never shown as shipped.
 *
 * Sources: crates/functionary-flow-exec-oracle/flows/jig_tests.rs and
 * basic_functionality.rs (built); the Block Ontology reference rendering's
 * procedure pages (designed).
 */

export type FlowStatus = "built" | "designed";

export interface SiteFlow extends CanvasFlow {
  status: FlowStatus;
}

/** F1. Scan a list of sites for issues, summarize, review, write. Fixture: jig_tests.rs. */
export const siteScan: SiteFlow = {
  id: "site-scan",
  status: "built",
  aria:
    "A flow: a table of URLs feeds a Map; inside it each row's URL is fetched, formatted to text and summarized; the Map's table is formatted, summarized into one digest, held for review, then written.",
  nodes: [
    { id: "urls", kind: "source", verb: "Source", title: "sites to scan", mode: "table", col: 0, lane: 1 },
    { id: "map", kind: "jig", verb: "Map", mode: "one row at a time", col: 1, lane: 0, body: ["url", "fetch", "text", "issues"] },
    { id: "url", kind: "transform", verb: "Field", mode: "url", col: 1, lane: 1 },
    { id: "fetch", kind: "source", verb: "Source", title: "fetch the page", mode: "url", col: 2, lane: 1 },
    { id: "text", kind: "transform", verb: "Format", mode: "html to text", col: 3, lane: 1 },
    { id: "issues", kind: "block", verb: "Summarize", title: "issues on this page", col: 4, lane: 1 },
    { id: "report", kind: "transform", verb: "Format", mode: "table to markdown", col: 5, lane: 1 },
    { id: "digest", kind: "block", verb: "Summarize", title: "one digest across sites", col: 6, lane: 1 },
    { id: "review", kind: "gate", verb: "Review", title: "read before it goes out", col: 7, lane: 1 },
    { id: "write", kind: "egress", verb: "Write", title: "weekly scan", mode: "knowledge", col: 8, lane: 1 },
  ],
  edges: [
    { from: "urls", to: "url", origin: "sourced" },
    { from: "url", to: "fetch", origin: "sourced" },
    { from: "fetch", to: "text", origin: "sourced" },
    { from: "text", to: "issues", origin: "computed" },
    { from: "issues", to: "report", origin: "generated" },
    { from: "report", to: "digest", origin: "generated" },
    { from: "digest", to: "review", origin: "generated" },
    { from: "review", to: "write", origin: "reviewed" },
  ],
};

/** Contamination, the short version: a model-written value heading for a destination, with and without a Check. */
export const unchecked: SiteFlow = {
  id: "unchecked",
  status: "designed",
  aria: "A Model block's output passes through a Format into a Write with no check between them.",
  nodes: [
    { id: "doc", kind: "source", verb: "Source", title: "the filing", mode: "file", col: 0, lane: 0 },
    { id: "model", kind: "block", verb: "Model", title: "figures with quotes", extraction: true, col: 1, lane: 0 },
    { id: "fmt", kind: "transform", verb: "Format", mode: "table to markdown", col: 2, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "the model", mode: "knowledge", col: 3, lane: 0 },
  ],
  edges: [
    { from: "doc", to: "model", origin: "sourced" },
    { from: "model", to: "fmt", origin: "generated" },
    { from: "fmt", to: "write", origin: "generated" },
  ],
};

export const checked: SiteFlow = {
  id: "checked",
  status: "designed",
  aria: "The same flow with a Check gate after the Model: each quote is verified as an exact substring of the filing before the Write.",
  nodes: [
    { id: "doc", kind: "source", verb: "Source", title: "the filing", mode: "file", col: 0, lane: 0 },
    { id: "model", kind: "block", verb: "Model", title: "figures with quotes", extraction: true, col: 1, lane: 0 },
    { id: "check", kind: "gate", verb: "Check", title: "quote is in the filing", mode: "quote", col: 2, lane: 0 },
    { id: "write", kind: "egress", verb: "Write", title: "the model", mode: "knowledge", col: 3, lane: 0 },
  ],
  edges: [
    { from: "doc", to: "model", origin: "sourced" },
    { from: "model", to: "check", origin: "generated" },
    { from: "check", to: "write", origin: "verified" },
  ],
};

/** F6. Check the citations in a pasted answer. Designed (D130, D148); the procedure page "Check citations". */
export const checkCitations: SiteFlow = {
  id: "check-citations",
  status: "designed",
  aria:
    "A pasted transcript is split by a Model into claims and sources, reviewed by a person, then a Map over each claim-source pair fetches the source, formats it to text, judges its stance with a quote, and checks that the quote is in the page; results are aggregated per claim and written to knowledge.",
  nodes: [
    { id: "paste", kind: "source", verb: "Source", title: "the pasted answer", mode: "text", col: 0, lane: 1 },
    { id: "split", kind: "block", verb: "Model", title: "claims and the sources cited", extraction: true, col: 1, lane: 1 },
    { id: "edit", kind: "gate", verb: "Review", title: "fix the list before checking", mode: "edit", col: 2, lane: 1 },
    { id: "map", kind: "jig", verb: "Map", mode: "each claim, each source", col: 3, lane: 0, body: ["fetch", "text", "stance", "quote"] },
    { id: "fetch", kind: "source", verb: "Source", title: "fetch the source", mode: "url", col: 3, lane: 1 },
    { id: "text", kind: "transform", verb: "Format", mode: "html to text", col: 4, lane: 1 },
    { id: "stance", kind: "block", verb: "Judge", title: "supports, contradicts, not found", mode: "stance", col: 5, lane: 1 },
    { id: "quote", kind: "gate", verb: "Check", title: "quote is on the page", mode: "quote", col: 6, lane: 1 },
    { id: "agg", kind: "transform", verb: "Aggregate", mode: "per claim", col: 7, lane: 1 },
    { id: "write", kind: "egress", verb: "Write", title: "citation ledger", mode: "knowledge", col: 8, lane: 1 },
  ],
  edges: [
    { from: "paste", to: "split", origin: "sourced" },
    { from: "split", to: "edit", origin: "generated" },
    { from: "edit", to: "fetch", origin: "reviewed" },
    { from: "fetch", to: "text", origin: "sourced" },
    { from: "text", to: "stance", origin: "computed" },
    { from: "stance", to: "quote", origin: "generated" },
    { from: "quote", to: "agg", origin: "verified" },
    { from: "agg", to: "write", origin: "verified" },
  ],
};

/** F3. Best of N. Designed (D142, D143, D145). */
export const bestOfN: SiteFlow = {
  id: "best-of-n",
  status: "designed",
  aria:
    "A brief feeds a Replicate jig that drafts three times; a Compare block chooses the best with a reason; a Select picks the chosen text; a Review holds it; a Write sends it.",
  nodes: [
    { id: "brief", kind: "source", verb: "Source", title: "the brief", mode: "file", col: 0, lane: 1 },
    { id: "rep", kind: "jig", verb: "Replicate", mode: "3 runs, different models", col: 1, lane: 0, body: ["draft"] },
    { id: "draft", kind: "block", verb: "Draft", title: "memo from the brief", mode: "compose", col: 1, lane: 1 },
    { id: "pick", kind: "block", verb: "Compare", title: "which is best, and why", mode: "choose", col: 2, lane: 1 },
    { id: "sel", kind: "transform", verb: "Select", mode: "the chosen draft", col: 3, lane: 1 },
    { id: "review", kind: "gate", verb: "Review", title: "editor", col: 4, lane: 1 },
    { id: "write", kind: "egress", verb: "Write", title: "memo", mode: "file", col: 5, lane: 1 },
  ],
  edges: [
    { from: "brief", to: "draft", origin: "sourced" },
    { from: "draft", to: "pick", origin: "generated", label: "Table<Draft>" },
    { from: "pick", to: "sel", origin: "generated" },
    { from: "sel", to: "review", origin: "generated" },
    { from: "review", to: "write", origin: "reviewed" },
  ],
};
