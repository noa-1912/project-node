const Joi = require("joi");

const passwordRule = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).+$/)
  .messages({
    "string.pattern.base":
      "Password must include upper, lower, number and special character",
  });

const registerSchema = Joi.object({
  username: Joi.string().trim().min(2).max(50).required(),
  password: passwordRule.required(),
  email: Joi.string().trim().email().required(),
  address: Joi.string().trim().allow(""),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

const updatePasswordSchema = Joi.object({
  password: passwordRule.required(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updatePasswordSchema,
};