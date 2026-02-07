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

## Stack

- React 19, TypeScript, Vite
- Tailwind CSS v4, shadcn/ui (New York, neutral)
- React Router, React Icons, Lucide React
