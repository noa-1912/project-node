
const mongoose = require("mongoose");
const Recipe = require("../models/recipe");
const AppError = require("../utils/appError");
const {
  resolveCategoryIds,
  syncCategoryUsage,
  removeRecipeFromCategories,
} = require("../services/categoryService");

const visibleRecipesFilter = (user) => {
  if (!user) {
    return { isPrivate: false };
  }
  if (user.role === "admin") {
    return {};
  }
  return {
    $or: [{ isPrivate: false }, { createdBy: user._id }],
  };
};

const canMutateRecipe = (recipe, user) =>
  user.role === "admin" || recipe.createdBy.toString() === user._id.toString();

const getAllRecipes = async (req, res, next) => {
  try {
    const { search = "", limit = 10, page = 1 } = req.query;
    const queryFilter = visibleRecipesFilter(req.user);
    if (search) {
      const regex = new RegExp(search, "i");
      queryFilter.$and = [
        {
          $or: [{ name: regex }, { description: regex }, { instructions: regex }],
        },
      ];
    }

    const numericLimit = Number(limit);
    const numericPage = Number(page);
    const skip = (numericPage - 1) * numericLimit;

    const [recipes, total] = await Promise.all([
      Recipe.find(queryFilter)
        .populate("categories", "code description recipeCount")
        .populate("createdBy", "username email role")
        .sort({ dateAdded: -1 })
        .skip(skip)
        .limit(numericLimit),
      Recipe.countDocuments(queryFilter),
    ]);

    return res.json({
      page: numericPage,
      limit: numericLimit,
      total,
      totalPages: Math.ceil(total / numericLimit) || 1,
      data: recipes,
    });
  } catch (error) {
    return next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate("categories", "code description recipeCount")
      .populate("createdBy", "username email role");
    if (!recipe) {
      return next(new AppError("Recipe not found", 404));
    }

    if (recipe.isPrivate && !req.user) {
      return next(new AppError("Forbidden", 403));
    }
    if (
      recipe.isPrivate &&
      req.user.role !== "admin" &&
      recipe.createdBy._id.toString() !== req.user._id.toString()
    ) {
      return next(new AppError("Forbidden", 403));
    }

    return res.json(recipe);
  } catch (error) {
    return next(error);
  }
};

const getRecipesByPrepTime = async (req, res, next) => {
  try {
    const maxMinutes = Number(req.params.minutes);
    const filter = {
      ...visibleRecipesFilter(req.user),
      prepTimeMinutes: { $lte: maxMinutes },
    };

    const recipes = await Recipe.find(filter)
      .populate("categories", "code description recipeCount")
      .populate("createdBy", "username email role")
      .sort({ prepTimeMinutes: 1 });

    return res.json(recipes);
  } catch (error) {
    return next(error);
  }
};

const createRecipe = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    let createdRecipe = null;
    await session.withTransaction(async () => {
      const categoryIds = await resolveCategoryIds(req.body.categories, session);
      const recipe = await Recipe.create(
        [
          {
            name: req.body.name,
            description: req.body.description,
            categories: categoryIds,
            prepTimeMinutes: req.body.prepTimeMinutes,
            difficulty: req.body.difficulty,
            layers: req.body.layers || [],
            instructions: req.body.instructions,
            image: req.body.image || "",
            isPrivate: !!req.body.isPrivate,
            createdBy: req.user._id,
          },
        ],
        { session }
      ).then((docs) => docs[0]);

      await syncCategoryUsage([], categoryIds, recipe._id, session);
      createdRecipe = recipe;
    });

    const populated = await Recipe.findById(createdRecipe._id)
      .populate("categories", "code description recipeCount")
      .populate("createdBy", "username email role");

    return res.status(201).json(populated);
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
};

const updateRecipe = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    let updatedId = null;
    await session.withTransaction(async () => {
      const recipe = await Recipe.findById(req.params.id).session(session);
      if (!recipe) {
        throw new AppError("Recipe not found", 404);
      }
      if (!canMutateRecipe(recipe, req.user)) {
        throw new AppError("Forbidden", 403);
      }

      const oldCategoryIds = [...recipe.categories];
      const newCategoryIds = await resolveCategoryIds(req.body.categories, session);

      recipe.name = req.body.name;
      recipe.description = req.body.description;
      recipe.categories = newCategoryIds;
      recipe.prepTimeMinutes = req.body.prepTimeMinutes;
      recipe.difficulty = req.body.difficulty;
      recipe.layers = req.body.layers || [];
      recipe.instructions = req.body.instructions;
      recipe.image = req.body.image || "";
      recipe.isPrivate = !!req.body.isPrivate;

      await recipe.save({ session });
      await syncCategoryUsage(oldCategoryIds, newCategoryIds, recipe._id, session);
      updatedId = recipe._id;
    });

    const populated = await Recipe.findById(updatedId)
      .populate("categories", "code description recipeCount")
      .populate("createdBy", "username email role");

    return res.json(populated);
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
};

const deleteRecipe = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const recipe = await Recipe.findById(req.params.id).session(session);
      if (!recipe) {
        throw new AppError("Recipe not found", 404);
      }
      if (!canMutateRecipe(recipe, req.user)) {
        throw new AppError("Forbidden", 403);
      }

      await removeRecipeFromCategories(recipe, session);
      await Recipe.findByIdAndDelete(recipe._id).session(session);
    });

    return res.json({ message: "Recipe deleted successfully" });
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  getRecipesByPrepTime,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
