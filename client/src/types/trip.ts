/**
 * Client mirror of the server domain contracts
 * (server/src/schemas/trip.ts — keep in sync).
 */

export interface TravelerComposition {
  adults: number;
  children: number;
  infants: number;
  elders: number;
}

export type Occasion = 'birthday' | 'anniversary' | 'honeymoon' | 'bachelorette' | null;
export type AccommodationType = 'hotel' | 'apartment' | 'hostel' | 'unique';
export type Pace = 'relaxed' | 'balanced' | 'packed';
export type Diet = 'veg' | 'nonveg' | 'egg';

export interface RouteCity {
  city: string;
  country: string;
  nights: number;
  lat?: number;
  lng?: number;
}

export interface TripBrief {
  travelers: TravelerComposition;
  occasion?: Occasion;
  startDate: string;
  endDate: string;
  departureCity?: string;
  route: RouteCity[];
  accommodationType: AccommodationType;
  budgetPerNight: { min: number; max: number; currency: string };
  pace: Pace;
  diet: Diet[];
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

export interface ItineraryAccommodation {
  id?: string;
  city: string;
  name: string;
  type: string;
  pricePerNight?: number;
  lat?: number;
  lng?: number;
  options?: { provider: string; price: number; url?: string }[];
}

export interface Itinerary {
  title: string;
  currency: string;
  days: ItineraryDay[];
  accommodations: ItineraryAccommodation[];
  estTotalCost?: number;
}

/** A persisted trip as returned by the API. */
export interface Trip {
  id: string;
  ownerId: string;
  title: string;
  status: 'DRAFT' | 'PUBLISHED';
  isPublic: boolean;
  shareSlug: string;
  startDate?: string;
  endDate?: string;
  currency: string;
  occasion?: string | null;
  brief?: TripBrief;
  itinerary?: Itinerary;
  createdAt?: string;
}
