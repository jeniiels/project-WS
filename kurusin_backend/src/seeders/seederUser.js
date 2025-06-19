const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const { User } = require('../models');
require('dotenv').config();

faker.seed(50);

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await User.deleteMany({});

    const roles = ['user', 'admin'];
    const subscriptions = ['free', 'basic', 'premium'];

    const users = [];

    for (let i = 0; i < 10; i++) {
        const subscription = faker.helpers.arrayElement(subscriptions);
        const isSubscribed = subscription !== 'free';

        users.push(new User({
            username: faker.internet.username(),
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password(),
            role: faker.helpers.arrayElement(roles),
            saldo: faker.number.int({ min: 0, max: 100000 }),
            subscription,
            subscriptionDate: isSubscribed ? faker.date.past({ years: 1 }) : null,
            apiQuota: faker.number.int({ min: 0, max: 500 }),
        }));
    }

    await User.insertMany(users);
    console.log('Dummy users seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
