import { create } from 'zustand';
import type {
  TripBrief,
  TravelerComposition,
  Occasion,
  RouteCity,
  AccommodationType,
  Pace,
  Diet,
} from '../types/trip';

/** The four wizard steps, in order. */
export const WIZARD_STEPS = ['Who', 'When', 'Where', 'How'] as const;
export type WizardStepName = (typeof WIZARD_STEPS)[number];

/**
 * The wizard collects a *partial* TripBrief while the user fills steps in.
 * `buildBrief()` assembles a fully-valid TripBrief from this draft.
 *
 * Defaults are chosen so the very first step is already valid (1 adult) and
 * the brief always has a sensible shape even mid-flow.
 */
interface WizardDraft {
  travelers: TravelerComposition;
  occasion: Occasion;
  /** ISO date strings (yyyy-MM-dd) or null while unset. */
  startDate: string | null;
  endDate: string | null;
  departureCity: string;
  route: RouteCity[];
  accommodationType: AccommodationType;
  budgetMin: number;
  budgetMax: number;
  currency: string;
  pace: Pace;
  diet: Diet[];
  interests: string;
}

interface WizardState extends WizardDraft {
  /** Index into WIZARD_STEPS (0..3). */
  currentStep: number;

  // ── Step 1 · WHO ──────────────────────────────────────────────────────
  setTravelerCount: (key: keyof TravelerComposition, value: number) => void;
  setOccasion: (occasion: Occasion) => void;

  // ── Step 2 · WHEN ─────────────────────────────────────────────────────
  setDateRange: (start: string | null, end: string | null) => void;

  // ── Step 3 · WHERE ────────────────────────────────────────────────────
  setDepartureCity: (city: string) => void;
  addCity: (city: RouteCity) => void;
  removeCity: (index: number) => void;
  setCityNights: (index: number, nights: number) => void;
  moveCity: (index: number, direction: -1 | 1) => void;

  // ── Step 4 · HOW ──────────────────────────────────────────────────────
  setAccommodationType: (type: AccommodationType) => void;
  setBudget: (min: number, max: number) => void;
  setCurrency: (currency: string) => void;
  setPace: (pace: Pace) => void;
  toggleDiet: (diet: Diet) => void;
  setInterests: (interests: string) => void;

  // ── Navigation ────────────────────────────────────────────────────────
  next: () => void;
  back: () => void;
  goTo: (step: number) => void;

  // ── Output ────────────────────────────────────────────────────────────
  buildBrief: () => TripBrief;
  reset: () => void;
}

/** Sensible ranges for the traveler counters. */
export const TRAVELER_RANGES: Record<keyof TravelerComposition, { min: number; max: number }> = {
  adults: { min: 1, max: 16 },
  children: { min: 0, max: 12 },
  infants: { min: 0, max: 8 },
  elders: { min: 0, max: 12 },
};

const initialDraft: WizardDraft = {
  travelers: { adults: 1, children: 0, infants: 0, elders: 0 },
  occasion: null,
  startDate: null,
  endDate: null,
  departureCity: '',
  route: [],
  accommodationType: 'hotel',
  budgetMin: 80,
  budgetMax: 250,
  currency: 'USD',
  pace: 'balanced',
  diet: [],
  interests: '',
};

export const useWizardStore = create<WizardState>((set, get) => ({
  ...initialDraft,
  currentStep: 0,

  // ── WHO ─────────────────────────────────────────────────────────────────
  setTravelerCount: (key, value) =>
    set((s) => {
      const { min, max } = TRAVELER_RANGES[key];
      const clamped = Math.max(min, Math.min(max, value));
      return { travelers: { ...s.travelers, [key]: clamped } };
    }),
  setOccasion: (occasion) => set({ occasion }),

  // ── WHEN ────────────────────────────────────────────────────────────────
  setDateRange: (startDate, endDate) => set({ startDate, endDate }),

  // ── WHERE ───────────────────────────────────────────────────────────────
  setDepartureCity: (departureCity) => set({ departureCity }),
  addCity: (city) => set((s) => ({ route: [...s.route, city] })),
  removeCity: (index) => set((s) => ({ route: s.route.filter((_, i) => i !== index) })),
  setCityNights: (index, nights) =>
    set((s) => ({
      route: s.route.map((c, i) => (i === index ? { ...c, nights: Math.max(1, nights) } : c)),
    })),
  moveCity: (index, direction) =>
    set((s) => {
      const target = index + direction;
      if (target < 0 || target >= s.route.length) return s;
      const route = [...s.route];
      [route[index], route[target]] = [route[target], route[index]];
      return { route };
    }),

  // ── HOW ─────────────────────────────────────────────────────────────────
  setAccommodationType: (accommodationType) => set({ accommodationType }),
  setBudget: (budgetMin, budgetMax) => set({ budgetMin, budgetMax }),
  setCurrency: (currency) => set({ currency }),
  setPace: (pace) => set({ pace }),
  toggleDiet: (diet) =>
    set((s) => ({
      diet: s.diet.includes(diet) ? s.diet.filter((d) => d !== diet) : [...s.diet, diet],
    })),
  setInterests: (interests) => set({ interests }),

  // ── Navigation ──────────────────────────────────────────────────────────
  next: () => set((s) => ({ currentStep: Math.min(WIZARD_STEPS.length - 1, s.currentStep + 1) })),
  back: () => set((s) => ({ currentStep: Math.max(0, s.currentStep - 1) })),
  goTo: (step) => set({ currentStep: Math.max(0, Math.min(WIZARD_STEPS.length - 1, step)) }),

  // ── Output ──────────────────────────────────────────────────────────────
  buildBrief: () => {
    const s = get();
    const currency = s.currency || 'USD';
    return {
      travelers: { ...s.travelers },
      occasion: s.occasion,
      // Step validation guarantees these are set before submit; fall back to ''.
      startDate: s.startDate ?? '',
      endDate: s.endDate ?? '',
      departureCity: s.departureCity.trim() || undefined,
      route: s.route.map((c) => ({ ...c })),
      accommodationType: s.accommodationType,
      budgetPerNight: { min: s.budgetMin, max: s.budgetMax, currency },
      pace: s.pace,
      diet: [...s.diet],
      interests: s.interests.trim(),
      currency,
    };
  },

  reset: () => set({ ...initialDraft, currentStep: 0 }),
}));

/**
 * Per-step validity. Drives the Next button and progress checkmarks.
 * Kept as a pure selector so components stay declarative.
 */
export function isStepValid(state: WizardState, step: number): boolean {
  switch (step) {
    case 0: // WHO — at least one adult
      return state.travelers.adults >= 1;
    case 1: // WHEN — both ends of the range chosen, end >= start
      return (
        !!state.startDate && !!state.endDate && state.startDate <= state.endDate
      );
    case 2: // WHERE — at least one city in the route
      return state.route.length > 0;
    case 3: // HOW — budget range coherent
      return state.budgetMin >= 0 && state.budgetMax >= state.budgetMin;
    default:
      return false;
  }
}
