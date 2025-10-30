import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { Package, User, Mail, Lock, Phone } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { register as registerAction } from '@/features/auth/authSlice';
import { RegisterRequest } from '@/types/auth.types';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { ROUTES } from '@/utils/constants';

const schema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và gạch dưới'),
  password: yup
    .string()
    .required('Mật khẩu là bắt buộc')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .required('Xác nhận mật khẩu là bắt buộc')
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp'),
  email: yup
    .string()
    .required('Email là bắt buộc')
    .email('Email không hợp lệ'),
  fullName: yup.string().required('Họ tên là bắt buộc'),
  phone: yup
    .string()
    .required('Số điện thoại là bắt buộc')
    .matches(/^[0-9]{10,11}$/, 'Số điện thoại phải có 10-11 chữ số'),
});

type RegisterFormData = RegisterRequest & { confirmPassword: string };

const RegisterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoading } = useSelector((state: RootState) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    const result = await dispatch(registerAction(registerData));
    
    if (result.type === 'auth/register/fulfilled') {
      navigate(ROUTES.LOGIN);
    }
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đăng ký</h1>
          <p className="text-gray-600">Tạo tài khoản mới để bắt đầu mua sắm</p>
        </div>

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Tên đăng nhập"
              type="text"
              placeholder="Nhập tên đăng nhập"
              leftIcon={<User size={20} />}
              error={errors.username?.message}
              {...register('username')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Nhập email"
              leftIcon={<Mail size={20} />}
              error={errors.email?.message}
              {...register('email')}
            />

            <Input
              label="Họ tên"
              type="text"
              placeholder="Nhập họ tên đầy đủ"
              leftIcon={<User size={20} />}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <Input
              label="Số điện thoại"
              type="tel"
              placeholder="Nhập số điện thoại"
              leftIcon={<Phone size={20} />}
              error={errors.phone?.message}
              {...register('phone')}
            />

            <Input
              label="Mật khẩu"
              type="password"
              placeholder="Nhập mật khẩu"
              leftIcon={<Lock size={20} />}
              error={errors.password?.message}
              {...register('password')}
            />

            <Input
              label="Xác nhận mật khẩu"
              type="password"
              placeholder="Nhập lại mật khẩu"
              leftIcon={<Lock size={20} />}
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                required
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Điều khoản sử dụng
                </a>{' '}
                và{' '}
                <a href="#" className="text-primary-600 hover:text-primary-700 font-medium">
                  Chính sách bảo mật
                </a>
              </span>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
            >
              Đăng ký
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Đã có tài khoản?{' '}
              <Link
                to={ROUTES.LOGIN}
                className="text-primary-600 hover:text-primary-700 font-semibold"
              >
                Đăng nhập ngay
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

export default RegisterPage;