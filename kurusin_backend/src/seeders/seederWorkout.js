const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Workout = require('../models/Workout');
const calculateHeaviestSet = require('../utils/helper/calculateHeaviestSet');
const calculateBestVolume = require('../utils/helper/calculateBestVolume');

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Workout.deleteMany({});

    const workouts = [];

    for (let i = 1; i <= 20; i++) {
        const numExercises = faker.number.int({ min: 1, max: 5 });

        const exercises = [];

        for (let j = 0; j < numExercises; j++) {
            const idNum = faker.number.int({ min: 1, max: 100 });
            const id_exercise = idNum.toString().padStart(4, '0'); // 0001–0100

            const numSets = faker.number.int({ min: 2, max: 5 });
            const sets = [];

            for (let k = 0; k < numSets; k++) {
                const weight = faker.number.float({ min: 2.5, max: 50, multipleOf: 2.5 });
                const reps = faker.number.int({ min: 5, max: 15 });
                const setStr = `${weight}kg x ${reps}`;
                sets.push(setStr);
            }

            const heaviest_weight = calculateHeaviestSet(sets);
            const best_set_volume = calculateBestVolume(sets);

            exercises.push({
                id_exercise,
                sets,
                heaviest_weight,
                best_set_volume
            });
        }

        const id = 'WO' + i.toString().padStart(3, '0');
        const kalori_total = faker.number.int({ min: 1, max: 300 });
        workouts.push(new Workout({
            id: `WO${i.toString().padStart(3, '0')}`,
            exercises,
            kalori_total
        }));
    }

    await Workout.insertMany(workouts);
    console.log('Dummy workouts seeded!');
    process.exit(0);
}).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});