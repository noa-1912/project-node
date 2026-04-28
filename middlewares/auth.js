//הקובץ הזה אחראי על ההתחברות 
//על פי מה שאנחנו רוצים לעשות זה שאנחנו רוצים לקבל את ההתחברות ולשמור אותה במסד הנתונים
//איך הוא מקבל את ההתחברות?
//איך הוא מעדכן את ההתחברות?
//איך הוא מוחק את ההתחברות?
//איך הוא מקבל את ההתחברות?
//איך הוא מעדכן את ההתחברות?
//איך הוא מוחק את ההתחברות?
//איך הוא מקבל את ההתחברות?
//התשובה זה שהוא מקבל את ההתחברות ולשמור אותם במסד הנתונים
const User = require("../models/user");
const AppError = require("../utils/appError");
const { verifyToken } = require("../utils/jwt");


const extractBearerToken = (header = "") => {//זה מאפשר לנו לקבל את ההתחברות
  if (!header.startsWith("Bearer ")) {//זה אם ההתחברות נכבשת
    return null;
  }
  return header.slice(7).trim();//זה מאפשר לנו לקבל את ההתחברות
};

//פונקציה שמאפשרת לנו לקבל את ההתחברות בהכרח
const requireAuth = async (req, res, next) => {//זה מאפשר לנו לקבל את ההתחברות
  try {
    const token = extractBearerToken(req.headers.authorization);//זה מאפשר לנו לקבל את ההתחברות
    if (!token) {
      return next(new AppError("Authentication required", 401));//זה אם ההתחברות נכבשת
    }

    const payload = verifyToken(token);//זה מאפשר לנו לקבל את ההתחברות
    const user = await User.findById(payload.sub).select("-password");//זה מאפשר לנו לקבל את ההתחברות
    if (!user) {
      return next(new AppError("User no longer exists", 401));//זה אם המשתמש נכבשת
    }

    req.user = user;//זה מאפשר לנו לשמור את המשתמש בקונטקסט
    return next();
  } catch (error) {
    return next(new AppError("Invalid or expired token", 401));//זה אם ההתחברות נכבשת
  }
};

//פונקציה שמאפשרת לנו לקבל את ההתחברות באופציה
const optionalAuth = async (req, res, next) => {//זה מאפשר לנו לקבל את ההתחברות
  try {//
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      return next();
    }

    const payload = verifyToken(token);
    const user = await User.findById(payload.sub).select("-password");
    if (user) {
      req.user = user;
    }
    return next();
  } catch (error) {
    return next();
  }
};

module.exports = {
  requireAuth,
  optionalAuth,
};
