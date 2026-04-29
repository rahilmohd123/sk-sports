import { useGetDashboardStatsQuery } from '../api/statsApiSlice';
import { useGetOrdersQuery } from '../api/ordersApiSlice';
import {
  Users, DollarSign, Package, TrendingUp, ShoppingCart, AlertTriangle, RefreshCw
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts';

import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, trend, color = 'blue', loading, to = '/' }) => {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    green: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  };
  return (
    <Link to={to} className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 flex items-center justify-between group cursor-pointer transform hover:-translate-y-1">
      <div>
        <p className="text-sm font-bold text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{title}</p>
        <div className="flex items-baseline mt-2 space-x-2">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-lg" />
          ) : (
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</p>
          )}
          {trend && !loading && (
            <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full flex items-center">
              <TrendingUp className="w-3 h-3 mr-1" /> {trend}
            </span>
          )}
        </div>
      </div>
      <div className={`p-4 ${colorMap[color]} rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
        <Icon className="w-6 h-6" />
      </div>
    </Link>
  );
};

const Dashboard = () => {
  const { data: stats, isLoading, isError, refetch } = useGetDashboardStatsQuery();

  const formatCurrency = (val) => `₹${Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  // Fallback chart data if no data from DB yet
  const chartData = stats?.monthlyIncome?.length > 0
    ? stats.monthlyIncome
    : [
        { name: 'Jan', revenue: 0, orders: 0 },
        { name: 'Feb', revenue: 0, orders: 0 },
      ];

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 mt-1 font-medium">Real-time metrics and store performance.</p>
        </div>
        <button
          onClick={refetch}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-xl font-semibold transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {isError && (
        <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span>Failed to load dashboard stats. Make sure you are logged in as admin.</span>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats?.totalRevenue)}
          icon={DollarSign}
          color="blue"
          loading={isLoading}
          to="/orders"
        />
        <StatCard
          title="Total Orders"
          value={stats?.totalOrders ?? '—'}
          icon={ShoppingCart}
          color="green"
          loading={isLoading}
          to="/orders"
        />
        <StatCard
          title="Pending Deliveries"
          value={stats?.pendingOrders ?? '—'}
          icon={Package}
          color="orange"
          loading={isLoading}
          to="/orders"
        />
        <StatCard
          title="Registered Users"
          value={stats?.totalUsers ?? '—'}
          icon={Users}
          color="purple"
          loading={isLoading}
          to="/customers"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Revenue Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analytics</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">Monthly</span>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={8} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={(v) => `₹${v}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  formatter={(v) => [`₹${Number(v).toFixed(2)}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Orders Bar Chart */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Orders / Month</h2>
            <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full font-medium">Count</span>
          </div>
          {isLoading ? (
            <div className="h-64 bg-gray-100 animate-pulse rounded-xl" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 11 }} allowDecimals={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Recent Orders</h2>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : !stats?.recentOrders?.length ? (
          <div className="text-center py-10 text-gray-400">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No orders yet</p>
            <p className="text-sm">Orders placed by customers will appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-gray-400 text-xs uppercase border-b border-gray-100">
                  <th className="pb-3 font-semibold pl-1">Order ID</th>
                  <th className="pb-3 font-semibold">Customer</th>
                  <th className="pb-3 font-semibold">Total</th>
                  <th className="pb-3 font-semibold">Paid</th>
                  <th className="pb-3 font-semibold">Delivered</th>
                  <th className="pb-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats.recentOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-1 font-mono text-xs text-gray-500">#{order._id.slice(-8).toUpperCase()}</td>
                    <td className="py-3 font-medium text-gray-800 dark:text-gray-200">{order.user?.name || 'Unknown'}</td>
                    <td className="py-3 font-bold text-gray-900 dark:text-white">{formatCurrency(order.totalPrice)}</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {order.isPaid ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${order.isDelivered ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {order.isDelivered ? 'Delivered' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
