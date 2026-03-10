import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const CheckoutPage = () => {
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentDone, setPaymentDone] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    // Mock Razorpay integration flow
    console.log('Initiating Razorpay mock payment...');
    setTimeout(() => {
      setPaymentDone(true);
    }, 1000);
  };

  if (paymentDone) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center animate-fade-in">
        <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Thank you for your order. Your gear is officially on its way to you.
        </p>
        <Link to="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors">
          View Order Status
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Shipping Address</h2>
            <form onSubmit={submitHandler} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Street Address</label>
                <input type="text" required value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="123 Champion Lane" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City</label>
                  <input type="text" required value={city} onChange={e => setCity(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="New York" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Postal Code</label>
                  <input type="text" required value={postalCode} onChange={e => setPostalCode(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="10001" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Country</label>
                <input type="text" required value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="United States" />
              </div>

              <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
                <button type="submit" className="w-full py-4 bg-yellow-400 hover:bg-yellow-500 text-blue-900 text-lg font-bold rounded-xl transition-all shadow-md flex justify-center items-center">
                  Pay with Razorpay <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-blue-50 dark:bg-gray-900 border border-blue-100 dark:border-gray-800 p-8 rounded-3xl sticky top-24">
            <h2 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">Order Summary</h2>
            <div className="space-y-4 text-gray-600 dark:text-gray-300 pb-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex justify-between"><span>Items (3)</span> <span className="font-medium">$200.00</span></div>
              <div className="flex justify-between"><span>Shipping</span> <span className="font-medium">$15.00</span></div>
              <div className="flex justify-between"><span>Tax</span> <span className="font-medium">$10.00</span></div>
            </div>
            <div className="mt-6 flex justify-between items-center text-xl font-extrabold text-gray-900 dark:text-white">
              <span>Total</span>
              <span className="text-blue-600 dark:text-blue-400">$225.00</span>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400 text-center">
              Secured payments powered by Razorpay.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
