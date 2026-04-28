const jwt = require("jsonwebtoken");
const env = require("../config/env");

const signUserToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      email: user.email,
      username: user.username,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );

const verifyToken = (token) => jwt.verify(token, env.jwtSecret);

module.exports = {
  signUserToken,
  verifyToken,
};
