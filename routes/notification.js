const express = require("express");

const authenticateUser = require("../middleware/authenticate");
const {
  CreateNotification,
  editNotification,
  getAllNotifications,
} = require("../controllers/notification");
const router = express.Router();
router.route("/").post(CreateNotification);
router.route("/:id").patch(editNotification);
router.route("/all/:userId").get(getAllNotifications);
module.exports = router;
