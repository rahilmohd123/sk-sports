import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, ShoppingBag, Package, Settings, FileText } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Products', icon: ShoppingBag, path: '/products' },
    { name: 'Orders', icon: Package, path: '/orders' },
    { name: 'Customers', icon: Users, path: '/customers' },
    { name: 'Invoices', icon: FileText, path: '/invoices' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col fixed left-0 top-0 text-gray-300 z-20">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <Link to="/dashboard" className="text-xl font-extrabold text-blue-500 italic flex items-center gap-2">
          <span className="text-2xl">⚡</span> SPORTSGEAR
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navItems.map((item) => {
            const isActive = path.startsWith(item.path);
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors ${
                  isActive ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-gray-800 hover:text-white'
                }`}
              >
                <Icon className={`mr-3 h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
