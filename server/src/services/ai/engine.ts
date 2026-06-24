import Anthropic from '@anthropic-ai/sdk';
import { config } from '../../config.js';
import {
  ItinerarySchema,
  type TripBrief,
  type Itinerary,
  type ItineraryDay,
  type ItineraryActivity,
  type ItineraryAccommodation,
} from '../../schemas/trip.js';
import { geocodePlace } from '../geocode.js';
import { simulatePrices } from '../priceMock.js';
import {
  buildSystemPrompt,
  buildUserPrompt,
  buildRegenerateDayUserPrompt,
} from './prompt.js';

/**
 * AI itinerary engine (the academic centerpiece).
 *
 * Two paths:
 *  - WITH an ANTHROPIC_API_KEY: prompt Claude for JSON-only output, validate with
 *    Zod (+1 repair retry), then geocode + enforce constraints.
 *  - WITHOUT a key: a deterministic local mock generator that still produces a
 *    schema-valid, constraint-respecting Itinerary so the app demos for free.
 *
 * Either way the result passes through `enforceConstraints` so pace/budget/diet/
 * occasion rules hold regardless of source.
 */
export interface GenerateOptions {
  /** Override the default model (e.g. claude-opus-4-8 for the quality toggle). */
  model?: string;
}

const PACE_ACTIVITY_COUNT: Record<TripBrief['pace'], number> = {
  relaxed: 2,
  balanced: 3,
  packed: 4,
};

// ─── Public API ────────────────────────────────────────────────────────────────

export async function generateItinerary(
  brief: TripBrief,
  opts: GenerateOptions = {},
): Promise<Itinerary> {
  let itinerary: Itinerary;

  if (config.ANTHROPIC_API_KEY) {
    itinerary = await generateWithClaude(brief, opts);
  } else {
    itinerary = generateLocally(brief);
  }

  itinerary = enforceConstraints(itinerary, brief);
  itinerary = await geocodeItinerary(itinerary);
  itinerary = attachPrices(itinerary);
  return itinerary;
}

export async function regenerateDay(
  brief: TripBrief,
  itinerary: Itinerary,
  dayIndex: number,
  opts: GenerateOptions = {},
): Promise<Itinerary> {
  let next: Itinerary;

  if (config.ANTHROPIC_API_KEY) {
    const userPrompt = buildRegenerateDayUserPrompt(brief, itinerary, dayIndex);
    next = await callClaudeForItinerary(userPrompt, opts);
  } else {
    // Local path: rebuild the whole itinerary deterministically, then splice the
    // freshly-generated target day into the existing structure.
    const fresh = generateLocally(brief);
    const replacement = fresh.days.find((d) => d.dayIndex === dayIndex);
    next = {
      ...itinerary,
      days: itinerary.days.map((d) => (d.dayIndex === dayIndex && replacement ? replacement : d)),
    };
  }

  next = enforceConstraints(next, brief);
  next = await geocodeItinerary(next);
  next = attachPrices(next);
  return next;
}

// ─── Claude path ─────────────────────────────────────────────────────────────

async function generateWithClaude(brief: TripBrief, opts: GenerateOptions): Promise<Itinerary> {
  const userPrompt = buildUserPrompt(brief);
  return callClaudeForItinerary(userPrompt, opts);
}

async function callClaudeForItinerary(
  userPrompt: string,
  opts: GenerateOptions,
): Promise<Itinerary> {
  const client = new Anthropic({ apiKey: config.ANTHROPIC_API_KEY });
  const model = opts.model ?? config.AI_MODEL;
  const system = buildSystemPrompt();

  const first = await requestClaudeJson(client, model, system, userPrompt);
  const parsed = ItinerarySchema.safeParse(first.json);
  if (parsed.success) return parsed.data;

  // ONE repair retry: hand the model its own output plus the validation errors.
  const repairPrompt = [
    'Your previous response did not match the required JSON schema.',
    'Validation errors:',
    JSON.stringify(parsed.error.issues, null, 2),
    '',
    'Here is what you returned:',
    first.raw,
    '',
    'Return a corrected JSON object that matches the schema exactly. JSON only.',
  ].join('\n');

  const second = await requestClaudeJson(client, model, system, repairPrompt);
  const reparsed = ItinerarySchema.parse(second.json); // throw if still invalid
  return reparsed;
}

