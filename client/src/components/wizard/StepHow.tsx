import { Building2, Home, BedDouble, Sparkles } from 'lucide-react';
import { useWizardStore } from '../../stores/wizardStore';
import type { AccommodationType, Pace, Diet } from '../../types/trip';
import Chip from './Chip';
import { cn } from '../../lib/cn';

const ACCOMMODATION: { value: AccommodationType; label: string; icon: React.ReactNode }[] = [
  { value: 'hotel', label: 'Hotel', icon: <Building2 size={15} /> },
  { value: 'apartment', label: 'Apartment', icon: <Home size={15} /> },
  { value: 'hostel', label: 'Hostel', icon: <BedDouble size={15} /> },
  { value: 'unique', label: 'Unique stay', icon: <Sparkles size={15} /> },
];

const PACES: { value: Pace; label: string; hint: string }[] = [
  { value: 'relaxed', label: 'Relaxed', hint: 'Slow mornings, room to breathe' },
  { value: 'balanced', label: 'Balanced', hint: 'A mix of sights and downtime' },
  { value: 'packed', label: 'Packed', hint: 'See as much as possible' },
];

const DIETS: { value: Diet; label: string; icon: string }[] = [
  { value: 'veg', label: 'Vegetarian', icon: '🥗' },
  { value: 'nonveg', label: 'Non-veg', icon: '🍖' },
  { value: 'egg', label: 'Eggetarian', icon: '🥚' },
];

const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'INR', 'AUD', 'CAD', 'SGD'];

/** Step 4 · HOW — stay style, budget, pace, diet, and free-text wishes. */
export default function StepHow() {
  const accommodationType = useWizardStore((s) => s.accommodationType);
  const setAccommodationType = useWizardStore((s) => s.setAccommodationType);
  const budgetMin = useWizardStore((s) => s.budgetMin);
  const budgetMax = useWizardStore((s) => s.budgetMax);
  const setBudget = useWizardStore((s) => s.setBudget);
  const currency = useWizardStore((s) => s.currency);
  const setCurrency = useWizardStore((s) => s.setCurrency);
  const pace = useWizardStore((s) => s.pace);
  const setPace = useWizardStore((s) => s.setPace);
  const diet = useWizardStore((s) => s.diet);
  const toggleDiet = useWizardStore((s) => s.toggleDiet);
  const interests = useWizardStore((s) => s.interests);
  const setInterests = useWizardStore((s) => s.setInterests);

  const budgetInvalid = budgetMax < budgetMin;

  return (
    <div className="space-y-8">
      <header>
        <h2 className="font-grotesk text-2xl font-bold text-aurora-text sm:text-3xl">
          How do you like to travel?
        </h2>
        <p className="mt-1.5 text-sm text-aurora-muted">
          A few preferences help the AI tailor stays, food, and the daily rhythm.
        </p>
      </header>

      {/* Accommodation */}
      <Section title="Where you'll stay">
        <div className="flex flex-wrap gap-2.5">
          {ACCOMMODATION.map((a) => (
            <Chip
              key={a.value}
              label={a.label}
              icon={a.icon}
              selected={accommodationType === a.value}
              onClick={() => setAccommodationType(a.value)}
            />
          ))}
        </div>
      </Section>

      {/* Budget per night */}
      <Section title="Budget per night">
        <div className="flex flex-wrap items-end gap-3">
          <MoneyInput
            label="Min"
            value={budgetMin}
            onChange={(v) => setBudget(v, budgetMax)}
          />
          <span className="pb-2.5 text-aurora-dim">—</span>
          <MoneyInput
            label="Max"
            value={budgetMax}
            onChange={(v) => setBudget(budgetMin, v)}
          />
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-aurora-dim">
              Currency
            </span>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="rounded-2xl border border-aurora-line bg-white/[0.03] px-3 py-2.5 text-sm text-aurora-text outline-none transition-colors focus:border-aurora-cyan/50"
            >
              {CURRENCIES.map((c) => (
                <option key={c} value={c} className="bg-aurora-night text-aurora-text">
                  {c}
                </option>
              ))}
            </select>
          </label>
        </div>
        {budgetInvalid && (
          <p className="mt-2 text-xs text-aurora-coral">Max should be at least the minimum.</p>
        )}
      </Section>

      {/* Pace */}
      <Section title="Daily pace">
        <div className="grid gap-2.5 sm:grid-cols-3">
          {PACES.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => setPace(p.value)}
              aria-pressed={pace === p.value}
              className={cn(
                'rounded-2xl border px-4 py-3 text-left transition-all',
                pace === p.value
                  ? 'border-aurora-cyan/60 bg-aurora-cyan/10 shadow-glow-cyan'
                  : 'border-aurora-line bg-white/[0.03] hover:border-white/25',
              )}
            >
              <div className="font-grotesk text-sm font-semibold text-aurora-text">{p.label}</div>
              <div className="mt-0.5 text-xs text-aurora-dim">{p.hint}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Diet */}
      <Section title="Dietary preferences" optional>
        <div className="flex flex-wrap gap-2.5">
          {DIETS.map((d) => (
            <Chip
              key={d.value}
              label={d.label}
              icon={d.icon}
              showTick
              selected={diet.includes(d.value)}
              onClick={() => toggleDiet(d.value)}
            />
          ))}
        </div>
      </Section>

      {/* Free text */}
      <Section title="Tell us what you want" optional>
        <textarea
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          rows={4}
          placeholder="Hidden gems, great coffee, museums, hikes, nightlife, kid-friendly… anything goes."
          className="w-full resize-none rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-3 text-sm text-aurora-text placeholder:text-aurora-dim outline-none transition-colors focus:border-aurora-cyan/50 focus:bg-white/[0.05]"
        />
      </Section>
    </div>
  );
}

function Section({
  title,
  optional,
  children,
}: {
  title: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="mb-3 font-grotesk text-sm font-medium text-aurora-text">
        {title}
        {optional && <span className="ml-1.5 text-aurora-dim">(optional)</span>}
      </h3>
      {children}
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-aurora-dim">
        {label}
      </span>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Math.max(0, Number(e.target.value) || 0))}
        className="w-28 rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-2.5 text-sm text-aurora-text outline-none transition-colors focus:border-aurora-cyan/50 focus:bg-white/[0.05]"
      />
    </label>
  );
}
