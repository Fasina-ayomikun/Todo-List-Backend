const mongoose = require("mongoose");

const connect = (url) => {
  console.log("Mongo Connected");
  return mongoose.connect(url);
};

module.exports = connect;
