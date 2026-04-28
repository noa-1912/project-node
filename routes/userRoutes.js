//הקובץ הזה אחראי על המשתמשים 
//מה שהוא בעצם עושה זה לקבל את המשתמשים ולשמור אותם במסד הנתונים
//איך הוא מקבל משתמשים חדשים?
//איך הוא מעדכן את המשתמשים?
//איך הוא מוחק את המשתמשים?
//איך הוא מקבל את המשתמשים?
//איך הוא מעדכן את המשתמשים?
//איך הוא מוחק את המשתמשים?
//איך הוא מקבל את המשתמשים?
//התשובה זה שהוא מקבל את המשתמשים ולשמור אותם במסד הנתונים
const express = require("express");
const { getAllUsers, updatePassword, deleteUser } = require("../controllers/usersController");
const { requireAuth } = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const { updatePasswordSchema } = require("../validations/userValidation");

const router = express.Router();

router.get("/", requireAuth, authorizeRoles("admin"), getAllUsers);
router.patch("/:id/password", requireAuth, validate(updatePasswordSchema), updatePassword);
router.delete("/:id", requireAuth, authorizeRoles("admin"), deleteUser);

module.exports = router;
