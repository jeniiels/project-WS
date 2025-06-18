const mongoose = require('mongoose');
const { Schema } = mongoose;

const apitierSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: ['free', 'basic', 'premium']
    },
    monthlyQuota: {
        type: Number,
        required: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('Apitier', apitierSchema, 'apitiers');
