const mongoose = require('mongoose');
const { Schema } = mongoose;

const exerciseSetSchema = new Schema({
    id_exercise: { 
        type: String, 
        required: true 
    },
    sets: [
        { 
            type: String, 
            required: true
        }
    ],
    heaviest_weight: {
        type: String,
        default: ""
    },
    best_set_volume: {
        type: String,
        default: ""
    }
}, { 
    _id: false 
});

const workoutSchema = new Schema({
    id: { 
        type: String, 
        required: true,
        unique: true
    },
    exercises: [ exerciseSetSchema ],
    kalori_total: {
        type: Number,
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Workout', workoutSchema, 'workouts');
