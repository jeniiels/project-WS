const mongoose = require('mongoose');
const { Schema } = mongoose;

const apilogSchema = new Schema({
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
        enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    statusCode: {
        type: Number
    },
    userAgent: {
        type: String
    },
    ip: {
        type: String
    }
}, {
    timestamps: false,
    versionKey: false
});

module.exports = mongoose.model('Apilog', apilogSchema, 'apilogs');
