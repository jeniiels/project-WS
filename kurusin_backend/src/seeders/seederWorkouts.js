require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const Workout = require('../models/Workout');
const connectDB = require('../database/connection');

const seedWorkouts = async () => {
    try {
        await connectDB();

        await Workout.deleteMany();

        const workouts = [];

        // Sample exercise IDs (these would correspond to real exercise IDs from ExerciseDB)
        const exerciseIds = ['0001', '0002', '0003', '0004', '0005', '0006', '0007', '0008', '0009', '0010'];
        
        for (let i = 0; i < 30; i++) {
            const numberOfExercises = faker.number.int({ min: 3, max: 6 });
            const exercises = [];
            
            for (let j = 0; j < numberOfExercises; j++) {
                const numberOfSets = faker.number.int({ min: 2, max: 5 });
                const sets = [];
                
                for (let k = 0; k < numberOfSets; k++) {
                    const reps = faker.number.int({ min: 8, max: 15 });
                    const weight = faker.number.int({ min: 10, max: 100 });
                    sets.push(`${reps} reps @ ${weight}kg`);
                }
                
                exercises.push({
                    id_exercise: faker.helpers.arrayElement(exerciseIds),
                    sets: sets
                });
            }
              workouts.push({
                username: `user${faker.number.int({ min: 1, max: 20 })}`,
                time: faker.date.recent({ days: 30 }).toISOString(),
                duration: `${faker.number.int({ min: 30, max: 120 })} minutes`,
                exercises: exercises
            });
        }

        await Workout.insertMany(workouts);
        console.log('Seeder: 30 workouts successfully created!');
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed workouts:', error);
        process.exit(1);
    }
};

seedWorkouts();