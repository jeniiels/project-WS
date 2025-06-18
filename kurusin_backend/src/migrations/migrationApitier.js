const mongoose = require('mongoose');
const { Apitier } = require('../models');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(async () => {
    await Apitier.createCollection();
    console.log('Apitier collection created!');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
