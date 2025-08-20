const jwt = require("jsonwebtoken");
const User = require("../Model/User");
const AppError = require("../Utils/AppError");
const { catchAsync } = require("../Utils/CatchAsync");

const signToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const {
    role,
    NationalId,
    FirstName,
    SecoundName,
    gender,
    email,
    phone,
    address,
    username,
    password,
    position,
    salary,
    hireDate
  } = req.body;
  if (!role || role !== "customer") {
    return next(new AppError("Self-signup is only allowed for customers and admins", 400));
  }

  const newUser = await User.create({
    NationalId,
    FirstName,
    SecoundName,
    gender,
    email,
    phone,
    address,
    username,
    password,
    position,
    salary,
    hireDate,
  });

  const token = signToken({ id: newUser._id, role: newUser.role });

  res.status(201).json({
    message: "Success",
    token,
    data: newUser
  });
});
exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("Please enter username and password", 400));
  }

  const user = await User.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password))) {
    return next(new AppError("Invalid username or password", 401));
  }

  const token = signToken({ id: user._id, role: user.role });

  res.status(200).json({
    message: "Success",
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer")
  ) {
    return next(new AppError("You are not logged in", 401));
  }

  const token = req.headers.authorization.split(" ")[1];

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("User no longer exists", 404));
  }

  req.user = user;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)){
      return next(new AppError("You do not have permission to perform this action"),403);
    }
     next();
  };
};
