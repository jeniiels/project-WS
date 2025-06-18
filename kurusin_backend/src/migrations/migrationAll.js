const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    try {
        await require('./migrationApitier');
        await require('./migrationUser');
        await require('./migrationFood');
        await require('./migrationExercise');
        await require('./migrationWorkouts');

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