import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const updateYogaMat = async () => {
  try {
    const product = await Product.findOne({ name: 'Yoga Mat with Alignment Lines' });
    
    if (product) {
      product.images = ['/yoga_mat_alignment.png'];
      await product.save();
      console.log('Successfully updated Yoga Mat image!');
    } else {
      console.log('Yoga Mat product not found.');
    }
    
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateYogaMat();
