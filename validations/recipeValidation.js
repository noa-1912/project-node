const Joi = require("joi");

const layerSchema = Joi.object({
  description: Joi.string().trim().required(),
  ingredients: Joi.array().items(Joi.string().trim().required()).min(1).required(),
});

const recipeBodySchema = Joi.object({
  name: Joi.string().trim().min(2).max(120).required(),
  description: Joi.string().trim().min(2).required(),
  categories: Joi.array().items(Joi.string().trim().min(1).required()).min(1).required(),
  prepTimeMinutes: Joi.number().integer().min(1).required(),
  difficulty: Joi.number().integer().min(1).max(5).required(),
  layers: Joi.array().items(layerSchema).default([]),
  instructions: Joi.array().items(Joi.string().trim().required()).min(1).required(),
  image: Joi.string().trim().allow(""),
  isPrivate: Joi.boolean().default(false),
});

const recipeQuerySchema = Joi.object({
  search: Joi.string().trim().allow(""),
  limit: Joi.number().integer().min(1).max(100).default(10),
  page: Joi.number().integer().min(1).default(1),
});

const prepTimeParamSchema = Joi.object({
  minutes: Joi.number().integer().min(1).required(),
});

module.exports = {
  recipeBodySchema,
  recipeQuerySchema,
  prepTimeParamSchema,
};