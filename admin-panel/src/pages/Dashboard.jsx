import { Users, DollarSign, Package, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const StatCard = ({ title, value, icon: Icon, trend }) => (
  <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] flex items-center justify-between hover:border-blue-200 transition-colors">
    <div>
      <p className="text-sm font-medium text-gray-500 break-words">{title}</p>
      <div className="flex items-baseline mt-2 space-x-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full flex items-center">
          <TrendingUp className="w-3 h-3 mr-1" /> {trend}
        </span>
      </div>
    </div>
    <div className="p-4 bg-blue-50 rounded-[1.25rem] text-blue-600">
      <Icon className="w-6 h-6" />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1 font-medium">Real-time metrics and store performance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Revenue" value="$45,231" icon={DollarSign} trend="+20%" />
        <StatCard title="Active Users" value="1,241" icon={Users} trend="+12%" />
        <StatCard title="Orders Pending" value="34" icon={Package} trend="+5%" />
        <StatCard title="Avg. Order Value" value="$120.00" icon={TrendingUp} trend="+8%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">Revenue Analytics</h2>
          <div className="flex-1 w-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} tickFormatter={(value) => `$${value}`} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 overflow-hidden flex flex-col">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex-shrink-0">Recent Orders</h2>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-0 last:pb-0 hover:bg-gray-50 rounded-lg transition-colors p-2 -mx-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                    #{100 + item}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">John Doe</p>
                    <p className="text-xs text-gray-500 font-medium">2 mins ago</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">$120.00</p>
                  <p className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-0.5 rounded-full mt-1 inline-block">Pending</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
