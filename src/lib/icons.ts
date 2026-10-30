/**
 * Per-verb line icons for canvas cards, in the app's idiom: a 16×16 viewBox,
 * stroke currentColor at 1.5, round caps, no fill. Paths follow the block
 * icon set used by the product's reference rendering.
 */
const ICONS: Record<string, string> = {
  globe: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2zM2 8h12M8 2c2 2 2 10 0 12M8 2c-2 2-2 10 0 12',
  file: 'M3 2.5h8.5L13.5 5v8.5h-11zM5 2.5v3.5h5V2.5M5 13.5v-3.5h6v3.5',
  person: 'M6 7.2a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4zM2 14c0-2.5 2-4 4-4 1 0 1.9.4 2.6 1M9 11l1.8 2L14 8.5',
  struct: 'M2.5 2.5h11v11h-11zM5.5 6h5M5.5 8.5h5M5.5 11h3',
  draft: 'M4 2.5h5l3 3V11M5.5 13.5l-2 .5.5-2 5-5 1.5 1.5z',
  branch: 'M4 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM12 5.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 14.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM8 11.5V8M8 8C8 6 5 6 4.5 5.4M8 8c0-2 3-2 3.5-2.6',
  loop: 'M12.5 8a4.5 4.5 0 1 1-1.3-3.2M11 2.5v2.8h-2.8',
  shield: 'M8 2l5 2v4c0 3.5-2.5 5.5-5 6.5C5.5 13.5 3 11.5 3 8V4zM5.8 8l1.6 1.6L10.5 6.5',
  funnel: 'M2.5 3.5l5 5v5h1v-5l5-5zM2.5 3.5h11',
  compare: 'M2.5 3h4.5v10H2.5zM9 3h4.5v10H9z',
  bell: 'M8 2.5a3.5 3.5 0 0 0-3.5 3.5c0 3-1.5 4-1.5 4h10s-1.5-1-1.5-4A3.5 3.5 0 0 0 8 2.5zM6.8 13a1.3 1.3 0 0 0 2.4 0',
  table: 'M2.5 3h11v10h-11zM2.5 6.5h11M2.5 10h11M6.5 3v10',
  text: 'M3 4h10M3 7h10M3 10h7M3 13h5',
  search: 'M7 11.5a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9zM10.5 10.5L14 14',
  verdict: 'M3 8.5l3 3 7-7',
  key: 'M6 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM9 8h5M12 8v2.5M14 8v2',
  agent: 'M8 2l1.5 3.5L13 7l-3.5 1.5L8 12l-1.5-3.5L3 7l3.5-1.5zM13 14.2a1.2 1.2 0 1 0 0-2.4 1.2 1.2 0 0 0 0 2.4z',
  repeat: 'M3 6.5a5 5 0 0 1 9-2.5M13 9.5a5 5 0 0 1-9 2.5M12 2v2.5h-2.5M4 14v-2.5h2.5',
  quote: 'M3 4h4v4H4.5L3 10.5zM9 4h4v4h-2.5L9 10.5z',
  sigma: 'M4 3h8M4 3l4.5 5L4 13M4 13h8',
  stack: 'M2.5 4h11M2.5 8h11M2.5 12h11',
  join: 'M6 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM10 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  eraser: 'M3 11l6-6 4 4-6 6H5zM7 13h6',
};

const VERB_ICON: Record<string, string> = {
  Source: 'globe',
  Write: 'file',
  Review: 'person',
  Model: 'struct',
  Draft: 'draft',
  Branch: 'branch',
  Map: 'loop',
  Replicate: 'repeat',
  Repeat: 'repeat',
  Refine: 'repeat',
  Retry: 'repeat',
  Check: 'shield',
  Filter: 'funnel',
  Compare: 'compare',
  Notify: 'bell',
  Field: 'table',
  Select: 'table',
  Sort: 'table',
  Mutate: 'table',
  Aggregate: 'sigma',
  Join: 'join',
  Stack: 'stack',
  Reshape: 'table',
  Format: 'text',
  Template: 'text',
  Summarize: 'text',
  Search: 'search',
  Judge: 'verdict',
  Declassify: 'key',
  Redact: 'eraser',
  Apply: 'draft',
  Quote: 'quote',
  Agent: 'agent',
  'Sketch agent': 'agent',
  Coalesce: 'join',
};

export function iconFor(verb: string): string | undefined {
  const key = VERB_ICON[verb];
  return key ? ICONS[key] : undefined;
}
