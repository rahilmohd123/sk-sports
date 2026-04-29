import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { useGetProductsQuery } from '../slices/productsApiSlice';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const { category, keyword } = useParams();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const { data: products, isLoading, error } = useGetProductsQuery({ 
    category: category || '',
    keyword: keyword || '',
  });

  useEffect(() => {
    if (location.hash === '#products') {
      const element = document.getElementById('products');
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  return (
    <div className="animate-fade-in">
      {/* Hero Section — only on home '/' */}
      {isHome && (
        <div className="relative overflow-hidden mb-12 border-b border-white/5 dark:border-[#cdfb0a]/20 shadow-2xl">
          {/* Hero background image */}
          <img
            src="/hero_bg.png"
            alt="SK Sports Hero"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* Subtle left-side gradient so text stays readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          {/* Content */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-28 lg:py-36">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-4 text-white leading-[1.1]">
              GEAR UP.<br/>
              <span className="text-[#cdfb0a] drop-shadow-[0_0_20px_rgba(205,251,10,0.5)]">PLAY HARD.</span>
            </h1>
            <p className="max-w-xl text-lg md:text-xl text-gray-300 mb-10 font-medium">
              Premium quality sports gear for champions.<br />Built for performance. Designed for you.
            </p>
            <a href="#products" className="active-pulse inline-flex items-center gap-2 bg-[#cdfb0a] hover:bg-[#b0d908] text-black font-black py-4 px-10 rounded-full shadow-[0_0_20px_rgba(205,251,10,0.4)] transform hover:-translate-y-1 hover:scale-105 transition-all duration-300 text-sm uppercase tracking-widest">
              SHOP NOW <span className="text-lg leading-none">›</span>
            </a>
          </div>
          {/* LIVE. PLAY. WIN. — bottom-right label matching screenshot */}
          <p className="absolute bottom-5 right-8 z-20 text-xs font-bold tracking-[0.25em] text-white/50 uppercase select-none">
            Live. Play. Win.
          </p>
        </div>
      )}

      {/* Category banner when on a category page */}
      {!isHome && category && (
        <div className="bg-[#101217] border-b border-[#1a1c23] py-8 mb-8">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight">
                {category.charAt(0).toUpperCase() + category.slice(1)}
                <span className="text-[#cdfb0a] ml-2">Gear</span>
              </h1>
              <p className="text-gray-400 mt-2">Shop the best {category} equipment and apparel.</p>
            </div>
            <Link to="/#products" className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-full border border-gray-700 text-sm font-medium text-gray-300 hover:text-[#cdfb0a] hover:border-[#cdfb0a] transition-colors">
              View All <span>›</span>
            </Link>
          </div>
        </div>
      )}

      {/* Latest Products */}
      <div id="products" className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Home-only heading */}
        {isHome && (
          <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                Latest Gear <span className="text-[#cdfb0a] text-2xl">⚡</span>
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">Check out our newest arrivals customized for your sport.</p>
            </div>
          </div>
        )}
        {/* Keyword search heading */}
        {keyword && (
          <div className="mb-8 border-b border-gray-800 pb-4">
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              Results for <span className="text-[#cdfb0a] ml-2">&ldquo;{keyword}&rdquo;</span>
            </h2>
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-xl text-center">
            {error?.data?.message || 'Error loading products'}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products && products.length > 0 ? (
              products.map((product, index) => (
                <div key={product._id} style={{ animationDelay: `${index * 100}ms` }} className="animate-slide-up opacity-0">
                  <ProductCard product={product} />
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500">
                No products found in this category.
              </div>
            )}
          </div>
        )}

        {/* Feature Highlights bottom bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 pt-10 border-t border-gray-200 dark:border-[#1a1c23]">
          {[
            { icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', title: '100% Original', p: 'Genuine Products' },
            { icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', title: 'Fast Delivery', p: 'On time, every time' },
            { icon: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15', title: 'Easy Returns', p: 'Hassle free returns' },
            { icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: '24/7 Support', p: 'We are here to help' },
          ].map((feat, i) => (
            <div key={i} className="flex items-center gap-4 group cursor-pointer">
              <div className="p-3 bg-gray-100 dark:bg-[#1a1c23] rounded-xl group-hover:bg-[#cdfb0a]/10 transition-colors">
                <svg className="w-8 h-8 text-[#cdfb0a]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={feat.icon} />
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm group-hover:text-[#cdfb0a] transition-colors">{feat.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">{feat.p}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
