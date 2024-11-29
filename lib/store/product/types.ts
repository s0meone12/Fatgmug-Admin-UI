// Define the types for the product information
export interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface ProductDimensions {
  width: number;
  height: number;
  depth: number;
}

export interface ProductMeta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: ProductDimensions;
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: ProductReview[];
  returnPolicy: string;
  minimumOrderQuantity: number;
  meta: ProductMeta;
  images: string[];
  thumbnail: string;
}

// Define the store structure
export interface ProductStore {
  products: Product[]; // List of all products
  product: Product | null; // A single product's details
  loadingList: boolean; // Loading state for fetching product list
  loadingProduct: boolean; // Loading state for fetching a single product
  error: string | null; // General error state
  fetchProducts: () => Promise<void>; // Fetch all products
  fetchProduct: (id: number) => Promise<void>; // Fetch a single product by ID
}
