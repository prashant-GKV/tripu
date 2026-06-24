import { describe, it, expect } from 'vitest';
import { scoreCompatibility, type MatchInput } from './matching.js';

const base: MatchInput = {
  travelStyles: ['hiking', 'food', 'photography'],
  budgetBand: 'mid',
  pacePref: 'balanced',
  destinations: ['Japan', 'Kyoto'],
  startDate: '2026-09-01',
  endDate: '2026-09-10',
};

describe('scoreCompatibility', () => {
  it('always returns a score in 0..100', () => {
    const inputs: MatchInput[] = [
      base,
      { travelStyles: [], destinations: [], budgetBand: null, pacePref: null, startDate: null, endDate: null },
      { travelStyles: ['beach'], destinations: ['Bali'], budgetBand: 'luxury', pacePref: 'relaxed', startDate: '2027-01-01', endDate: '2027-01-05' },
    ];
    for (const a of inputs) {
      for (const b of inputs) {
        const { score, breakdown } = scoreCompatibility(a, b);
        expect(score).toBeGreaterThanOrEqual(0);
        expect(score).toBeLessThanOrEqual(100);
        for (const v of Object.values(breakdown)) {
          expect(v).toBeGreaterThanOrEqual(0);
          expect(v).toBeLessThanOrEqual(100);
        }
      }
    }
  });

  it('is deterministic', () => {
    const a = scoreCompatibility(base, base);
    const b = scoreCompatibility(base, base);
    expect(a).toEqual(b);
  });

  it('identical inputs score higher than dissimilar inputs', () => {
    const similar = scoreCompatibility(base, base);
    const dissimilar = scoreCompatibility(base, {
      travelStyles: ['nightlife'],
      budgetBand: 'economy',
      pacePref: 'packed',
      destinations: ['Iceland'],
      startDate: '2030-01-01',
      endDate: '2030-01-02',
    });
    expect(similar.score).toBeGreaterThan(dissimilar.score);
  });

  it('rewards overlapping styles monotonically', () => {
    const partial = scoreCompatibility(base, {
      ...base,
      travelStyles: ['hiking'], // 1 of 3 overlap
    });
    const full = scoreCompatibility(base, base);
    expect(full.breakdown.styleJaccard).toBeGreaterThan(partial.breakdown.styleJaccard);
  });

  it('gives partial credit for adjacent budget bands', () => {
    const adjacent = scoreCompatibility(
      { ...base, budgetBand: 'mid' },
      { ...base, budgetBand: 'luxury' },
    );
    const far = scoreCompatibility(
      { ...base, budgetBand: 'economy' },
      { ...base, budgetBand: 'luxury' },
    );
    expect(adjacent.breakdown.budget).toBeGreaterThan(far.breakdown.budget);
  });
});
