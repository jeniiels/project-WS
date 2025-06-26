const mongoose = require('mongoose');
require('dotenv').config();

const migrateApitier = require('./migrationApitier');
const migrateUser = require('./migrationUser');
const migrateFood = require('./migrationFood');
const migrateExercise = require('./migrationExercise');
const migrateWorkouts = require('./migrationWorkouts');

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        await migrateApitier();
        await migrateUser();
        await migrateFood();
        await migrateExercise();
        await migrateWorkouts();

        console.log('\nAll migrations completed successfully!');
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}).catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});