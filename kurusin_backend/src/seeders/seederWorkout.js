const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Workout = require('../models/Workout');

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Workout.deleteMany({});
    const workouts = [];

    for (let i = 0; i < 10; i++) {
        const exerciseCount = faker.number.int({ min: 1, max: 5 });
        const exercises = Array.from({ length: exerciseCount }).map(() => ({
            id_exercise: faker.string.uuid(),
            sets: Array.from({ length: faker.number.int({ min: 2, max: 5 }) }).map(() => {
                const reps = faker.number.int({ min: 8, max: 15 });
                const weight = faker.number.int({ min: 20, max: 100 });
                return `${reps} reps x ${weight} kg`;
            })
        }));

        const id = 'WO' + (i + 1).toString().padStart(3, '0');

        workouts.push(new Workout({
            id,
            username: faker.string.uuid(),
            time: faker.date.recent().toISOString(),
            duration: `${faker.number.int({ min: 20, max: 90 })} minutes`,
            exercises: exercises
        }));
    }

    await Workout.insertMany(workouts);
    console.log('Dummy workouts seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
