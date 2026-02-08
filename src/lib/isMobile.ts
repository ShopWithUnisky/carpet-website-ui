/**
 * True when popup sign-in is likely to fail (mobile / touch devices).
 * Use redirect flow instead.
 */
export function isMobile(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") return false;
  // Viewport: use redirect for phones and tablets (up to 768px)
  if (window.matchMedia("(max-width: 768px)").matches) return true;
  // Touch-first or no hover (typical for mobile)
  if (window.matchMedia("(pointer: coarse)").matches) return true;
  if (window.matchMedia("(hover: none)").matches) return true;
  // User agent fallback so we never use popup on real mobile browsers
  const ua = navigator.userAgent || "";
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(ua)) return true;
  return false;
}
