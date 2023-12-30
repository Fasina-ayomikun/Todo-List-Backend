const { default: mongoose } = require("mongoose");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const UnauthenticatedError = require("../errors/unauthenticated");
const Todo = require("../models/Todo");
const checkError = require("../utils/checkError");
const Notification = require("../models/Notification");
const sendMail = require("../utils/sendMail");

const getAllUserTodos = async (req, res) => {
  try {
    const { sort } = req.query;
    const tasks = await Todo.find({ user: req.user.userId }).sort(sort);
    res.status(200).json({ tasks, success: true, nbHits: tasks.length });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const getAllTodos = async (req, res) => {
  try {
    const { id } = req.params;
    const { sort } = req.query;

    const regex = new RegExp(id, "i");

    const tasks = await Todo.find({
      $or: [{ user: mongoose.Types.ObjectId(id) }, { "participants._id": id }],
    }).sort(sort);
    res.status(200).json({ tasks, success: true, nbHits: tasks.length });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const createTodo = async (req, res) => {
  try {
    const { title, deadline, participants } = req.body;
    if (!title || !deadline) {
      throw new BadRequestError("Please input all needed information.");
    }
    if (title.length > 60) {
      throw new BadRequestError("Title cannot be more than 20 characters");
    }
    const date = new Date(Date.now());
    const milliDeadline = new Date(deadline).getTime();

    if (date >= milliDeadline) {
      throw new BadRequestError("Incorrect Deadline");
    }
    req.body.user = req.user.userId;
    const task = await Todo.create(req.body);
    let notificationRecipients = [];
    notificationRecipients.push({
      profile: req.user.profile,
      userId: req.user.userId,
      userEmail: req.user.email,
      content: "New Task Created",
      profile: req.user.profile,
    });

    participants.forEach((participant) => {
      notificationRecipients.push({
        profile: req.user.profile,
        userId: participant._id,
        userEmail: participant.email,
        content: `${req.user.username} created a new task and you are added as a participant`,
        profile: req.user.profile,
      });
    });

    await Notification.insertMany(notificationRecipients);

    notificationRecipients.forEach((p) => {
      sendMail({
        content: p.content,
        receiver_email: p.userEmail,
      });
    });
    res.status(201).json({ msg: "Task Created Successfully", success: "true" });
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.id;

    const {
      title,
      deadline,
      user,
      description,
      participants,
      tags,
      completed,
    } = req.body;
    if (!title || !deadline) {
      throw new BadRequestError("Please input all needed information.");
    }

    const date = new Date(Date.now());
    const milliDeadline = new Date(req.body.deadline).getTime();
    const updatedTodo = await Todo.findById(todoId);

    if (!updatedTodo) {
      throw new NotFoundError(`No Todo Item with the id ${todoId}`);
    }
    console.log(updatedTodo, user);
    if (updatedTodo.user.toString() !== user) {
      throw new UnauthenticatedError(`Unauthorize to access this route`);
    }
    updatedTodo.title = title;
    updatedTodo.participants = participants;
    updatedTodo.tags = tags;
    updatedTodo.description = description;
    updatedTodo.completed = completed;
    updatedTodo.deadline = deadline;
    await updatedTodo.save();
    let notificationRecipients = [];
    notificationRecipients.push({
      profile: req.user.profile,
      userId: user,
      content: "Task Updated",
      userEmail: req.user.email,
    });

    participants.forEach((participant) => {
      notificationRecipients.push({
        profile: req.user.profile,
        userId: participant._id,
        userEmail: participant.email,
        content: `${
          req.user.userId === participant._id ? "You" : req.user.username
        } updated a task you are  a participant of`,
      });
    });

    await Notification.insertMany(notificationRecipients);

    notificationRecipients.forEach((p) => {
      sendMail({
        content: p.content,
        receiver_email: p.userEmail,
      });
    });
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
    let notificationRecipients = [];
    notificationRecipients.push({
      profile: req.user.profile,
      userId: deletedTodo.user,
      content: "Task deleted",
      userEmail: req.user.email,
    });

    deletedTodo.participants.forEach((participant) => {
      notificationRecipients.push({
        profile: req.user.profile,
        userId: participant._id,
        userEmail: participant.email,
        content: `${
          req.user.userId === participant._id ? "You" : req.user.username
        } deleted a task you are a participant of`,
      });
    });

    await Notification.insertMany(notificationRecipients);

    notificationRecipients.forEach((p) => {
      sendMail({
        content: p.content,
        receiver_email: p.userEmail,
      });
    });
    res.status(200).json({
      msg: "Task Successfully Deleted",
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
  getAllUserTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getSingleTodo,
  getAllTodos,
};
