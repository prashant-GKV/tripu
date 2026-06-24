/**
 * Geocoding via OpenStreetMap Nominatim (free, no key).
 * OWNER: server-ai agent.
 *
 * Polite usage: a small in-memory cache avoids repeat lookups, we send a
 * descriptive User-Agent as Nominatim's policy requires, and any failure
 * (network error, non-200, empty result) resolves to `null` so callers can
 * degrade gracefully rather than throw.
 */
export interface GeoPoint {
  lat: number;
  lng: number;
}

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';
const USER_AGENT = 'TripuApp/1.0';

// Process-lifetime cache. Key is the normalized query; value may be `null`
// (a negative cache) so we don't hammer Nominatim for places it can't find.
const cache = new Map<string, GeoPoint | null>();

function normalize(query: string): string {
  return query.trim().toLowerCase();
}

export async function geocodePlace(query: string): Promise<GeoPoint | null> {
  const q = query?.trim();
  if (!q) return null;

  const key = normalize(q);
  if (cache.has(key)) return cache.get(key) ?? null;

  try {
    const url = `${NOMINATIM_URL}?q=${encodeURIComponent(q)}&format=json&limit=1`;
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!res.ok) {
      cache.set(key, null);
      return null;
    }

    const data = (await res.json()) as Array<{ lat?: string; lon?: string }>;
    const first = Array.isArray(data) ? data[0] : undefined;
    if (!first || first.lat == null || first.lon == null) {
      cache.set(key, null);
      return null;
    }

    const lat = Number(first.lat);
    const lng = Number(first.lon);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      cache.set(key, null);
      return null;
    }

    const point: GeoPoint = { lat, lng };
    cache.set(key, point);
    return point;
  } catch {
    // Network/parse failure: negative-cache and degrade to null.
    cache.set(key, null);
    return null;
  }
}
