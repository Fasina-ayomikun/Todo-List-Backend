const BadRequestError = require("../errors/bad-request");
const checkError = require("../utils/checkError");

const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const UploadImage = async (req, res) => {
  try {
    const { data } = req.body;
    if (!data) {
      throw new BadRequestError("Please upload a file");
    }
    const response = await cloudinary.uploader.upload(data, {
      use_filename: true,
      secure: true,
    });

    res.status(200).json({ url: response.url, success: true });
  } catch (error) {
    console.log(error);
    const { status, msg } = checkError(error);
    res.status(status).json({ msg, success: false });
  }
};
module.exports = {
  UploadImage,
};
