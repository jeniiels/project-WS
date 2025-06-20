const Joi = require('joi');

const createExerciseSchema = Joi.object({
    id: Joi.string().required().messages({
        'any.required': 'ID wajib diisi',
        'string.base': 'ID harus berupa string'
        }),
    name: Joi.string().required().messages({
        'any.required': 'Nama latihan wajib diisi',
        'string.base': 'Nama latihan harus berupa string'
        }),
    equipment: Joi.string().required().messages({
        'any.required': 'Peralatan wajib diisi',
        'string.base': 'Peralatan harus berupa string'
        }),
    muscles: Joi.array().items(Joi.string().required().messages({
        'string.base': 'Setiap otot harus berupa string',
        'any.required': 'Nama otot tidak boleh kosong'
        }))
        .required().messages({
            'array.base': 'Muscles harus berupa array',
            'any.required': 'Daftar otot wajib diisi'
      }),
    img: Joi.string().uri().optional().messages({
        'string.uri': 'Gambar harus berupa URL yang valid'
    })
});

module.exports = createExerciseSchema;