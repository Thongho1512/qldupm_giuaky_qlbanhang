export interface ProductFilterState {
  categoryId?: number;
  sortBy: string;
  sortDir: 'ASC' | 'DESC';
}