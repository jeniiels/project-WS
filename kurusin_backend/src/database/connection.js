const mongoose = require('mongoose');
const config = require('../config/config');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.connection.uri);
        console.log(`MongoDB connected: ${conn.connection.db.databaseName}`);
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
