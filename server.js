require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("./db/connect");
const errorHandlingMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const fileUploader = require("express-fileupload");
const cors = require("cors");
const cloudinary = require("cloudinary").v2;
const app = express();

app.use(express.json());
console.log(`${process.env.FRONTEND_LINK}`);
app.use(
  cors({
    origin: process.env.FRONTEND_LINK,
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
    credentials: true,
  })
);
app.use(
  fileUploader({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", process.env.FRONTEND_LINK);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
// Add Routes
app.use("/users", require("./routes/auth"));
app.use("/tasks", require("./routes/todo"));
app.use("/files", require("./routes/files"));
app.use("/comment", require("./routes/comment"));
app.use("/notification", require("./routes/notification"));
app.use("/all-users", require("./routes/users"));

app.get("/", (req, res) => res.send("todo list"));
// Add Middleware
app.use(notFoundMiddleware);
app.use(errorHandlingMiddleware);
const PORT = process.env.PORT || 5000;
// Fix Mongoose StrictQuery
mongoose.set("strictQuery", false);
const start = async () => {
  try {
    await connect(process.env.MONGO_URI);
    app.listen(PORT, console.log("Server started"));
  } catch (error) {
    console.log(error);
  }
};
start();
