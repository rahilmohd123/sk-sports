import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const dummyProducts = [
  { _id: '1', name: 'Pro Cricket Bat - English Willow', image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=400', price: 120.00, rating: 4.5, numReviews: 12, countInStock: 5 },
  { _id: '2', name: 'Premium Match Football Size 5', image: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?auto=format&fit=crop&q=80&w=400', price: 40.00, rating: 5, numReviews: 8, countInStock: 15 },
  { _id: '3', name: 'Adjustable Dumbbells Set', image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&q=80&w=400', price: 199.99, rating: 4.8, numReviews: 34, countInStock: 0 },
  { _id: '4', name: 'Pro Elite Running Shoes', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400', price: 150.00, rating: 4.2, numReviews: 24, countInStock: 10 },
  { _id: '5', name: 'Yoga Mat with Alignment Lines', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cfecb7?auto=format&fit=crop&q=80&w=400', price: 35.00, rating: 4.9, numReviews: 54, countInStock: 20 },
  { _id: '6', name: 'Professional Tennis Racket', image: 'https://images.unsplash.com/photo-1622279457486-640c4cbce8e9?auto=format&fit=crop&q=80&w=400', price: 180.00, rating: 4.6, numReviews: 19, countInStock: 8 },
];

const HomePage = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative bg-blue-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-800 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-24 lg:py-32">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4">
            UNLEASH YOUR <br/> <span className="text-yellow-400">POTENTIAL</span>
          </h1>
          <p className="max-w-xl text-lg md:text-xl text-blue-100 mb-8 font-medium">
            Premium sports gear, apparel, and equipment to push your performance to the absolute limit.
          </p>
          <Link to="#products" className="inline-block bg-yellow-400 hover:bg-yellow-500 text-blue-900 font-bold py-3 px-8 rounded-full shadow-lg transform hover:-translate-y-1 transition-all duration-300 text-lg">
            Shop Now
          </Link>
        </div>
      </div>

      {/* Latest Products */}
      <div id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Latest Gear</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Check out our newest arrivals customized for your sport.</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {dummyProducts.map((product) => (
             <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
