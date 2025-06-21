const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutEntrySchema = new Schema({
    id_workout: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    duration_total: {
        type: String,
        required: true
    }
}, { _id: false });

const summaryWorkoutSchema = new Schema({
    duration: {
        type: String,
        required: true
    },
    kalori: {
        type: Number,
        default: 0
    },
}, { 
    _id: false 
});

const workoutHistorySchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    tanggal: {
        type: String,
        required: true
    },
    workouts: [workoutEntrySchema],
    summary: summaryWorkoutSchema
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema, 'workouthistories');
