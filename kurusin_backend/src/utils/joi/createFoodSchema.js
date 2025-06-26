const Joi = require('joi');

const nutrientFactSchema = Joi.object({
    energi: Joi.number().default(0).messages({ 'number.base': 'Energi harus berupa angka' }),
    lemak_total: Joi.number().default(0).messages({ 'number.base': 'Lemak total harus berupa angka' }),
    vitamin_a: Joi.number().default(0).messages({ 'number.base': 'Vitamin A harus berupa angka' }),
    vitamin_b1: Joi.number().default(0).messages({ 'number.base': 'Vitamin B1 harus berupa angka' }),
    vitamin_b2: Joi.number().default(0).messages({ 'number.base': 'Vitamin B2 harus berupa angka' }),
    vitamin_b3: Joi.number().default(0).messages({ 'number.base': 'Vitamin B3 harus berupa angka' }),
    vitamin_c: Joi.number().default(0).messages({ 'number.base': 'Vitamin C harus berupa angka' }),
    karbohidrat_total: Joi.number().default(0).messages({ 'number.base': 'Karbohidrat total harus berupa angka' }),
    protein: Joi.number().default(0).messages({ 'number.base': 'Protein harus berupa angka' }),
    serat_pangan: Joi.number().default(0).messages({ 'number.base': 'Serat pangan harus berupa angka' }),
    kalsium: Joi.number().default(0).messages({ 'number.base': 'Kalsium harus berupa angka' }),
    fosfor: Joi.number().default(0).messages({ 'number.base': 'Fosfor harus berupa angka' }),
    natrium: Joi.number().default(0).messages({ 'number.base': 'Natrium harus berupa angka' }),
    kalium: Joi.number().default(0).messages({ 'number.base': 'Kalium harus berupa angka' }),
    tembaga: Joi.number().default(0).messages({ 'number.base': 'Tembaga harus berupa angka' }),
    besi: Joi.number().default(0).messages({ 'number.base': 'Besi harus berupa angka' }),
    seng: Joi.number().default(0).messages({ 'number.base': 'Seng harus berupa angka' }),
    b_karoten: Joi.number().default(0).messages({ 'number.base': 'Beta karoten harus berupa angka' }),
    karoten_total: Joi.number().default(0).messages({ 'number.base': 'Karoten total harus berupa angka' }),
    air: Joi.number().default(0).messages({ 'number.base': 'Air harus berupa angka' }),
    abu: Joi.number().default(0).messages({ 'number.base': 'Abu harus berupa angka' }),
});

const createFoodSchema = Joi.object({
    name: Joi.string().trim().required().messages({
        'string.base': 'Nama makanan harus berupa teks',
        'any.required': 'Nama makanan wajib diisi',
        }),
    jumlah_sajian_per_kemasan: Joi.number().default(1).messages({
        'number.base': 'Jumlah sajian per kemasan harus berupa angka',
        }),
    jumlah_per_sajian: Joi.number().default(0).messages({
        'number.base': 'Jumlah per sajian harus berupa angka',
        }),
    tipe_sajian: Joi.string().trim().default("").messages({
        'string.base': 'Tipe sajian harus berupa teks',
        }),
    nutrient_fact_100g: nutrientFactSchema.default({}).messages({
        'object.base': 'Nutrient fact 100g harus berupa objek',
        }),
    nutrient_fact_per_serving: nutrientFactSchema.required().messages({
        'any.required': 'Nutrient fact per sajian wajib diisi',
        'object.base': 'Nutrient fact per sajian harus berupa objek',
    }),
    image: Joi.string().uri().trim().optional().messages({
        'string.uri': 'Image harus berupa URL yang valid',
        'string.base': 'Image harus berupa teks',
        }),
});
module.exports = createFoodSchema;