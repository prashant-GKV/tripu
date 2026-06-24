import { apiFetch } from './api';
import type { TripBrief, Itinerary, Trip } from '../types/trip';

export interface DestinationDTO {
  id: string;
  name: string;
  country: string;
  image?: string;
  lat?: number;
  lng?: number;
  tags: string[];
}

export interface TestimonialDTO {
  id: string;
  author: string;
  location?: string;
  avatar?: string;
  quote: string;
  rating: number;
}

export interface MatchDTO {
  candidateId: string;
  displayName: string;
  avatarUrl?: string;
  score: number;
  breakdown: Record<string, number>;
}

// The server wraps payloads in a single-key envelope (e.g. { trip }, { matches }).
// These helpers unwrap that here so the rest of the client works with plain values.

/** Generate an itinerary from a brief WITHOUT persisting (no auth, fast preview). */
export const previewItinerary = (brief: TripBrief) =>
  apiFetch<{ itinerary: Itinerary }>('/api/ai/preview', {
    method: 'POST',
    body: JSON.stringify({ brief }),
  }).then((r) => r.itinerary);

/** Create + persist a trip (requires auth); server generates the itinerary. */
export const createTrip = (brief: TripBrief) =>
  apiFetch<{ trip: Trip }>('/api/trips', {
    method: 'POST',
    body: JSON.stringify({ brief }),
  }).then((r) => r.trip);

/** Public tripboard view by share slug — no login required. */
export const getPublicTrip = (slug: string) =>
  apiFetch<{ trip: Trip }>(`/api/t/${slug}`).then((r) => r.trip);

/** Public list of published tripboards. */
export const listTripboards = () =>
  apiFetch<{ trips: Trip[] }>('/api/tripboards').then((r) => r.trips);

/** Patch a single activity (used by collaborative edits). Best-effort. */
export const updateActivity = (id: string, patch: Record<string, unknown>) =>
  apiFetch<{ activity: unknown }>(`/api/activities/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  });

/** Re-generate a single day of an itinerary. */
export const regenerateDay = (tripId: string, dayIndex: number) =>
  apiFetch<{ trip: Trip }>(`/api/trips/${tripId}/regenerate-day`, {
    method: 'POST',
    body: JSON.stringify({ dayIndex }),
  }).then((r) => r.trip);

/** Compute + return companion matches for a trip. */
export const computeMatches = (tripId: string) =>
  apiFetch<{ matches: MatchDTO[] }>(`/api/match/${tripId}`, { method: 'POST' }).then(
    (r) => r.matches,
  );
export const getMatches = (tripId: string) =>
  apiFetch<{ matches: MatchDTO[] }>(`/api/match/${tripId}`).then((r) => r.matches);

export const getDestinations = () =>
  apiFetch<{ destinations: DestinationDTO[] }>('/api/destinations').then((r) => r.destinations);
export const getTestimonials = () =>
  apiFetch<{ testimonials: TestimonialDTO[] }>('/api/testimonials').then((r) => r.testimonials);
