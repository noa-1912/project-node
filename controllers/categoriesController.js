//הקובץ הזה אחראי על הקטגוריות 
const Category = require("../models/category");
const AppError = require("../utils/appError");

const canViewRecipe = (recipe, user) => {
  if (!recipe.isPrivate) {
    return true;
  }
  if (!user) {
    return false;
  }
  if (user.role === "admin") {
    return true;
  }
  return recipe.createdBy && recipe.createdBy.toString() === user._id.toString();
};

const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ description: 1 });
    return res.json(categories);
  } catch (error) {
    return next(error);
  }
};

const getCategoriesWithRecipes = async (req, res, next) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "recipes",
        populate: { path: "createdBy", select: "username email role" },
      })
      .sort({ description: 1 });

    const mapped = categories.map((category) => {
      const categoryObject = category.toObject();
      categoryObject.recipes = categoryObject.recipes.filter((recipe) =>
        canViewRecipe(recipe, req.user)
      );
      return categoryObject;
    });

    return res.json(mapped);
  } catch (error) {
    return next(error);
  }
};

const getCategoryByCodeOrName = async (req, res, next) => {
  try {
    const { codeOrName } = req.params;
    const escaped = codeOrName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`^${escaped}$`, "i");

    const category = await Category.findOne({
      $or: [{ code: codeOrName }, { description: regex }],
    }).populate({
      path: "recipes",
      populate: { path: "createdBy", select: "username email role" },
    });

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const payload = category.toObject();
    payload.recipes = payload.recipes.filter((recipe) => canViewRecipe(recipe, req.user));
    return res.json(payload);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllCategories,
  getCategoriesWithRecipes,
  getCategoryByCodeOrName,
};
