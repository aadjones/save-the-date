/**
 * Simple className merging utility
 * Filters out falsy values and joins class names with spaces
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
