// Category
export interface Category {
  id: number;
  name: string;
  description: string;
  productCount: number;
  createdAt: string;
  updatedAt: string;
}

// Category Request
export interface CategoryRequest {
  name: string;
  description: string | undefined;
}

// Category State
export interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}