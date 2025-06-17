require('dotenv').config();
const mongoose = require('mongoose');
const Workout = require('../models/Workout');
const connectDB = require('../database/connection');

const runMigration = async () => {
    try {
        await connectDB();

        // Ensure indexes are created and schema is valid
        await Workout.init();

        console.log('Migration: Workout collection ready to use');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

runMigration();