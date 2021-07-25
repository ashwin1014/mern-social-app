import HttpError from '../models/http-error';

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, next) => {
  let error = { ...err };

  error.message = err.message;

  // 11000 IN MONGO IS DUPLICATE ERROR CODE
  if (err.code === 11000 && err.name === 'MongoError') {
    const message = 'Duplicate field value entered';

    error = new HttpError(message, 400);
  }

  // ValidationError from Mongoose
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message);

    error = new HttpError(message, 400);
  }

  res.status(error.errorCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    status: error.errorCode,
  });
};

export default errorHandler;
