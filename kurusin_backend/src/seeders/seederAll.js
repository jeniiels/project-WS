const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        require('./seederApitier');
        require('./seederUser');
        require('./seederFood');
        require('./seederExercise');
        require('./seederWorkout');
        require('./seederFoodHistory');
        require('./seederWorkoutHistory');

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
