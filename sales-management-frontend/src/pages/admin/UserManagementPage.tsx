// src/pages/admin/UserManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit, Trash2, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchAllUsers,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
} from '@/features/user/userSlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import Badge from '@/components/common/Badge';
import { TableRowSkeleton } from '@/components/common/Loading';
import { formatDateTime } from '@/utils/formatDate';
import { getUserRoleText } from '@/utils/helpers';
import { UserRequest } from '@/types/user.types';
import { USER_STATUS, USER_ROLE } from '@/utils/constants';

const schema = yup.object({
  username: yup
    .string()
    .required('Tên đăng nhập là bắt buộc')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .matches(/^[a-zA-Z0-9_]+$/, 'Tên đăng nhập chỉ chứa chữ cái, số và gạch dưới'),
  password: yup
    .string()
    .optional()
    .test('password-length', 'Mật khẩu phải có ít nhất 6 ký tự', function(value) {
      if (value && value.length > 0 && value.length < 6) {
        return false;
      }
      return true;
    }),
  email: yup.string().required('Email là bắt buộc').email('Email không hợp lệ'),
  fullName: yup.string().optional(),
  phone: yup.string().optional().matches(/^[0-9]{10,11}$/, {
    message: 'Số điện thoại phải có 10-11 chữ số',
    excludeEmptyString: true,
  }),
  role: yup.string().required('Vai trò là bắt buộc'),
  status: yup.string().required('Trạng thái là bắt buộc'),
});

const UserManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, totalPages, currentPage } = useSelector(
    (state: RootState) => state.user
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<number | null>(null);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserRequest>({
    resolver: yupResolver(schema) as any,
  });

  // ✅ FIX: Chỉ load dữ liệu khi currentPage hoặc searchKeyword thay đổi
  useEffect(() => {
    dispatch(fetchAllUsers({ page: currentPage, size: 10, keyword: searchKeyword }));
  }, [dispatch, currentPage, searchKeyword]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchAllUsers({ page, size: 10, keyword: searchKeyword }));
  };

  const handleOpenModal = (userId?: number) => {
    if (userId) {
      const user = users.find((u) => u.id === userId);
      if (user) {
        setEditingUser(userId);
        setValue('username', user.username);
        setValue('email', user.email);
        setValue('fullName', user.fullName || '');
        setValue('phone', user.phone || '');
        setValue('role', user.role);
        setValue('status', user.status);
        setValue('password', '');
      }
    } else {
      setEditingUser(null);
      reset({
        role: 'CUSTOMER',
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    reset();
  };

  const onSubmit = async (data: UserRequest) => {
    if (!editingUser && !data.password) {
      toast.error('Mật khẩu là bắt buộc khi tạo người dùng mới');
      return;
    }

    if (editingUser && !data.password) {
      const { password, ...dataWithoutPassword } = data;
      await dispatch(updateUser({ id: editingUser, data: dataWithoutPassword }));
    } else if (editingUser) {
      await dispatch(updateUser({ id: editingUser, data }));
    } else {
      await dispatch(createUser(data));
    }

    handleCloseModal();
    dispatch(fetchAllUsers({ page: currentPage, size: 10, keyword: searchKeyword }));
  };

  const handleStatusChange = async (userId: number, status: string) => {
    await dispatch(updateUserStatus({ id: userId, status }));
    dispatch(fetchAllUsers({ page: currentPage, size: 10, keyword: searchKeyword }));
  };

  const handleDelete = async () => {
    if (userToDelete) {
      await dispatch(deleteUser(userToDelete));
      setUserToDelete(null);
      dispatch(fetchAllUsers({ page: currentPage, size: 10, keyword: searchKeyword }));
    }
  };

  const roleOptions = [
    { value: USER_ROLE.CUSTOMER, label: 'Khách hàng' },
    { value: USER_ROLE.ADMIN, label: 'Quản trị viên' },
  ];

  const statusOptions = [
    { value: USER_STATUS.ACTIVE, label: 'Hoạt động' },
    { value: USER_STATUS.INACTIVE, label: 'Không hoạt động' },
    { value: USER_STATUS.BANNED, label: 'Bị khóa' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý người dùng</h1>
            <p className="text-gray-600 mt-1">Quản lý tài khoản người dùng hệ thống</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={20} />}>
            Thêm người dùng
          </Button>
        </div>

        {/* Search */}
        <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm người dùng..." />

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">ID</th>
                  <th className="table-header-cell">Tên đăng nhập</th>
                  <th className="table-header-cell">Email</th>
                  <th className="table-header-cell">Họ tên</th>
                  <th className="table-header-cell">Vai trò</th>
                  <th className="table-header-cell">Trạng thái</th>
                  <th className="table-header-cell">Ngày tạo</th>
                  <th className="table-header-cell">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={8} />
                  ))
                ) : users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id} className="table-row">
                      <td className="table-cell font-mono text-sm">{user.id}</td>
                      <td className="table-cell font-medium">{user.username}</td>
                      <td className="table-cell">{user.email}</td>
                      <td className="table-cell">{user.fullName || '-'}</td>
                      <td className="table-cell">
                        <Badge variant={user.role === 'ADMIN' ? 'primary' : 'gray'}>
                          {getUserRoleText(user.role)}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <select
                          value={user.status}
                          onChange={(e) => handleStatusChange(user.id, e.target.value)}
                          className="text-sm border-0 bg-transparent font-medium cursor-pointer focus:ring-0"
                        >
                          {statusOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="table-cell text-sm">
                        {formatDateTime(user.createdAt)}
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(user.id)}
                            leftIcon={<Edit size={16} />}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setUserToDelete(user.id)}
                            leftIcon={<Trash2 size={16} />}
                          >
                            Xóa
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="table-cell text-center text-gray-500 py-8">
                      Không có người dùng nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* User Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên đăng nhập"
            placeholder="Nhập tên đăng nhập"
            error={errors.username?.message}
            required
            disabled={!!editingUser}
            {...register('username')}
          />

          <Input
            label="Mật khẩu"
            type="password"
            placeholder={editingUser ? 'Để trống nếu không đổi' : 'Nhập mật khẩu'}
            error={errors.password?.message}
            required={!editingUser}
            leftIcon={<Lock size={20} />}
            {...register('password')}
          />

          <Input
            label="Email"
            type="email"
            placeholder="Nhập email"
            error={errors.email?.message}
            required
            {...register('email')}
          />

          <Input
            label="Họ tên"
            placeholder="Nhập họ tên đầy đủ"
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            error={errors.phone?.message}
            {...register('phone')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Vai trò"
              options={roleOptions}
              error={errors.role?.message}
              required
              {...register('role')}
            />

            <Select
              label="Trạng thái"
              options={statusOptions}
              error={errors.status?.message}
              required
              {...register('status')}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit">{editingUser ? 'Cập nhật' : 'Thêm mới'}</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={userToDelete !== null}
        onClose={() => setUserToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa người dùng"
        message="Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default UserManagementPage;