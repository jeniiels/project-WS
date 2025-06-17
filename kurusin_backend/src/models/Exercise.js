const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    equipment: {
        type: String,
        required: true,
    },
    muscles: [{
        type: String,
        required: true
    }],
    img: {
        type: String,
        required: true
    }
}, { 
    timestamps: false 
});

module.exports = mongoose.model('Exercise', exerciseSchema, 'exercises');