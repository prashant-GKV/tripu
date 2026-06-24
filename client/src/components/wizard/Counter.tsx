import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface CounterProps {
  /** Label shown to the left of the stepper. */
  label: string;
  /** Optional helper line under the label. */
  hint?: string;
  value: number;
  min: number;
  max: number;
  onChange: (next: number) => void;
}

/**
 * A labelled +/- stepper. Used for the traveler composition counters.
 * Buttons disable at the configured bounds.
 */
export default function Counter({ label, hint, value, min, max, onChange }: CounterProps) {
  const dec = () => onChange(Math.max(min, value - 1));
  const inc = () => onChange(Math.min(max, value + 1));

  return (
    <div className="flex items-center justify-between rounded-2xl border border-aurora-line bg-white/[0.03] px-4 py-3">
      <div>
        <div className="font-grotesk text-sm font-medium text-aurora-text">{label}</div>
        {hint && <div className="text-xs text-aurora-dim">{hint}</div>}
      </div>

      <div className="flex items-center gap-3">
        <StepButton onClick={dec} disabled={value <= min} aria-label={`Decrease ${label}`}>
          <Minus size={15} />
        </StepButton>
        <span className="w-6 text-center font-grotesk text-base font-semibold tabular-nums text-aurora-text">
          {value}
        </span>
        <StepButton onClick={inc} disabled={value >= max} aria-label={`Increase ${label}`}>
          <Plus size={15} />
        </StepButton>
      </div>
    </div>
  );
}

interface StepButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

function StepButton({ children, className, ...rest }: StepButtonProps) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-full border border-aurora-line bg-aurora-glass text-aurora-text transition-all',
        'hover:border-aurora-cyan/50 hover:text-aurora-cyan',
        'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-aurora-line disabled:hover:text-aurora-text',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
