const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Todo = require("../models/Todo");
const checkError = require("../utils/checkError");

const getAllTodos = async (req, res) => {
  try {
    const { sort } = req.query;
    const tasks = await Todo.find({ user: req.user.userId }).sort(sort);
    res.status(200).json({ tasks, success: true, nbHits: tasks.length });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const createTodo = async (req, res) => {
  try {
    const { title, deadline } = req.body;
    if (!title || !deadline) {
      throw new BadRequestError("Please input all needed information.");
    }
    const date = new Date(Date.now());
    const milliDeadline = new Date(deadline).getTime();

    if (date >= milliDeadline) {
      throw new BadRequestError("Incorrect Deadline");
    }
    req.body.user = req.user.userId;
    const task = await Todo.create(req.body);
    res.status(201).json({ msg: "Task Created Successfully", success: "true" });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const { title, deadline } = req.body;
    if (!title || !deadline) {
      throw new BadRequestError("Please input all needed information.");
    }
    const date = new Date(Date.now());
    const milliDeadline = new Date(req.body.deadline).getTime();

    if (date >= milliDeadline) {
      throw new BadRequestError("Incorrect Deadline");
    }

    const updatedTodo = await Todo.findOneAndUpdate({ _id: todoId }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedTodo) {
      throw new NotFoundError(`No Todo Item with the id ${todoId}`);
    }

    res.status(200).json({
      msg: "Task Successfully Updated",
      task: updatedTodo,
      success: true,
    });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const deletedTodo = await Todo.findOneAndDelete({ _id: todoId });
    if (!deletedTodo) {
      throw new NotFoundError(`No Todo Item with the id ${todoId}`);
    }

    res.status(200).json({
      msg: "Task Sucessfully Deleted",
      task: deletedTodo,
      success: true,
    });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg });
  }
};
const getSingleTodo = async (req, res) => {
  try {
    const task = await Todo.findById({ _id: req.params.id });
    if (!task) {
      throw new NotFoundError(`No Todo Item with the id ${req.params.id}`);
    }
    res.status(200).json({ task, success: true });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
module.exports = {
  getAllTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getSingleTodo,
};
