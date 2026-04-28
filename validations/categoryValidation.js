const Joi = require("joi");

const categoryLookupSchema = Joi.object({
  codeOrName: Joi.string().trim().required(),
});

module.exports = {
  categoryLookupSchema,
};