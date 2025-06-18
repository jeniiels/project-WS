const mongoose = require('mongoose');
const { Workout } = require('../models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    await Workout.createCollection();
    console.log('Workout collection created!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
