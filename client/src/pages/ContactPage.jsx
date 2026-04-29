import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Contact Us</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Have a question or need help with an order? We would love to hear from you.
          Use the details below or drop us a message to get in touch.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="p-4 bg-blue-50 dark:bg-gray-800 rounded-2xl flex-shrink-0 text-blue-600 dark:text-blue-400">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">+91 7022050785</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">Mon-Fri from 9am to 6pm IST</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-4 bg-green-50 dark:bg-gray-800 rounded-2xl flex-shrink-0 text-green-600 dark:text-green-400">
              <Mail className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Email</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-1">sksports@gmail.com</p>
              <p className="text-
              sm text-gray-500 dark:text-gray-500">We aim to reply within 24 hours</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-4 bg-purple-50 dark:bg-gray-800 rounded-2xl flex-shrink-0 text-purple-600 dark:text-purple-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Headquarters</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Pinapal City Ground Floor<br />
                Moodbidri, Mangalore<br />
                Karnataka 574227
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert("Thanks for reaching out! We'll be in touch soon."); }}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
              <input type="text" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
              <input type="email" required className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
              <textarea required rows="4" className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white outline-none resize-none" placeholder="How can we help?"></textarea>
            </div>
            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition shadow-md flex justify-center items-center gap-2">
              Send Message <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
