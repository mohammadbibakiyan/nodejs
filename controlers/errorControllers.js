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
const handleJwtError=()=>{
  return new AppError("token is't valid, please log in agian",401)
};
const handleJwtExpiredError=()=>{
  return new AppError("your token expired please log in again",401)
}



const sendErrorDev = (err,req, res) => {
  if(req.originalUrl.startsWith=="/api"){
    res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });}else{
    res.status(err.statusCode).render("error",{
      title:"something was wrong",
      msg:err.message
    })
  }
};
const sendErrorProd = (err,req, res) => {
  // Operational, trusted error: send message to client
  if(req.originalUrl.startsWith=="/api"){
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
  }else{
    if (err.isOperational){
      res.status(err.statusCode).render("error",{
        title:"something was wrong",
        msg:err.message
      })
    }else{
      res.status(err.statusCode).render("error",{
        title:"something was wrong",
        msg:"something was wrong"
      })
    }
  }
};


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err,req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // console.log(err);
    let error = { ...err,name:err.name,message:err.message };
    console.log(error,err);
    if (err.name === 'CastError') error = handleCastErrorDB(error);//مانند id هایی که نادرست
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);//اسم های مشابه 
    if (err.name === 'ValidationError')  error = handleValidationErrorDB(error);//validation error
    if(err.name==="JsonWebTokenError") error=handleJwtError();
    if(err.name==="TokenExpiredError") error=handleJwtExpiredError();
    sendErrorProd(error,req, res);
  }
};
