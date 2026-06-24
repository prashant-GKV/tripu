import {
  Utensils,
  Camera,
  Bed,
  Plane,
  Mountain,
  Coffee,
  Landmark,
  ShoppingBag,
  Sun,
  Navigation,
  MapPin,
} from 'lucide-react';

type IconKey =
  | 'food'
  | 'coffee'
  | 'stay'
  | 'transport'
  | 'outdoor'
  | 'culture'
  | 'shopping'
  | 'leisure'
  | 'sight'
  | 'walk'
  | 'pin';

/**
 * Map a free-form activity category string onto an icon key. Defensive: the
 * server may emit arbitrary categories, so we keyword-match and fall back to a pin.
 */
function categoryIconKey(category: string): IconKey {
  const c = (category || '').toLowerCase();
  if (/(food|eat|dining|restaurant|lunch|dinner|breakfast|cuisine)/.test(c)) return 'food';
  if (/(coffee|cafe|drink|bar|nightlife)/.test(c)) return 'coffee';
  if (/(hotel|stay|lodg|accommodation|sleep|rest)/.test(c)) return 'stay';
  if (/(flight|transfer|transport|transit|travel|airport)/.test(c)) return 'transport';
  if (/(hike|trek|mountain|nature|outdoor|adventure)/.test(c)) return 'outdoor';
  if (/(museum|temple|monument|landmark|history|culture|heritage)/.test(c)) return 'culture';
  if (/(shop|market|mall|souvenir)/.test(c)) return 'shopping';
  if (/(beach|sun|relax|leisure|spa|pool)/.test(c)) return 'leisure';
  if (/(sight|view|photo|scenic|tour|explore)/.test(c)) return 'sight';
  if (/(walk|stroll|wander|route)/.test(c)) return 'walk';
  return 'pin';
}

/**
 * Render the icon for a category. Uses a static switch (no dynamic component
 * variables) so it satisfies react-hooks/static-components.
 */
export function CategoryIcon({ category, size = 16 }: { category: string; size?: number }) {
  switch (categoryIconKey(category)) {
    case 'food':
      return <Utensils size={size} />;
    case 'coffee':
      return <Coffee size={size} />;
    case 'stay':
      return <Bed size={size} />;
    case 'transport':
      return <Plane size={size} />;
    case 'outdoor':
      return <Mountain size={size} />;
    case 'culture':
      return <Landmark size={size} />;
    case 'shopping':
      return <ShoppingBag size={size} />;
    case 'leisure':
      return <Sun size={size} />;
    case 'sight':
      return <Camera size={size} />;
    case 'walk':
      return <Navigation size={size} />;
    default:
      return <MapPin size={size} />;
  }
}
