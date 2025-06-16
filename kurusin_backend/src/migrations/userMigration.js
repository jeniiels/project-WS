require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../database/connection');

const runMigration = async () => {
    try {
        await connectDB();

        // Pastikan index dibuat dan schema valid
        await User.init(); // penting: ini membuat index secara eksplisit

        console.log('Migration: User collection siap digunakan');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

runMigration();
