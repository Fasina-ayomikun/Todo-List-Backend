const express = require("express");
const { UploadImage } = require("../controllers/files");
const router = express.Router();
router.route("/").post(UploadImage);

module.exports = router;
