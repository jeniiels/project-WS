const mongoose = require('mongoose');
const { Exercise } = require('./models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    await Exercise.createCollection();
    console.log('Exercise collection created!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
