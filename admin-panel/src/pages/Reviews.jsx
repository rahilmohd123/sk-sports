import { useGetReviewsQuery } from '../api/productsApiSlice';
import { Star, User, AlertTriangle, MessageSquare, Search } from 'lucide-react';
import { useState } from 'react';

const Reviews = () => {
  const { data: reviews = [], isLoading, isError } = useGetReviewsQuery();
  const [search, setSearch] = useState('');

  const filtered = reviews.filter((r) =>
    r.productName?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reviews</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Manage product reviews and view customer details.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full">{reviews.length} reviews</span>
        </div>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by product or customer..."
          className="pl-9 pr-4 py-2.5 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
      </div>

      {isError && (
        <div className="mb-5 flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-5 text-sm">
          <div className="flex items-center gap-3 font-bold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Failed to load reviews. Please try again.</span>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold">Rating & Comment</th>
                <th className="p-4 font-semibold">Customer info</th>
                <th className="p-4 font-semibold">Contact Details</th>
                <th className="p-4 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      <td colSpan={5} className="p-4"><div className="h-10 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg" /></td>
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={5} className="text-center py-16 text-gray-400">
                        <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No reviews found</p>
                      </td>
                    </tr>
                  )
                : filtered.map((review) => (
                    <tr key={review._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                      <td className="p-4">
                        <p className="font-bold text-gray-900 dark:text-white">{review.productName}</p>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">ID: {review.productId}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className={`w-3 h-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                          ))}
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 italic text-sm line-clamp-2" title={review.comment}>"{review.comment}"</p>
                      </td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-900 dark:text-white">{review.user?.name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">{review.user?.email || 'N/A'}</p>
                      </td>
                      <td className="p-4">
                        {review.user?.addresses && review.user.addresses.length > 0 ? (
                          <div className="text-xs">
                            <p className="font-semibold text-gray-800 dark:text-gray-300">
                              Phone: {review.user.addresses.find(a => a.isDefault)?.phone || review.user.addresses[0].phone || 'Not provided'}
                            </p>
                            <p className="text-gray-500 truncate max-w-[150px]" title={review.user.addresses[0].address}>
                              {review.user.addresses.find(a => a.isDefault)?.address || review.user.addresses[0].address}
                            </p>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No contact details</span>
                        )}
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
