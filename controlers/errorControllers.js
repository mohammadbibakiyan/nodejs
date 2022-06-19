const AppError = require('./../utils/appError');


const handleCastErrorDB=(err)=>{
  const message=`invalid ${err.path}: ${err.value}`;
  return new AppError(message,400);
};
const handleDuplicateFieldsDB = err => {
  const value = err.keyValue.name;
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = err => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};


const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};
const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!'
    });
  }
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err);
    let error = { ...err,name:err.name };
    if (err.name === 'CastError') error = handleCastErrorDB(error);//مانند id هایی که نادرست
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);//اسم های مشابه 
    if (err.name === 'ValidationError')  error = handleValidationErrorDB(error);//validation error
    sendErrorProd(error, res);
  }
};
