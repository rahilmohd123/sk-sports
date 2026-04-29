import { useState } from 'react';
import { Plus, Edit2, Trash2, X, Save, Package, AlertTriangle, Search, Loader2, Upload, ImageIcon, Image } from 'lucide-react';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation, useUploadImageMutation } from '../api/productsApiSlice';
import { useGetCategoriesQuery } from '../api/categoriesApiSlice';

const EMPTY_FORM = {
  name: '',
  price: '',
  description: '',
  brand: '',
  category: '',
  countInStock: '',
  images: '',
};

const Products = () => {
  const { data: products = [], isLoading, isError } = useGetProductsQuery();
  const { data: categories = [] } = useGetCategoriesQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();
  const [uploadImage, { isLoading: isUploadingImg }] = useUploadImageMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [search, setSearch] = useState('');
  const [formError, setFormError] = useState('');

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      price: product.price,
      description: product.description,
      brand: product.brand,
      category: product.category?._id || product.category || '',
      countInStock: product.countInStock,
      images: (product.images || []).join(', '),
    });
    setFormError('');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadImage(formData).unwrap();
      // Add the new URL to the images list
      setForm((prev) => ({
        ...prev,
        images: prev.images ? `${prev.images}, ${res.url}` : res.url
      }));
    } catch (err) {
      setFormError('Failed to upload image. Please check your connection and Cloudinary settings.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      description: form.description,
      brand: form.brand,
      category: form.category,
      countInStock: parseInt(form.countInStock, 10),
      images: form.images ? form.images.split(',').map((s) => s.trim()).filter(Boolean) : [],
    };

    try {
      if (editingProduct) {
        await updateProduct({ id: editingProduct._id, ...payload }).unwrap();
      } else {
        await createProduct(payload).unwrap();
      }
      closeModal();
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to save product. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id).unwrap();
      setDeleteConfirmId(null);
    } catch (err) {
      alert(err?.data?.message || 'Failed to delete product.');
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.brand || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Products Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Add, edit, or delete your inventory.</p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="pl-9 pr-4 py-2.5 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {isError && (
        <div className="mb-5 flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          Failed to load products. Please ensure you are logged in.
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Brand</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading
                ? Array(4).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(6).fill(0).map((_, j) => (
                        <td key={j} className="p-4"><div className="h-5 bg-gray-100 animate-pulse rounded-lg" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={6} className="text-center py-16 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No products found</p>
                        <p className="text-xs mt-1">Click "Add Product" to create your first product.</p>
                      </td>
                    </tr>
                  )
                : filtered.map((product) => (
                    <tr key={product._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{product.name}</p>
                          <p className="text-xs text-gray-400 dark:text-gray-500 font-mono mt-0.5">#{product._id.slice(-8)}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{product.category?.name || '—'}</td>
                      <td className="p-4 text-gray-600 dark:text-gray-400">{product.brand}</td>
                      <td className="p-4 font-bold text-gray-900 dark:text-white">₹{Number(product.price).toFixed(2)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${product.countInStock > 0 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'}`}>
                          {product.countInStock > 0 ? `${product.countInStock} in stock` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => openEdit(product)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-flex items-center"
                          title="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* Products count */}
      {!isLoading && products.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 pl-1">
          Showing {filtered.length} of {products.length} products
        </p>
      )}

      {/* Create/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm">
                  <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  {formError}
                </div>
              )}
              {[
                { label: 'Product Name', name: 'name', type: 'text', placeholder: 'e.g. Pro Cricket Bat', required: true },
                { label: 'Brand', name: 'brand', type: 'text', placeholder: 'e.g. SG Sports', required: true },
                { label: 'Price (₹)', name: 'price', type: 'number', placeholder: '0.00', required: true, min: 0, step: '0.01' },
                { label: 'Count In Stock', name: 'countInStock', type: 'number', placeholder: '0', required: true, min: 0 },
              ].map(({ label, name, ...rest }) => (
                <div key={name}>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
                  <input
                    name={name}
                    value={form[name]}
                    onChange={handleFormChange}
                    className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    {...rest}
                  />
                </div>
              ))}

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                  <span>Product Images</span>
                  <span className="text-[10px] text-gray-400 font-normal">URL or Upload</span>
                </label>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      name="images"
                      value={form.images}
                      onChange={handleFormChange}
                      placeholder="Paste URLs (comma-separated)..."
                      className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">OR</span>
                    <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800"></div>
                  </div>

                  <label className={`
                    flex flex-col items-center justify-center w-full h-24 border-2 border-dashed rounded-2xl cursor-pointer
                    ${isUploadingImg ? 'bg-gray-50 border-blue-400' : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-50/10'}
                    transition-all duration-300
                  `}>
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      {isUploadingImg ? (
                        <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                      ) : (
                        <Upload className="w-6 h-6 mb-1 text-gray-400" />
                      )}
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {isUploadingImg ? 'Uploading...' : <><span className="font-bold text-blue-600">Click to upload</span> to Cloudinary</>}
                      </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isUploadingImg} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleFormChange}
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleFormChange}
                  rows={3}
                  required
                  placeholder="Product description..."
                  className="w-full px-3 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {(isCreating || isUpdating) ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> {editingProduct ? 'Update' : 'Create'} Product</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Delete Product</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={isDeleting}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
              >
                {isDeleting ? <><Loader2 className="w-4 h-4 animate-spin" /> Deleting...</> : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
