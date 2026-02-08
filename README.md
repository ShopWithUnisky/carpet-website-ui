# Carpet Co. — Website UI

A clean, premium carpet e-commerce site built with React, TypeScript, Vite, Tailwind CSS v4, and shadcn/ui.

## Pages

- **Landing** (`/`) — Hero carousel and product showcase
- **Listing** (`/carpets`) — All carpet variants with add-to-cart
- **Cart** (`/cart`) — Cart items, quantity, subtotal, checkout CTA
- **Sign In / Sign Up** (`/auth`) — Auth forms (demo; stores user in `localStorage`)

## Changing landing page images

To update the images on the landing page:

1. **Add or replace image files** in the `public/landing/` folder (e.g. `hero-1.jpg`, `product-1.jpg`).
2. **Edit** `src/config/landingImages.ts` and update the `hero` and/or `products` arrays with the exact filenames you use. Order in the array controls display order.

No build step is required: replace a file with the same name to update an image, or add a new filename to the config and drop the file in `public/landing/`.

## Running the app

```bash
yarn install
yarn dev
```

Build for production:

```bash
yarn build
yarn preview
```

## Firebase Auth on mobile

Google sign-in prefers a popup; if the browser blocks it, the app falls back to redirect. On mobile, redirect can fail when the app is not on the same domain as Firebase Auth (third-party storage blocking). For production:

- **Option A**: Deploy with **Firebase Hosting** and a **custom domain**, then set `authDomain` in Firebase config to that domain (e.g. `yourdomain.com`). Add `https://yourdomain.com/__/auth/handler` to your Google OAuth redirect URIs. See [Firebase redirect best practices](https://firebase.google.com/docs/auth/web/redirect-best-practices).
- **Option B**: Use the app over **HTTPS** and ensure the site is in the device’s allowed list so the popup can open.

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4, shadcn/ui (New York, neutral)
- React Router, React Icons, Lucide React
