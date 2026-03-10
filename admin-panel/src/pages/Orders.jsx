import { Eye, Truck, FileText } from 'lucide-react';

const mockOrders = [
  { _id: '101', user: 'John Doe', date: 'Oct 24, 2026', total: 225.00, isPaid: true, isDelivered: false },
  { _id: '102', user: 'Jane Smith', date: 'Oct 23, 2026', total: 85.00, isPaid: true, isDelivered: true },
  { _id: '103', user: 'Mike Ross', date: 'Oct 20, 2026', total: 450.00, isPaid: false, isDelivered: false },
];

const Orders = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Orders Management</h1>
        <p className="text-gray-500 mt-1 font-medium">Process orders and generate shipments.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
                <th className="p-4 font-semibold">Order ID</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Paid</th>
                <th className="p-4 font-semibold">Delivered</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockOrders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-bold text-gray-900">#{order._id}</td>
                  <td className="p-4 text-gray-700">{order.user}</td>
                  <td className="p-4 text-gray-500">{order.date}</td>
                  <td className="p-4 font-bold text-gray-900">${order.total.toFixed(2)}</td>
                  <td className="p-4">
                     {order.isPaid ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Yes</span>
                     ) : (
                        <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">No</span>
                     )}
                  </td>
                  <td className="p-4">
                     {order.isDelivered ? (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">Yes</span>
                     ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-bold">Pending</span>
                     )}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button title="View Details" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors inline-block">
                      <Eye className="w-4 h-4" />
                    </button>
                    {!order.isDelivered && (
                      <button title="Generate Shipment" className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors inline-block">
                        <Truck className="w-4 h-4" />
                      </button>
                    )}
                    <button title="Download Invoice" className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors inline-block">
                      <FileText className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;
