import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 group flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden w-full pt-[80%]">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=400'} 
          alt={product.name} 
          className="absolute inset-0 w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
        />
        {product.countInStock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            Out of Stock
          </div>
        )}
      </Link>
      <div className="p-5 flex flex-col flex-grow">
        <Link to={`/product/${product._id}`} className="block mb-2 flex-grow">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 md:truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mb-4">
          <Rating value={product.rating} text={`${product.numReviews} reviews`} />
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
            ${product.price}
          </span>
          <button 
            disabled={product.countInStock === 0}
            className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 dark:text-white px-4 py-2 text-sm font-semibold rounded-full transition-colors">
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
