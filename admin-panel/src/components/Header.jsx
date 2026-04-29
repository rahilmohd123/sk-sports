import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';
import { adminLogout } from '../slices/adminAuthSlice';
import { toggleDarkMode } from '../slices/themeSlice';
import { useLogoutMutation } from '../api/authApiSlice';
import { useState } from 'react';

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminInfo } = useSelector((state) => state.adminAuth);
  const { darkMode } = useSelector((state) => state.theme);
  const [logout] = useLogoutMutation();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } catch {
      // ignore
    }
    dispatch(adminLogout());
    navigate('/');
  };

  const initials = adminInfo?.name
    ? adminInfo.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'AD';

  return (
    <header className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-6 sticky top-0 z-10 w-full transition-colors duration-300">
      {/* Left: Page title slot */}
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">SK Sports Admin</p>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => dispatch(toggleDarkMode())}
          className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {darkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5" />}
        </button>

        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full outline outline-2 outline-white dark:outline-gray-900" />
          <Bell className="h-5 w-5" />
        </button>

        {/* Admin profile + logout dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-1.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{adminInfo?.name || 'Admin'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{adminInfo?.email || ''}</p>
            </div>
            <ChevronDown className="w-3 h-3 text-gray-400" />
          </button>

          {showDropdown && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)} />
              <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg z-20 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200">{adminInfo?.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{adminInfo?.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors font-medium"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
