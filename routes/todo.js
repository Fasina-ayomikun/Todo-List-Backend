const express = require("express");
const {
  getAllTodos,
  createTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todo");
const authenticateUser = require("../middleware/authenticate");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, getAllTodos)
  .post(authenticateUser, createTodo);
router
  .route("/:id")
  .get(getSingleTodo)
  .patch(authenticateUser, updateTodo)
  .delete(authenticateUser, deleteTodo);

module.exports = router;
