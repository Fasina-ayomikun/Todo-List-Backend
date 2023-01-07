const CustomError = require("./custom-error");

class BadRequestError extends CustomError {
  constructor(message, status) {
    super(message);
    this.status = 400;
  }
}

module.exports = BadRequestError;
