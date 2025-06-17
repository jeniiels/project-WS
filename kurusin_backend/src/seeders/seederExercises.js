require('dotenv').config();
const mongoose = require('mongoose');
const Exercise = require('../models/Exercise');
const connectDB = require('../database/connection');

const seedExercises = async () => {
    try {
        await connectDB();

        await Exercise.deleteMany();

        const exercises = [
            {
                id: "0001",
                name: "3/4 sit-up",
                equipment: "body weight",
                muscles: ["abs", "hip flexors", "lower back"],
                img: "https://v2.exercisedb.io/image/6dWmpataxPBdzJ"
            },
            {
                id: "0002",
                name: "45° side bend",
                equipment: "body weight",
                muscles: ["abs", "obliques"],
                img: "https://v2.exercisedb.io/image/45SideBend"
            },
            {
                id: "0003",
                name: "air bike",
                equipment: "body weight",
                muscles: ["abs", "hip flexors"],
                img: "https://v2.exercisedb.io/image/AirBike"
            },
            {
                id: "0004",
                name: "barbell bench press",
                equipment: "barbell",
                muscles: ["chest", "shoulders", "triceps"],
                img: "https://v2.exercisedb.io/image/BarbellBenchPress"
            },
            {
                id: "0005",
                name: "barbell squat",
                equipment: "barbell",
                muscles: ["quadriceps", "glutes", "hamstrings"],
                img: "https://v2.exercisedb.io/image/BarbellSquat"
            },
            {
                id: "0006",
                name: "pull-up",
                equipment: "body weight",
                muscles: ["lats", "biceps", "middle trapezius"],
                img: "https://v2.exercisedb.io/image/PullUp"
            },
            {
                id: "0007",
                name: "push-up",
                equipment: "body weight",
                muscles: ["chest", "shoulders", "triceps"],
                img: "https://v2.exercisedb.io/image/PushUp"
            },
            {
                id: "0008",
                name: "dumbbell bicep curl",
                equipment: "dumbbell",
                muscles: ["biceps", "forearms"],
                img: "https://v2.exercisedb.io/image/DumbbellBicepCurl"
            },
            {
                id: "0009",
                name: "plank",
                equipment: "body weight",
                muscles: ["abs", "shoulders", "back"],
                img: "https://v2.exercisedb.io/image/Plank"
            },
            {
                id: "0010",
                name: "deadlift",
                equipment: "barbell",
                muscles: ["hamstrings", "glutes", "lower back"],
                img: "https://v2.exercisedb.io/image/Deadlift"
            }
        ];

        await Exercise.insertMany(exercises);
        console.log(`Seeder: ${exercises.length} exercises successfully created!`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed exercises:', error);
        process.exit(1);
    }
};

seedExercises();
