const mongoose = require("mongoose");
const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Comment = require("../models/Comment");
const Notification = require("../models/Notification");
const Todo = require("../models/Todo");
const User = require("../models/User");
const checkError = require("../utils/checkError");

const sendMail = require("../utils/sendMail");
const CreateComment = async (req, res) => {
  try {
    const { comment, creator, task } = req.body;
    if (!comment) {
      throw new BadRequestError("Please provide a comment");
    }
    const userExists = await User.findById(creator);
    if (!userExists) {
      throw new BadRequestError("Unauthorized to access this route");
    }
    const taskExist = await Todo.findById(task);
    if (!taskExist) {
      throw new NotFoundError("Task does not exist");
    }
    await Comment.create(req.body);

    let notificationRecipients = [];
    notificationRecipients.push({
      userId: mongoose.Types.ObjectId(creator),
      content: "New Comment Added",
      userEmail: userExists.email,
      profile: userExists.profile,
    });

    taskExist.participants.forEach((participant) => {
      notificationRecipients.push({
        userId: participant._id,
        profile: userExists.profile,
        userEmail: participant.email,
        content: `${req.user.username} added a new comment to a task you are a participant of`,
      });
    });

    await Notification.insertMany(notificationRecipients);

    notificationRecipients.forEach((p) => {
      sendMail({
        content: p.content,
        receiver_email: p.userEmail,
      });
    });
    res
      .status(201)
      .json({ msg: "Comment successfully created", success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const commentExists = await Comment.findById(id).populate({
      path: "creator",
      select: "_id profile username",
    });
    if (!commentExists) {
      throw new NotFoundError("Comment does not exist");
    }
    await Comment.findByIdAndRemove(id);

    await Notification.create({
      userId: commentExists.creator._id,
      content: "Comment Deleted",
      profile: commentExists.creator.profile,
      userEmail: commentExists.creator.email,
    });
    sendMail({
      content: "Comment Deleted",
      receiver_email: commentExists.creator.email,
    });
    res
      .status(200)
      .json({ msg: "Comment successfully deleted", success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const getAllComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const comments = await Comment.find({ task: taskId }).populate({
      path: "creator",
      select: "profile username email",
    });
    res.status(200).json({ comments });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);

    res.status(status).json({ msg, success: false });
  }
};
module.exports = {
  CreateComment,
  deleteComment,
  getAllComments,
};
