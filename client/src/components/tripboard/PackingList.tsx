import { useMemo, useState } from 'react';
import { Backpack, Check } from 'lucide-react';
import type { Trip } from '../../types/trip';

interface PackingListProps {
  trip: Trip;
}

/**
 * Heuristic, client-side packing list — no API. Derives items from trip length,
 * destinations (cold/beach/city keywords), occasion and accommodation type.
 * Checkbox state is local-only (resets on reload) — purely a planning aid.
 */
function buildPackingList(trip: Trip): { group: string; items: string[] }[] {
  const days = trip.itinerary?.days ?? [];
  const length = days.length || 1;
  const cities = days.map((d) => `${d.city} ${d.country}`).join(' ').toLowerCase();
  const interests = (trip.brief?.interests ?? '').toLowerCase();
  const occasion = (trip.occasion ?? trip.brief?.occasion ?? '').toString().toLowerCase();
  const blob = `${cities} ${interests}`;

  const essentials = [
    'Passport / ID',
    'Phone + charger',
    'Travel adapter',
    'Payment cards & some cash',
    'Reusable water bottle',
    'Basic medkit & meds',
  ];

  const clothing = [
    `${Math.min(length + 2, 14)} tops`,
    `${Math.ceil(length / 2) + 1} bottoms`,
    'Underwear & socks',
    'Comfortable walking shoes',
    'Light jacket',
  ];

  if (/(beach|island|bali|maldi|coast|tropic|goa)/.test(blob)) {
    clothing.push('Swimwear', 'Sandals / flip-flops', 'Sunscreen', 'Sunglasses', 'Hat');
  }
  if (/(iceland|patagonia|alps|mountain|trek|hike|snow|winter|ski|nordic|himalaya)/.test(blob)) {
    clothing.push('Warm layers / thermals', 'Waterproof jacket', 'Hiking boots', 'Gloves & beanie');
  }
  if (/(kyoto|tokyo|paris|rome|london|city|museum|temple|culture)/.test(blob)) {
    clothing.push('One smart-casual outfit', 'Day bag for sightseeing');
  }

  const tech = ['Power bank', 'Headphones', 'Offline maps downloaded'];
  if (/(photo|camera|scenic|safari)/.test(blob)) tech.push('Camera + spare battery');

  const groups: { group: string; items: string[] }[] = [
    { group: 'Essentials', items: essentials },
    { group: 'Clothing', items: clothing },
    { group: 'Tech', items: tech },
  ];

  if (/(honeymoon|anniversary|birthday|bachelorette)/.test(occasion)) {
    groups.push({
      group: 'For the occasion',
      items: ['One dressy outfit', 'Small gift / surprise', 'Camera for the moment'],
    });
  }

  return groups;
}

export default function PackingList({ trip }: PackingListProps) {
  const groups = useMemo(() => buildPackingList(trip), [trip]);
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const total = groups.reduce((s, g) => s + g.items.length, 0);
  const done = checked.size;

  function toggle(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Backpack size={16} className="text-aurora-cyan" />
          <h3 className="font-grotesk text-sm font-semibold uppercase tracking-wide text-aurora-text">
            Packing list
          </h3>
        </div>
        <span className="text-[11px] text-aurora-dim">
          {done}/{total}
        </span>
      </div>

      <div className="space-y-4">
        {groups.map((g) => (
          <div key={g.group}>
            <p className="mb-1.5 text-[11px] uppercase tracking-wide text-aurora-dim">{g.group}</p>
            <ul className="space-y-1">
              {g.items.map((item) => {
                const key = `${g.group}:${item}`;
                const isChecked = checked.has(key);
                return (
                  <li key={key}>
                    <button
                      type="button"
                      onClick={() => toggle(key)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-1 py-1 text-left text-sm transition-colors hover:bg-white/5"
                    >
                      <span
                        className={
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ' +
                          (isChecked
                            ? 'border-aurora-cyan bg-aurora-cyan text-aurora-deep'
                            : 'border-aurora-line bg-transparent')
                        }
                      >
                        {isChecked && <Check size={11} strokeWidth={3} />}
                      </span>
                      <span className={isChecked ? 'text-aurora-dim line-through' : 'text-aurora-muted'}>
                        {item}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
