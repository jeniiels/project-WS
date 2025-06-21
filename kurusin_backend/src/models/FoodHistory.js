const mongoose = require('mongoose');
const { Schema } = mongoose;

const foodEntrySchema = new Schema({
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    jumlah: {
        type: Number,
        required: true
    },
    tipe_sajian: {
        type: String,
        required: true
    },
    kalori_total: {
        type: Number,
        required: true
    }
}, { _id: false });

const summaryFoodSchema = new Schema({
    kalori: {
        type: Number,
        default: 0
    },
    protein: {
        type: Number,
        default: 0
    },
    lemak: {
        type: Number,
        default: 0
    },
    karbohidrat: {
        type: Number,
        default: 0
    }
}, { 
    _id: false 
});

const foodHistorySchema = new Schema({
    username: {
        type: String,
        required: true,
        index: true
    },
    tanggal: {
        type: String,
        required: true
    },
    foods: [foodEntrySchema],
    summary: summaryFoodSchema
}, {
    timestamps: true,
    versionKey: false
});

module.exports = mongoose.model('FoodHistory', foodHistorySchema, 'foodhistories');
