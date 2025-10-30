// Product Status
export enum ProductStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
}

// Product
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  categoryName: string;
  imageUrl: string;
  status: string; // "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK"
  createdAt: string;
  updatedAt: string;
}

// Product Request (for create/update)
export interface ProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: number;
  imageUrl?: string;
  status?: string;
}

// Product Form Data (with file)
export interface ProductFormData extends ProductRequest {
  file?: File;
}

// Product Filter
export interface ProductFilter {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  status?: ProductStatus;
  keyword?: string;
}

// Product State
export interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  totalPages: number;
  totalElements: number;
  currentPage: number;
  isLoading: boolean;
  error: string | null;
}