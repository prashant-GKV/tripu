import { useWizardStore, TRAVELER_RANGES } from '../../stores/wizardStore';
import type { TravelerComposition } from '../../types/trip';
import Counter from './Counter';
import OccasionChips from './OccasionChips';

/** Counter rows, in display order, with friendly hints. */
const TRAVELER_ROWS: { key: keyof TravelerComposition; label: string; hint: string }[] = [
  { key: 'adults', label: 'Adults', hint: 'Ages 18+' },
  { key: 'children', label: 'Children', hint: 'Ages 2–17' },
  { key: 'infants', label: 'Infants', hint: 'Under 2' },
  { key: 'elders', label: 'Elders', hint: 'Need a gentler pace' },
];

/** Step 1 · WHO is travelling — composition counters + optional occasion. */
export default function StepWho() {
  const travelers = useWizardStore((s) => s.travelers);
  const setTravelerCount = useWizardStore((s) => s.setTravelerCount);
  const occasion = useWizardStore((s) => s.occasion);
  const setOccasion = useWizardStore((s) => s.setOccasion);

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-grotesk text-2xl font-bold text-aurora-text sm:text-3xl">
          Who's coming along?
        </h2>
        <p className="mt-1.5 text-sm text-aurora-muted">
          Tell us the crew so we can size rooms, pace, and activities just right.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {TRAVELER_ROWS.map((row) => (
          <Counter
            key={row.key}
            label={row.label}
            hint={row.hint}
            value={travelers[row.key]}
            min={TRAVELER_RANGES[row.key].min}
            max={TRAVELER_RANGES[row.key].max}
            onChange={(v) => setTravelerCount(row.key, v)}
          />
        ))}
      </div>

      <div>
        <h3 className="mb-3 font-grotesk text-sm font-medium text-aurora-text">
          Any special occasion? <span className="text-aurora-dim">(optional)</span>
        </h3>
        <OccasionChips value={occasion} onChange={setOccasion} />
      </div>
    </div>
  );
}
