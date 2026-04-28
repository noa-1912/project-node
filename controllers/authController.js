//הקובץ הזה אחראי על ההתחברות 
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const AppError = require("../utils/appError");
const { signUserToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { username, email, password, address } = req.body;
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return next(new AppError("Email already in use", 409));
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
      address,
      role: "user",
    });

    const token = signUserToken(user);
    return res.status(201).json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(new AppError("Invalid email or password", 401));
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return next(new AppError("Invalid email or password", 401));
    }

    const token = signUserToken(user);
    return res.json({
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  register,
  login,
};