async function requestClaudeJson(
  client: Anthropic,
  model: string,
  system: string,
  userPrompt: string,
): Promise<{ json: unknown; raw: string }> {
  const message = await client.messages.create({
    model,
    max_tokens: 4096,
    system,
    messages: [{ role: 'user', content: userPrompt }],
  });

  const raw = message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  return { json: extractJson(raw), raw };
}

/** Pull the first JSON object out of a model response, tolerating fences/prose. */
function extractJson(raw: string): unknown {
  const trimmed = raw.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  const slice = start >= 0 && end > start ? candidate.slice(start, end + 1) : candidate;
  try {
    return JSON.parse(slice);
  } catch {
    return null;
  }
}

// ─── Local deterministic generator (no-key fallback) ───────────────────────────

interface CityActivityTemplate {
  timeSlot: string;
  title: (city: string) => string;
  category: string;
  isFood?: boolean;
  rationale: string;
}

const DAY_TEMPLATES: CityActivityTemplate[] = [
  {
    timeSlot: 'morning',
    title: (c) => `Old town walking tour of ${c}`,
    category: 'sight',
    rationale: 'A gentle orientation walk to get the lay of the land.',
  },
  {
    timeSlot: 'afternoon',
    title: (c) => `Lunch at a local spot in ${c}`,
    category: 'food',
    isFood: true,
    rationale: 'A midday meal chosen to fit the group’s dietary needs.',
  },
  {
    timeSlot: 'afternoon',
    title: (c) => `Visit a landmark museum in ${c}`,
    category: 'activity',
    rationale: 'A signature cultural highlight for the city.',
  },
  {
    timeSlot: 'evening',
    title: (c) => `Dinner & stroll in ${c}`,
    category: 'food',
    isFood: true,
    rationale: 'An evening meal and relaxed walk to close the day.',
  },
];

const DIET_LABEL: Record<string, string> = {
  veg: 'vegetarian',
  nonveg: 'non-vegetarian',
  egg: 'eggetarian',
};

const OCCASION_TOUCH: Record<string, { title: string; rationale: string }> = {
  birthday: {
    title: 'Birthday celebration dinner',
    rationale: 'A special birthday dinner to mark the occasion.',
  },
  anniversary: {
    title: 'Anniversary sunset experience',
    rationale: 'A romantic sunset moment for the anniversary.',
  },
  honeymoon: {
    title: 'Honeymoon couples experience',
    rationale: 'An intimate experience tailored to honeymooners.',
  },
  bachelorette: {
    title: 'Bachelorette night out',
    rationale: 'A lively evening to celebrate the bachelorette.',
  },
};

function dietLabel(diet: TripBrief['diet']): string | null {
  if (!diet.length) return null;
  return diet.map((d) => DIET_LABEL[d] ?? d).join(' / ');
}

function generateLocally(brief: TripBrief): Itinerary {
  const perDay = PACE_ACTIVITY_COUNT[brief.pace];
  const diet = dietLabel(brief.diet);
  const midBudget = (brief.budgetPerNight.min + brief.budgetPerNight.max) / 2;
  const start = parseISO(brief.startDate);

  const days: ItineraryDay[] = [];
  let dayIndex = 0;

  for (const cityNode of brief.route) {
    const nights = Math.max(1, cityNode.nights || 1);
    for (let n = 0; n < nights; n++) {
      const activities = buildLocalActivities(cityNode.city, perDay, diet, midBudget);
      days.push({
        dayIndex,
        date: start ? addDaysISO(start, dayIndex) : undefined,
        city: cityNode.city,
        country: cityNode.country,
        summary: `Day ${dayIndex + 1} in ${cityNode.city}`,
        activities,
      });
      dayIndex++;
    }
  }

  const accommodations: ItineraryAccommodation[] = brief.route.map((c) => ({
    city: c.city,
    name: `${capitalize(brief.accommodationType)} stay in ${c.city}`,
    type: brief.accommodationType,
    pricePerNight: Math.round(midBudget),
  }));

  const estTotalCost = days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + (a.estCost ?? 0), 0),
    0,
  );

  return {
    title: buildTitle(brief),
    currency: brief.currency,
    days,
    accommodations,
    estTotalCost: Math.round(estTotalCost),
  };
}

