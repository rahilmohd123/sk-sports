import User from '../models/User.js';

// @desc    Get user profile (from token)
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({ _id: user._id, name: user.name, email: user.email, isAdmin: user.isAdmin, addresses: user.addresses });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) user.password = req.body.password;
      const updatedUser = await user.save();
      res.json({ _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, isAdmin: updatedUser.isAdmin, addresses: updatedUser.addresses });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isFirst = user.addresses.length === 0;
    const newAddress = {
      fullName: req.body.fullName,
      phone: req.body.phone || '',
      address: req.body.address,
      city: req.body.city,
      postalCode: req.body.postalCode,
      country: req.body.country,
      isDefault: isFirst || req.body.isDefault || false,
    };

    if (newAddress.isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    user.addresses.push(newAddress);
    await user.save();
    res.status(201).json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PUT /api/users/addresses/:addressId/default
// @access  Private
export const setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.addresses.forEach((a) => { a.isDefault = a._id.toString() === req.params.addressId; });
    await user.save();
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all users (Admin)
// @route   GET /api/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete user (Admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.isAdmin) return res.status(400).json({ message: 'Cannot delete an admin user' });
      await User.deleteOne({ _id: user._id });
      res.json({ message: 'User deleted successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Sync guest cart with user cart
// @route   POST /api/users/cart/sync
// @access  Private
export const syncCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const user = await User.findById(req.user._id);

    if (user) {
      const existingItems = user.cartItems || [];
      const mergedCart = [...existingItems];

      cartItems.forEach((localItem) => {
        const index = mergedCart.findIndex((i) => i._id.toString() === localItem._id.toString());
        if (index > -1) {
          mergedCart[index] = localItem; 
        } else {
          mergedCart.push(localItem);
        }
      });

      user.cartItems = mergedCart;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user cart explicitly
// @route   PUT /api/users/cart
// @access  Private
export const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    const user = await User.findById(req.user._id);
    if (user) {
      user.cartItems = cartItems;
      await user.save();
      res.json(user.cartItems);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
export const getUserCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json(user.cartItems || []);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
