import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Package, Menu, X, Search, FileSearch } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useDispatch } from 'react-redux';
import { logout } from '@/features/auth/authSlice';
import { AppDispatch } from '@/store/store';
import Button from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';

const Header: React.FC = () => {
  const { isAuthenticated, user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate(ROUTES.LOGIN);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`${ROUTES.PRODUCTS}?search=${searchQuery}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center gap-2">
            <Package className="text-primary-600" size={32} />
            <span className="text-xl font-bold text-gray-900">FurniHub</span>
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            </div>
          </form>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to={ROUTES.PRODUCTS}
              className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
            >
              Sản phẩm
            </Link>

            <Link 
              to = {ROUTES.TRACK_ORDER}
              className='text-gray-700 hover:text-primary-600 font-medium transition-colors flex items-center gap-2'>
                <FileSearch size={20} />
                Tra cứu đơn hàng
            </Link>
            <Link
              to={ROUTES.CART}
              className="relative text-gray-700 hover:text-primary-600 transition-colors"
            >
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    to={ROUTES.ADMIN_DASHBOARD}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors"
                  >
                    Quản trị
                  </Link>
                )}

                

                <div className="relative group">
                  <button className="flex items-center gap-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User size={24} />
                    <span className="font-medium">{user?.fullName || user?.username}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      to={ROUTES.ORDER_HISTORY}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Đơn hàng của tôi
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                    >
                      <LogOut size={18} />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="outline" size="sm">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-gray-700 p-2"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            {/* Search - Mobile */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </form>

            <nav className="flex flex-col gap-3">
              <Link
                to={ROUTES.PRODUCTS}
                className="text-gray-700 hover:text-primary-600 font-medium py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sản phẩm
              </Link>

              <Link
                to={ROUTES.TRACK_ORDER}
                className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center gap-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <FileSearch size={20} />
                Tra cứu đơn hàng
              </Link>

              {isAuthenticated ? (
                <>
                  {isAdmin && (
                    <Link
                      to={ROUTES.ADMIN_DASHBOARD}
                      className="text-gray-700 hover:text-primary-600 font-medium py-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Quản trị
                    </Link>
                  )}

                  <Link
                    to={ROUTES.CART}
                    className="text-gray-700 hover:text-primary-600 font-medium py-2 flex items-center gap-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <ShoppingCart size={20} />
                    Giỏ hàng ({totalItems})
                  </Link>

                  <Link
                    to={ROUTES.ORDER_HISTORY}
                    className="text-gray-700 hover:text-primary-600 font-medium py-2"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>

                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-red-600 hover:text-red-700 font-medium py-2 text-left flex items-center gap-2"
                  >
                    <LogOut size={20} />
                    Đăng xuất
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" fullWidth>
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                    <Button fullWidth>Đăng ký</Button>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;