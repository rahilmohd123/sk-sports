import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalUsers = await User.countDocuments({ isAdmin: false });

    // Total revenue from paid orders
    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } },
    ]);
    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    // Pending orders count
    const pendingOrders = await Order.countDocuments({ isDelivered: false });

    // Monthly income for last 7 months
    const monthlyIncome = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$totalPrice' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 12 },
    ]);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedMonthly = monthlyIncome.map((m) => ({
      name: monthNames[m._id.month - 1],
      revenue: Math.round(m.revenue * 100) / 100,
      orders: m.orders,
    }));

    // Recent orders
    const recentOrders = await Order.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalOrders,
      totalProducts,
      totalUsers,
      pendingOrders,
      monthlyIncome: formattedMonthly,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Seed admin user from env credentials
// @route   POST /api/admin/seed
// @access  Public (only creates if not exists)
export const seedAdmin = async (req, res) => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return res.status(500).json({ message: 'Admin credentials not configured in .env' });
    }

    const existing = await User.findOne({ email: adminEmail.toLowerCase() });
    if (existing) {
      return res.json({ message: 'Admin user already exists', email: adminEmail.toLowerCase() });
    }

    const admin = await User.create({
      name: 'SK Sports Admin',
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      isAdmin: true,
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      email: admin.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
