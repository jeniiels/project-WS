const mongoose = require('mongoose');
const { Apitier } = require('../models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    await Apitier.deleteMany({});
    
    const apiTiers = [
        {
            name: 'free',
            price: 0,
            monthlyQuota: 100,
            description: 'Free tier with 100 API calls per month'
        },
        {
            name: 'basic',
            price: 55000,
            monthlyQuota: 1000,
            description: 'Basic tier with 1,000 API calls per month'
        },
        {
            name: 'premium',
            price: 99000,
            monthlyQuota: 10000,
            description: 'Premium tier with 10,000 API calls per month'
        }
    ];

    await Apitier.insertMany(apiTiers);
    console.log('Dummy API tiers seeded!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
