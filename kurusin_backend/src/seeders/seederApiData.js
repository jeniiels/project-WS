require('dotenv').config();
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const ApiTier = require('../models/ApiTier');
const ApiLog = require('../models/ApiLog');
const connectDB = require('../database/connection');

const seedApiData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await ApiTier.deleteMany();
        await ApiLog.deleteMany();

        const apiTiers = [];
        const apiLogs = [];        // Create API tiers for users
        for (let i = 1; i <= 20; i++) {
            const tier = faker.helpers.arrayElement(['free', 'premium']);
            const username = `user${i}`;
            
            const subscriptionStart = faker.date.recent({ days: 30 });
            const subscriptionEnd = new Date(subscriptionStart);
            subscriptionEnd.setDate(subscriptionEnd.getDate() + (tier === 'premium' ? 365 : 30));
            
            apiTiers.push({
                username,
                tier,
                api_hits_used: faker.number.int({ min: 0, max: tier === 'premium' ? 500 : 80 }),
                max_api_hits: tier === 'premium' ? 10000 : 100,
                subscription_start: subscriptionStart,
                subscription_end: subscriptionEnd,
                is_active: faker.datatype.boolean(0.9) // 90% chance of being active
            });

            // Create some API logs for each user
            const numberOfLogs = faker.number.int({ min: 10, max: 50 });
            for (let j = 0; j < numberOfLogs; j++) {
                const endpoints = [
                    '/api/exercises',
                    '/api/exercises/0001',
                    '/api/workouts',
                    '/api/workouts/507f1f77bcf86cd799439011'
                ];
                
                apiLogs.push({
                    username,
                    endpoint: faker.helpers.arrayElement(endpoints),
                    method: faker.helpers.arrayElement(['GET', 'POST', 'PUT', 'DELETE']),
                    timestamp: faker.date.recent({ days: 30 }),
                    status_code: faker.helpers.arrayElement([200, 201, 400, 404, 500]),
                    response_time: faker.number.int({ min: 50, max: 2000 })
                });
            }
        }

        await ApiTier.insertMany(apiTiers);
        await ApiLog.insertMany(apiLogs);
        
        console.log('Seeder: API tiers and logs successfully created!');
        console.log(`Created ${apiTiers.length} API tiers and ${apiLogs.length} API logs`);
        process.exit(0);
    } catch (error) {
        console.error('Failed to seed API data:', error);
        process.exit(1);
    }
};

seedApiData();
