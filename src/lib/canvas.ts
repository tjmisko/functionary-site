import type { Kind, Origin } from "./flow";

/**
 * Data model for the site's canvas drawings. Every node sits on a (col, lane)
 * grid; the renderer derives geometry. A Jig is a region: its `body` names the
 * nodes drawn inside it, and the region is sized around them.
 */

export interface CanvasNode {
  id: string;
  kind: Kind;
  /** The verb: Source, Model, Filter, Review, Write… */
  verb: string;
  /** What this instance does, in the user's words: "claims with quotes". */
  title?: string;
  /** Mode or settings summary shown as the header badge. */
  mode?: string;
  /** Extract-class blocks and Search read as extraction (green). */
  extraction?: boolean;
  col: number;
  lane: number;
  /** Jigs only: ids of the nodes inside the region. */
  body?: string[];
  /** Jigs only: the footer line, e.g. "12 rows · parallel". */
  foot?: string;
  /** Table sources: the spreadsheet drawn in the card body. */
  table?: { columns: string[]; rows: string[][]; total?: number; widths?: number[] };
}

export interface CanvasEdge {
  from: string;
  to: string;
  origin?: Origin;
  /** Wire type drawn on the edge, e.g. "Table<Claim>". */
  label?: string;
}

export interface CanvasFlow {
  id: string;
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  /** Accessible description of the drawing. */
  aria: string;
}
