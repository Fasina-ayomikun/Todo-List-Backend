const mongoose = require("mongoose");

const TodoSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, "Please provide a title"],
  },
  description: {
    type: String,
    default: "No description.",
  },
  completed: {
    type: Array,
  },
  participants: {
    type: Array,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  deadline: {
    type: Date,
    required: [true, "Please choose a deadline"],
  },
  tags: {
    type: Array,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Todo", TodoSchema);
