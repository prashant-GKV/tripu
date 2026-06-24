import { useState } from 'react';
import { Info } from 'lucide-react';
import { CategoryIcon } from './categoryIcon';
import { updateActivity } from '../../lib/tripApi';
import type { ItineraryActivity } from '../../types/trip';

interface ActivityCardProps {
  activity: ItineraryActivity;
  currency: string;
}

/**
 * A single itinerary activity. Title and description are editable inline; on blur
 * we best-effort PATCH the activity (errors are swallowed — read-only viewers and
 * offline edits should never crash the board).
 */
export default function ActivityCard({ activity, currency }: ActivityCardProps) {
  const [title, setTitle] = useState(activity.title);
  const [description, setDescription] = useState(activity.description ?? '');

  function persist(patch: Record<string, unknown>) {
    if (!activity.id) return;
    // Best-effort collaborative edit — ignore failures (no server / offline).
    void updateActivity(activity.id, patch).catch(() => {});
  }

  return (
    <div className="group relative flex gap-3 rounded-2xl border border-aurora-line bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
      {/* Time + category rail */}
      <div className="flex flex-col items-center gap-2 pt-1">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan/30 to-aurora-violet/30 text-aurora-cyan">
          <CategoryIcon category={activity.category} size={16} />
        </span>
        {activity.timeSlot && (
          <span className="whitespace-nowrap text-[10px] font-medium uppercase tracking-wide text-aurora-dim">
            {activity.timeSlot}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => title !== activity.title && persist({ title })}
            className="w-full bg-transparent font-grotesk text-sm font-semibold text-aurora-text outline-none focus:rounded focus:bg-white/5 focus:px-1 focus:ring-1 focus:ring-aurora-cyan/40"
            aria-label="Activity title"
          />
          {activity.aiRationale && (
            <span className="relative shrink-0">
              <Info
                size={14}
                className="peer mt-1 cursor-help text-aurora-dim transition-colors hover:text-aurora-cyan"
                aria-label="Why this is suggested"
              />
              <span className="pointer-events-none absolute right-0 top-6 z-20 w-56 rounded-xl border border-aurora-line bg-aurora-night/95 p-3 text-xs text-aurora-muted opacity-0 shadow-glass backdrop-blur-md transition-opacity duration-200 peer-hover:opacity-100">
                {activity.aiRationale}
              </span>
            </span>
          )}
        </div>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => description !== (activity.description ?? '') && persist({ description })}
          rows={2}
          placeholder="Add a note…"
          className="mt-1 w-full resize-none bg-transparent text-xs leading-relaxed text-aurora-muted outline-none placeholder:text-aurora-dim focus:rounded focus:bg-white/5 focus:px-1 focus:ring-1 focus:ring-aurora-cyan/40"
          aria-label="Activity description"
        />

        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {activity.place && <span className="text-[11px] text-aurora-dim">{activity.place}</span>}
          {typeof activity.estCost === 'number' && activity.estCost > 0 && (
            <span className="rounded-full bg-aurora-coral/15 px-2 py-0.5 text-[11px] font-medium text-aurora-coral">
              {currency} {activity.estCost.toLocaleString()}
            </span>
          )}
          {activity.bookingUrl && (
            <a
              href={activity.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] text-aurora-cyan underline-offset-2 hover:underline"
            >
              Book
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
