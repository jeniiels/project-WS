const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { User } = require('../models');
require('dotenv').config();

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await User.deleteMany({});
    const users = [];
    for (let i = 0; i < 10; i++) {
            users.push(new User({
                id: faker.string.uuid(),
                username: faker.internet.username(),
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            }));
    }

    await User.insertMany(users);
    console.log('Dummy users seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
