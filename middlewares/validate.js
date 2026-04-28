const AppError = require("../utils/appError");

const validate = (schema, target = "body") => (req, res, next) => {
  const { error, value } = schema.validate(req[target], {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(", ");
    return next(new AppError(message, 400));
  }

  req[target] = value;
  return next();
};

module.exports = validate;
