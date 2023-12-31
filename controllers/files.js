const BadRequestError = require("../errors/bad-request");
const checkError = require("../utils/checkError");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const UploadImage = async (req, res) => {
  try {
    console.log(req.files.image);
    const fileImage = req.files.image;
    if (!req.files) {
      throw new BadRequestError("Please provide files");
    }
    if (fileImage.length > 1) {
      throw new BadRequestError("Please provide only one image");
    }
    if (!fileImage.mimetype.startsWith("image")) {
      throw new BadRequestError("Please upload an image");
    }
    const maxSize = process.env.IMAGE_MAX_SIZE;
    if (fileImage.size > maxSize) {
      throw new BadRequestError("Please upload an image smaller than 20MB");
    }
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath
    );

    res.status(200).json({ url: result.secure_url, success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
module.exports = {
  UploadImage,
};
