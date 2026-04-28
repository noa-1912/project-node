//הקובץ הזה אחראי על המשתמשים 
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const Recipe = require("../models/recipe");
const AppError = require("../utils/appError");
const { removeRecipeFromCategories } = require("../services/categoryService");
const mongoose = require("mongoose");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    return res.json(users);
  } catch (error) {
    return next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const { id } = req.params;
    const isSelf = req.user._id.toString() === id;
    const isAdmin = req.user.role === "admin";
    if (!isSelf && !isAdmin) {
      return next(new AppError("Forbidden", 403));
    }

    const user = await User.findById(id);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    user.password = await bcrypt.hash(req.body.password, 10);
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    const { id } = req.params;
    await session.withTransaction(async () => {
      const user = await User.findById(id).session(session);
      if (!user) {
        throw new AppError("User not found", 404);
      }

      const recipes = await Recipe.find({ createdBy: id }).session(session);
      for (const recipe of recipes) {
        await removeRecipeFromCategories(recipe, session);
      }
      await Recipe.deleteMany({ createdBy: id }).session(session);
      await User.findByIdAndDelete(id).session(session);
    });

    return res.json({ message: "User deleted successfully" });
  } catch (error) {
    return next(error);
  } finally {
    await session.endSession();
  }
};

module.exports = {
  getAllUsers,
  updatePassword,
  deleteUser,
};
