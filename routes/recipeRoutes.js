//הקובץ הזה אחראי על המאכלים 
//מה שהוא בעצם עושה זה לקבל את המאכלים ולשמור אותם במסד הנתונים
//איך הוא מקבל מאכלים חדשים?
//איך הוא מעדכן את המאכלים?
//איך הוא מוחק את המאכלים?
//איך הוא מקבל את המאכלים?
//איך הוא מעדכן את המאכלים?
//איך הוא מוחק את המאכלים?
//איך הוא מקבל את המאכלים?
//התשובה זה שהוא מקבל את המאכלים ולשמור אותם במסד הנתונים
const express = require("express");
const {
  getAllRecipes,
  getRecipeById,
  getRecipesByPrepTime,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controllers/recipesController");
const { requireAuth, optionalAuth } = require("../middlewares/auth");
const authorizeRoles = require("../middlewares/authorize");
const validate = require("../middlewares/validate");
const {
  recipeBodySchema,
  recipeQuerySchema,
  prepTimeParamSchema,
} = require("../validations/recipeValidation");

const router = express.Router();

router.get("/", optionalAuth, validate(recipeQuerySchema, "query"), getAllRecipes);
router.get("/by-prep-time/:minutes", optionalAuth, validate(prepTimeParamSchema, "params"), getRecipesByPrepTime);
router.get("/:id", optionalAuth, getRecipeById);
router.post("/", requireAuth, authorizeRoles("admin", "user"), validate(recipeBodySchema), createRecipe);
router.put("/:id", requireAuth, authorizeRoles("admin", "user"), validate(recipeBodySchema), updateRecipe);
router.delete("/:id", requireAuth, authorizeRoles("admin", "user"), deleteRecipe);

module.exports = router;
