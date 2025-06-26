const Joi = require('joi');
const Exercise = require('../../models/Exercise');

const createWorkoutSchema = Joi.object({
    exercises: Joi.array().items(
        Joi.object({
            id_exercise: Joi.string().required().custom(async (value, helpers) => {
                const exists = await Exercise.exists({ id: value });
                if (!exists) throw new Error(`Exercise dengan id "${value}" tidak ditemukan di database.`);
                return value;
            })
            .messages({
                'string.base': 'ID exercise harus berupa teks.',
                'string.empty': 'ID exercise tidak boleh kosong.',
                'any.required': 'ID exercise wajib diisi.'
            }),
            sets: Joi.array().items(Joi.string().pattern(/^\d+(\.\d+)?kg\sx\s\d+$/)).min(1).required().messages({
                'array.base': 'Sets harus berupa array.',
                'array.min': 'Sets minimal harus memiliki 1 item.',
                'string.pattern.base': 'Format sets harus seperti: "2.5kg x 15"',
                'any.required': 'Sets wajib diisi.'
            }),
        })
    )
    .min(1).required().messages({
        'array.base': 'Exercises harus berupa array.',
        'array.min': 'Exercises minimal harus memiliki 1 item.',
        'any.required': 'Exercises wajib diisi.'
        }),
    kalori_total: Joi.number().integer().min(0).required().messages({
        'number.base': 'Kalori total harus berupa angka.',
        'number.integer': 'Kalori total harus berupa bilangan bulat.',
        'number.min': 'Kalori total tidak boleh negatif.',
        'any.required': 'Kalori total wajib diisi.'
        })
});

module.exports = createWorkoutSchema;