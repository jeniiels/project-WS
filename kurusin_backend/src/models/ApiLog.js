const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    endpoint: {
        type: String,
        required: true
    },
    method: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    status_code: {
        type: Number,
        required: true
    },
    response_time: {
        type: Number, // in milliseconds
        required: true
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('ApiLog', apiLogSchema, 'apilogs');
