const sendResponse = (res, success, message, data, statusCode = 200) => {
  res.status(statusCode).send({
    success,
    message,
    data,
  });
};

module.exports = sendResponse;
