import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  useCreateOrderMutation,
  useCreateRazorpayOrderMutation,
  useVerifyRazorpayPaymentMutation,
  usePayOrderMutation,
  useGetRazorpayConfigQuery
} from '../slices/ordersApiSlice';
import { clearCartItems, clearBuyNowItem } from '../slices/cartSlice';
import { addDecimals } from '../utils/cartUtils';

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [paymentDone, setPaymentDone] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { cartItems, buyNowItem, itemsPrice: cartItemsPrice, shippingPrice: cartShippingPrice, taxPrice: cartTaxPrice, totalPrice: cartTotalPrice } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  // Determine which items to use (Buy Now item takes priority if it exists)
  const activeItems = buyNowItem ? [buyNowItem] : cartItems;

  // Calculate prices for the active items
  const itemsPrice = addDecimals(activeItems.reduce((acc, item) => acc + item.price * item.qty, 0));
  const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
  const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice) + Number(taxPrice)).toFixed(2);


  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/checkout');
    } else if (activeItems.length === 0 && !paymentDone) {
      navigate('/cart');
    }
  }, [userInfo, cartItems, navigate, paymentDone]);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [createRazorpayOrder, { isLoading: isRazorpayLoading }] = useCreateRazorpayOrderMutation();
  const [verifyRazorpayPayment] = useVerifyRazorpayPaymentMutation();
  const [payOrder] = usePayOrderMutation();
  const { data: razorpayConfig, isLoading: isConfigLoading } = useGetRazorpayConfigQuery();

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!/^\d+$/.test(postalCode)) {
      alert('Postal code must contain only numbers');
      return;
    }

    try {
      const res = await createOrder({
        orderItems: activeItems,
        shippingAddress: { address, city, postalCode, country },
        paymentMethod: paymentMethod,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }).unwrap();

      if (paymentMethod === 'Cash on Delivery') {
        if (buyNowItem) {
          dispatch(clearBuyNowItem());
        } else {
          dispatch(clearCartItems());
        }
        setPaymentDone(true);
        return;
      }

      const resScript = await loadRazorpayScript();
      if (!resScript) {
        alert('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const rzpOrder = await createRazorpayOrder(totalPrice).unwrap();

      const options = {
        key: razorpayConfig.key,
        amount: rzpOrder.amount,
        currency: rzpOrder.currency,
        name: 'SK Sports',
        description: 'Payment for your order',
        order_id: rzpOrder.id,
        handler: async function (response) {
          try {
            const verifyRes = await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap();

            if (verifyRes.success) {
              await payOrder({
                orderId: res._id,
                details: {
                  id: response.razorpay_payment_id,
                  status: 'completed',
                  update_time: new Date().toISOString(),
                  email_address: userInfo.email,
                }
              }).unwrap();

              if (buyNowItem) {
                dispatch(clearBuyNowItem());
              } else {
                dispatch(clearCartItems());
              }
              setPaymentDone(true);
            }
          } catch (err) {
            alert(err?.data?.message || err.error || 'Payment verification failed');
          }
        },
        prefill: {
          name: userInfo.name,
          email: userInfo.email,
        },
        theme: {
          color: '#2563eb'
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response){
        alert(`Payment Failed: ${response.error.description}`);
      });
      rzp.open();
    } catch (err) {
      alert(err?.data?.message || err.error || 'Something went wrong');
    }
  };

  if (paymentDone) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Order Placed Successfully!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order. Your gear is on its way!
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg"
        >
          View My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Shipping Form */}
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Shipping Address</h2>
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                  placeholder="123 Champion Lane"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    required
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                    placeholder="400001"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input
                  type="text"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none"
                  placeholder="India"
                />
              </div>

              <div className="pt-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Payment Method</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Razorpay" 
                      checked={paymentMethod === 'Razorpay'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-900 dark:text-white font-medium">Razorpay</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      value="Cash on Delivery" 
                      checked={paymentMethod === 'Cash on Delivery'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <span className="text-gray-900 dark:text-white font-medium">Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <button
                  type="submit"
                  disabled={isCreating || (paymentMethod === 'Razorpay' && (isRazorpayLoading || isConfigLoading))}
                  className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 text-blue-900 text-lg font-bold rounded-xl transition-all shadow-md flex justify-center items-center gap-2"
                >
                  {isCreating || (paymentMethod === 'Razorpay' && isRazorpayLoading) ? 'Processing...' : paymentMethod === 'Razorpay' ? 'Pay with Razorpay' : 'Place Order (COD)'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-blue-50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 pb-6 border-b border-gray-200 dark:border-gray-800">
              {activeItems.map((item) => (
                <div key={item._id} className="flex justify-between text-sm">
                  <span className="truncate mr-2">{item.name} x{item.qty}</span>
                  <span className="font-medium whitespace-nowrap">₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">₹{itemsPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-medium">₹{shippingPrice}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (15%)</span>
                <span className="font-medium">₹{taxPrice}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-between items-center text-xl font-extrabold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-blue-600 dark:text-blue-400">₹{totalPrice}</span>
            </div>
            <p className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
              {paymentMethod === 'Razorpay' ? '🔒 Secured payments powered by Razorpay' : '🚚 Pay when your gear arrives'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
