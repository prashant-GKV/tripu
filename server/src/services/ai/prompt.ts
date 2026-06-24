import type { TripBrief, Itinerary } from '../../schemas/trip.js';

/**
 * Prompt construction for the Claude-backed itinerary engine.
 * OWNER: server-ai agent.
 *
 * The model is asked to return ONLY JSON matching `ItinerarySchema`. We keep the
 * schema description inline so the prompt is self-contained and version-locked to
 * the contract in schemas/trip.ts.
 */

const ITINERARY_JSON_SHAPE = `{
  "title": string,
  "currency": string,
  "days": [
    {
      "dayIndex": number,            // 0-based
      "date": string (optional, ISO date),
      "city": string,
      "country": string,
      "summary": string (optional),
      "activities": [
        {
          "timeSlot": string,        // "morning" | "afternoon" | "evening" | "09:00"
          "title": string,
          "description": string (optional),
          "category": string,        // "food" | "sight" | "activity" | "transport" | "rest"
          "place": string (optional, a real geocodable place name),
          "estCost": number (optional, per-person cost in the trip currency),
          "aiRationale": string (optional, one sentence: why this fits the brief)
        }
      ]
    }
  ],
  "accommodations": [
    { "city": string, "name": string, "type": string, "pricePerNight": number (optional) }
  ],
  "estTotalCost": number (optional)
}`;

const PACE_GUIDANCE: Record<TripBrief['pace'], string> = {
  relaxed: 'RELAXED pace: exactly 2 activities per day, with plenty of downtime.',
  balanced: 'BALANCED pace: exactly 3 activities per day.',
  packed: 'PACKED pace: exactly 4 activities per day, energetic schedule.',
};

export function buildSystemPrompt(): string {
  return [
    'You are Tripu\'s itinerary engine: an expert, constraint-aware travel planner.',
    'You produce structured, editable, map-friendly day-by-day itineraries.',
    'You MUST respond with a SINGLE JSON object and nothing else — no prose, no',
    'markdown fences. The JSON MUST conform exactly to this shape:',
    '',
    ITINERARY_JSON_SHAPE,
    '',
    'Rules:',
    '- One day per night across the route, in order. Allocate days to cities by their night counts.',
    '- Respect the requested pace (activities-per-day) precisely.',
    '- Respect dietary restrictions in every food activity and say so in aiRationale.',
    '- Keep per-day estimated cost within the nightly budget band where feasible.',
    '- If an occasion is provided, include at least one occasion-specific moment.',
    '- Prefer real, geocodable place names for the "place" field.',
    '- Every activity should have a one-sentence aiRationale for transparency.',
  ].join('\n');
}

function describeTravelers(t: TripBrief['travelers']): string {
  const parts: string[] = [];
  if (t.adults) parts.push(`${t.adults} adult(s)`);
  if (t.children) parts.push(`${t.children} child(ren)`);
  if (t.infants) parts.push(`${t.infants} infant(s)`);
  if (t.elders) parts.push(`${t.elders} elder(s)`);
  return parts.length ? parts.join(', ') : '1 traveler';
}

export function buildUserPrompt(brief: TripBrief): string {
  const route = brief.route
    .map((c) => `${c.city}, ${c.country} (${c.nights} night${c.nights === 1 ? '' : 's'})`)
    .join(' → ');

  const diet = brief.diet.length ? brief.diet.join(', ') : 'no restrictions';
  const occasion = brief.occasion ? brief.occasion : 'none';

  return [
    'Plan a trip with this brief:',
    `- Travelers: ${describeTravelers(brief.travelers)}`,
    `- Occasion: ${occasion}`,
    `- Dates: ${brief.startDate} to ${brief.endDate}`,
    brief.departureCity ? `- Departing from: ${brief.departureCity}` : null,
    `- Route: ${route}`,
    `- Accommodation type: ${brief.accommodationType}`,
    `- Budget per night: ${brief.budgetPerNight.min}–${brief.budgetPerNight.max} ${brief.budgetPerNight.currency}`,
    `- ${PACE_GUIDANCE[brief.pace]}`,
    `- Diet: ${diet}`,
    `- Interests / free text: ${brief.interests || '(none provided)'}`,
    `- Currency for all costs: ${brief.currency}`,
    '',
    'Return ONLY the JSON itinerary object.',
  ]
    .filter(Boolean)
    .join('\n');
}

/**
 * Scoped prompt for regenerating a single day, with the rest of the trip as
 * read-only context and constraints locked.
 */
export function buildRegenerateDayUserPrompt(
  brief: TripBrief,
  itinerary: Itinerary,
  dayIndex: number,
): string {
  const target = itinerary.days.find((d) => d.dayIndex === dayIndex);
  const context = itinerary.days
    .filter((d) => d.dayIndex !== dayIndex)
    .map((d) => `Day ${d.dayIndex} (${d.city}): ${d.activities.map((a) => a.title).join('; ')}`)
    .join('\n');

  return [
    buildUserPrompt(brief),
    '',
    `Regenerate ONLY day index ${dayIndex} (${target?.city ?? ''}, ${target?.country ?? ''}).`,
    'Keep the same city, country, dayIndex and date; produce fresh activities that',
    'still respect the pace, budget, diet and occasion constraints above.',
    'The rest of the trip (do not repeat its highlights) is:',
    context || '(no other days)',
    '',
    'Return ONLY the full JSON itinerary object with the regenerated day swapped in.',
  ].join('\n');
}
