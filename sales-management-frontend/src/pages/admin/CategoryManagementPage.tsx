import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit, Trash2, FolderTree } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import {
  fetchAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/features/category/categorySlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '../../components/common/Textarea';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loading from '@/components/common/Loading';
import EmptyState from '@/components/common/EmptyState';
import { CategoryRequest } from '@/types/category.types';
import { formatDateTime } from '@/utils/formatDate';

const schema = yup.object({
  name: yup
    .string()
    .required('Tên danh mục là bắt buộc')
    .max(100, 'Tên danh mục không được quá 100 ký tự'),
  description: yup.string().max(500, 'Mô tả không được quá 500 ký tự'),
});

const CategoryManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, isLoading } = useSelector((state: RootState) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [categoryToDelete, setCategoryToDelete] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CategoryRequest>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleOpenModal = (categoryId?: number) => {
    if (categoryId) {
      const category = categories.find((c) => c.id === categoryId);
      if (category) {
        setEditingCategory(categoryId);
        setValue('name', category.name);
        setValue('description', category.description);
      }
    } else {
      setEditingCategory(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = async (data: CategoryRequest) => {
    if (editingCategory) {
      await dispatch(updateCategory({ id: editingCategory, data }));
    } else {
      await dispatch(createCategory(data));
    }
    handleCloseModal();
    dispatch(fetchAllCategories());
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      await dispatch(deleteCategory(categoryToDelete));
      setCategoryToDelete(null);
      dispatch(fetchAllCategories());
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý danh mục</h1>
            <p className="text-gray-600 mt-1">Quản lý danh mục sản phẩm thời trang</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={20} />}>
            Thêm danh mục
          </Button>
        </div>

        {/* Categories Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loading size="lg" text="Đang tải danh mục..." />
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary-50 rounded-lg">
                      <FolderTree className="text-primary-600" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500">
                        {category.productCount} sản phẩm
                      </p>
                    </div>
                  </div>
                </div>

                {category.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="text-xs text-gray-500 mb-4">
                  <p>Tạo: {formatDateTime(category.createdAt)}</p>
                  <p>Cập nhật: {formatDateTime(category.updatedAt)}</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenModal(category.id)}
                    leftIcon={<Edit size={16} />}
                    className="flex-1"
                  >
                    Sửa
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setCategoryToDelete(category.id)}
                    leftIcon={<Trash2 size={16} />}
                    className="flex-1"
                  >
                    Xóa
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FolderTree size={64} />}
            title="Chưa có danh mục"
            description="Thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm"
            action={{
              label: 'Thêm danh mục',
              onClick: () => handleOpenModal(),
            }}
          />
        )}
      </div>

      {/* Category Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục mới'}
        size="md"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên danh mục"
            placeholder="Nhập tên danh mục"
            error={errors.name?.message}
            required
            {...register('name')}
          />

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả danh mục (tùy chọn)"
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit">
              {editingCategory ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={categoryToDelete !== null}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Danh mục có sản phẩm không thể xóa."
        confirmText="Xóa"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default CategoryManagementPage;