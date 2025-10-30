// ============================================
// 1. ProductManagementPage.tsx (FIXED)
// ============================================

// src/pages/admin/ProductManagementPage.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Plus, Edit, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { RootState, AppDispatch } from '@/store/store';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct } from '@/features/product/productSlice';
import { fetchAllCategories } from '@/features/category/categorySlice';
import AdminLayout from '@/components/layout/AdminLayout';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import Textarea from '@/components/common/Textarea';
import Select from '@/components/common/Select';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Pagination from '@/components/common/Pagination';
import SearchBar from '@/components/common/SearchBar';
import Badge from '@/components/common/Badge';
import { TableRowSkeleton } from '@/components/common/Loading';
import { formatCurrency } from '@/utils/formatCurrency';
import { getProductStatusColor, getProductStatusText } from '@/utils/helpers';
import { ProductRequest } from '@/types/product.types';
import { PRODUCT_STATUS } from '@/utils/constants';
import toast from 'react-hot-toast';
// THÊM (import cả 2 functions):
import { ProductImage, getImageUrl } from '@/utils/imageHelper';

const schema = yup.object({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  description: yup.string().optional(),
  price: yup.number().required('Giá là bắt buộc').min(0, 'Giá phải lớn hơn 0'),
  stock: yup.number().required('Số lượng là bắt buộc').min(0, 'Số lượng phải >= 0'),
  categoryId: yup.number().required('Danh mục là bắt buộc'),
  status: yup.string().optional(),
});


const ProductManagementPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, isLoading, totalPages, currentPage } = useSelector((state: RootState) => state.product);
  const { categories } = useSelector((state: RootState) => state.category);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<number | null>(null);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ProductRequest>({
    resolver: yupResolver(schema) as any,
  });

  useEffect(() => {
    dispatch(fetchAllProducts({ page: currentPage, size: 10, keyword: searchKeyword }));
  }, [dispatch, currentPage, searchKeyword]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  const handlePageChange = (page: number) => {
    dispatch(fetchAllProducts({ page, size: 10, keyword: searchKeyword }));
  };

  const handleOpenModal = (productId?: number) => {
    if (productId) {
      const product = products.find(p => p.id === productId);
      if (product) {
        setEditingProduct(productId);
        setValue('name', product.name);
        setValue('description', product.description);
        setValue('price', product.price);
        setValue('stock', product.stock);
        setValue('categoryId', product.categoryId);
        setValue('status', product.status);
        setImagePreview(getImageUrl(product.imageUrl));
      }
    } else {
      setEditingProduct(null);
      reset({
        status: 'ACTIVE',
      });
      setImagePreview('');
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview('');
    setIsUploading(false);
    reset();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WebP)');
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB');
      return;
    }

    setIsUploading(true);
    setImageFile(file);

    // Create preview using FileReader
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      setIsUploading(false);
    };
    reader.onerror = () => {
      toast.error('Không thể đọc file ảnh');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const onSubmit = async (data: ProductRequest) => {
    const formData = new FormData();
    
    const productData = {
      name: data.name,
      description: data.description || '',
      price: data.price,
      stock: data.stock,
      categoryId: data.categoryId,
      status: data.status || 'ACTIVE',
    };
    
    formData.append('product', JSON.stringify(productData));
    
    if (imageFile) {
      formData.append('file', imageFile);
    }

    try {
      if (editingProduct) {
        await dispatch(updateProduct({ id: editingProduct, data: formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }
      handleCloseModal();
      dispatch(fetchAllProducts({ page: currentPage, size: 10, keyword: searchKeyword }));
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProduct(productToDelete));
      setProductToDelete(null);
      dispatch(fetchAllProducts({ page: currentPage, size: 10, keyword: searchKeyword }));
    }
  };

  const categoryOptions = [
    { value: '', label: 'Chọn danh mục' },
    ...categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))
  ];

  const statusOptions = [
    { value: PRODUCT_STATUS.ACTIVE, label: 'Đang bán' },
    { value: PRODUCT_STATUS.INACTIVE, label: 'Ngừng bán' },
    { value: PRODUCT_STATUS.OUT_OF_STOCK, label: 'Hết hàng' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý sản phẩm</h1>
            <p className="text-gray-600 mt-1">Quản lý danh sách sản phẩm thời trang</p>
          </div>
          <Button onClick={() => handleOpenModal()} leftIcon={<Plus size={20} />}>
            Thêm sản phẩm
          </Button>
        </div>

        <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm sản phẩm..." />

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="table">
              <thead className="table-header">
                <tr>
                  <th className="table-header-cell">Hình ảnh</th>
                  <th className="table-header-cell">Tên sản phẩm</th>
                  <th className="table-header-cell">Danh mục</th>
                  <th className="table-header-cell">Giá</th>
                  <th className="table-header-cell">Kho</th>
                  <th className="table-header-cell">Trạng thái</th>
                  <th className="table-header-cell">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={7} />
                  ))
                ) : products.length > 0 ? (
                  products.map((product) => (
                    <tr key={product.id} className="table-row">
                      <td className="table-cell">
  <ProductImage
    src={product.imageUrl}
    alt={product.name}
    className="w-16 h-16 rounded-lg object-cover"
  />
</td>
                      <td className="table-cell font-medium">{product.name}</td>
                      <td className="table-cell">{product.categoryName}</td>
                      <td className="table-cell font-semibold">{formatCurrency(product.price)}</td>
                      <td className="table-cell">{product.stock}</td>
                      <td className="table-cell">
                        <Badge variant={getProductStatusColor(product.status) as any}>
                          {getProductStatusText(product.status)}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenModal(product.id)}
                            leftIcon={<Edit size={16} />}
                          >
                            Sửa
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => setProductToDelete(product.id)}
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
                    <td colSpan={7} className="table-cell text-center text-gray-500 py-8">
                      Không có sản phẩm nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProduct ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Tên sản phẩm"
            placeholder="Nhập tên sản phẩm"
            error={errors.name?.message}
            required
            {...register('name')}
          />

          <Textarea
            label="Mô tả"
            placeholder="Nhập mô tả sản phẩm"
            rows={4}
            error={errors.description?.message}
            {...register('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Giá"
              type="number"
              placeholder="0"
              error={errors.price?.message}
              required
              {...register('price')}
            />

            <Input
              label="Số lượng"
              type="number"
              placeholder="0"
              error={errors.stock?.message}
              required
              {...register('stock')}
            />
          </div>

          <Select
            label="Danh mục"
            options={categoryOptions}
            error={errors.categoryId?.message}
            required
            {...register('categoryId')}
          />

          <Select
            label="Trạng thái"
            options={statusOptions}
            error={errors.status?.message}
            {...register('status')}
          />

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hình ảnh
            </label>
            
            {imagePreview ? (
              <div className="relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-w-xs h-48 rounded-lg object-cover border-2 border-gray-200"
                  
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
                  <ImageIcon className="mx-auto text-gray-400 mb-2" size={48} />
                  <p className="text-sm text-gray-600 mb-1">
                    Click để chọn ảnh
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG, GIF, WebP (Max 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </label>
            )}
            
            {isUploading && (
              <p className="text-sm text-gray-500 mt-2">Đang tải ảnh...</p>
            )}
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button type="submit" isLoading={isUploading}>
              {editingProduct ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={productToDelete !== null}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDelete}
        title="Xóa sản phẩm"
        message="Bạn có chắc chắn muốn xóa sản phẩm này?"
        confirmText="Xóa"
        variant="danger"
      />
    </AdminLayout>
  );
};

export default ProductManagementPage;