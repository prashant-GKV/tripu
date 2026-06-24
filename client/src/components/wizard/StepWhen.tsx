import { useMemo } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import { format, parseISO, differenceInCalendarDays } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { useWizardStore } from '../../stores/wizardStore';
import { cn } from '../../lib/cn';

const ISO = 'yyyy-MM-dd';

/**
 * Tailwind-driven theme for react-day-picker. We can't import the library's
 * stylesheet here (it ships as Sass and index.css is off-limits), so every
 * visible part is styled via the `classNames` map using the library's UI keys.
 */
const dayPickerClassNames: Record<string, string> = {
  root: 'text-aurora-text',
  months: 'flex justify-center',
  month: 'space-y-3',
  month_caption: 'flex items-center justify-center h-9 font-grotesk font-semibold',
  caption_label: 'text-sm',
  nav: 'absolute inset-x-0 top-0 flex items-center justify-between px-1',
  button_previous:
    'h-8 w-8 inline-flex items-center justify-center rounded-full border border-aurora-line bg-white/[0.03] text-aurora-muted hover:text-aurora-cyan hover:border-aurora-cyan/50 transition-colors',
  button_next:
    'h-8 w-8 inline-flex items-center justify-center rounded-full border border-aurora-line bg-white/[0.03] text-aurora-muted hover:text-aurora-cyan hover:border-aurora-cyan/50 transition-colors',
  chevron: 'fill-current',
  month_grid: 'w-full border-collapse',
  weekdays: 'flex',
  weekday: 'w-9 text-xs font-medium text-aurora-dim',
  week: 'flex w-full mt-1',
  day: 'w-9 h-9 text-sm p-0',
  day_button:
    'w-9 h-9 inline-flex items-center justify-center rounded-full text-aurora-text hover:bg-white/10 transition-colors',
  today: 'font-bold text-aurora-cyan',
  outside: 'text-aurora-dim/40',
  disabled: 'opacity-30 cursor-not-allowed',
  selected: 'text-aurora-deep',
  range_start:
    '[&>button]:bg-gradient-to-r [&>button]:from-aurora-cyan [&>button]:to-aurora-violet [&>button]:text-aurora-deep [&>button]:font-semibold',
  range_end:
    '[&>button]:bg-gradient-to-r [&>button]:from-aurora-cyan [&>button]:to-aurora-violet [&>button]:text-aurora-deep [&>button]:font-semibold',
  range_middle:
    'bg-aurora-cyan/15 [&>button]:rounded-none [&>button]:bg-transparent [&>button]:text-aurora-text',
};

/** Step 2 · WHEN — pick the trip's date range. */
export default function StepWhen() {
  const startDate = useWizardStore((s) => s.startDate);
  const endDate = useWizardStore((s) => s.endDate);
  const setDateRange = useWizardStore((s) => s.setDateRange);

  // Mirror the store's ISO strings into a DateRange for the picker.
  const selected = useMemo<DateRange | undefined>(() => {
    if (!startDate) return undefined;
    return {
      from: parseISO(startDate),
      to: endDate ? parseISO(endDate) : undefined,
    };
  }, [startDate, endDate]);

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(
      range?.from ? format(range.from, ISO) : null,
      range?.to ? format(range.to, ISO) : null,
    );
  };

  // Trip length in nights, for the summary line.
  const nights =
    startDate && endDate ? differenceInCalendarDays(parseISO(endDate), parseISO(startDate)) : 0;

  // Disable past dates — you can't plan a trip into the past.
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="space-y-7">
      <header>
        <h2 className="font-grotesk text-2xl font-bold text-aurora-text sm:text-3xl">
          When are you travelling?
        </h2>
        <p className="mt-1.5 text-sm text-aurora-muted">
          Pick your start and end dates — tap a day to start, then tap again to set the return.
        </p>
      </header>

      {/* Selected-range summary */}
      <div className="flex flex-wrap items-center gap-3">
        <DateBadge label="Depart" value={startDate ? format(parseISO(startDate), 'EEE, MMM d') : null} />
        <span className="text-aurora-dim">→</span>
        <DateBadge label="Return" value={endDate ? format(parseISO(endDate), 'EEE, MMM d') : null} />
        {nights > 0 && (
          <span className="rounded-full bg-aurora-cyan/10 px-3 py-1 text-xs font-medium text-aurora-cyan">
            {nights} {nights === 1 ? 'night' : 'nights'}
          </span>
        )}
      </div>

      <div className="flex justify-center rounded-3xl border border-aurora-line bg-white/[0.02] p-4">
        <DayPicker
          mode="range"
          required={false}
          selected={selected}
          onSelect={handleSelect}
          disabled={{ before: today }}
          className="relative"
          classNames={dayPickerClassNames}
        />
      </div>
    </div>
  );
}

function DateBadge({ label, value }: { label: string; value: string | null }) {
  return (
    <div
      className={cn(
        'flex items-center gap-2 rounded-2xl border px-3.5 py-2',
        value ? 'border-aurora-cyan/40 bg-aurora-cyan/5' : 'border-aurora-line bg-white/[0.03]',
      )}
    >
      <CalendarDays size={15} className={value ? 'text-aurora-cyan' : 'text-aurora-dim'} />
      <div>
        <div className="text-[10px] uppercase tracking-wider text-aurora-dim">{label}</div>
        <div className="text-sm font-medium text-aurora-text">{value ?? 'Select a date'}</div>
      </div>
    </div>
  );
}
