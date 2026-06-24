import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/cn';
import { WIZARD_STEPS } from '../../stores/wizardStore';

interface WizardProgressProps {
  currentStep: number;
  /** Which steps are currently valid (used to show a completed checkmark). */
  completed: boolean[];
  /** Jump to a step. Only allowed for steps already visited/valid. */
  onJump: (step: number) => void;
}

/**
 * Sticky top progress indicator: Who · When · Where · How.
 * Completed steps show a checkmark; the active step glows.
 */
export default function WizardProgress({ currentStep, completed, onJump }: WizardProgressProps) {
  return (
    <div className="sticky top-0 z-20 -mx-6 mb-8 border-b border-aurora-line bg-aurora-deep/70 px-6 py-4 backdrop-blur-xl">
      <ol className="mx-auto flex max-w-3xl items-center justify-between gap-2">
        {WIZARD_STEPS.map((name, i) => {
          const isActive = i === currentStep;
          const isDone = completed[i] && i !== currentStep;
          // Allow jumping back to any visited step, or forward only if prior steps are done.
          const reachable = i <= currentStep || completed.slice(0, i).every(Boolean);

          return (
            <li key={name} className="flex flex-1 items-center">
              <button
                type="button"
                disabled={!reachable}
                onClick={() => reachable && onJump(i)}
                className={cn(
                  'group flex items-center gap-2.5 rounded-full px-2 py-1 transition-colors',
                  reachable ? 'cursor-pointer' : 'cursor-not-allowed',
                )}
              >
                <span
                  className={cn(
                    'flex h-7 w-7 flex-none items-center justify-center rounded-full border text-xs font-semibold transition-all',
                    isActive
                      ? 'border-aurora-cyan bg-aurora-cyan/20 text-aurora-cyan shadow-glow-cyan'
                      : isDone
                        ? 'border-aurora-cyan/50 bg-aurora-cyan/10 text-aurora-cyan'
                        : 'border-aurora-line bg-white/[0.03] text-aurora-dim',
                  )}
                >
                  {isDone ? <Check size={14} /> : i + 1}
                </span>
                <span
                  className={cn(
                    'hidden font-grotesk text-sm sm:inline',
                    isActive ? 'font-semibold text-aurora-text' : 'text-aurora-muted',
                  )}
                >
                  {name}
                </span>
              </button>

              {/* Connector line between steps */}
              {i < WIZARD_STEPS.length - 1 && (
                <div className="mx-2 h-px flex-1 overflow-hidden rounded-full bg-aurora-line">
                  <motion.div
                    className="h-full bg-gradient-to-r from-aurora-cyan to-aurora-violet"
                    initial={false}
                    animate={{ width: completed[i] ? '100%' : '0%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
