const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "Please provide your comment"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Todo",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
