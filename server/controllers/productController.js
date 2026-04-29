import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Order from '../models/Order.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const keyword = req.query.keyword
      ? { name: { $regex: req.query.keyword, $options: 'i' } }
      : {};

    let categoryFilter = {};
    if (req.query.category) {
      // Try to find the category by name slug (e.g. "cricket")
      const categoryDoc = await Category.findOne({
        name: { $regex: `^${req.query.category}$`, $options: 'i' },
      });
      if (categoryDoc) {
        categoryFilter = { category: categoryDoc._id };
      } else {
        // If not found by name, try as ObjectId directly
        categoryFilter = { category: req.query.category };
      }
    }

    const products = await Product.find({ ...keyword, ...categoryFilter }).populate('category');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch a product
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, images, brand, category, countInStock } = req.body;

    const product = new Product({
      name: name || 'Sample name',
      price: price || 0,
      description: description || 'Sample description',
      images: images || [],
      brand: brand || 'Sample brand',
      category: category || null,
      countInStock: countInStock || 0,
      numReviews: 0,
    });

    const createdProduct = await product.save();
    const populated = await createdProduct.populate('category');
    res.status(201).json(populated);
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    const { name, price, description, images, brand, category, countInStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.images = images;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await Product.deleteOne({ _id: product._id });
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews across all products
// @route   GET /api/products/reviews/all
// @access  Private/Admin
export const getReviews = async (req, res) => {
  try {
    // We fetch products that have at least one review and populate the user details
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .populate({
        path: 'reviews.user',
        select: 'name email addresses' // ensure we get contact details like addresses for phone number
      });

    const allReviews = [];
    products.forEach((product) => {
      product.reviews.forEach((review) => {
        allReviews.push({
          _id: review._id,
          productId: product._id,
          productName: product.name,
          rating: review.rating,
          comment: review.comment,
          user: review.user,
          createdAt: review.createdAt
        });
      });
    });

    // Sort by latest
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allReviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
export const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }

    // Check if user has ordered this product and it is delivered
    const orders = await Order.find({ user: req.user._id, isDelivered: true });
    
    // Check if any of these delivered orders contain the product
    const hasBoughtAndDelivered = orders.some(order => 
      order.orderItems.some(item => item.product.toString() === product._id.toString())
    );

    if (!hasBoughtAndDelivered) {
      return res.status(400).json({ message: 'You can only review products that have been delivered to you.' });
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: 'Review added' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
