require('dotenv').config();
const mongoose = require('mongoose');
const ApiLog = require('../models/ApiLog');
const ApiTier = require('../models/ApiTier');
const connectDB = require('../database/connection');

const runMigration = async () => {
    try {
        await connectDB();

        // Ensure indexes are created and schema is valid
        await ApiLog.init();
        await ApiTier.init();

        console.log('Migration: ApiLog and ApiTier collections ready to use');
        process.exit(0);
    } catch (err) {
        console.error('Migration error:', err);
        process.exit(1);
    }
};

runMigration();
