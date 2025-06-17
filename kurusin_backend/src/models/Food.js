const mongoose = require('mongoose');

const nutrientFactSchema = new mongoose.Schema({
    energi: { type: Number, default: 0 },
    lemak_total: { type: Number, default: 0 },
    vitamin_a: { type: Number, default: 0 },
    vitamin_b1: { type: Number, default: 0 },
    vitamin_b2: { type: Number, default: 0 },
    vitamin_b3: { type: Number, default: 0 },
    vitamin_c: { type: Number, default: 0 },
    karbohidrat_total: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    serat_pangan: { type: Number, default: 0 },
    kalsium: { type: Number, default: 0 },
    fosfor: { type: Number, default: 0 },
    natrium: { type: Number, default: 0 },
    kalium: { type: Number, default: 0 },
    tembaga: { type: Number, default: 0 },
    besi: { type: Number, default: 0 },
    seng: { type: Number, default: 0 },
    b_karoten: { type: Number, default: 0 },
    karoten_total: { type: Number, default: 0 },
    air: { type: Number, default: 0 },
    abu: { type: Number, default: 0 }
}, { _id: false });

const foodSchema = new mongoose.Schema({
    id: {
        type: String,
        required: [true, "Custom food ID is required."],
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: [true, "Food name is required."],
        trim: true,
        index: true
    },
    jumlah_sajian_per_kemasan: {
        type: Number,
        default: 1
    },
    jumlah_per_sajian: {
        type: Number,
        default: 0
    },
    tipe_sajian: {
        type: String,
        trim: true,
        default: ""
    },
    nutrient_fact_100g: {
        type: nutrientFactSchema,
        default: () => ({})
    },
    nutrient_fact_per_serving: {
        type: nutrientFactSchema,
        required: [true, "Nutrient fact per serving is required."],
        default: () => ({})
    },
    image: {
        type: String,
        trim: true,
    },
}, {
    // Menghilangkan __v dari output JSON
    versionKey: false,
    // Mengubah _id menjadi id dan menghapus _id saat dikonversi ke JSON
    toJSON: {
        transform: function (doc, ret) {
            delete ret._id;
        }
    },
    timestamps: true 
});

    module.exports = mongoose.model('Food', foodSchema, 'foods');