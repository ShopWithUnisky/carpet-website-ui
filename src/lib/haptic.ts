/**
 * Trigger haptic feedback when supported (e.g. mobile devices).
 * Uses the Vibration API; no-op on unsupported browsers.
 */
export function haptic(pattern: number | number[] = 30): void {
  if (typeof navigator !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}
