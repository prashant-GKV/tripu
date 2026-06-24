import { Minus, Plus } from 'lucide-react';
import { cn } from '../../lib/cn';

interface NightsStepperProps {
  nights: number;
  onChange: (nights: number) => void;
  min?: number;
  max?: number;
}

/**
 * Compact +/- stepper for the number of nights assigned to a route city.
 * Minimum is 1 night; capped to keep totals reasonable.
 */
export default function NightsStepper({ nights, onChange, min = 1, max = 30 }: NightsStepperProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-aurora-line bg-white/[0.03] px-1.5 py-1">
      <Btn onClick={() => onChange(Math.max(min, nights - 1))} disabled={nights <= min} label="Fewer nights">
        <Minus size={13} />
      </Btn>
      <span className="min-w-[3.2rem] text-center text-xs font-medium tabular-nums text-aurora-text">
        {nights} {nights === 1 ? 'night' : 'nights'}
      </span>
      <Btn onClick={() => onChange(Math.min(max, nights + 1))} disabled={nights >= max} label="More nights">
        <Plus size={13} />
      </Btn>
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  label,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full text-aurora-muted transition-all',
        'hover:bg-aurora-cyan/15 hover:text-aurora-cyan',
        'disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-aurora-muted',
      )}
    >
      {children}
    </button>
  );
}
