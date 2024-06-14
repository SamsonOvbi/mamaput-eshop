export interface Article {
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

export interface ArticleFilter {
  pageSize?: string;
  pageNumber: number;
  category?: string;
  name?: string;
  sort?: string; // Property for orderForm
  rating?: number; // Property for ratingForm
  minValue?: number;
  maxValue?: number;
  // Add other filter properties if needed
}
