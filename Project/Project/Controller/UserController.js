const User = require('../Model/User');
const { catchAsync } = require('../Utils/CatchAsync');
const AppError = require('../Utils/AppError');
const crypto = require("crypto");
const sendEmail=require("../Utils/email")

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({ message: 'Users retrieved successfully', data: users });
});

exports.createStaff = catchAsync(async (req, res, next) => {
  req.body.role = 'staff';
  const newStaff = await User.create(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Staff account created by admin',
    data: { user: newStaff }
  });
});

exports.getUserById = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ message: 'User fetched successfully', data: user });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for password updates. Please use forgotPassword', 400));
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!user) return next(new AppError('User not found', 404));

  res.status(200).json({
    message: 'User updated successfully',
    data: user
  });
});
exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ message: 'User deleted successfully' });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  if (!user) return next(new AppError('User not found', 404));
  res.status(200).json({ user });
});

exports.forgetPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) return next(new AppError('No user found with that email', 404));

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get('host')}/api/User/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  await sendEmail({
    email: user.email,
    subject: 'Your password reset token (valid for 10 min)',
    message,
  });

  res.status(200).json({
    status: 'success',
    message: 'Token sent to email!',
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() }
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password reset successful'
  });
});