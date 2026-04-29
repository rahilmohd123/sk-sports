# SK Sports 🏀⚽🎾

SK Sports is a premium, high-energy e-commerce platform for athletes and sports enthusiasts. Built with the MERN stack, it features a cutting-edge UI with WebGL animations, professional branding, and a robust feature set for a seamless shopping experience.

---

## 🔥 Key Features

### 💻 Stunning UI/UX
- **Dynamic 3D Backgrounds**: Integration of high-performance WebGL components like *LightRays* and *GridScan* for a futuristic aesthetic.
- **Interactive Product Cards**: 3D tilted card animations with real-time hover effects using `framer-motion`.
- **Neon-Dark Theme**: A polished, dark-mode-first design with high-energy neon green accenting.
- **Micro-animations**: Smooth transitions, pulsating loaders, and hover-active states for superior engagement.

### 🛒 Advanced Cart System
- **Guest vs. User Synchronization**: Intelligent cart management that preserves guest items in `localStorage` and optionally merges them into a user's database-backed account upon registration.
- **Strict Privacy**: Existing user data is prioritized; guest carts are cleared upon login to ensure session cleanliness.
- **Buy Now Support**: Quick checkout for single items without disrupting the main cart items.

### 🛡️ Secure Authentication
- **Validated Registration**: Strict validation for emails and passwords to ensure security.
- **JWT-based Sessions**: Secure, cookie-based authentication.
- **OTP Recovery**: Password reset flows via mobile number OTP simulation.

### ⚙️ Admin Power
- **Dashboard**: Full overview of orders, users, and stock status.
- **Product Management**: Complete CRUD operations for categories and products including multiple image support.
- **Order Tracking**: Manage shipping status and payment verification.

---

## 🛠️ Technology Stack

- **Frontend**: React.js, Redux Toolkit, Tailwind CSS, Lucide Icons.
- **Animations**: OGL (WebGL), Framer Motion, Vanilla CSS (Premium Micro-animations).
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Mongoose ORM).
- **Payments**: Razorpay Integration.
- **State Management**: Redux Toolkit Query (RTK Query) for efficient API caching.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/rahilmohd123/sk-sports.git
   ```

2. **Server Setup**:
   ```bash
   cd server
   npm install
   # Create a .env file with:
   # PORT=5000
   # MONGO_URI=your_mongodb_uri
   # JWT_SECRET=your_secret
   # RAZORPAY_KEY_ID=your_id
   # RAZORPAY_KEY_SECRET=your_secret
   npm run dev
   ```

3. **Client Setup**:
   ```bash
   cd client
   npm install
   npm run dev
   ```

4. **Admin Panel Setup**:
   ```bash
   cd admin-panel
   npm install
   npm run dev
   ```

---

## ⚖️ License

**Proprietary License - All Rights Reserved.**

This software is the private property of the owner. Unauthorized copying, modification, or distribution of this code or any part of it is strictly prohibited. For inquiries, please contact the owner.
