require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../models/User');
const connectDB = require('../database/connection');

const seedUsers = async () => {
    try {
        await connectDB();

        await User.deleteMany();

        const users = [];

        for (let i = 0; i < 20; i++) {
        users.push({
            name: faker.person.fullName(),
            email: faker.internet.email(),
            password: faker.internet.password({ length: 10, memorable: true }),
        });
        }

        await User.insertMany(users);
        console.log('Seeder: 20 users berhasil dibuat!');
        process.exit(0);
    } catch (error) {
        console.error('Gagal melakukan seeding:', error);
        process.exit(1);
    }
};

seedUsers();
