/** A node in the figures' schematic flow language. Drawn by FlowNodes.astro. */
export type FlowNode =
  | { k: "source" | "write"; label: string; x: number; y: number; w: number; h: number }
  | { k: "block"; label: string; x: number; y: number; w: number; h: number }
  | { k: "agent"; x: number; y: number; w: number; h: number }
  | { k: "pill"; label: string; x: number; y: number; w: number }
  | { k: "gate"; label: string; cx: number; cy: number; r: number; human?: boolean }
  | { k: "jig"; label: string; x: number; y: number; w: number; h: number }
  | { k: "mini"; tone: "source" | "egress"; label: string | null; x: number; y: number; w: number; h: number; dim?: boolean }
  | { k: "text"; text: string; x: number; y: number };
