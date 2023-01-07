const checkError = (error) => {
  let status = error.status || 500;
  let msg = error.message;
  if (error.name === "CastError") {
    status = 404;
    msg = `No item with id ${error.value._id || error.value}`;
  }
  return { status, msg };
};
module.exports = checkError;
