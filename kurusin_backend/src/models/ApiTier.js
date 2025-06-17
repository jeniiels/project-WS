const mongoose = require('mongoose');

const apiTierSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    tier: {
        type: String,
        enum: ['free', 'premium'],
        default: 'free'
    },
    api_hits_used: {
        type: Number,
        default: 0
    },
    max_api_hits: {
        type: Number,
        default: 100 // Free tier limit
    },
    subscription_start: {
        type: Date,
        default: Date.now
    },
    subscription_end: {
        type: Date,
        default: function() {
            // Default to 30 days from now
            const date = new Date();
            date.setDate(date.getDate() + 30);
            return date;
        }
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('ApiTier', apiTierSchema, 'apitiers');
