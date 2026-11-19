/**
 * Timing and drawing helpers shared by the hero figure (FlowHero.astro) and
 * the beats drawn in their own components. Times are seconds on the figure's
 * one clock; each helper returns a CSS `animation:` declaration.
 */
import { rng, spline, type P } from "./draw";

/** Fade in at `t0`, and out at `t1` if given. For an element with class `t`. */
export const win = (t0: number, t1?: number | null) =>
  `animation: fh-in 0.4s ${t0.toFixed(2)}s both` + (t1 != null ? `, fh-out 0.35s ${t1.toFixed(2)}s forwards` : "");

/** Draw a path (class `d`, `pathLength="1"`) over `dur` from `t0`, and fade it at `t1` if given. */
export const draw = (t0: number, dur: number, t1?: number | null) =>
  `animation: fh-draw ${dur}s ${t0.toFixed(2)}s both, fh-in 0.15s ${t0.toFixed(2)}s both` +
  (t1 != null ? `, fh-out 0.35s ${t1.toFixed(2)}s forwards` : "");

/**
 * An agent's path from (x0, y) to (x1, y), within about ±amp: uneven swings
 * with an occasional loop. Between a tight coil and a zigzag.
 */
export function meander(x0: number, x1: number, y: number, amp: number, seed: number): P[] {
  const q = rng(seed);
  const L = x1 - x0;
  const waves = Math.max(1, L / 85) * (0.8 + 0.5 * q());
  const ph = [q() * 6.28, q() * 6.28];
  const count = L < 90 ? (q() < 0.7 ? 1 : 0) : Math.max(1, Math.round(L / 130 + (q() - 0.5)));
  const loops = Array.from({ length: count }, (_, i) => ({
    c: (i + 0.5 + (q() - 0.5) * 0.6) / count,
    r: amp * (0.26 + 0.2 * q()),
    w: Math.min(0.45, (34 + q() * 14) / L),
    dir: q() < 0.5 ? -1 : 1,
  }));
  const steps = Math.max(28, Math.round(L / 3.5));
  const pts: P[] = [];
  for (let i = 0; i <= steps; i++) {
    const s = i / steps;
    const env = Math.pow(Math.sin(Math.PI * s), 0.6);
    let px = x0 + s * L;
    let py = y + amp * 0.62 * env * (0.7 * Math.sin(2 * Math.PI * waves * s + ph[0]) + 0.3 * Math.sin(2 * Math.PI * waves * 2.3 * s + ph[1]));
    for (const loop of loops) {
      const u = (s - loop.c) / loop.w + 0.5;
      if (u <= 0 || u >= 1) continue;
      px -= loop.r * Math.sin(2 * Math.PI * u);
      py += loop.dir * loop.r * (1 - Math.cos(2 * Math.PI * u));
    }
    pts.push({ x: px, y: Math.min(y + amp, Math.max(y - amp, py)) });
  }
  pts[0] = { x: x0, y };
  pts[pts.length - 1] = { x: x1, y };
  return pts;
}
/** A spline's curve commands, without its leading move. */
export const seg = (pts: P[]) => spline(pts).replace(/^M [\d.-]+ [\d.-]+/, "");
