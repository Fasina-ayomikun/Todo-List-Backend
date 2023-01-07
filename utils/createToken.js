const jwt = require("jsonwebtoken");

const createNewToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION_DATE,
  });
};
module.exports = createNewToken;
