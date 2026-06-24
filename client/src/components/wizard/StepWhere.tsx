import { useState } from 'react';
import { MapPin, Plane, Plus, Trash2, ChevronUp, ChevronDown, GripVertical } from 'lucide-react';
import { useWizardStore } from '../../stores/wizardStore';
import type { RouteCity } from '../../types/trip';
import NightsStepper from './NightsStepper';
import { cn } from '../../lib/cn';

/** Step 3 · WHERE — build a multi-city route with nights per stop. */
export default function StepWhere() {
  const route = useWizardStore((s) => s.route);
  const addCity = useWizardStore((s) => s.addCity);
  const removeCity = useWizardStore((s) => s.removeCity);
  const setCityNights = useWizardStore((s) => s.setCityNights);
  const moveCity = useWizardStore((s) => s.moveCity);
  const departureCity = useWizardStore((s) => s.departureCity);
  const setDepartureCity = useWizardStore((s) => s.setDepartureCity);

  const [cityInput, setCityInput] = useState('');
  const [countryInput, setCountryInput] = useState('');

  const totalNights = route.reduce((sum, c) => sum + c.nights, 0);

  const handleAdd = () => {
    const city = cityInput.trim();
    const country = countryInput.trim();
    if (!city) return;
    const next: RouteCity = { city, country, nights: 2 };
    addCity(next);
    setCityInput('');
    setCountryInput('');
  };

  return (
    <div className="space-y-7">
      <header>
        <h2 className="font-grotesk text-2xl font-bold text-aurora-text sm:text-3xl">
          Where do you want to go?
        </h2>
        <p className="mt-1.5 text-sm text-aurora-muted">
          Add one or more cities and set how many nights you'll spend in each. Reorder to shape your route.
        </p>
      </header>

      {/* Optional departure city */}
      <label className="block">
        <span className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-aurora-dim">
          <Plane size={13} /> Departing from <span className="lowercase tracking-normal">(optional)</span>
        </span>
        <input
          type="text"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
          placeholder="e.g. New York"
          className={inputClass}
        />
      </label>

      {/* Add-city composer */}
      <div className="rounded-3xl border border-aurora-line bg-white/[0.02] p-4">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            type="text"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="City — e.g. Kyoto"
            className={cn(inputClass, 'flex-1')}
            aria-label="City"
          />
          <input
            type="text"
            value={countryInput}
            onChange={(e) => setCountryInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Country — e.g. Japan"
            className={cn(inputClass, 'flex-1')}
            aria-label="Country"
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={!cityInput.trim()}
            className="btn-aurora shrink-0 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
          >
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      {/* Route list */}
      {route.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-3xl border border-dashed border-aurora-line py-10 text-center">
          <MapPin size={22} className="text-aurora-dim" />
          <p className="text-sm text-aurora-muted">No stops yet — add your first city above.</p>
        </div>
      ) : (
        <ul className="space-y-2.5">
          {route.map((c, i) => (
            <li
              key={`${c.city}-${i}`}
              className="flex items-center gap-3 rounded-2xl border border-aurora-line bg-white/[0.03] px-3 py-2.5"
            >
              {/* Order badge + drag affordance (reordering via buttons) */}
              <div className="flex items-center gap-1.5 text-aurora-dim">
                <GripVertical size={15} aria-hidden />
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-aurora-cyan/10 text-xs font-semibold text-aurora-cyan">
                  {i + 1}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="truncate font-grotesk text-sm font-medium text-aurora-text">{c.city}</div>
                {c.country && <div className="truncate text-xs text-aurora-dim">{c.country}</div>}
              </div>

              <NightsStepper nights={c.nights} onChange={(n) => setCityNights(i, n)} />

              {/* Reorder up/down */}
              <div className="flex flex-col">
                <IconBtn onClick={() => moveCity(i, -1)} disabled={i === 0} label="Move up">
                  <ChevronUp size={15} />
                </IconBtn>
                <IconBtn onClick={() => moveCity(i, 1)} disabled={i === route.length - 1} label="Move down">
                  <ChevronDown size={15} />
                </IconBtn>
              </div>

              <IconBtn onClick={() => removeCity(i)} label="Remove city" danger>
                <Trash2 size={15} />
              </IconBtn>
            </li>
          ))}
        </ul>
      )}

      {/* Running nights counter */}
      {route.length > 0 && (
        <div className="flex items-center justify-end gap-2 text-sm">
          <span className="text-aurora-muted">Nights assigned:</span>
          <span className="rounded-full bg-aurora-cyan/10 px-3 py-1 font-semibold text-aurora-cyan">
            {totalNights} {totalNights === 1 ? 'night' : 'nights'} · {route.length}{' '}
            {route.length === 1 ? 'city' : 'cities'}
          </span>
        </div>
      )}
    </div>
  );
}

const inputClass =
  'w-full rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-2.5 text-sm text-aurora-text placeholder:text-aurora-dim outline-none transition-colors focus:border-aurora-cyan/50 focus:bg-white/[0.05]';

function IconBtn({
  children,
  onClick,
  disabled,
  label,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-lg text-aurora-muted transition-colors',
        danger ? 'hover:bg-aurora-coral/15 hover:text-aurora-coral' : 'hover:bg-white/10 hover:text-aurora-text',
        'disabled:cursor-not-allowed disabled:opacity-25 disabled:hover:bg-transparent disabled:hover:text-aurora-muted',
      )}
    >
      {children}
    </button>
  );
}
