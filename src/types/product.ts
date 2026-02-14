export interface Product {
  _id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  slug: string;
  price: number;
  mrp: number;
  discountPercentage: number;
  stockQuantity: number;
  shippingCharge: number;
  size: string;
  material: string;
  color: string;
  pattern: string;
  shape: string;
  pileHeight: string;
  thickness: number;
  weight: number;
  backingMaterial: string;
  weaveType: string;
  roomType: string[];
  careInstructions: string;
  countryOfOrigin: string;
  images: string[];
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  isActive: boolean;
  createdBy: CreatedBy;
  createdAt: string;
  updatedAt: string;
  __v: number;
  inStock: boolean;
  finalPrice: number;
  discountAmount: number;
  id: string;
}

export interface CreatedBy {
  _id: string;
  email: string;
  name: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
