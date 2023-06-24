const AppError = require('../utils/appError');

const handleCastErrorDB = function (err) {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 404);
};

const handleDuplicateFieldDB = function (err) {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);

  const message = `Duplicate field value ${value}. Please use another value!`;

  return new AppError(message, 400);
};

const handleValidationErrorDB = function (err) {
  const error = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${error.join('. ')}`;
  return new AppError(message, 400);
};

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('Your session has expired! Please log in again', 401);
};

const sendDevErr = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  //Render website
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    message: err.message,
  });
};

const sendProdErr = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith('/api')) {
    //Trusted error: Send it to client
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    //Unknow error: Dont leak error details
    return res.status(err.statusCode).json({
      status: 'error',
      message: 'something went wrong!',
    });
  }

  //Render website
  //Trusted error: Send it to client
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'something went wrong!',
      message: err.message,
    });
  }

  //Unknow error: Dont leak error details
  return res.status(err.statusCode).render('error', {
    title: 'something went wrong!',
    message: 'Please try it again later.',
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendDevErr(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err, message: err.message, name: err.name };

    if (err.name === 'CastError') error = handleCastErrorDB(err);
    if (err.code === 11000) error = handleDuplicateFieldDB(err);
    if (err.name === 'ValidationError') error = handleValidationErrorDB(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendProdErr(error, req, res);
  }
};
