const mongoose = require('mongoose');
const { Schema } = mongoose;

const workoutHistorySchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    workout_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Workout'
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    heaviest_set: {
        type: String,
        default: ""
    },
    best_set_volume: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});
  
module.exports = mongoose.model('WorkoutHistory', workoutHistorySchema, 'workouthistories');
  