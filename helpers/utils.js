const utilsHelper = {};

utilsHelper.sendResponse = (
  res,
  status,
  success,
  cars,
  errors,
  message,
  totalCar,
  totalPages
) => {
  const response = {};
  if (success) response.success = success;
  if (message) response.message = message;
  if (cars) response.cars = cars;
  if (totalCar) response.totalCar = totalCar;
  if (errors) response.errors = errors;
  if (totalPages) response.totalPages = totalPages;
  return res.status(status).json({ data: response });
};

class AppError extends Error {
  constructor(statusCode, message, errorType) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    // all errors using this class are operational errors.
    this.isOperational = true;
    // create a stack trace for debugging (Error obj, void obj to avoid stack polution)
    Error.captureStackTrace(this, this.constructor);
  }
}

utilsHelper.AppError = AppError;
module.exports = utilsHelper;
