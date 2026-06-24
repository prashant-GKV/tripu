import { cn } from '../../lib/cn';

interface AuroraBackgroundProps {
  /** Extra classes for the wrapper. */
  className?: string;
  /** Page content rendered above the aurora layers. */
  children?: React.ReactNode;
  /** Dim the aurora blobs for content-dense screens. */
  subtle?: boolean;
}

/**
 * Full-bleed deep-twilight backdrop with soft, drifting aurora gradient blobs.
 * The signature surface of the "Aurora Glass" design system. Decorative layers
 * are pointer-events-none and animation is disabled under prefers-reduced-motion
 * (handled globally in index.css).
 */
export default function AuroraBackground({ className, children, subtle }: AuroraBackgroundProps) {
  return (
    <div className={cn('relative min-h-screen overflow-hidden bg-aurora-deep text-aurora-text', className)}>
      {/* Aurora blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full blur-3xl animate-aurora-drift',
            subtle ? 'opacity-25' : 'opacity-50',
          )}
          style={{ background: 'radial-gradient(circle at 30% 30%, #2dd4bf, transparent 60%)' }}
        />
        <div
          className={cn(
            'absolute top-1/4 -right-40 h-[46rem] w-[46rem] rounded-full blur-3xl animate-aurora-drift-slow',
            subtle ? 'opacity-25' : 'opacity-55',
          )}
          style={{ background: 'radial-gradient(circle at 60% 40%, #8b5cf6, transparent 60%)' }}
        />
        <div
          className={cn(
            'absolute -bottom-48 left-1/4 h-[40rem] w-[40rem] rounded-full blur-3xl animate-aurora-drift',
            subtle ? 'opacity-20' : 'opacity-45',
          )}
          style={{ background: 'radial-gradient(circle at 50% 50%, #ec4899, transparent 60%)' }}
        />
      </div>

      {/* Subtle grain/vignette for depth */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse at 50% 0%, transparent 40%, rgba(7,7,17,0.6) 100%)' }}
      />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
