import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { ShoppingCart, User, Moon, Sun, Menu, LogOut, LayoutDashboard, Search } from 'lucide-react';
import { useLogoutMutation } from '../slices/usersApiSlice';
import { logout } from '../slices/authSlice';
import { clearCartItems } from '../slices/cartSlice';
import { useGetCategoriesQuery } from '../slices/categoriesApiSlice';
import SearchBox from './SearchBox';

const Header = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();
  const { data: categories = [] } = useGetCategoriesQuery();

  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
    } catch (err) {
      console.error('Logout API error (ignored):', err);
    } finally {
      dispatch(clearCartItems());
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <header className="bg-white/80 dark:bg-[#0a0a0c]/80 backdrop-blur-lg shadow-sm border-b border-gray-100 dark:border-[#1a1c23] transition-colors duration-300 sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity shrink-0">
              {/* Logo: use actual image with neon filter in dark mode */}
              <img
                src="/logo.jpg"
                alt="SK Sports"
                className="h-12 w-auto object-contain rounded-md"
                style={{ filter: darkMode ? 'hue-rotate(200deg) saturate(1.5) brightness(1.2)' : 'none' }}
              />
              <span className="text-xl font-black italic tracking-tight hidden sm:block">
                <span className={darkMode ? 'text-[#cdfb0a]' : 'text-blue-700'}>SK</span>
                <span className={darkMode ? 'text-gray-100' : 'text-gray-800'}> SPORTS</span>
              </span>
            </Link>
            <div className="hidden lg:block w-72">
              <SearchBox />
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`font-medium text-sm transition capitalize ${
                location.pathname === '/'
                  ? 'text-[#cdfb0a] border-b-2 border-[#cdfb0a] pb-0.5'
                  : 'text-gray-700 dark:text-gray-300 hover:text-[#cdfb0a] dark:hover:text-[#cdfb0a]'
              }`}
            >
              Home
            </Link>
            {categories.slice(0, 5).map((cat) => (
              <Link 
                key={cat._id} 
                to={`/category/${cat.name}`} 
                className={`font-medium text-sm transition capitalize ${
                  location.pathname === `/category/${cat.name}`
                    ? 'text-[#cdfb0a] border-b-2 border-[#cdfb0a] pb-0.5'
                    : 'text-gray-700 dark:text-gray-300 hover:text-[#cdfb0a] dark:hover:text-[#cdfb0a]'
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-[#1a1c23] transition">
              {darkMode ? <Sun className="w-5 h-5 text-gray-400 hover:text-[#cdfb0a] hover-bounce transition-colors" /> : <Moon className="w-5 h-5 text-gray-600 hover-bounce" />}
            </button>
            <Link to="/cart" className="relative p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-[#1a1c23] transition group">
              <ShoppingCart className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#cdfb0a] hover-bounce transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#cdfb0a] text-black text-[10px] font-extrabold rounded-full h-4 w-4 flex items-center justify-center shadow-[0_0_8px_rgba(205,251,10,0.6)]">
                  {cartItems.reduce((a, c) => a + c.qty, 0)}
                </span>
              )}
            </Link>
            
            {userInfo ? (
              <div className="flex items-center space-x-2">
                <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded-xl dark:bg-[#1a1c23] bg-gray-100/50 text-gray-900 dark:text-white font-medium text-sm hover:!bg-[#cdfb0a] hover:!text-black transition-all group">
                   <User className="w-4 h-4 hover-bounce" />
                   <span>{userInfo.name.split(' ')[0]}</span>
                </Link>
                <button onClick={logoutHandler} className="p-2 text-gray-500 hover:text-red-500 transition group">
                  <LogOut className="w-5 h-5 hover-bounce" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="flex items-center space-x-1 p-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-[#1a1c23] transition group">
                <User className="w-5 h-5 text-gray-700 dark:text-gray-300 group-hover:text-[#cdfb0a] hover-bounce" />
              </Link>
            )}

            <button className="md:hidden p-2 rounded-md hover:bg-gray-200/50 dark:hover:bg-[#1a1c23] transition">
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300 hover-bounce" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
