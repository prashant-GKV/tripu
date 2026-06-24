import { describe, it, expect } from 'vitest';
import { cn } from './cn';

describe('cn', () => {
  it('joins truthy class names', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('drops falsy values', () => {
    const hidden = false as boolean;
    expect(cn('a', hidden && 'b', undefined, null, 'c')).toBe('a c');
  });

  it('de-duplicates conflicting tailwind utilities (last wins)', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('merges aurora theme classes without clobbering unrelated utilities', () => {
    expect(cn('text-aurora-text', 'rounded-2xl', 'rounded-3xl')).toBe('text-aurora-text rounded-3xl');
  });
});
