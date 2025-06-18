const mongoose = require('mongoose');
const { User } = require('../models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    await User.createCollection();
    console.log('User collection created!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});