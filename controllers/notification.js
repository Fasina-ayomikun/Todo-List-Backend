const BadRequestError = require("../errors/bad-request");
const NotFoundError = require("../errors/not-found");
const Notification = require("../models/Notification");
const Todo = require("../models/Todo");
const User = require("../models/User");
const checkError = require("../utils/checkError");
const cron = require("node-cron");
const mongoose = require("mongoose");
const sendMail = require("../utils/sendMail");
const CreateNotification = async (req, res) => {
  try {
    const { content, isRead, userId } = req.body;
    if (!content) {
      throw new BadRequestError("Please provide a notification");
    }
    const userExists = await User.findById(userId);
    if (!userExists) {
      throw new BadRequestError("Unauthorized to access this route");
    }
    await Notification.create(req.body);

    res
      .status(201)
      .json({ msg: "Notification successfully created", success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const editNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notificationExists = await Notification.findById(id);
    if (!notificationExists) {
      throw new NotFoundError("Notification does not exist");
    }
    notificationExists.isRead = true;
    await notificationExists.save();
    res
      .status(200)
      .json({ msg: "Notification successfully edited", success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
const getAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId })
      .populate({
        path: "userId",
        select: "profile username email",
      })
      .sort("-createdAt");
    res.status(200).json({ notifications });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);

    res.status(status).json({ msg, success: false });
  }
};
cron.schedule("0 12 * * *", async () => {
  console.log("Cron job started: Checking approaching deadlines");

  try {
    const taskDeadline = await Todo.find({
      deadline: {
        $gte: new Date(),
        $lt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    taskDeadline.forEach(async (task) => {
      let notificationRecipients = [];
      notificationRecipients.push({
        userId: mongoose.Types.ObjectId(task.user),
        content: "Task deadline approaching",
      });

      task.participants.forEach((participant) => {
        notificationRecipients.push({
          userId: participant._id,
          content: "Task deadline approaching",
        });
      });

      await Notification.insertMany(notificationRecipients);
    });
    console.log(taskDeadline);
  } catch (error) {
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
});
module.exports = {
  CreateNotification,
  editNotification,
  getAllNotifications,
};
