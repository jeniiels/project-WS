const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSchema = new Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    equipment: { 
        type: String, 
        required: true 
    },
    muscles: [{ 
        type: String, required: true 
    }],
    img: { 
        type: String 
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('Exercise', exerciseSchema, 'exercises');
