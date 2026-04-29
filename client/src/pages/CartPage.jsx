import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { addToCart, removeFromCart, clearBuyNowItem } from '../slices/cartSlice';
import { useEffect } from 'react';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearBuyNowItem());
  }, [dispatch]);

  const cart = useSelector((state) => state.cart);
  const { cartItems, itemsPrice, totalPrice } = cart;

  const addToCartHandler = async (product, qty) => {
    dispatch(addToCart({ ...product, qty }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 text-lg mb-6">Your cart is empty.</p>
          <Link to="/" className="inline-flex items-center text-blue-600 dark:text-blue-400 font-bold hover:underline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div key={item._id} className="flex flex-col sm:flex-row items-center justify-between p-4 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-4 mb-4 sm:mb-0 w-full sm:w-auto">
                  <img src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400'} alt={item.name} className="w-24 h-24 object-cover rounded-xl" />
                  <div>
                    <Link to={`/product/${item._id}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-lg transition-colors">
                      {item.name}
                    </Link>
                    <div className="text-blue-600 dark:text-blue-400 font-extrabold mt-1">₹{item.price}</div>
                  </div>
                </div>

                <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                  <select 
                    value={item.qty}
                    onChange={(e) => addToCartHandler(item, Number(e.target.value))}
                    className="p-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg focus:ring-blue-500 focus:border-blue-500 outline-none"
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  
                  <button 
                    onClick={() => removeFromCartHandler(item._id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-4">Order Summary</h2>
              
              <div className="space-y-4 mb-6 text-gray-600 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((acc, i) => acc + i.qty, 0)} items)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{itemsPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{cart.shippingPrice}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (15%)</span>
                  <span className="font-semibold text-gray-900 dark:text-white">₹{cart.taxPrice}</span>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-800 pt-4 mb-8">
                <div className="flex justify-between items-center text-lg font-extrabold text-gray-900 dark:text-white">
                  <span>Total Due</span>
                  <span className="text-blue-600 dark:text-blue-400">₹{totalPrice}</span>
                </div>
              </div>

              <button 
                type="button"
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full flex items-center justify-center p-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors shadow-lg shadow-blue-500/30"
              >
                Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
