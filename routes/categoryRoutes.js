//הקובץ הזה אחראי על הקטגוריות 
//מה שהוא בעצם עושה זה לקבל את הקטגוריות ולשמור אותן במסד הנתונים
//איך הוא מקבל קטגוריות חדשות?
//איך הוא מקבל קטגוריות קיימות?
//איך הוא מעדכן את הקטגוריות?
//איך הוא מוחק את הקטגוריות?
//איך הוא מקבל את הקטגוריות?
//איך הוא מעדכן את הקטגוריות?
//איך הוא מוחק את הקטגוריות?
//איך הוא מקבל את הקטגוריות?
//התשובה זה שהוא מקבל את הקטגוריות ולשמור אותם במסד הנתונים
const express = require("express");
const {
  getAllCategories,
  getCategoriesWithRecipes,
  getCategoryByCodeOrName,
} = require("../controllers/categoriesController");
const { optionalAuth } = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { categoryLookupSchema } = require("../validations/categoryValidation");

const router = express.Router();

router.get("/", getAllCategories);
router.get("/with-recipes", optionalAuth, getCategoriesWithRecipes);
router.get("/:codeOrName", optionalAuth, validate(categoryLookupSchema, "params"), getCategoryByCodeOrName);

module.exports = router;
