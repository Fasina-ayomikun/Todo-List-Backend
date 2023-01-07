require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connect = require("./db/connect");
const errorHandlingMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
// Add Routes
app.use("/users", require("./routes/auth"));
app.use("/tasks", require("./routes/todo"));
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
