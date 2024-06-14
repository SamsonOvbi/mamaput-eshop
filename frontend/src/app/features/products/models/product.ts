export interface Product {
  _id: string;
  id: number;
  name: string;
  slug: string;
  price: number;
  image: string;
  brand: string;
  category: string;
  description: string;
  countInStock: number;
  rating: number;
  numReviews: number;
  reviews: any[];
}

export interface ProductFilter {
  category?: string;
  name?: string;
  description?: string;
  sort?: string; // Property for orderForm
  rating?: number; // Property for ratingForm
  minValue?: number;
  maxValue?: number;
  pageSize?: string;
  pageNumber: number;
  // Add other filter properties if needed
}