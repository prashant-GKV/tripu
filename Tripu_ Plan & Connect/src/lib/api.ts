/**
 * API client for the Tripu backend (Fastify, default http://localhost:4000).
 * The backend wraps payloads in single-key envelopes ({ itinerary }, { trip },
 * { trips }, { matches }) — these helpers unwrap them.
 *
 * Set VITE_API_URL to point at a different backend.
 */
const BASE =
  (import.meta.env.VITE_API_URL as string | undefined)?.replace(/\/$/, '') ??
  'http://localhost:4000';

export const apiBaseUrl = BASE;

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body.error ?? body.message ?? message;
    } catch {
      /* non-JSON */
    }
    throw new ApiError(res.status, message);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ─── Domain types (mirror the backend contract) ─────────────────────────────────
export interface TripBriefInput {
  travelers: { adults: number; children: number; infants: number; elders: number };
  occasion?: string | null;
  startDate: string;
  endDate: string;
  departureCity?: string;
  route: { city: string; country?: string; nights: number }[];
  accommodationType: string;
  budgetPerNight: { min: number; max: number; currency: string };
  pace: string;
  diet: string[];
  interests: string;
  currency: string;
}

export interface ItineraryActivity {
  id?: string;
  timeSlot: string;
  title: string;
  description?: string;
  category: string;
  place?: string;
  lat?: number;
  lng?: number;
  estCost?: number;
  bookingUrl?: string;
  aiRationale?: string;
}
export interface ItineraryDay {
  id?: string;
  dayIndex: number;
  date?: string;
  city: string;
  country: string;
  summary?: string;
  activities: ItineraryActivity[];
}
export interface Itinerary {
  title: string;
  currency: string;
  days: ItineraryDay[];
  accommodations: {
    id?: string;
    city: string;
    name: string;
    type: string;
    pricePerNight?: number;
    lat?: number;
    lng?: number;
    options?: { provider: string; price: number; url?: string }[];
  }[];
  estTotalCost?: number;
}

export interface TripDTO {
  id: string;
  ownerId: string;
  title: string;
  status: string;
  isPublic: boolean;
  shareSlug: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  occasion?: string | null;
  brief?: TripBriefInput;
  itinerary?: Itinerary;
  createdAt?: string;
}

export interface MatchDTO {
  candidateId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  breakdown: Record<string, number>;
}

// ─── Endpoints ──────────────────────────────────────────────────────────────────

/** Generate an itinerary from a brief WITHOUT saving (no DB, no auth needed). */
export const previewItinerary = (brief: TripBriefInput) =>
  api<{ itinerary: Itinerary }>('/api/ai/preview', {
    method: 'POST',
    body: JSON.stringify({ brief }),
  }).then((r) => r.itinerary);

/** Public list of tripboards (needs the DB). */
export const listTripboards = () =>
  api<{ trips: TripDTO[] }>('/api/tripboards').then((r) => r.trips);

/** A public tripboard by share slug (needs the DB). */
export const getPublicTrip = (slug: string) =>
  api<{ trip: TripDTO }>(`/api/t/${slug}`).then((r) => r.trip);

/** Companion matches for a trip (needs the DB). */
export const getMatches = (tripId: string) =>
  api<{ matches: MatchDTO[] }>(`/api/match/${tripId}`).then((r) => r.matches);

/** Health check — handy to detect whether the backend is reachable. */
export const ping = () => api<{ status: string }>('/health');
