const User = require("../models/User");
const checkError = require("../utils/checkError");

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("username profile email");

    res.status(200).json({ users, success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
module.exports = { getAllUsers };
