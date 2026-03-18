const Joi = require('joi');

const categoryValidationSchema = Joi.object({
    code: Joi.string().trim().required(),

    description: Joi.string().trim().required(),

    recipeCount: Joi.number().min(0),

    recipes: Joi.array().items(
        Joi.string().trim().required()
    )
});

module.exports = categoryValidationSchema;