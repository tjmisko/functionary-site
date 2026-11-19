/** A node in the figures' schematic flow language. Drawn by FlowNodes.astro. */
export type FlowNode =
  | { k: "source" | "write"; label: string; x: number; y: number; w: number; h: number }
  | { k: "block"; label: string; x: number; y: number; w: number; h: number }
  | { k: "agent"; x: number; y: number; w: number; h: number }
  | { k: "pill"; label: string; x: number; y: number; w: number }
  | { k: "gate"; label: string; cx: number; cy: number; r: number; human?: boolean; above?: boolean }
  /** A Map as the canvas draws it: a funnel into a body and a funnel out. x and w include the funnels. */
  | { k: "mapjig"; label: string; rule: string; x: number; y: number; w: number; h: number; funnel?: number }
  /** A table in the Source table shape: a titled header over n rows. */
  | { k: "rows"; title: string; x: number; y: number; w: number; n: number }
  /** A short block, for branches that run side by side. */
  | { k: "chip"; tone: "model" | "check"; label: string; x: number; y: number; w: number; h: number }
  | { k: "jig"; label: string; x: number; y: number; w: number; h: number }
  | { k: "mini"; tone: "source" | "egress"; label: string | null; x: number; y: number; w: number; h: number; dim?: boolean }
  /** A module: a named function of blocks, called like one block. */
  | { k: "module"; label: string; x: number; y: number; w: number; h: number }
  /** A knowledge table: committed by one flow, read by another at a pinned revision. */
  | { k: "table"; label: string; x: number; y: number; w: number; h: number }
  /** A module's argument or return value. */
  | { k: "arg"; label: string; x: number; y: number; w: number; h: number }
  | { k: "text"; text: string; x: number; y: number };
