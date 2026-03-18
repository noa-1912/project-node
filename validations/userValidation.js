const Joi = require('joi');

const userValidationSchema = Joi.object({
    username: Joi.string().trim().min(2).required(),

    password: Joi.string()
        .min(8)
        .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*\\d).+$'))
        .required(),

    email: Joi.string().trim().email().required(),

    address: Joi.string().trim().allow(''),

    role: Joi.string().valid('admin', 'user', 'guest')
});

module.exports = userValidationSchema;