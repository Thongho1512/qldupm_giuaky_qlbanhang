import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Package, Mail, Lock } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { login } from '@/features/auth/authSlice';
import { LoginRequest } from '@/types/auth.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';

const schema = yup.object({
  username: yup.string().required('Tên đăng nhập là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc'),
});

const LoginPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, user } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated && user) {
      // Redirect based on role
      const isAdmin = user.role === 'ADMIN';
      if (isAdmin) {
        navigate(ROUTES.ADMIN_DASHBOARD);
      } else {
        navigate(ROUTES.HOME);
      }
    }
  }, [isAuthenticated, user, navigate]);

  const onSubmit = async (data: LoginRequest) => {
    await dispatch(login(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 mb-4">
            <Package className="text-primary-600" size={40} />
            <span className="text-2xl font-bold text-gray-900">FurniHub</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Chào mừng bạn quay trở lại!</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Tên đăng nhập"
              type="text"
              placeholder="Nhập tên đăng nhập"
              leftIcon={<Mail size={20} />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              leftIcon={<Lock size={20} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </label>
              
              <a href="#" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Quên mật khẩu?
              </a>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Đăng nhập
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Chưa có tài khoản?{' '}
              <Link
                to={ROUTES.REGISTER}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link
            to={ROUTES.HOME}
            className="text-gray-600 hover:text-gray-900 text-sm font-medium"
          >
            ← Quay lại trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;