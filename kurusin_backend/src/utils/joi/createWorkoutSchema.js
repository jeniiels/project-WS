const Joi = require('joi');

const createWorkoutSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.base': 'Username harus berupa teks.',
            'string.empty': 'Username tidak boleh kosong.',
            'any.required': 'Username wajib diisi.'
        }),

    time: Joi.string()
        .required()
        .messages({
            'string.base': 'Time harus berupa teks.',
            'string.empty': 'Time tidak boleh kosong.',
            'any.required': 'Time wajib diisi.'
        }),

    duration: Joi.string()
        .required()
        .messages({
            'string.base': 'Duration harus berupa teks.',
            'string.empty': 'Duration tidak boleh kosong.',
            'any.required': 'Duration wajib diisi.'
        }),

    exercises: Joi.array()
        .items(
            Joi.object({
                id_exercise: Joi.string()
                    .required()
                    .messages({
                        'string.base': 'ID exercise harus berupa teks.',
                        'string.empty': 'ID exercise tidak boleh kosong.',
                        'any.required': 'ID exercise wajib diisi.'
                    }),
                sets: Joi.array()
                    .items(Joi.string())
                    .min(1)
                    .required()
                    .messages({
                        'array.base': 'Sets harus berupa array.',
                        'array.min': 'Sets minimal harus memiliki 1 item.',
                        'any.required': 'Sets wajib diisi.'
                    })
            })
        )
        .min(1)
        .required()
        .messages({
            'array.base': 'Exercises harus berupa array.',
            'array.min': 'Exercises minimal harus memiliki 1 item.',
            'any.required': 'Exercises wajib diisi.'
        })
});

module.exports = createWorkoutSchema;