
const mongoose = require("mongoose");
const Category = require("../models/category");
const Recipe = require("../models/recipe");

const getNextCategoryCode = async (session) => {//זה מאפשר לנו לקבל את הקוד הבא לקטגוריה
  const categories = await Category.find({}, { code: 1, _id: 0 }).session(session).lean();//זה מאפשר לנו לקבל את הקטגוריות
  const maxCode = categories.reduce((max, category) => {//זה מאפשר לנו לקבל את הקוד המרבי לקטגוריה
    const value = Number.parseInt(category.code, 10);
    if (Number.isNaN(value)) {//זה אם הקוד הוא מספר
      return max;
    }
    return Math.max(max, value);//זה מאפשר לנו לקבל את הקוד המרבי לקטגוריה
  }, 1000);
  return String(maxCode + 1);
};
const resolveCategoryIds = async (categoryNames, session) => {//זה מאפשר לנו לקבל את הקטגוריות
  const uniqueNames = [...new Set(categoryNames.map((name) => name.trim()).filter(Boolean))];//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
  const categoryIds = [];//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות

  for (const name of uniqueNames) {//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
    const regex = new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i");//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
    let category = await Category.findOne({ description: regex }).session(session);//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות

    if (!category) {
      const code = await getNextCategoryCode(session);//זה מאפשר לנו לקבל את הקוד הבא לקטגוריה
      category = await Category.create([{ code, description: name }], { session }).then((created) => created[0]);
    }

    categoryIds.push(category._id);//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
  }

  return categoryIds;//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
};

const syncCategoryUsage = async (oldCategoryIds, newCategoryIds, recipeId, session) => {//זה מאפשר לנו לקבל את הקטגוריות
  const oldSet = new Set((oldCategoryIds || []).map((id) => id.toString()));
  const newSet = new Set((newCategoryIds || []).map((id) => id.toString()));//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות

  const removed = [...oldSet].filter((id) => !newSet.has(id));//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
  const added = [...newSet].filter((id) => !oldSet.has(id));//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות

  if (removed.length) {//זה אם יש לנו קטגוריות שנוספו
    await Category.updateMany(
      { _id: { $in: removed.map((id) => new mongoose.Types.ObjectId(id)) } },
      { $pull: { recipes: recipeId } },
      { session }//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
    );
  }

  if (added.length) {//זה אם יש לנו קטגוריות שנוספו
    await Category.updateMany(
      { _id: { $in: added.map((id) => new mongoose.Types.ObjectId(id)) } },
      { $addToSet: { recipes: recipeId } },
      { session }
    );
  }

  const touchedIds = [...new Set([...removed, ...added])];//זה מאפשר לנו לקבל את הקטגוריות הייחודיות המוחלטות
  for (const categoryId of touchedIds) {
    const count = await Recipe.countDocuments({ categories: categoryId }).session(session);
    await Category.findByIdAndUpdate(
      categoryId,//פרמטר של הקטגוריה
      {
        recipeCount: count,
      },
      { session }
    );
  }
};

const removeRecipeFromCategories = async (recipe, session) => {//זה מאפשר לנו לקבל את הקטגוריות
  await syncCategoryUsage(recipe.categories, [], recipe._id, session);
};

module.exports = {
  resolveCategoryIds,
  syncCategoryUsage,
  removeRecipeFromCategories,
};
