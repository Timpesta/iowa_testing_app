/**
 * Utility functions for the Iowa Testing Portal.
 */

export function cn(...classes: (string | undefined | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
