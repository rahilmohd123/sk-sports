import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const updateTrophyCategory = async () => {
  try {
    const trophyCat = await Category.findOne({ name: 'trophy' });
    if (trophyCat) {
      trophyCat.image = '/trophy_cup.png';
      await trophyCat.save();
      console.log('Trophy category image updated to /trophy_cup.png');
    } else {
      console.log('Trophy category not found!');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

updateTrophyCategory();
