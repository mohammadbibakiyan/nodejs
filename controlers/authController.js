const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const sendEmail = require('./../utils/email');
const Email=require("./../utils/email");
const crypto = require('crypto');

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure:true,
    httpOnly: true,
  };
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  user.password = undefined;
  res.cookie('jwt', token, cookieOptions);
  res.status(statusCode).json({ status: 'success', data: user, token });
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  // const newUser=await User.create({req.body});
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  let url=`${req.protocol}://${req.get("host")}/me`;
  await new Email(newUser,url).sendWelcome();
  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) return next(new AppError('pleace enter email and password', 400));
  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError("password or email is't correct", 401));
  const correct = await user.correctPassword(password, user.password);
  if (!correct) return next(new AppError("password or email is't correct", 401));
  createSendToken(user, 200, res);
});

exports.logout=(req,res)=>{
  res.cookie("jwt","",{expires:new Date(Date.now()+1*1000),httpOnly:true});
  res.status(200).json({status:"success",message:"loggin out successfully"})
}

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //?????????? ???????? ???????? ???? ??????
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token)
    return next(new AppError('you are not logge in please log to access', 401));
  //???????? ???????? ?????? ???? ?????????????? ??????
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  //?????????? ???????? ???????? ???????? ???? ???????? ???? ?????? ??????
  const currentUser = await User.findById(decode.id);
  if (!currentUser) {
    return next(new AppError("user isn't exist for this token", 401));
  }
  //?????????? ?????????? ?????? ???? ???? ???? ???????? ?????????? ???????? ?????? ???? ??????
  if (currentUser.changePasswordAfter(decode.iat)) {
    return next(
      new AppError('you recently change password, pleace login again ')
    );
  }
  req.user = currentUser;
  next();
});

exports.isLoggedIn = catchAsync(async (req, res, next) => {
  try{if (req.cookies.jwt) {
    const decode = jwt.verify(req.cookies.jwt,process.env.JWT_SECRET);
    const currentUser = await User.findById(decode.id);
    if (!currentUser) {
      return next();
    }
    if (currentUser.changePasswordAfter(decode.iat)) {
      return next();
    }
    res.locals.user = currentUser;
    return next();
  }}catch(err){
    next()
  }
  next()
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('you do not have permission to this action', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return next(new AppError("there is't any user with this email", 404));
  const { resetToken, passwordResetExpired, passwordResetToken } =
    user.createPasswordResetToken();
  user.passwordResetToken = passwordResetToken;
  user.passwordResetExpired = passwordResetExpired;
  await user.save({ validateBeforeSave: false });
  const resetURL = `${req.protocol}//${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  const message = `forget password, send patch request with password and confirm password to ${resetURL}`;
  try {
    await new Email(user,resetURL).sendResetPassword();
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetExpired = undefined),
      await user.save({ validateBeforeSave: false });
    return next(new AppError('there was a error to sending email', 500));
  }
  res
    .status(200)
    .json({ status: 'seccuss', message: 'email sended successfuly' });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpired: { $gt: Date.now() },
  });
  if (!user) return next(new AppError('toke is invalid or expired', 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetToken = undefined;
  await user.save();
  const token = signToken(user._id);
  res.status('200').json({ status: 'seccuss', token });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword, passwordConfirm } = req.body; 
  const user = await User.findById(req.user._id).select('+password');
  const correct = await user.correctPassword(currentPassword, user.password);
  if (!correct) next(new AppError("currentPassword is't correct", 401));
  user.password = newPassword;
  user.passwordConfirm = passwordConfirm;
  await user.save();
  res
    .status(200)
    .json({ status: 'success', message: 'password changed seccussfully' });
});
