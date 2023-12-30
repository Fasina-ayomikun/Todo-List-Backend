const express = require("express");
const {
  getAllUserTodos,
  createTodo,
  getSingleTodo,
  updateTodo,
  deleteTodo,
  getAllTodos,
} = require("../controllers/todo");
const authenticateUser = require("../middleware/authenticate");
const router = express.Router();

router
  .route("/")
  .get(authenticateUser, getAllUserTodos)
  .post(authenticateUser, createTodo);
router.route("/users/all/:id").get(getAllTodos);
router
  .route("/:id")
  .get(getSingleTodo)

  .patch(authenticateUser, updateTodo)
  .delete(authenticateUser, deleteTodo);
module.exports = router;
