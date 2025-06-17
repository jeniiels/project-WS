const mongoose = require('mongoose');
require('dotenv').config();

await mongoose.connect(process.env.MONGO_URI);
try {
    await require('./seederUser')();
    await require('./seederFood')();
    await require('./seederExercise')();
    await require('./seederWorkout')();

    console.log('\nAll seeders completed successfully!');
} catch (err) {
    console.error(err);
} finally {
    await mongoose.disconnect();
    process.exit(0);
}
