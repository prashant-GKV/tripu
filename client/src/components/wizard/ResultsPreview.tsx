import { motion } from 'framer-motion';
import { Clock, Sparkles, MapPin, Wand2 } from 'lucide-react';
import type { Itinerary } from '../../types/trip';
import GlassCard from '../ui/GlassCard';

interface ResultsPreviewProps {
  itinerary: Itinerary;
  currency: string;
}

/**
 * Inline results panel that renders a generated Itinerary day-by-day.
 * Makes the AI engine demoable end-to-end without auth or a database.
 */
export default function ResultsPreview({ itinerary, currency }: ResultsPreviewProps) {
  const money = (amount?: number) =>
    amount == null ? null : `${formatCurrency(amount, itinerary.currency || currency)}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="space-y-5"
    >
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-aurora-cyan">
            <Sparkles size={13} /> AI preview
          </p>
          <h2 className="mt-1 font-grotesk text-2xl font-bold text-aurora-text">
            {itinerary.title || 'Your draft itinerary'}
          </h2>
        </div>
        {itinerary.estTotalCost != null && (
          <div className="rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-2 text-right">
            <div className="text-[10px] uppercase tracking-wider text-aurora-dim">Est. total</div>
            <div className="font-grotesk text-lg font-bold text-aurora-text">
              {money(itinerary.estTotalCost)}
            </div>
          </div>
        )}
      </header>

      <div className="space-y-4">
        {itinerary.days.map((day) => (
          <GlassCard key={day.id ?? day.dayIndex} compact glow="cyan" className="p-5">
            {/* Day header */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-aurora-line pb-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gradient-to-r from-aurora-cyan to-aurora-violet font-grotesk text-sm font-bold text-aurora-deep">
                  {day.dayIndex + 1}
                </span>
                <div>
                  <div className="flex items-center gap-1.5 font-grotesk text-sm font-semibold text-aurora-text">
                    <MapPin size={13} className="text-aurora-cyan" />
                    {day.city}
                    {day.country && <span className="text-aurora-dim">· {day.country}</span>}
                  </div>
                  {day.date && <div className="text-xs text-aurora-dim">{day.date}</div>}
                </div>
              </div>
            </div>

            {day.summary && <p className="mb-4 text-sm text-aurora-muted">{day.summary}</p>}

            {/* Activities */}
            <ol className="space-y-3">
              {day.activities.map((act, i) => (
                <li key={act.id ?? i} className="flex gap-3">
                  <div className="flex w-20 flex-none items-start gap-1 pt-0.5 text-xs font-medium text-aurora-cyan">
                    <Clock size={12} className="mt-px" />
                    {act.timeSlot}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="font-grotesk text-sm font-medium text-aurora-text">
                        {act.title}
                      </span>
                      {act.estCost != null && (
                        <span className="text-xs text-aurora-muted">{money(act.estCost)}</span>
                      )}
                    </div>
                    {act.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-aurora-muted">
                        {act.description}
                      </p>
                    )}
                    {act.aiRationale && (
                      <p className="mt-1 flex items-start gap-1 text-[11px] italic leading-relaxed text-aurora-dim">
                        <Wand2 size={11} className="mt-0.5 flex-none" />
                        {act.aiRationale}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </GlassCard>
        ))}
      </div>
    </motion.div>
  );
}

/** Format an amount with a currency code, gracefully falling back to "CODE amount". */
function formatCurrency(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${Math.round(amount)}`;
  }
}
