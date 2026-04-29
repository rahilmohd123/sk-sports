import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import connectDB from './config/db.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await connectDB();
    const users = await User.find({});
    console.log(`There are ${users.length} users in the database.`);
    if (users.length > 0) {
      console.log(users[0].name, users[0].email, users[0].isAdmin);
    }
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

checkUsers();
