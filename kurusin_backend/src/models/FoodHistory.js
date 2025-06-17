const mongoose = require('mongoose');

const foodHistorySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    id_food: {
        type: String,
        required: true
    },
    food_name: {
        type: String,
        required: true
    },
    serving_amount: {
        type: Number,
        required: true,
        default: 1
    },
    total_calories: {
        type: Number,
        required: true
    },
    meal_type: {
        type: String,
        enum: ['breakfast', 'lunch', 'dinner', 'snack'],
        required: true
    },
    consumed_at: {
        type: Date,
        default: Date.now
    },
    image_url: {
        type: String // URL for scanned food image
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('FoodHistory', foodHistorySchema, 'foodhistories');
