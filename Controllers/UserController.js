const User = require("../Models/UserModel");
const catchAsyncErrors = require("../Middleware/catchAsyncError");
const sendToken = require("../Utils/jwtToken");
const ErrorHandler = require("../Utils/ErrorHandler");
const sendEmail = require("../Utils/SendEmail.js");
const crypto = require("crypto");
const FRONTEND_URL = process.env.FRONTEND_URL;

const signUp = catchAsyncErrors(async (req, res, next) => {
  const user = await User.create(req.body);
  sendToken(user, 201, res);
});

const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email & Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  sendToken(user, 200, res);
});

const forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${FRONTEND_URL}resetpassword/${resetToken}`;

  const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: `The Early Ouevre Account Password Recovery`,
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler(
        "Reset Password Token is invalid or has been expired",
        400
      )
    );
  }

  user.password = req.body.newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();
  sendToken(user, 200, res);
});
const logout = catchAsyncErrors(async (req, res, next) => {
  return res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

const getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    user,
  });
});

const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  await user.save();

  sendToken(user, 200, res);
});

const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");
  console.log(user);

  user.password = req.body.password;

  await user.save();

  sendToken(user, 200, res);
});

//admin controllers
const getSingleUser = catchAsyncErrors(async (req, res, next) => {
  const singleUser = await User.findById(req.params.userId);

  if (!singleUser) {
    return next(
      new ErrorHandler(`User does not exist with id:${req.params.userId}`, 400)
    );
  }

  return res.status(200).json({
    success: true,
    singleUser,
  });
});

const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().sort({ createdAt: "desc" });

  return res.status(200).json({
    success: true,
    users,
  });
});

const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const result = await User.deleteOne({ _id: req.params.userId });

  if (result.deletedCount === 0) {
    return next(new ErrorHandler("User not found with this Id", 404));
  }
  res.status(200).json({
    success: true,
    message: "User Deleted Successfully",
  });
});

const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };

  await User.findByIdAndUpdate(req.params.userId, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Role updated successfully",
  });
});

exports.signUp = signUp;
exports.login = login;
exports.resetPassword = resetPassword;
exports.forgetPassword = forgetPassword;

exports.logout = logout;
exports.getUserDetails = getUserDetails;
exports.updateProfile = updateProfile;
exports.updatePassword = updatePassword;

exports.getSingleUser = getSingleUser;
exports.getAllUsers = getAllUsers;
exports.deleteUser = deleteUser;
exports.updateUserRole = updateUserRole;
