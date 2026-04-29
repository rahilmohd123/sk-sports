import { useState } from 'react';
import { Plus, Trash2, X, Save, Layers, AlertTriangle, Loader2, Upload, ImageIcon } from 'lucide-react';
import { useGetCategoriesQuery, useCreateCategoryMutation, useDeleteCategoryMutation } from '../api/categoriesApiSlice';
import { useUploadImageMutation } from '../api/productsApiSlice';

const Categories = () => {
  const { data: categories = [], isLoading, isError } = useGetCategoriesQuery();
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [uploadImage, { isLoading: isUploadingImg }] = useUploadImageMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', image: '' });
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await createCategory(form).unwrap();
      setModalOpen(false);
      setForm({ name: '', description: '', image: '' });
    } catch (err) {
      setFormError(err?.data?.message || 'Failed to create category.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This may affect products in this category.')) {
      try {
        await deleteCategory(id).unwrap();
      } catch (err) {
        alert(err?.data?.message || 'Failed to delete category.');
      }
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await uploadImage(formData).unwrap();
      setForm((prev) => ({ ...prev, image: res.url }));
    } catch (err) {
      setFormError('Failed to upload image. Please check your connection and Cloudinary settings.');
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Categories Management</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Organize your products with categories.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-xl transition shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Failed to load categories.</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-2xl" />
          ))
        ) : categories.length === 0 ? (
          <div className="col-span-full text-center py-20 text-gray-400">
            <Layers className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="font-medium">No categories found</p>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat._id} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden group hover:border-blue-300 transition-all">
              <div className="h-32 bg-gray-100 relative overflow-hidden">
                {cat.image ? (
                  <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Layers className="w-10 h-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="p-2 bg-white/90 hover:bg-red-50 text-red-600 rounded-xl shadow-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg capitalize">{cat.name}</h3>
                <p className="text-gray-500 text-sm mt-1 line-clamp-2 min-h-[40px]">{cat.description || 'No description provided.'}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Add New Category</h2>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-xs flex items-center gap-2">
                   <AlertTriangle className="w-4 h-4" /> {formError}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Football"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                  rows={3}
                  placeholder="What's in this category?"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex justify-between">
                  <span>Category Image</span>
                  <span className="text-[10px] text-gray-400 font-normal">URL or Upload</span>
                </label>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input
                      name="image"
                      value={form.image}
                      onChange={(e) => setForm({ ...form, image: e.target.value })}
                      placeholder="Paste image URL..."
                      className="w-full pl-3 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <ImageIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
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
                      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        {isUploadingImg ? 'Uploading...' : <><span className="font-bold text-blue-600">Upload to Cloudinary</span></>}
                      </p>
                    </div>
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" disabled={isUploadingImg} />
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-semibold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
