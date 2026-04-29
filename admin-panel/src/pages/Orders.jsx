import { useState } from 'react';
import { Eye, Truck, FileText, AlertTriangle, Package, Search, X, ChevronDown, Loader2 } from 'lucide-react';
import { useGetOrdersQuery, useDeliverOrderMutation } from '../api/ordersApiSlice';

const StatusBadge = ({ active, activeLabel = 'Yes', inactiveLabel = 'No', activeColor = 'green', inactiveColor = 'red' }) => {
  const colorMap = {
    green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${active ? colorMap[activeColor] : colorMap[inactiveColor]}`}>
      {active ? activeLabel : inactiveLabel}
    </span>
  );
};

const OrderDetailModal = ({ order, onClose, onDeliver, isDelivering }) => {
  if (!order) return null;
  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Order Details</h2>
            <p className="text-xs text-gray-400 font-mono mt-0.5">#{order._id}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Customer Information</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Name</p>
                <p className="font-semibold text-gray-800">{order.user?.name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Email</p>
                <p className="font-semibold text-gray-800">{order.user?.email || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Shipping Address</h3>
            <p className="text-sm text-gray-700">
              {order.shippingAddress?.address}, {order.shippingAddress?.city},{' '}
              {order.shippingAddress?.postalCode}, {order.shippingAddress?.country}
            </p>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3">Order Items</h3>
            <div className="space-y-2">
              {order.orderItems?.map((item, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    {item.images?.[0] ? (
                      <img src={item.images[0]} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                    ) : (
                      <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Package className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-400">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm">{formatCurrency(item.price * item.qty)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Items Total</span>
              <span className="font-semibold">{formatCurrency(order.itemsPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-semibold">{formatCurrency(order.shippingPrice)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax</span>
              <span className="font-semibold">{formatCurrency(order.taxPrice)}</span>
            </div>
            <div className="flex justify-between border-t border-gray-200 dark:border-gray-800 pt-2 mt-2">
              <span className="font-bold text-gray-800 dark:text-gray-200">Total</span>
              <span className="font-extrabold text-gray-900 dark:text-white">{formatCurrency(order.totalPrice)}</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Payment:</span>
              <StatusBadge active={order.isPaid} activeLabel="Paid" inactiveLabel="Unpaid" activeColor="green" inactiveColor="red" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Delivery:</span>
              <StatusBadge active={order.isDelivered} activeLabel="Delivered" inactiveLabel="Pending" activeColor="green" inactiveColor="yellow" />
            </div>
          </div>

          {/* Deliver Action */}
          {!order.isDelivered && (
            <button
              onClick={() => onDeliver(order._id)}
              disabled={isDelivering}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isDelivering ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Marking as Delivered...</>
              ) : (
                <><Truck className="w-4 h-4" /> Mark as Delivered</>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery();
  const [deliverOrder, { isLoading: isDelivering }] = useDeliverOrderMutation();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const handleDeliver = async (id) => {
    try {
      await deliverOrder(id).unwrap();
      setSelectedOrder(null);
    } catch (err) {
      alert(err?.data?.message || 'Failed to update order status.');
    }
  };

  const filtered = orders.filter((order) => {
    const matchSearch =
      order._id.includes(search) ||
      (order.user?.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (order.user?.email || '').toLowerCase().includes(search.toLowerCase());

    const matchStatus =
      statusFilter === 'all' ||
      (statusFilter === 'pending' && !order.isDelivered) ||
      (statusFilter === 'delivered' && order.isDelivered) ||
      (statusFilter === 'paid' && order.isPaid) ||
      (statusFilter === 'unpaid' && !order.isPaid);

    return matchSearch && matchStatus;
  });

  const formatCurrency = (val) => `₹${Number(val || 0).toFixed(2)}`;

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tight">Orders Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">Process orders and update delivery status.</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full">{orders.length} total orders</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID or customer..."
            className="pl-9 pr-4 py-2.5 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none pl-4 pr-9 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {isError && (
        <div className="mb-5 flex flex-col gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 rounded-xl p-5 text-sm">
          <div className="flex items-center gap-3 font-bold">
            <AlertTriangle className="w-5 h-5 flex-shrink-0" />
            <span>Session Authorization Failed</span>
          </div>
          <p className="pl-8 text-gray-700 dark:text-gray-300">
            Your security token has expired or is invalid due to recent updates. <strong>Please click Logout on the bottom left and log back in</strong> to regain access to order data.
          </p>
        </div>
      )}

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 text-xs uppercase border-b border-gray-200 dark:border-gray-800">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Paid</th>
                <th className="p-4 font-semibold">Delivered</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {isLoading
                ? Array(5).fill(0).map((_, i) => (
                    <tr key={i}>
                      {Array(7).fill(0).map((_, j) => (
                        <td key={j} className="p-4"><div className="h-5 bg-gray-100 animate-pulse rounded-lg" /></td>
                      ))}
                    </tr>
                  ))
                : filtered.length === 0
                ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16 text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No orders found</p>
                        <p className="text-xs mt-1">Orders from customers will appear here.</p>
                      </td>
                    </tr>
                  )
                : filtered.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                      <td className="p-4">
                        <p className="font-semibold text-gray-800">{order.user?.name || 'N/A'}</p>
                        <p className="text-xs text-gray-400">{order.user?.email || ''}</p>
                      </td>
                      <td className="p-4 text-gray-500 text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="p-4 font-bold text-gray-900">{formatCurrency(order.totalPrice)}</td>
                      <td className="p-4">
                        <StatusBadge active={order.isPaid} activeLabel="Paid" inactiveLabel="Unpaid" activeColor="green" inactiveColor="red" />
                      </td>
                      <td className="p-4">
                        <StatusBadge active={order.isDelivered} activeLabel="Delivered" inactiveLabel="Pending" activeColor="green" inactiveColor="yellow" />
                      </td>
                      <td className="p-4 text-right space-x-1 flex items-center justify-end">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {!order.isDelivered && (
                          <button
                            onClick={() => handleDeliver(order._id)}
                            disabled={isDelivering}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50"
                            title="Mark as Delivered"
                          >
                            <Truck className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
              }
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && orders.length > 0 && (
        <p className="text-xs text-gray-400 mt-3 pl-1">Showing {filtered.length} of {orders.length} orders</p>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onDeliver={handleDeliver}
          isDelivering={isDelivering}
        />
      )}
    </div>
  );
};

export default Orders;
