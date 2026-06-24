import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '../../lib/cn';

interface GlassCardProps extends HTMLMotionProps<'div'> {
  /** Add a coloured glow ring on hover (the "3D lucid" lift). */
  glow?: 'cyan' | 'violet' | 'coral' | 'none';
  /** Smaller radius / blur variant. */
  compact?: boolean;
}

const glowMap = {
  cyan: 'hover:shadow-glow-cyan',
  violet: 'hover:shadow-glow-violet',
  coral: 'hover:shadow-glow-coral',
  none: '',
} as const;

/**
 * Frosted-glass surface with depth and an optional hover glow.
 * The reusable building block for cards across the Aurora Glass UI.
 */
export default function GlassCard({
  glow = 'none',
  compact = false,
  className,
  children,
  ...rest
}: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        compact ? 'glass-sm' : 'glass',
        'transition-shadow duration-300',
        glowMap[glow],
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
