/**
 * Companion-compatibility scoring (a novel technical contribution).
 * OWNER: server-ai agent. Deterministic + explainable.
 *
 * score(0..100) = 100 * weighted_sum of five sub-scores, each in [0,1]:
 *   - dateOverlap         (weight 0.20) — fraction of the shorter trip window
 *                                         that overlaps the other's window.
 *   - destinationOverlap  (weight 0.25) — Jaccard over normalized destinations.
 *   - styleJaccard        (weight 0.30) — Jaccard over travel styles/interests.
 *   - budget              (weight 0.15) — proximity of budget bands (economy/mid/luxury).
 *   - pace                (weight 0.10) — proximity of pace prefs (relaxed/balanced/packed).
 *
 * Weights sum to 1.0. The breakdown is returned as 0..100 per dimension so the
 * client can render a transparent "why" panel.
 */
export interface MatchBreakdown {
  dateOverlap: number;
  destinationOverlap: number;
  styleJaccard: number;
  budget: number;
  pace: number;
}

export interface MatchInput {
  travelStyles: string[];
  budgetBand?: string | null;
  pacePref?: string | null;
  destinations: string[]; // countries/cities of interest
  startDate?: string | null;
  endDate?: string | null;
}

export interface MatchResult {
  score: number; // 0..100
  breakdown: MatchBreakdown;
}

const WEIGHTS = {
  dateOverlap: 0.2,
  destinationOverlap: 0.25,
  styleJaccard: 0.3,
  budget: 0.15,
  pace: 0.1,
} as const;

// Ordinal scales so "adjacent" preferences score partial credit.
const BUDGET_ORDER: Record<string, number> = { economy: 0, mid: 1, luxury: 2 };
const PACE_ORDER: Record<string, number> = { relaxed: 0, balanced: 1, packed: 2 };

function normToken(s: string): string {
  return s.trim().toLowerCase();
}

function toSet(items: string[]): Set<string> {
  const set = new Set<string>();
  for (const item of items ?? []) {
    const t = normToken(item);
    if (t) set.add(t);
  }
  return set;
}

/** Jaccard similarity of two string collections, in [0,1]. */
function jaccard(a: string[], b: string[]): number {
  const sa = toSet(a);
  const sb = toSet(b);
  if (sa.size === 0 && sb.size === 0) return 0;
  let intersection = 0;
  for (const x of sa) if (sb.has(x)) intersection++;
  const union = sa.size + sb.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Date-window overlap as a fraction of the shorter window, in [0,1]. */
function dateOverlapScore(a: MatchInput, b: MatchInput): number {
  const aStart = parseDate(a.startDate);
  const aEnd = parseDate(a.endDate);
  const bStart = parseDate(b.startDate);
  const bEnd = parseDate(b.endDate);
  if (aStart == null || aEnd == null || bStart == null || bEnd == null) return 0;

  const aLo = Math.min(aStart, aEnd);
  const aHi = Math.max(aStart, aEnd);
  const bLo = Math.min(bStart, bEnd);
  const bHi = Math.max(bStart, bEnd);

  const overlap = Math.max(0, Math.min(aHi, bHi) - Math.max(aLo, bLo));
  const shorter = Math.min(aHi - aLo, bHi - bLo);
  // Same-day trips (zero-length windows) that overlap count as a full match.
  if (shorter <= 0) return aLo <= bHi && bLo <= aHi ? 1 : 0;
  return clamp01(overlap / shorter);
}

function parseDate(s?: string | null): number | null {
  if (!s) return null;
  const t = Date.parse(s);
  return Number.isFinite(t) ? t : null;
}

/** Proximity on an ordinal scale: 1 if equal, falling off by distance. */
function ordinalProximity(
  a: string | null | undefined,
  b: string | null | undefined,
  order: Record<string, number>,
): number {
  if (!a || !b) return 0;
  const ai = order[normToken(a)];
  const bi = order[normToken(b)];
  if (ai == null || bi == null) return 0;
  const span = Math.max(...Object.values(order)) - Math.min(...Object.values(order));
  if (span <= 0) return 1;
  return clamp01(1 - Math.abs(ai - bi) / span);
}

function clamp01(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.max(0, Math.min(1, n));
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function scoreCompatibility(a: MatchInput, b: MatchInput): MatchResult {
  const dateOverlap = dateOverlapScore(a, b);
  const destinationOverlap = jaccard(a.destinations, b.destinations);
  const styleJaccard = jaccard(a.travelStyles, b.travelStyles);
  const budget = ordinalProximity(a.budgetBand, b.budgetBand, BUDGET_ORDER);
  const pace = ordinalProximity(a.pacePref, b.pacePref, PACE_ORDER);

  const weighted =
    WEIGHTS.dateOverlap * dateOverlap +
    WEIGHTS.destinationOverlap * destinationOverlap +
    WEIGHTS.styleJaccard * styleJaccard +
    WEIGHTS.budget * budget +
    WEIGHTS.pace * pace;

  const score = round1(clamp01(weighted) * 100);

  return {
    score,
    breakdown: {
      dateOverlap: round1(dateOverlap * 100),
      destinationOverlap: round1(destinationOverlap * 100),
      styleJaccard: round1(styleJaccard * 100),
      budget: round1(budget * 100),
      pace: round1(pace * 100),
    },
  };
}
