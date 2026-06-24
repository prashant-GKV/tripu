import type { Occasion } from '../../types/trip';
import Chip from './Chip';

/** The selectable special occasions (null === none / deselected). */
const OCCASIONS: { value: Exclude<Occasion, null>; label: string; icon: string }[] = [
  { value: 'birthday', label: 'Birthday', icon: '🎂' },
  { value: 'anniversary', label: 'Anniversary', icon: '💍' },
  { value: 'honeymoon', label: 'Honeymoon', icon: '🌙' },
  { value: 'bachelorette', label: 'Bachelorette', icon: '🥂' },
];

interface OccasionChipsProps {
  value: Occasion;
  onChange: (occasion: Occasion) => void;
}

/**
 * Single-select occasion chips. Clicking the active chip clears the selection
 * (back to null), since an occasion is optional.
 */
export default function OccasionChips({ value, onChange }: OccasionChipsProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {OCCASIONS.map((o) => (
        <Chip
          key={o.value}
          label={o.label}
          icon={o.icon}
          selected={value === o.value}
          onClick={() => onChange(value === o.value ? null : o.value)}
        />
      ))}
    </div>
  );
}
