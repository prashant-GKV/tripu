import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowLeft, Map, Sparkles, Calendar, MapPin, Compass } from 'lucide-react';
import AuroraBackground from '../components/ui/AuroraBackground';
import GlassCard from '../components/ui/GlassCard';
import { listTripboards, getDestinations } from '../lib/tripApi';
import type { DestinationDTO } from '../lib/tripApi';
import type { Trip } from '../types/trip';

/** One-line route summary, e.g. "Reykjavík → Vík → Höfn". */
function routeSummary(trip: Trip): string {
  const cities =
    trip.brief?.route?.map((r) => r.city) ??
    trip.itinerary?.days?.map((d) => d.city) ??
    [];
  const unique = cities.filter((c, i) => c && cities.indexOf(c) === i);
  if (unique.length === 0) return 'Itinerary';
  if (unique.length <= 3) return unique.join(' → ');
  return `${unique[0]} → … → ${unique[unique.length - 1]}`;
}

function dayCount(trip: Trip): number {
  if (trip.itinerary?.days?.length) return trip.itinerary.days.length;
  if (trip.brief?.route?.length) {
    return trip.brief.route.reduce((s, r) => s + (r.nights || 0), 0);
  }
  return 0;
}

/**
 * Public tripboard browser — intentionally NO login required (an edge over
 * auth-walled competitors). Lists published tripboards; if the API is empty or
 * unavailable, gracefully falls back to sample destination inspiration cards.
 */
export default function TripboardsPage() {
  const { data: trips, isLoading } = useQuery({
    queryKey: ['tripboards'],
    queryFn: listTripboards,
    retry: 0,
  });

  const hasTrips = !isLoading && Array.isArray(trips) && trips.length > 0;

  // Fallback inspiration: only fetched when there are no real tripboards.
  const { data: destinations } = useQuery({
    queryKey: ['destinations-fallback'],
    queryFn: getDestinations,
    retry: 0,
    enabled: !isLoading && !hasTrips,
  });

  return (
    <AuroraBackground subtle>
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm text-aurora-muted transition-colors hover:text-aurora-text"
        >
          <ArrowLeft size={16} /> Back home
        </Link>

        {/* Hero */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-aurora-line bg-aurora-glass px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-aurora-cyan">
              <Compass size={13} /> No account needed
            </span>
            <h1 className="font-grotesk text-4xl font-bold md:text-5xl">
              Explore <span className="text-aurora">tripboards</span>
            </h1>
            <p className="mt-3 max-w-lg text-aurora-muted">
              Browse living, map-backed itineraries from fellow travellers — open any board to see
              the route on a real map, the day-by-day plan and the budget.
            </p>
          </div>
          <Link to="/plan" className="btn-aurora shrink-0">
            <Sparkles size={15} /> Plan a trip
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <SkeletonGrid />
        ) : hasTrips ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips!.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        ) : (
          <InspirationGrid destinations={destinations ?? []} />
        )}
      </div>
    </AuroraBackground>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const days = dayCount(trip);
  return (
    <Link to={`/t/${trip.shareSlug}`} className="block">
      <GlassCard glow="violet" className="h-full overflow-hidden p-5 transition-transform hover:scale-[1.02]">
        <div className="flex h-32 items-center justify-center rounded-2xl bg-gradient-to-br from-aurora-cyan/15 to-aurora-violet/15 text-aurora-cyan">
          <Map size={30} />
        </div>
        <h3 className="mt-4 line-clamp-1 font-grotesk text-lg font-semibold text-aurora-text">
          {trip.title}
        </h3>
        <p className="mt-1 line-clamp-1 flex items-center gap-1.5 text-sm text-aurora-muted">
          <MapPin size={13} className="shrink-0 text-aurora-dim" />
          {routeSummary(trip)}
        </p>
        <div className="mt-3 flex items-center gap-3 text-xs text-aurora-dim">
          {days > 0 && (
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> {days} {days === 1 ? 'day' : 'days'}
            </span>
          )}
          <span className="rounded-full bg-white/5 px-2 py-0.5 font-medium text-aurora-muted">
            {trip.currency}
          </span>
        </div>
      </GlassCard>
    </Link>
  );
}

function InspirationGrid({ destinations }: { destinations: DestinationDTO[] }) {
  return (
    <div className="mt-12">
      <div className="mb-5 flex items-center gap-2 rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-3 text-sm text-aurora-muted">
        <Sparkles size={15} className="text-aurora-coral" />
        No published tripboards yet — here's some inspiration. These are{' '}
        <span className="font-medium text-aurora-text">sample destinations</span>, not real trips.
      </div>

      {destinations.length === 0 ? (
        <div className="rounded-3xl border border-aurora-line bg-white/[0.03] p-12 text-center">
          <Compass className="mx-auto text-aurora-dim" size={32} />
          <p className="mt-4 text-aurora-muted">No tripboards to show right now.</p>
          <Link to="/plan" className="btn-aurora mt-6">
            <Sparkles size={15} /> Plan the first one
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {destinations.map((d) => (
            <GlassCard key={d.id} glow="cyan" className="overflow-hidden p-0">
              <div className="relative h-40 w-full overflow-hidden">
                {d.image ? (
                  <img src={d.image} alt={d.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-aurora-cyan/15 to-aurora-violet/15 text-aurora-cyan">
                    <MapPin size={28} />
                  </div>
                )}
                <span className="absolute left-3 top-3 rounded-full bg-aurora-deep/70 px-2.5 py-1 text-[10px] uppercase tracking-wide text-aurora-cyan backdrop-blur-sm">
                  Sample
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-grotesk text-lg font-semibold text-aurora-text">{d.name}</h3>
                <p className="text-sm text-aurora-muted">{d.country}</p>
                {d.tags?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {d.tags.slice(0, 3).map((t) => (
                      <span key={t} className="rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-aurora-muted">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <GlassCard key={i} className="overflow-hidden p-5">
          <div className="h-32 animate-pulse rounded-2xl bg-white/5" />
          <div className="mt-4 h-4 w-2/3 animate-pulse rounded bg-white/10" />
          <div className="mt-2 h-3 w-1/3 animate-pulse rounded bg-white/5" />
        </GlassCard>
      ))}
    </div>
  );
}