function buildLocalActivities(
  city: string,
  perDay: number,
  diet: string | null,
  midBudget: number,
): ItineraryActivity[] {
  // Per-activity cost so a day's activity spend lands inside the nightly band.
  const perActivityCost = Math.round((midBudget * 0.6) / perDay);
  const out: ItineraryActivity[] = [];

  for (let i = 0; i < perDay; i++) {
    const tpl = DAY_TEMPLATES[i % DAY_TEMPLATES.length];
    let title = tpl.title(city);
    let rationale = tpl.rationale;

    if (tpl.isFood && diet) {
      title = `${title} (${diet})`;
      rationale = `${rationale} Chosen to respect a ${diet} diet.`;
    }

    out.push({
      timeSlot: tpl.timeSlot,
      title,
      description: undefined,
      category: tpl.category,
      place: city,
      estCost: perActivityCost,
      aiRationale: rationale,
    });
  }

  return out;
}

function buildTitle(brief: TripBrief): string {
  const cities = brief.route.map((c) => c.city);
  const head = cities.slice(0, 2).join(' & ');
  const suffix = brief.occasion ? ` — ${capitalize(brief.occasion)}` : '';
  return `${head}${cities.length > 2 ? ' & more' : ''} Trip${suffix}`;
}

// ─── Constraint enforcement (deterministic post-process) ───────────────────────

function enforceConstraints(itinerary: Itinerary, brief: TripBrief): Itinerary {
  const perDay = PACE_ACTIVITY_COUNT[brief.pace];
  const diet = dietLabel(brief.diet);
  const occasion = brief.occasion ?? null;
  const dietLabels = Object.values(DIET_LABEL);

  const days = itinerary.days.map((day) => {
    let activities = [...day.activities];

    // 1) Diet: label food activities so the restriction is explicit.
    if (diet) {
      activities = activities.map((a) => {
        if (a.category !== 'food') return a;
        const alreadyLabeled = dietLabels.some((l) => a.title.toLowerCase().includes(l));
        if (alreadyLabeled) return a;
        return {
          ...a,
          title: `${a.title} (${diet})`,
          aiRationale: `${a.aiRationale ?? ''} Filtered for a ${diet} diet.`.trim(),
        };
      });
    }

    // 2) Pace: clamp/pad to the exact activities-per-day for this pace.
    if (activities.length > perDay) {
      activities = activities.slice(0, perDay);
    } else if (activities.length < perDay) {
      activities = padActivities(activities, perDay, day.city, brief);
    }

    // 3) Budget: keep the day's activity spend within the nightly band where possible.
    activities = clampDailyCost(activities, brief);

    return { ...day, activities };
  });

  // 4) Occasion: ensure at least one occasion-specific item exists somewhere.
  if (occasion && OCCASION_TOUCH[occasion]) {
    const touch = OCCASION_TOUCH[occasion];
    const present = days.some((d) =>
      d.activities.some((a) => a.title.toLowerCase().includes(occasion)),
    );
    if (!present && days.length > 0) {
      const last = days[days.length - 1];
      const occActivity: ItineraryActivity = {
        timeSlot: 'evening',
        title: touch.title,
        category: 'activity',
        place: last.city,
        estCost: Math.round((brief.budgetPerNight.min + brief.budgetPerNight.max) / 2 / perDay),
        aiRationale: touch.rationale,
      };
      // Swap the last activity for the occasion item to preserve pace count.
      const activities = [...last.activities];
      if (activities.length >= perDay) activities[activities.length - 1] = occActivity;
      else activities.push(occActivity);
      days[days.length - 1] = { ...last, activities };
    }
  }

  const estTotalCost = days.reduce(
    (sum, d) => sum + d.activities.reduce((s, a) => s + (a.estCost ?? 0), 0),
    0,
  );

  return { ...itinerary, days, estTotalCost: Math.round(estTotalCost) };
}

