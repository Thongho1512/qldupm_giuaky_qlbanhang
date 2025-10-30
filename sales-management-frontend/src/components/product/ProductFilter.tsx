// sales-management-frontend/src/components/product/ProductFilter.tsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter, X } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchAllCategories } from '@/features/category/categorySlice';
import Button from '@/components/common/Button';
import { SORT_OPTIONS } from '@/utils/constants';
import { ProductFilterState } from '@/types/filter.types'; // IMPORT

interface ProductFilterProps {
  onFilterChange: (filters: ProductFilterState) => void; // SỬ DỤNG TYPE CHUNG
  isMobile?: boolean;
  onClose?: () => void;
}

const ProductFilter: React.FC<ProductFilterProps> = ({
  onFilterChange,
  isMobile = false,
  onClose,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);

  const [filters, setFilters] = useState<ProductFilterState>({ // SỬ DỤNG TYPE CHUNG
    sortBy: 'createdAt',
    sortDir: 'DESC',
  });

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleCategoryChange = (categoryId: number | undefined) => {
    const newFilters = { ...filters, categoryId };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSortChange = (value: string) => {
    const [sortBy, sortDir] = value.split('-');
    const newFilters = { 
      ...filters, 
      sortBy, 
      sortDir: sortDir as 'ASC' | 'DESC' // TYPE ASSERTION
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    const newFilters: ProductFilterState = {
      sortBy: 'createdAt',
      sortDir: 'DESC',
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const hasActiveFilters = filters.categoryId;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Filter className="text-primary-600" size={20} />
          <h3 className="text-lg font-semibold text-gray-900">Bộ lọc</h3>
        </div>
        
        {isMobile && onClose && (
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        )}
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sắp xếp theo
        </label>
        <select
          value={`${filters.sortBy}-${filters.sortDir}`}
          onChange={(e) => handleSortChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Danh mục</h4>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={!filters.categoryId}
              onChange={() => handleCategoryChange(undefined)}
              className="text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Tất cả</span>
          </label>
          
          {categories.map((category) => (
            <label key={category.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.categoryId === category.id}
                onChange={() => handleCategoryChange(category.id)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700">
                {category.name} ({category.productCount})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          fullWidth
          onClick={handleClearFilters}
          leftIcon={<X size={18} />}
        >
          Xóa bộ lọc
        </Button>
      )}
    </div>
  );
};

export default ProductFilter;