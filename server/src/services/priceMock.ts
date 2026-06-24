/**
 * Simulated multi-OTA price comparison (clearly mock — live OTA APIs are paid).
 * OWNER: server-ai agent.
 *
 * Given a base nightly price, we deterministically spread a handful of
 * "providers" around it with small, fixed multipliers so the comparison UI has
 * realistic-looking but reproducible data. No network, no randomness.
 */
export interface PriceOption {
  provider: string;
  price: number;
  url?: string;
}

interface ProviderSpec {
  provider: string;
  /** Multiplier applied to the base price (e.g. 0.96 = 4% cheaper). */
  factor: number;
  url: string;
}

// Clearly-simulated providers. Factors are fixed for determinism.
const PROVIDERS: ProviderSpec[] = [
  { provider: 'Tripu Direct', factor: 0.95, url: 'https://example.com/tripu' },
  { provider: 'Booking (sample)', factor: 1.0, url: 'https://example.com/booking' },
  { provider: 'Agoda (sample)', factor: 1.04, url: 'https://example.com/agoda' },
  { provider: 'Expedia (sample)', factor: 1.08, url: 'https://example.com/expedia' },
];

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function simulatePrices(basePrice: number, _currency = 'USD'): PriceOption[] {
  const base = Number.isFinite(basePrice) && basePrice > 0 ? basePrice : 0;
  if (base === 0) return [];

  return PROVIDERS.map(({ provider, factor, url }) => ({
    provider,
    price: round2(base * factor),
    url,
  })).sort((a, b) => a.price - b.price);
}
