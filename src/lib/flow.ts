/**
 * Shared flow vocabulary for the site's canvas drawings.
 *
 * Mirrors the seven D135 kinds the served catalog names on integration/f98
 * (`web/src/canvas/categoryColor.ts`, `categoryForCatalogKind`): each kind
 * reads as one canvas category and takes that category's `--cat-*` token.
 * A Block is painted as extraction or synthesis by its editor group; the
 * site passes that choice per node.
 */

export type Kind =
  | "source"
  | "block"
  | "agent"
  | "transform"
  | "jig"
  | "gate"
  | "egress";

/** The canvas category a kind reads as. Blocks default to synthesis. */
export const kindCategory: Record<Kind, string> = {
  source: "var(--cat-source)",
  block: "var(--cat-synthesis)",
  agent: "var(--cat-agent)",
  transform: "var(--cat-transformation)",
  jig: "var(--cat-control)",
  gate: "var(--cat-human)",
  egress: "var(--cat-action)",
};

/** Blocks in the Extract class (Model, Quote) and Search read as extraction. */
export const extractionTint = "var(--cat-extraction)";

/** The origin axis on every wire (D139). */
export type Origin = "sourced" | "computed" | "generated" | "verified" | "reviewed";

export const originLabel: Record<Origin, string> = {
  sourced: "Sourced",
  computed: "Computed",
  generated: "Generated",
  verified: "Verified",
  reviewed: "Reviewed",
};

export type RunState = "idle" | "running" | "completed" | "parked" | "failed";

export const stateLabel: Record<RunState, string> = {
  idle: "IDLE",
  running: "RUNNING",
  completed: "COMPLETED",
  parked: "PARKED",
  failed: "FAILED",
};

export const stateVar: Record<RunState, string> = {
  idle: "var(--fg-3)",
  running: "var(--accent-strong)",
  completed: "var(--success)",
  parked: "var(--conf-needs-input)",
  failed: "var(--danger)",
};
