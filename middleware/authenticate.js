const jwt = require("jsonwebtoken");
const UnauthenticatedError = require("../errors/unauthenticated");

const authenticateUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.includes("Bearer ")) {
      throw new UnauthenticatedError("Please provide a valid token");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw new UnauthenticatedError("Please provide a token");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, username, email } = decoded;
    req.user = { userId, username, email };
    next();
  } catch (error) {
    const status = error.status || 500;

    res.status(status).json({ msg: error.message });
  }
};
module.exports = authenticateUser;
