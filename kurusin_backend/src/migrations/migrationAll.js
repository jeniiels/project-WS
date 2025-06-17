const mongoose = require('mongoose');
require('dotenv').config();

await mongoose.connect(process.env.MONGO_URI);

try {
    await require('./migrationUser')();
    await require('./migrationFood')();
    await require('./migrationExercise')();
    await require('./migrationWorkouts')();

    console.log('\nAll migrations completed successfully!');
} catch (err) {
    console.error(err);
} finally {
    await mongoose.disconnect();
    process.exit(0);
}