function padActivities(
  activities: ItineraryActivity[],
  target: number,
  city: string,
  brief: TripBrief,
): ItineraryActivity[] {
  const out = [...activities];
  const perActivityCost = Math.round(
    ((brief.budgetPerNight.min + brief.budgetPerNight.max) / 2) * 0.6 / target,
  );
  let i = out.length;
  while (out.length < target) {
    const tpl = DAY_TEMPLATES[i % DAY_TEMPLATES.length];
    out.push({
      timeSlot: tpl.timeSlot,
      title: tpl.title(city),
      category: tpl.category,
      place: city,
      estCost: perActivityCost,
      aiRationale: tpl.rationale,
    });
    i++;
  }
  return out;
}

/**
 * Scale the day's activity costs down proportionally if the total exceeds the
 * nightly budget max. We never scale up — under budget is fine.
 */
function clampDailyCost(
  activities: ItineraryActivity[],
  brief: TripBrief,
): ItineraryActivity[] {
  const max = brief.budgetPerNight.max;
  if (!Number.isFinite(max) || max <= 0) return activities;

  const total = activities.reduce((s, a) => s + (a.estCost ?? 0), 0);
  if (total <= max || total <= 0) return activities;

  const factor = max / total;
  return activities.map((a) =>
    a.estCost != null ? { ...a, estCost: Math.round(a.estCost * factor) } : a,
  );
}

// ─── Geocoding + price enrichment ──────────────────────────────────────────────

async function geocodeItinerary(itinerary: Itinerary): Promise<Itinerary> {
  // Geocode at city granularity (cheap + cache-friendly), reused per activity.
  const cityCache = new Map<string, { lat: number; lng: number } | null>();

  const resolveCity = async (city: string, country: string) => {
    const key = `${city}, ${country}`;
    if (cityCache.has(key)) return cityCache.get(key) ?? null;
    const point = await geocodePlace(key);
    cityCache.set(key, point);
    return point;
  };

  const days: ItineraryDay[] = [];
  for (const day of itinerary.days) {
    const cityPoint = await resolveCity(day.city, day.country);
    const activities: ItineraryActivity[] = [];
    for (const a of day.activities) {
      if (a.lat != null && a.lng != null) {
        activities.push(a);
        continue;
      }
      let point = cityPoint;
      if (a.place && a.place !== day.city) {
        point = (await geocodePlace(`${a.place}, ${day.city}, ${day.country}`)) ?? cityPoint;
      }
      activities.push(point ? { ...a, lat: point.lat, lng: point.lng } : a);
    }
    days.push({ ...day, activities });
  }

  // Geocode accommodation cities best-effort.
  const accommodations: ItineraryAccommodation[] = [];
  for (const acc of itinerary.accommodations) {
    if (acc.lat != null && acc.lng != null) {
      accommodations.push(acc);
      continue;
    }
    const point = cityCache.get(`${acc.city}, `) ?? (await geocodePlace(acc.city));
    accommodations.push(point ? { ...acc, lat: point.lat, lng: point.lng } : acc);
  }

  return { ...itinerary, days, accommodations };
}

function attachPrices(itinerary: Itinerary): Itinerary {
  const accommodations = itinerary.accommodations.map((acc) => {
    if (acc.pricePerNight == null || acc.pricePerNight <= 0) return acc;
    return { ...acc, options: simulatePrices(acc.pricePerNight, itinerary.currency) };
  });
  return { ...itinerary, accommodations };
}

// ─── Small date/string helpers ────────────────────────────────────────────────

function parseISO(s: string): Date | null {
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t) : null;
}

function addDaysISO(base: Date, days: number): string {
  const d = new Date(base.getTime());
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function capitalize(s: string): string {
  return s.length ? s[0].toUpperCase() + s.slice(1) : s;
}
