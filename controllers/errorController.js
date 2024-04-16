const AppError = require('./../utils/appError');
const NODE_ENV='production'

//handle DB error
const handleCastErrorDB = message=> {
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = err=> {
 
    return new AppError(err, 400);
};
const handleValidationErrorDB = (message) => {
  
  return new AppError(message, 400)};

const handleJWTError = (message) =>
  new AppError(message, 401);

const handleJWTExpiredError = (message) =>
  new AppError(message, 401);



const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorProd = (err,res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      data: null,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send generic message
    res.status(500).json({
      status: 'error',
      message:  req.t('someError')
    });
  }
};


module.exports = (err, req, res, next) => {

  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (NODE_ENV === 'production') {
    let   message,error=err;
  
    if (error.name === 'ValidationError'){
   const errors = Object.values(err.errors).map(el => el.message)
   message = errors.map(el=>req.t(el))
   
  }
    console.log(err)
    if (error.name === 'CastError') error = handleCastErrorDB(req.t('invalid')+`  (${err.path}: ${err.value}.)`);
    if (error.code === 11000) error = handleDuplicateFieldsDB(req.t('emailUnique'));
    if (error.name === 'ValidationError')error = handleValidationErrorDB(`${message}`);
    if (error.name === 'JsonWebTokenError') error = handleJWTError(req.t('invalidToken'));
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(req.t('expireToken'));


    sendErrorProd(error, res);
  }
};
