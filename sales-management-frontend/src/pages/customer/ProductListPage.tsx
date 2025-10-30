// sales-management-frontend/src/pages/customer/ProductListPage.tsx
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchActiveProducts } from '@/features/product/productSlice';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ProductCard from '@/components/product/ProductCard';
import ProductFilter from '@/components/product/ProductFilter';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import Button from '@/components/common/Button';
import { ProductCardSkeleton } from '@/components/common/Loading';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { ProductFilterState } from '@/types/filter.types'; // IMPORT TYPE CHUNG

const ProductListPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const { products, isLoading, totalPages, currentPage, totalElements } = useSelector(
    (state: RootState) => state.product
  );

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const keyword = searchParams.get('search') || '';
  const [filters, setFilters] = useState<ProductFilterState>({ // SỬ DỤNG TYPE CHUNG
    sortBy: 'createdAt',
    sortDir: 'DESC',
    categoryId: searchParams.get('category') ? Number(searchParams.get('category')) : undefined,
  });

  useEffect(() => {
    dispatch(fetchActiveProducts({
      page: currentPage,
      size: DEFAULT_PAGE_SIZE,
      keyword,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      // Chỉ gửi categoryId nếu có
      ...(filters.categoryId && { categoryId: filters.categoryId }),
    }));
  }, [dispatch, currentPage, keyword, filters]);

  const handleFilterChange = (newFilters: ProductFilterState) => { // TYPE CHUNG
    setFilters(newFilters);
    setShowMobileFilter(false);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchActiveProducts({
      page,
      size: DEFAULT_PAGE_SIZE,
      keyword,
      sortBy: filters.sortBy,
      sortDir: filters.sortDir,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
    }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container-custom py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Tất cả sản phẩm'}
            </h1>
            <p className="text-gray-600">
              Tìm thấy {totalElements} sản phẩm
            </p>
          </div>

          <div className="flex gap-8">
            {/* Sidebar Filter - Desktop */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <ProductFilter onFilterChange={handleFilterChange} />
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden fixed bottom-6 right-6 z-30">
              <Button
                onClick={() => setShowMobileFilter(true)}
                leftIcon={<SlidersHorizontal size={20} />}
                className="shadow-lg"
              >
                Bộ lọc
              </Button>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilter && (
              <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40">
                <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white overflow-y-auto">
                  <ProductFilter
                    onFilterChange={handleFilterChange}
                    isMobile
                    onClose={() => setShowMobileFilter(false)}
                  />
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="flex-1">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  )}
                </>
              ) : (
                <EmptyState
                  icon="product"
                  title="Không tìm thấy sản phẩm"
                  description="Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác"
                />
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProductListPage;