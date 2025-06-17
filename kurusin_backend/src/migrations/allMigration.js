require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../database/connection');

// Import all models
const User = require('../models/User');
const Food = require('../models/Food');
const Exercise = require('../models/Exercise');
const Workout = require('../models/Workout');
const ApiLog = require('../models/ApiLog');
const ApiTier = require('../models/ApiTier');
const FoodHistory = require('../models/FoodHistory');
const WorkoutHistory = require('../models/WorkoutHistory');

const runAllMigrations = async () => {
    try {
        await connectDB();

        // Initialize all models to create indexes and validate schemas
        await User.init();
        await Food.init();
        await Exercise.init();
        await Workout.init();
        await ApiLog.init();
        await ApiTier.init();
        await FoodHistory.init();
        await WorkoutHistory.init();

        console.log('Migration: All collections ready to use');
        console.log('Collections created: users, foods, exercises, workouts, apilogs, apitiers, foodhistories, workouthistories');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

runAllMigrations();