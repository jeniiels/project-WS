require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../database/connection');

const runAllSeeders = async () => {
    try {
        await connectDB();
        
        console.log('Starting all seeders...');
        
        // Run seeders sequentially        console.log('Seeding users...');
        require('./seederUsers');
        
        setTimeout(() => {
            console.log('Seeding foods...');
            require('./seederFoods');
        }, 2000);

        setTimeout(() => {
            console.log('Seeding exercises...');
            require('./seederExercises');
        }, 4000);
        
        setTimeout(() => {
            console.log('Seeding workouts...');
            require('./seederWorkouts');
        }, 6000);
        
        setTimeout(() => {
            console.log('Seeding API data...');
            require('./seederApiData');
        }, 8000);
        
        setTimeout(() => {
            console.log('All seeders completed!');
            process.exit(0);
        }, 10000);
        
    } catch (error) {
        console.error('Failed to run all seeders:', error);
        process.exit(1);
    }
};

runAllSeeders();