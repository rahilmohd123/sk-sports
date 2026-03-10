import { useParams, Link } from 'react-router-dom';
import Rating from '../components/Rating';
import { ArrowLeft, Minus, Plus, ShoppingCart, Truck, ShieldCheck } from 'lucide-react';
import { useState } from 'react';

// Reusing dummy logic to visualize
const dummyProducts = [
  { _id: '1', name: 'Pro Cricket Bat - English Willow', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=800', price: 120.00, description: 'Handcrafted English willow bat with thick edges and huge sweet spot for explosive power. Comes with factory-fitted toe guard and fully knocked-in.', rating: 4.5, numReviews: 12, countInStock: 5 },
  // Need the others to match if user clicks
];

const ProductPage = () => {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  
  // Mock product loader
  const product = dummyProducts.find(p => p._id === id) || { ...dummyProducts[0], _id: id };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <Link to="/" className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 mb-8 transition font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
      </Link>

      <div className="flex flex-col md:flex-row gap-12">
        {/* Product Image */}
        <div className="md:w-1/2">
          <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-[500px] object-contain"
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="md:w-1/2 flex flex-col">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 leading-tight">
            {product.name}
          </h1>
          
          <div className="flex items-center gap-4 mb-6">
            <Rating value={product.rating} text={`${product.numReviews} Reviews`} />
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <span className={`${product.countInStock > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500'} font-semibold`}>
              {product.countInStock > 0 ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          <div className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-6">
            ${product.price}
          </div>

          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed mb-8 border-t border-gray-200 dark:border-gray-800 pt-6">
            {product.description}
          </p>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <div className="flex items-center justify-between mb-6">
              <span className="text-gray-700 dark:text-gray-300 font-semibold">Quantity</span>
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900">
                <button 
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  disabled={product.countInStock === 0}
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-bold text-gray-900 dark:text-white">{qty}</span>
                <button 
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  className="p-2 text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition"
                  disabled={product.countInStock === 0}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button 
              disabled={product.countInStock === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-lg font-bold py-4 px-8 rounded-xl shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex justify-center items-center gap-3">
              <ShoppingCart className="w-6 h-6" />
              {product.countInStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <Truck className="w-6 h-6 text-blue-500" />
              <span className="text-sm font-medium">Free Shipping</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
              <ShieldCheck className="w-6 h-6 text-green-500" />
              <span className="text-sm font-medium">1 Year Warranty</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
