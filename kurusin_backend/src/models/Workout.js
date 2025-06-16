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
    ]
}, { 
    _id: false 
});

const workoutSchema = new Schema({
    id_user: { 
        type: String, 
        required: true 
    },
    time: { 
        type: String, 
        required: true 
    },
    duration: { 
        type: String, 
        required: true 
    },
    exercises: [ exerciseSetSchema ]
});

module.exports = mongoose.model('Workout', workoutSchema, 'workouts');
