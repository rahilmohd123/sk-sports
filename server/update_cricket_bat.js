import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const updateCricketBat = async () => {
  try {
    // Try both names in case it was created differently
    const product = await Product.findOne({ name: { $in: ['Pro English Willow Cricket Bat', 'Pro Cricket Bat - English Willow'] } });
    
    if (product) {
      product.name = 'Pro English Willow Cricket Bat';
      product.images = ['/cricket_bat.png'];
      await product.save();
      console.log('Successfully updated Cricket Bat image and name!');
    } else {
      console.log('Cricket Bat product not found.');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateCricketBat();
