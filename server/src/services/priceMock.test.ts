import { describe, it, expect } from 'vitest';
import { simulatePrices } from './priceMock.js';

describe('simulatePrices', () => {
  it('returns multiple provider options for a positive base price', () => {
    const opts = simulatePrices(100);
    expect(opts.length).toBeGreaterThan(1);
    for (const o of opts) {
      expect(typeof o.provider).toBe('string');
      expect(o.price).toBeGreaterThan(0);
    }
  });

  it('is deterministic', () => {
    expect(simulatePrices(180, 'EUR')).toEqual(simulatePrices(180, 'EUR'));
  });

  it('is sorted cheapest-first', () => {
    const prices = simulatePrices(250).map((o) => o.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it('returns an empty array for non-positive or invalid base prices', () => {
    expect(simulatePrices(0)).toEqual([]);
    expect(simulatePrices(-50)).toEqual([]);
    expect(simulatePrices(Number.NaN)).toEqual([]);
  });

  it('scales prices with the base', () => {
    const cheap = simulatePrices(100);
    const pricey = simulatePrices(500);
    expect(Math.min(...pricey.map((o) => o.price))).toBeGreaterThan(
      Math.min(...cheap.map((o) => o.price)),
    );
  });
});
