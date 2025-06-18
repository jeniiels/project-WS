const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new mongoose.Schema({
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
    },    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    saldo: {
        type: Number,
        default: 0
    },
    subscription: {
        type: String,
        enum: ['free', 'basic', 'premium'],
        default: 'free'
    },
    subscriptionDate: {
        type: Date,
        default: null
    },
    apiQuota: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
}, { 
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('User', userSchema, 'users');
