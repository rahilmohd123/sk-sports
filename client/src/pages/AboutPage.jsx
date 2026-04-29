import { Trophy, ShieldCheck, Truck } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">About SK Sports</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Welcome to SK Sports, your ultimate destination for premium sports gear. 
          Founded with a passion for excellence, we strive to equip athletes at all levels 
          with the highest quality equipment to help them perform at their best.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-12 text-center mt-12">
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-6">
            <Trophy className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Premium Quality</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We partner with the best brands to ensure every piece of gear meets the highest standards of performance and durability.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">100% Authentic</h3>
          <p className="text-gray-600 dark:text-gray-400">
            All our products are guaranteed to be 100% authentic so you can shop with complete peace of mind.
          </p>
        </div>
        <div className="p-6 bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="w-16 h-16 mx-auto bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 rounded-full flex items-center justify-center mb-6">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Fast Shipping</h3>
          <p className="text-gray-600 dark:text-gray-400">
            We know you are eager to get out on the field, which is why we ensure fast, reliable delivery to your doorstep.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
