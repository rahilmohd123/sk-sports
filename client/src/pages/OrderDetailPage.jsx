import { Link, useParams } from 'react-router-dom';
import { useGetOrderDetailsQuery } from '../slices/ordersApiSlice';
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2, Clock } from 'lucide-react';

const OrderDetailPage = () => {
  const { id } = useParams();
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="bg-red-50 dark:bg-red-900/20 text-red-500 p-6 rounded-2xl">
          {error?.data?.message || 'Order not found'}
        </div>
        <Link to="/dashboard" className="mt-6 inline-block text-blue-600 dark:text-blue-400 font-bold hover:underline">
          ← Back to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/dashboard" className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to My Orders
      </Link>

      <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Order Details</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">#{order._id}</p>
        </div>
        <div className="flex items-center gap-3">
          {order.isDelivered ? (
            <span className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-bold text-sm">
              <CheckCircle2 className="w-4 h-4" /> Delivered
            </span>
          ) : (
            <span className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-4 py-2 rounded-full font-bold text-sm">
              <Clock className="w-4 h-4" /> Processing
            </span>
          )}
          {order.isPaid ? (
            <span className="flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-4 py-2 rounded-full font-bold text-sm">
              <CreditCard className="w-4 h-4" /> Paid
            </span>
          ) : (
            <span className="flex items-center gap-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-4 py-2 rounded-full font-bold text-sm">
              Payment Pending
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Items + Shipping */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" /> Ordered Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex items-center gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0 last:pb-0">
                  <img
                    src={item.images && item.images[0] ? item.images[0] : 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-gray-100 dark:border-gray-800"
                  />
                  <div className="flex-1">
                    <Link to={`/product/${item.product}`} className="font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900 dark:text-white">₹{(item.price * item.qty).toFixed(2)}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">₹{item.price} each</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" /> Shipping Address
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-1">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-500" /> Payment
            </h2>
            <div className="text-gray-600 dark:text-gray-300 space-y-2">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-semibold text-gray-900 dark:text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span className={`font-semibold ${order.isPaid ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {order.isPaid ? `Paid on ${order.paidAt?.substring(0, 10)}` : 'Not paid'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Price Summary */}
        <div className="lg:col-span-1">
          <div className="bg-blue-50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 rounded-2xl p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Price Summary</h2>
            <div className="space-y-3 text-gray-600 dark:text-gray-300 pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between"><span>Items</span><span className="font-medium">₹{order.itemsPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Shipping</span><span className="font-medium">₹{order.shippingPrice?.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Tax</span><span className="font-medium">₹{order.taxPrice?.toFixed(2)}</span></div>
            </div>
            <div className="flex justify-between items-center pt-4 text-lg font-extrabold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-blue-600 dark:text-blue-400">₹{order.totalPrice?.toFixed(2)}</span>
            </div>
            <div className="mt-6 text-center text-xs text-gray-400">
              Placed on {order.createdAt?.substring(0, 10)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
