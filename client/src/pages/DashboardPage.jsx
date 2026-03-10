import { Package, User, MapPin, LogOut } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const mockOrders = [
  { _id: 'ORD-7391', date: 'Oct 24, 2026', total: 225.00, status: 'Processing', tracking: 'AWB-10928374' },
  { _id: 'ORD-6120', date: 'Sep 12, 2026', total: 140.00, status: 'Delivered', tracking: 'AWB-99283112' },
];

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">My Account</h1>
        <button className="flex items-center text-red-500 hover:text-red-700 font-semibold transition mt-4 md:mt-0">
          <LogOut className="w-5 h-5 mr-2" /> Sign Out
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="lg:w-1/4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 space-y-2">
            <button 
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition ${activeTab === 'orders' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <Package className="w-5 h-5 mr-3" /> Orders & Tracking
            </button>
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <User className="w-5 h-5 mr-3" /> My Profile
            </button>
            <button 
              onClick={() => setActiveTab('address')}
              className={`w-full flex items-center px-4 py-3 rounded-xl transition ${activeTab === 'address' ? 'bg-blue-50 text-blue-600 dark:bg-gray-800 dark:text-blue-400 font-bold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <MapPin className="w-5 h-5 mr-3" /> Addresses
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:w-3/4">
          {activeTab === 'orders' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Order History</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400">
                      <th className="pb-4 font-semibold">Order ID</th>
                      <th className="pb-4 font-semibold">Date</th>
                      <th className="pb-4 font-semibold">Total</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 font-semibold">Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {mockOrders.map((order) => (
                      <tr key={order._id} className="text-gray-700 dark:text-gray-300">
                        <td className="py-4 font-bold">{order._id}</td>
                        <td className="py-4">{order.date}</td>
                        <td className="py-4">${order.total.toFixed(2)}</td>
                        <td className="py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4">
                          <Link to="#" className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center">
                            Track {order.tracking}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Update Profile</h2>
              <form className="space-y-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
                  <input type="text" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" defaultValue="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email Address</label>
                  <input type="email" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" defaultValue="athlete@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password (optional)</label>
                  <input type="password" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="••••••••" />
                </div>
                <button type="button" className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md">
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {activeTab === 'address' && (
            <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-800">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Saved Addresses</h2>
              <div className="p-6 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl text-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition">
                 + Add New Address
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
