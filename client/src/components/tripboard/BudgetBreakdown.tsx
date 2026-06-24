import { useMemo } from 'react';
import { Wallet } from 'lucide-react';
import type { Itinerary } from '../../types/trip';

interface BudgetBreakdownProps {
  itinerary: Itinerary;
  currency: string;
}

interface CategoryTotal {
  label: string;
  amount: number;
}

const BAR_COLORS = ['#22d3ee', '#8b5cf6', '#ff7a59', '#2dd4bf', '#ec4899', '#a6abcc'];

/**
 * Computes spend from the itinerary: per-activity estimated cost grouped by
 * category, plus accommodation (price × nights). Surfaces a grand total and, when
 * an accommodation carries simulated OTA `options`, a small price-comparison row.
 */
export default function BudgetBreakdown({ itinerary, currency }: BudgetBreakdownProps) {
  const { categories, accommodationTotal, grandTotal, sampleOptions } = useMemo(() => {
    const byCategory = new Map<string, number>();

    for (const day of itinerary.days) {
      for (const a of day.activities) {
        if (typeof a.estCost === 'number' && a.estCost > 0) {
          const key = a.category || 'Other';
          byCategory.set(key, (byCategory.get(key) ?? 0) + a.estCost);
        }
      }
    }

    // Accommodation: price per night × nights for that city (count itinerary days per city).
    const nightsByCity = new Map<string, number>();
    for (const day of itinerary.days) {
      nightsByCity.set(day.city, (nightsByCity.get(day.city) ?? 0) + 1);
    }

    let accomTotal = 0;
    let firstSample: { city: string; options: { provider: string; price: number; url?: string }[] } | null = null;
    for (const acc of itinerary.accommodations) {
      if (typeof acc.pricePerNight === 'number') {
        const nights = nightsByCity.get(acc.city) ?? 1;
        accomTotal += acc.pricePerNight * nights;
      }
      if (!firstSample && acc.options && acc.options.length > 0) {
        firstSample = { city: acc.city, options: acc.options };
      }
    }

    const cats: CategoryTotal[] = Array.from(byCategory.entries())
      .map(([label, amount]) => ({ label, amount }))
      .sort((a, b) => b.amount - a.amount);

    const activitiesTotal = cats.reduce((s, c) => s + c.amount, 0);

    return {
      categories: cats,
      accommodationTotal: accomTotal,
      grandTotal: activitiesTotal + accomTotal,
      sampleOptions: firstSample,
    };
  }, [itinerary]);

  const fmt = (n: number) => `${currency} ${Math.round(n).toLocaleString()}`;
  const maxBar = Math.max(accommodationTotal, ...categories.map((c) => c.amount), 1);

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Wallet size={16} className="text-aurora-cyan" />
        <h3 className="font-grotesk text-sm font-semibold uppercase tracking-wide text-aurora-text">
          Budget
        </h3>
      </div>

      {grandTotal === 0 ? (
        <p className="text-xs text-aurora-muted">No cost estimates on this itinerary.</p>
      ) : (
        <>
          <div className="space-y-2.5">
            {accommodationTotal > 0 && (
              <BudgetRow label="Accommodation" amount={accommodationTotal} max={maxBar} color={BAR_COLORS[0]} fmt={fmt} />
            )}
            {categories.map((c, i) => (
              <BudgetRow
                key={c.label}
                label={c.label}
                amount={c.amount}
                max={maxBar}
                color={BAR_COLORS[(i + 1) % BAR_COLORS.length]}
                fmt={fmt}
              />
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-aurora-line pt-3">
            <span className="font-grotesk text-sm font-semibold text-aurora-text">Total</span>
            <span className="font-grotesk text-base font-bold text-aurora">{fmt(grandTotal)}</span>
          </div>
        </>
      )}

      {sampleOptions && (
        <div className="mt-4 rounded-xl border border-aurora-line bg-white/[0.03] p-3">
          <p className="mb-2 text-[11px] uppercase tracking-wide text-aurora-dim">
            Sample prices · {sampleOptions.city}
          </p>
          <div className="space-y-1.5">
            {sampleOptions.options.map((o) => (
              <div key={o.provider} className="flex items-center justify-between text-xs">
                <span className="text-aurora-muted">{o.provider}</span>
                <span className="font-medium text-aurora-text">{fmt(o.price)}</span>
              </div>
            ))}
          </div>
          <p className="mt-2 text-[10px] italic text-aurora-dim">Sample prices — not live quotes.</p>
        </div>
      )}
    </div>
  );
}

function BudgetRow({
  label,
  amount,
  max,
  color,
  fmt,
}: {
  label: string;
  amount: number;
  max: number;
  color: string;
  fmt: (n: number) => string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="capitalize text-aurora-muted">{label}</span>
        <span className="font-medium text-aurora-text">{fmt(amount)}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.max(4, (amount / max) * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
