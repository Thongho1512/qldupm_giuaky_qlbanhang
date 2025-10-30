import React from 'react';
import { Link } from 'react-router-dom';
import { Package, Mail, Phone, MapPin, Facebook, Instagram, Youtube } from 'lucide-react';
import { ROUTES } from '@/utils/constants';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="text-primary-500" size={32} />
              <span className="text-xl font-bold text-white">FurniHub</span>
            </div>
            <p className="text-sm mb-4">
              Cửa hàng thời trang hàng đầu với những sản phẩm chất lượng cao và phong cách hiện đại.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                <Youtube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to={ROUTES.HOME} className="text-sm hover:text-primary-500 transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to={ROUTES.PRODUCTS} className="text-sm hover:text-primary-500 transition-colors">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Về chúng tôi
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Liên hệ
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-semibold mb-4">Hỗ trợ khách hàng</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Chính sách đổi trả
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Hướng dẫn mua hàng
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Câu hỏi thường gặp
                </a>
              </li>
              <li>
                <a href="#" className="text-sm hover:text-primary-500 transition-colors">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm">
                <MapPin size={18} className="flex-shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Phone size={18} className="flex-shrink-0" />
                <span>1900-xxxx</span>
              </li>
              <li className="flex items-center gap-2 text-sm">
                <Mail size={18} className="flex-shrink-0" />
                <span>support@fashionstore.vn</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} FurniHub. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-primary-500 transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                Chính sách bảo mật
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;