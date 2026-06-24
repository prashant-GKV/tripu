import { useQuery } from '@tanstack/react-query';
import { Users } from 'lucide-react';
import { computeMatches } from '../../lib/tripApi';
import type { MatchDTO } from '../../lib/tripApi';

interface CompanionMatchesProps {
  tripId: string;
}

/** Human labels + colors for the score breakdown dimensions. */
const DIMENSIONS: { key: string; label: string; color: string }[] = [
  { key: 'dateOverlap', label: 'Dates', color: '#22d3ee' },
  { key: 'destinationOverlap', label: 'Places', color: '#8b5cf6' },
  { key: 'styleJaccard', label: 'Style', color: '#ff7a59' },
  { key: 'budget', label: 'Budget', color: '#2dd4bf' },
  { key: 'pace', label: 'Pace', color: '#ec4899' },
];

/**
 * Companion matching panel. POSTs to compute matches for the trip, then renders a
 * ranked list with each candidate's overall score and a transparent per-dimension
 * breakdown bar. Needs the server + DB, so failures degrade to a friendly note.
 */
export default function CompanionMatches({ tripId }: CompanionMatchesProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['matches', tripId],
    queryFn: () => computeMatches(tripId),
    retry: 0,
    staleTime: 5 * 60_000,
  });

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <Users size={16} className="text-aurora-cyan" />
        <h3 className="font-grotesk text-sm font-semibold uppercase tracking-wide text-aurora-text">
          Travel companions
        </h3>
      </div>

      {isLoading && <p className="text-xs text-aurora-muted">Finding compatible travellers…</p>}

      {isError && (
        <p className="text-xs text-aurora-dim">
          Companion matching needs an account and the live service. It's unavailable for this
          public preview.
        </p>
      )}

      {!isLoading && !isError && (!data || data.length === 0) && (
        <p className="text-xs text-aurora-dim">No companion matches yet — check back soon.</p>
      )}

      {!isLoading && !isError && data && data.length > 0 && (
        <ul className="space-y-3">
          {data.map((m) => (
            <MatchRow key={m.candidateId} match={m} />
          ))}
        </ul>
      )}
    </div>
  );
}

function MatchRow({ match }: { match: MatchDTO }) {
  const pct = Math.round(match.score * (match.score <= 1 ? 100 : 1));
  const initials = match.displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <li className="rounded-xl border border-aurora-line bg-white/[0.03] p-3">
      <div className="flex items-center gap-3">
        {match.avatarUrl ? (
          <img
            src={match.avatarUrl}
            alt={match.displayName}
            className="h-9 w-9 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-aurora-cyan/40 to-aurora-violet/40 text-xs font-bold text-aurora-text">
            {initials}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-aurora-text">{match.displayName}</p>
        </div>
        <span className="font-grotesk text-sm font-bold text-aurora">{pct}%</span>
      </div>

      {/* Transparent breakdown */}
      <div className="mt-2.5 flex h-1.5 gap-0.5 overflow-hidden rounded-full">
        {DIMENSIONS.map((d) => {
          const raw = match.breakdown?.[d.key] ?? 0;
          const v = Math.max(0, Math.min(1, raw <= 1 ? raw : raw / 100));
          return (
            <div
              key={d.key}
              className="h-full"
              style={{ width: `${Math.max(2, v * 100) / DIMENSIONS.length}%`, background: d.color }}
              title={`${d.label}: ${Math.round(v * 100)}%`}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-x-2 gap-y-0.5">
        {DIMENSIONS.map((d) => (
          <span key={d.key} className="flex items-center gap-1 text-[10px] text-aurora-dim">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: d.color }} />
            {d.label}
          </span>
        ))}
      </div>
    </li>
  );
}
