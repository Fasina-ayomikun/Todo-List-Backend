const express = require("express");
const {
  CreateComment,
  deleteComment,
  getAllComments,
} = require("../controllers/comment");
const authenticateUser = require("../middleware/authenticate");
const router = express.Router();
router.route("/").post(authenticateUser, CreateComment);
router.route("/:id").delete(authenticateUser, deleteComment);
router.route("/all/:taskId").get(getAllComments);
module.exports = router;
