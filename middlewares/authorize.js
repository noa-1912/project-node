const AppError = require("../utils/appError");

const authorizeRoles = (...roles) => (req, res, next) => {//זה מאפשר לנו לקבל את ההתחברות
  if (!req.user) {//זה אם המשתמש אינו מחובר
    return next(new AppError("Authentication required", 401));
  }

  if (!roles.includes(req.user.role)) {//זה אם המשתמש אינו ברשת התפקידים
    return next(new AppError("Forbidden", 403));//זה אם המשתמש אינו ברשת התפקידים
  }

  return next();//זה מאפשר לנו לקבל את ההתחברות
};

module.exports = authorizeRoles;
