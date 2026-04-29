import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const updates = [
  { name: 'Pro English Willow Cricket Bat', image: '/products/cricket_bat.png' },
  { name: 'Premium Titanium Cricket Helmet', image: '/products/premium_cricket_helmet.png' },
  { name: 'Professional Leather Cricket Ball', image: '/products/cricket_ball.png' },
  { name: 'Cricket Batting Pads (Junior)', image: '/products/cricket_pads.png' },
  { name: 'Cricket Batting Gloves Pro', image: '/products/cricket_batting_gloves.png' },
  { name: 'Cricket Wicket Keeping Gloves', image: '/products/cricket_wk_gloves.png' },
];

const updateImages = async () => {
  try {
    for (let update of updates) {
      const product = await Product.findOne({ name: update.name });
      if (product) {
        product.images = [update.image];
        await product.save();
        console.log(`Updated: ${update.name}`);
      } else {
        console.log(`Not found: ${update.name}`);
      }
    }
    console.log('✅ Images updated successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateImages();
