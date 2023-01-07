const CustomError = require("./custom-error");

class UnauthenticatedError extends CustomError {
  constructor(message, status) {
    super(message);
    this.status = 401;
  }
}

module.exports = UnauthenticatedError;
