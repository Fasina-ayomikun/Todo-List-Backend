const BadRequestError = require("../errors/bad-request");
const CustomError = require("../errors/custom-error");
const User = require("../models/User");
const bcryptjs = require("bcryptjs");
const UnauthenticatedError = require("../errors/unauthenticated");
const jwt = require("jsonwebtoken");
const createNewToken = require("../utils/createToken");
const checkError = require("../utils/checkError");

// Register Controller

const register = async (req, res) => {
  try {
    let { email, image, firstName, lastName, password, password2 } = req.body;
    let username = firstName + " " + lastName;
    // check for empty input
    if (!email || !firstName || !lastName || !password || !password2) {
      throw new BadRequestError("Please provide all credentials");
    }
    // Check Password length
    if (password.length < 6) {
      throw new BadRequestError("Password must have at least six characters.");
    }
    // Check Username length
    if (username.length > 20) {
      throw new BadRequestError(
        "Username cannot have more than 20 characters."
      );
    }
    // Check if password Match
    if (password !== password2) {
      throw new BadRequestError("Passwords do not match");
    }
    // Check if User exists
    const user = await User.findOne({ email });
    if (user) {
      throw new BadRequestError("Email already exist");
    }
    // Hash password
    const salt = await bcryptjs.genSalt(10);
    const hash = await bcryptjs.hash(password, salt);
    // Create New User
    const newUser = await User.create({
      username,
      email,
      password: hash,
      profile: image,
    });
    console.log(newUser);
    res.status(201).json({
      msg: "User created successfully",
      success: true,
    });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      throw new UnauthenticatedError("Email does not exist.");
    }
    const passwordMatch = await bcryptjs.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthenticatedError("Incorrect Password");
    }

    const token = createNewToken({
      userId: user._id,
      username: user.username,
      email,
      profile: user.profile,
    });
    res.status(200).json({
      msg: "User Successfully Logged In",
      username: user.username,
      email,
      _id: user._id,
      token,
      profile: user.profile,
      success: true,
    });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
module.exports = {
  register,
  login,
};
