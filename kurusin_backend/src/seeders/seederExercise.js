const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
require('dotenv').config();

const Exercise = require('../models/Exercise');

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Exercise.deleteMany({});
    const equipmentList = ['barbell', 'dumbbell', 'body weight', 'machine'];
    const muscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];
    const exercises = [];

    for (let i = 0; i < 10; i++) {
        const muscles = faker.helpers.arrayElements(muscleGroups, faker.number.int({ min: 1, max: 3 }));
        exercises.push(new Exercise({
            id: faker.string.uuid(),
            name: faker.commerce.productName() + ' press',
            equipment: faker.helpers.arrayElement(equipmentList),
            muscles: muscles,
            img: faker.image.urlPicsumPhotos({ width: 400, height: 300 })
        }));
    }

    await Exercise.insertMany(exercises);
    console.log('Dummy exercises seeded!');
    process.exit(0);
}).catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
