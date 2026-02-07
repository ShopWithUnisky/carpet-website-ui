/**
 * Landing page image configuration.
 * To change landing images: add or replace files in public/landing/
 * and update the arrays below (filenames only). Order determines display order.
 */

const BASE = `${import.meta.env.BASE_URL || "/"}landing`;

export const landingImages = {
  /** Hero section images (carousel or single). Serve from public/landing/ */
  hero: ["hero-1.jpg", "hero-2.jpg", "hero-3.jpg"],
  /** Product showcase grid. Serve from public/landing/ */
  products: [
    "product-1.png",
    "product-2.jpg",
    "product-3.jpg",
    "product-4.jpg",
  ],
} as const;

export function getLandingImageUrl(filename: string): string {
  return `${BASE}/${filename}`;
}
