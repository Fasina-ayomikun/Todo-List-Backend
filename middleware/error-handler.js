const CustomError = require("../errors/custom-error");

const errorHandlingMiddleware = (err, req, res, next) => {
  let customError = {
    msg: err.message || "Something went wrong",
    status: err.status || 500,
  };
  console.log(err);
  if (err instanceof CustomError) {
    return res.status(err.status).json({ msg: err.message });
  }
 
  return res.status(500).json({ msg: "Something went wrong" });
};

module.exports = errorHandlingMiddleware;
