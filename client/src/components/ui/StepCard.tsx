import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface StepCardProps {
  step: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
  highlighted?: boolean;
}

export default function StepCard({ step, icon, title, description, delay = 0, highlighted = false }: StepCardProps) {
  return (
    <motion.div
      className={clsx(
        'relative rounded-2xl p-6 border border-traw-border bg-topo bg-cover',
        highlighted
          ? 'bg-traw-surface shadow-lime-glow'
          : 'bg-traw-surface shadow-card hover:shadow-card-lg',
        'transition-shadow duration-300 overflow-hidden'
      )}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut', delay }}
      viewport={{ once: true, margin: '0px 0px -60px 0px' }}
    >
      {highlighted && (
        <div className="absolute inset-0 bg-traw-lime/10 rounded-2xl pointer-events-none" />
      )}

      {/* Topographic texture overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none rounded-2xl"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cpath d='M0 150 Q40 120 80 150 T160 150 T240 150 T300 150' stroke='%23C8E63C' fill='none' stroke-width='1' opacity='0.4'/%3E%3Cpath d='M0 130 Q40 100 80 130 T160 130 T240 130 T300 130' stroke='%23E8E7E2' fill='none' stroke-width='0.8'/%3E%3Cpath d='M0 170 Q40 140 80 170 T160 170 T240 170 T300 170' stroke='%23E8E7E2' fill='none' stroke-width='0.8'/%3E%3Cpath d='M150 0 Q120 40 150 80 T150 160 T150 240 T150 300' stroke='%23E8E7E2' fill='none' stroke-width='0.8'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-4">
          <span className="font-display font-bold text-5xl text-traw-border leading-none select-none">
            {String(step).padStart(2, '0')}
          </span>
          <div className="w-10 h-10 rounded-xl bg-traw-bg flex items-center justify-center text-traw-primary">
            {icon}
          </div>
        </div>
        <h3 className="font-display font-bold text-traw-primary text-base mb-2 leading-snug">{title}</h3>
        <p className="font-sans text-traw-secondary text-sm leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}
