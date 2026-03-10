import { Bell, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10 w-full transition-shadow">
      <div className="flex-1 flex max-w-xl">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search orders, products, or users..."
          />
        </div>
      </div>
      <div className="ml-4 flex items-center justify-end space-x-4">
        <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full outline outline-2 outline-white"></span>
          <Bell className="h-6 w-6" />
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4 cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
            AD
          </div>
          <div className="hidden md:block text-sm font-medium text-gray-700">Admin User</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
