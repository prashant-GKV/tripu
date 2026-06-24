import { Check } from 'lucide-react';
import { cn } from '../../lib/cn';

interface ChipProps {
  label: string;
  selected: boolean;
  onClick: () => void;
  /** Optional leading emoji/icon. */
  icon?: React.ReactNode;
  /** Show a check tick when selected (good for multi-select sets). */
  showTick?: boolean;
}

/**
 * A pill-shaped selectable chip in the Aurora Glass style. Reused for
 * occasions, accommodation types, pace and dietary preferences.
 */
export default function Chip({ label, selected, onClick, icon, showTick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-4 py-2 font-grotesk text-sm transition-all duration-200',
        selected
          ? 'border-aurora-cyan/60 bg-aurora-cyan/10 text-aurora-text shadow-glow-cyan'
          : 'border-aurora-line bg-white/[0.03] text-aurora-muted hover:border-white/25 hover:text-aurora-text',
      )}
    >
      {icon && <span aria-hidden>{icon}</span>}
      {label}
      {showTick && selected && <Check size={14} className="text-aurora-cyan" />}
    </button>
  );
}
