const errorMessageList = {
    400: "Bad Request",
    401: "Unauthorized",
    403: "Forbidden",
    404: "Service not found",
    409: "Such email already exists",
  };
  
  const createError = (status, message = errorMessageList[status]) => {
    const error = new Error(message);
    error.status = status;
    return error;
  };
  
  module.exports = createError;