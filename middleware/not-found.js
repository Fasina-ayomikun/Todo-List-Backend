const notFoundMiddleware = (req, res, next) => res.send("Route does not exist");

module.exports = notFoundMiddleware;
