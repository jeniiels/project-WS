const Joi = require('joi');

const createUserSchema = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'string.base': 'Username harus berupa teks.',
            'string.empty': 'Username tidak boleh kosong.',
            'any.required': 'Username wajib diisi.'
        }),

    name: Joi.string()
        .required()
        .messages({
            'string.base': 'Nama harus berupa teks.',
            'string.empty': 'Nama tidak boleh kosong.',
            'any.required': 'Nama wajib diisi.'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email harus berupa teks.',
            'string.empty': 'Email tidak boleh kosong.',
            'string.email': 'Format email tidak valid.',
            'any.required': 'Email wajib diisi.'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.base': 'Password harus berupa teks.',
            'string.empty': 'Password tidak boleh kosong.',
            'any.required': 'Password wajib diisi.'
        }),
});

module.exports = createUserSchema;