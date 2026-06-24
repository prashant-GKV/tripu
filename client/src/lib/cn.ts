import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge conditional class names and de-duplicate conflicting Tailwind utilities.
 * Usage: cn('px-2', condition && 'px-4', 'text-aurora-text')
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
