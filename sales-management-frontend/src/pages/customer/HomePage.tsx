import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ShoppingBag, TrendingUp, Shield, Truck } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchLatestProducts } from '@/features/product/productSlice';
import { fetchAllCategories } from '@/features/category/categorySlice';
import ProductCard from '@/components/product/ProductCard';
import Button from '@/components/common/Button';
import Loading, { ProductCardSkeleton } from '@/components/common/Loading';
import { ROUTES } from '@/utils/constants';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const HomePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);

  useEffect(() => {
    dispatch(fetchLatestProducts(8));
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const features = [
    {
      icon: Truck,
      title: 'Giao hàng nhanh',
      description: 'Miễn phí vận chuyển cho đơn hàng trên 500K',
    },
    {
      icon: Shield,
      title: 'Thanh toán an toàn',
      description: 'Bảo mật thông tin thanh toán 100%',
    },
    {
      icon: TrendingUp,
      title: 'Chất lượng cao',
      description: 'Sản phẩm chính hãng, đảm bảo chất lượng',
    },
    {
      icon: ShoppingBag,
      title: 'Đổi trả dễ dàng',
      description: 'Đổi trả trong vòng 7 ngày nếu không hài lòng',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
                Biến không gian sống của bạn thành tác phẩm nghệ thuật
              </h1>
              <p className="text-lg md:text-xl mb-8 text-primary-100 animate-fade-in">
                Khám phá bộ sưu tập nội thất tinh tế, kết hợp giữa thiết kế hiện đại và chất lượng vượt trội
              </p>
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="secondary">
                  Mua sắm ngay
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 text-center hover:shadow-md transition-shadow"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
                    <feature.icon size={32} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="section">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Danh mục sản phẩm
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Khám phá các danh mục sản phẩm đa dạng của chúng tôi
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`${ROUTES.PRODUCTS}?category=${category.id}`}
                  className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-primary-300 transition-all text-center group"
                >
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category.productCount} sản phẩm
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Latest Products */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Sản phẩm mới nhất
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Cập nhật những sản phẩm thời trang mới nhất và hot nhất
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Link to={ROUTES.PRODUCTS}>
                    <Button size="lg">
                      Xem tất cả sản phẩm
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="container-custom text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Sẵn sàng mua sắm?
            </h2>
            <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
              Đăng ký ngay để nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={ROUTES.PRODUCTS}>
                <Button size="lg" variant="secondary">
                  Mua sắm ngay
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary-600">
                  Đăng ký tài khoản
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;