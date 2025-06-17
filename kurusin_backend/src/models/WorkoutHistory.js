const mongoose = require('mongoose');

const workoutHistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    id_workout: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workout',
        required: true
    },
    workout_name: {
        type: String,
        required: true
    },
    total_duration: {
        type: Number, // in minutes
        required: true
    },
    total_calories_burned: {
        type: Number,
        required: true
    },
    exercises_completed: [{
        id_exercise: String,
        exercise_name: String,
        sets_completed: Number,
        total_reps: Number,
        total_weight: Number
    }],
    completed_at: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema, 'workouthistories');
