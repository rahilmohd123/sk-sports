import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const addTrophyProduct = async () => {
  try {
    const trophyCat = await Category.findOne({ name: 'trophy' });
    if (!trophyCat) {
      console.log('Trophy category not found. Exiting.');
      process.exit();
    }

    const newTrophy = {
      name: 'Premium Gold Cup Trophy',
      images: ['/trophy_cup.png'],
      description: 'A beautiful, highly detailed premium gold cup trophy sitting on a prestigious wooden base. Perfect for tournament champions.',
      brand: 'SK Awards',
      category: trophyCat._id,
      price: 85.00,
      countInStock: 50,
      rating: 5.0,
      numReviews: 12,
    };

    const exists = await Product.findOne({ name: newTrophy.name });
    if (!exists) {
      await Product.create(newTrophy);
      console.log(`Added: ${newTrophy.name}`);
    } else {
      console.log(`Already exists: ${newTrophy.name}`);
    }

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addTrophyProduct();
