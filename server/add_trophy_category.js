import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from './models/Category.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const addTrophy = async () => {
  try {
    const exists = await Category.findOne({ name: 'trophy' });
    if (!exists) {
      await Category.create({
        name: 'trophy',
        description: 'Awards, medals, and premium trophies to celebrate victories and achievements.',
        image: 'https://images.unsplash.com/photo-1563299796-12ec2bf98715?auto=format&fit=crop&q=80&w=800'
      });
      console.log('Trophy category added successfully!');
    } else {
      console.log('Trophy category already exists.');
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

addTrophy();
