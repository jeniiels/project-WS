const mongoose = require('mongoose');
const { Schema } = mongoose;

const historySchema = new Schema({
    type: { 
        type: String, 
        required: true 
    },
    workoutName: { 
        type: String, 
        required: true 
    },
    durationMinutes: { 
        type: Number, 
        required: true 
    },
    caloriesBurned: { 
        type: Number, 
        required: true 
    },
    timestamp: { 
        type: Date, 
        required: true 
    },
    notes: { 
        type: String 
    }
}, { 
    _id: false 
});

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    history: [ historySchema ]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', userSchema, 'users');
