const Joi = require('joi');

const layerSchema = Joi.object({
    description: Joi.string().trim().required(),
    ingredients: Joi.array().items(
        Joi.string().trim().required()
    ).min(1).required()
});

const recipeValidationSchema = Joi.object({
    name: Joi.string().trim().required(),

    description: Joi.string().trim().required(),

    categories: Joi.array().items(
        Joi.string().trim().required()
    ).min(1).required(),

    prepTimeMinutes: Joi.number().min(1).required(),

    difficulty: Joi.number().min(1).max(5).required(),

    layers: Joi.array().items(layerSchema),

    instructions: Joi.array().items(
        Joi.string().trim().required()
    ).min(1).required(),

    image: Joi.string().trim().allow(''),

    isPrivate: Joi.boolean(),

    createdBy: Joi.string().trim().required()
});

module.exports = recipeValidationSchema;