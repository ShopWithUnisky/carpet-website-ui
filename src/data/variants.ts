export type Variant = {
  id: string;
  name: string;
  imageUrl: string;
  price: number | null;
  description?: string;
  tags?: string[];
};

/**
 * Listing page data. Image URLs can point to public/listing/<id>.jpg
 * or use the same /landing/ folder with filenames from landingImages.
 */
export const variants: Variant[] = [
  {
    id: "v1",
    name: "Classic Wool Plush",
    imageUrl: "/listing/classic-wool.jpg",
    price: 299,
    description: "Soft wool blend, ideal for living spaces.",
    tags: ["wool", "plush"],
  },
  {
    id: "v2",
    name: "Modern Geometric",
    imageUrl: "/listing/modern-geometric.jpg",
    price: 349,
    description: "Contemporary design with subtle pattern.",
    tags: ["modern", "pattern"],
  },
  {
    id: "v3",
    name: "Natural Jute",
    imageUrl: "/listing/natural-jute.jpg",
    price: 199,
    description: "Eco-friendly jute, perfect for casual areas.",
    tags: ["jute", "natural"],
  },
  {
    id: "v4",
    name: "Persian Heritage",
    imageUrl: "/listing/persian-heritage.jpg",
    price: null,
    description: "Hand-knotted, enquire for pricing.",
    tags: ["handmade", "luxury"],
  },
  {
    id: "v5",
    name: "Minimal Loop",
    imageUrl: "/listing/minimal-loop.jpg",
    price: 249,
    description: "Clean loop pile, easy to maintain.",
    tags: ["minimal", "loop"],
  },
  {
    id: "v6",
    name: "Velvet Touch",
    imageUrl: "/listing/velvet-touch.jpg",
    price: 399,
    description: "Luxurious velvet pile for bedrooms.",
    tags: ["velvet", "luxury"],
  },
];
