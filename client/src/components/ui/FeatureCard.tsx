import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  stat?: string;
  statLabel?: string;
  className?: string;
  delay?: number;
  variant?: 'default' | 'wide';
}

export default function FeatureCard({
  icon,
  title,
  description,
  stat,
  statLabel,
  className,
  delay = 0,
  variant = 'default',
}: FeatureCardProps) {
  return (
    <motion.div
      className={clsx(
        'bg-traw-surface rounded-2xl p-6 shadow-card border border-traw-border',
        'hover:shadow-card-lg transition-shadow duration-300',
        variant === 'wide' ? 'flex flex-col justify-between' : '',
        className
      )}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    >
      <div>
        <div className="w-11 h-11 rounded-xl bg-traw-bg flex items-center justify-center mb-4 text-traw-primary">
          {icon}
        </div>
        <h3 className="font-display font-bold text-traw-primary text-lg mb-2">{title}</h3>
        <p className="font-sans text-traw-secondary text-sm leading-relaxed">{description}</p>
      </div>

      {stat && (
        <div className="mt-6 pt-5 border-t border-traw-border">
          <p className="font-sans text-xs text-traw-muted uppercase tracking-wider mb-1">{statLabel}</p>
          <p className="font-display font-bold text-2xl text-traw-primary">{stat}</p>
        </div>
      )}
    </motion.div>
  );
}
