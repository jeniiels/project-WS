const Joi = require('joi');

const createWorkoutSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.base': 'Username harus berupa teks.',
        'string.empty': 'Username tidak boleh kosong.',
        'any.required': 'Username wajib diisi.'
        }),
    time: Joi.string().required()
        .pattern(/^[A-Za-z]+,\s[A-Za-z]+\s\d{1,2},\s\d{4}\s-\s\d{1,2}:\d{2}[ap]m$/).messages({
        'string.base': 'Time harus berupa teks.',
        'string.empty': 'Time tidak boleh kosong.',
        'string.pattern.base': 'Format time harus seperti: "Tuesday, Mar 25, 2025 - 5:30pm"',
        'any.required': 'Time wajib diisi.'
        }),

    duration: Joi.string().required().pattern(/^\d+h\s\d+min$/).messages({
        'string.base': 'Duration harus berupa teks.',
        'string.empty': 'Duration tidak boleh kosong.',
        'string.pattern.base': 'Format duration harus seperti: "1h 30min"',
        'any.required': 'Duration wajib diisi.'
        }),

    exercises: Joi.array().items(
            Joi.object({
                id_exercise: Joi.string().required().messages({
                    'string.base': 'ID exercise harus berupa teks.',
                    'string.empty': 'ID exercise tidak boleh kosong.',
                    'any.required': 'ID exercise wajib diisi.'
                    }),
                sets: Joi.array().items(Joi.string().pattern(/^\d+(\.\d+)?kg\sx\s\d+$/)).min(1).required().messages({
                    'array.base': 'Sets harus berupa array.',
                    'array.min': 'Sets minimal harus memiliki 1 item.',
                    'string.pattern.base': 'Format sets harus seperti: "2.5kg x 15"',
                    'any.required': 'Sets wajib diisi.'
                    })
            })
        )
        .min(1).required().messages({
            'array.base': 'Exercises harus berupa array.',
            'array.min': 'Exercises minimal harus memiliki 1 item.',
            'any.required': 'Exercises wajib diisi.'
            })
});

module.exports = createWorkoutSchema;