import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const addProducts = async () => {
  try {
    const footballCat = await Category.findOne({ name: 'football' });
    if (!footballCat) {
      console.log('Football category not found. Exiting.');
      process.exit();
    }

    const items = [
      {
        name: 'Elite Pro Goalkeeper Gloves',
        images: ['/gk_gloves.png'],
        description: 'Premium professional goalkeeper gloves featuring excellent grip padding and neon green accents for maximum impact protection.',
        brand: 'SK Sports',
        category: footballCat._id,
        price: 35.00,
        countInStock: 25,
        rating: 4.7,
        numReviews: 14,
      },
      {
        name: 'Agility Training Cones & Ladder Set',
        images: ['/agility_set.png'],
        description: 'Complete football agility training set including orange cones and a yellow agility ladder perfectly engineered for accelerating drills.',
        brand: 'SK Sports',
        category: footballCat._id,
        price: 25.00,
        countInStock: 40,
        rating: 4.8,
        numReviews: 32,
      }
    ];

    // Check if they exist to avoid duplicates
    for (let item of items) {
      const exists = await Product.findOne({ name: item.name });
      if (!exists) {
        await Product.create(item);
        console.log(`Added: ${item.name}`);
      } else {
        console.log(`Already exists: ${item.name}`);
      }
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addProducts();
