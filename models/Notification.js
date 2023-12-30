const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Please provide notification content"],
    },
    profile: {
      type: String,
      default:
        "http://res.cloudinary.com/dn4lenrqs/image/upload/v1703536455/wc51gd2cpugjupxazas4.jpg",
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userEmail: {
      type: String,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
