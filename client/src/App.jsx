import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import DashboardPage from './pages/DashboardPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import DynamicBackground from './components/DynamicBackground';
import ScrollToTop from './components/ScrollToTop';
import CartStoreSync from './components/CartStoreSync';

function App() {
  return (
    <div className="flex flex-col min-h-screen text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300 bg-transparent">
      <CartStoreSync />
      <DynamicBackground />
      <Header />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:keyword" element={<HomePage />} />
          <Route path="/category/:category" element={<HomePage />} />
          <Route path="/search/:keyword/category/:category" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/order/:id" element={<OrderDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}

export default App;
