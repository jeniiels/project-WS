const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        // Seed API tiers first
        await require('./seederApitier');
        
        // Then seed other collections
        await require('./seederUser');
        await require('./seederFood');
        await require('./seederExercise');
        await require('./seederWorkout');

        console.log('\nAll seeders completed successfully!');
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
