import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Rating from '../components/Rating';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, ShieldCheck, Zap, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { useGetProductDetailsQuery, useCreateReviewMutation } from '../slices/productsApiSlice';
import { useSelector } from 'react-redux';
import { addToCart, setBuyNowItem } from '../slices/cartSlice';

const ProductPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);

  const { data: product, isLoading, error, refetch } = useGetProductDetailsQuery(id);
  const [createReview, { isLoading: isReviewLoading }] = useCreateReviewMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await createReview({
        productId: id,
        rating,
        comment,
      }).unwrap();
      refetch();
      setRating(0);
      setComment('');
      alert('Review Submitted');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate('/cart');
  };

  const buyNowHandler = () => {
    dispatch(setBuyNowItem({ ...product, qty }));
    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20 h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 text-red-500 p-6 rounded-2xl inline-block">
          {error?.data?.message || 'Product not found'}
        </div>
        <div className="mt-8">
          <Link to="/" className="text-blue-600 font-bold hover:underline">Go Back</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <img 
              src={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=800'} 
              alt={product.name} 
              className="w-full h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className={`${product.countInStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'} font-semibold`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">
            ₹{product.price}
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            {product.description}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            {product.countInStock > 0 && (
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-700 dark:text-gray-300 font-semibold">Quantity</span>
                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900">
                  <button 
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{qty}</span>
                  <button 
                    onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                    className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button 
                onClick={buyNowHandler}
                disabled={product.countInStock === 0}
                className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 disabled:from-gray-400 dark:disabled:from-gray-700 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3"
              >
                <Zap className="w-6 h-6 fill-current" />
                Buy Now
              </button>
              
              <button 
                onClick={addToCartHandler}
                disabled={product.countInStock === 0}
                className="w-full bg-white dark:bg-gray-900 border-2 border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 disabled:border-gray-300 dark:disabled:border-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed text-lg font-bold py-4 px-8 rounded-xl transition-all duration-300 flex justify-center items-center gap-3"
              >
                <ShoppingCart className="w-6 h-6" />
                {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Truck className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium">1 Year Warranty</span>
            </div>
          </div>

        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16 bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 shadow-sm animate-fade-in">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Customer Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          <div>
            {product.reviews.length === 0 ? (
              <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 p-4 rounded-xl">No Reviews Yet</div>
            ) : (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review._id} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                        <UserIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <strong className="block text-gray-900 dark:text-gray-100">{review.name}</strong>
                        <Rating value={review.rating} text="" />
                      </div>
                    </div>
                    <p className="text-gray-500 text-xs mb-2">
                      {review.createdAt.substring(0, 10)}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Write a Customer Review</h2>
            {isReviewLoading && <div className="text-blue-500 mb-2 font-bold animate-pulse">Submitting Review...</div>}
            {userInfo ? (
              <form onSubmit={submitHandler} className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rating</label>
                  <select
                    required
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 dark:text-gray-200"
                  >
                    <option value="">Select...</option>
                    <option value="1">1 - Poor</option>
                    <option value="2">2 - Fair</option>
                    <option value="3">3 - Good</option>
                    <option value="4">4 - Very Good</option>
                    <option value="5">5 - Excellent</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Comment</label>
                  <textarea
                    required
                    rows="3"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-800 dark:text-gray-200 resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  disabled={isReviewLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold py-3 px-6 rounded-xl transition shadow text-center"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300 p-4 rounded-xl">
                Please <Link to="/login" className="font-bold underline">sign in</Link> to write a review.
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
