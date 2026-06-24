import { format, parseISO } from 'date-fns';
import ActivityCard from './ActivityCard';
import type { ItineraryDay } from '../../types/trip';

interface DayTimelineProps {
  days: ItineraryDay[];
  currency: string;
}

function formatDayDate(date?: string): string | null {
  if (!date) return null;
  try {
    return format(parseISO(date), 'EEE, MMM d');
  } catch {
    return null;
  }
}

/**
 * Day-by-day vertical timeline. Each day is a node on a glowing spine with its
 * city, optional date + summary, and the day's activities as editable cards.
 */
export default function DayTimeline({ days, currency }: DayTimelineProps) {
  if (days.length === 0) {
    return (
      <p className="rounded-2xl border border-aurora-line bg-white/5 p-6 text-sm text-aurora-muted">
        This itinerary has no days yet.
      </p>
    );
  }

  return (
    <ol className="relative space-y-8 before:absolute before:bottom-2 before:left-[15px] before:top-2 before:w-px before:bg-gradient-to-b before:from-aurora-cyan/50 before:via-aurora-violet/30 before:to-transparent">
      {days.map((day) => {
        const dateLabel = formatDayDate(day.date);
        return (
          <li key={day.id ?? day.dayIndex} className="relative pl-12">
            <span className="absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan to-aurora-violet font-grotesk text-sm font-bold text-aurora-deep shadow-glow-cyan">
              {day.dayIndex + 1}
            </span>

            <header className="mb-3">
              <h3 className="font-grotesk text-lg font-semibold text-aurora-text">
                {day.city}
                {day.country && <span className="text-aurora-dim">, {day.country}</span>}
              </h3>
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-aurora-muted">
                {dateLabel && <span>{dateLabel}</span>}
                {day.summary && (
                  <>
                    {dateLabel && <span className="text-aurora-dim">·</span>}
                    <span>{day.summary}</span>
                  </>
                )}
              </div>
            </header>

            <div className="space-y-3">
              {day.activities.length === 0 ? (
                <p className="text-xs text-aurora-dim">No activities planned.</p>
              ) : (
                day.activities.map((a, i) => (
                  <ActivityCard key={a.id ?? `${day.dayIndex}-${i}`} activity={a} currency={currency} />
                ))
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
