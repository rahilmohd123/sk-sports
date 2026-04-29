import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Rating from './Rating';
import { addToCart } from '../slices/cartSlice';
import TiltedCard from './TiltedCard';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty: 1 }));
    navigate('/cart');
  };

  return (
    <div className="bg-[#101217] dark:bg-[#101217] rounded-2xl shadow-lg border border-gray-100 dark:border-[#1a1c23] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(205,251,10,0.15)] hover:border-[#cdfb0a]/30 transition-all duration-300 overflow-hidden group flex flex-col h-full animate-slide-up relative">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden w-full shine-sweep">
        {/* NEW Badge */}
        <div className="absolute top-3 left-3 z-10 bg-[#cdfb0a] text-black text-[10px] uppercase font-black px-3 py-1 rounded-full shadow-md">
          NEW
        </div>
        <div className="flex items-center justify-center p-2">
          <TiltedCard
            imageSrc={product.images && product.images[0] ? product.images[0] : 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400'}
            altText={product.name}
            captionText={product.name}
            containerHeight="250px"
            containerWidth="100%"
            imageHeight="220px"
            imageWidth="220px"
            rotateAmplitude={12}
            scaleOnHover={1.15}
            showMobileWarning={false}
            showTooltip={true}
            displayOverlayContent={false}
          />
        </div>
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded z-20">
            Out of Stock
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="block mb-2 flex-grow">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug group-hover:text-[#cdfb0a] transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mb-4">
          <Rating value={product.rating} text={`(${product.numReviews} reviews)`} color="#eab308" />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-black text-[#cdfb0a]">
            ₹{product.price}
          </span>
          <button 
            onClick={addToCartHandler}
            disabled={product.countInStock === 0}
            className="active-pulse border border-[#cdfb0a] text-[#cdfb0a] hover:bg-[#cdfb0a] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 text-sm font-bold rounded-lg transition-all duration-300 shadow-md flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
