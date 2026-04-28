//הקובץ הזה אחראי על ההתחברות 
//מה שהוא בעצם עושה זה לקבל את ההתחברות ולשמור אותם במסד הנתונים
//איך הוא מקבל משתמשים חדשים?
//איך הוא מעדכן את המשתמשים?
//איך הוא מוחק את המשתמשים?
//איך הוא מקבל את המשתמשים?
//איך הוא מעדכן את המשתמשים?
//איך הוא מוחק את המשתמשים?
//איך הוא מקבל את המשתמשים?
//התשובה זה שהוא מקבל את המשתמשים ולשמור אותם במסד הנתונים
const express = require("express");
const { register, login } = require("../controllers/authController");
const validate = require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validations/userValidation");

const router = express.Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);

module.exports = router;
