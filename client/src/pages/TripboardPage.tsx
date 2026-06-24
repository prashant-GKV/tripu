import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import AuroraBackground from '../components/ui/AuroraBackground';
import GlassCard from '../components/ui/GlassCard';

/**
 * Placeholder for a single public tripboard view (built in M3).
 * Routed by share slug: /t/:slug — publicly viewable without login.
 */
export default function TripboardPage() {
  const { slug } = useParams();
  return (
    <AuroraBackground subtle>
      <div className="mx-auto max-w-5xl px-6 py-20">
        <Link
          to="/tripboards"
          className="mb-8 inline-flex items-center gap-2 text-sm text-aurora-muted transition-colors hover:text-aurora-text"
        >
          <ArrowLeft size={16} /> All tripboards
        </Link>
        <GlassCard className="p-8">
          <p className="text-xs uppercase tracking-wider text-aurora-cyan">Tripboard</p>
          <h1 className="mt-2 font-grotesk text-3xl font-bold">
            <span className="text-aurora">{slug ?? 'preview'}</span>
          </h1>
          <p className="mt-3 text-aurora-muted">
            Day-by-day itinerary with a live map will render here in milestone&nbsp;M3.
          </p>
        </GlassCard>
      </div>
    </AuroraBackground>
  );
}
