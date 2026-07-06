const asyncHandler = require('../utils/asyncHandler');
const generateToken = require('../utils/generateToken');
const User = require('../models/User');

const sendAuthResponse = (res, user, message) => {
  res.json({
    message,
    token: generateToken(user),
    user,
  });
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(409);
    throw new Error('Email is already registered');
  }

  const user = await User.create({ name, email, password });
  res.status(201);
  sendAuthResponse(res, user, 'Registration successful');
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  sendAuthResponse(res, user, 'Login successful');
});

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, role: 'admin' }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid admin credentials');
  }

  sendAuthResponse(res, user, 'Admin login successful');
});

const getMe = asyncHandler(async (req, res) => {
  res.json({ user: req.user });
});

const logout = asyncHandler(async (req, res) => {
  res.json({ message: 'Logout successful. Remove the token on the client.' });
});

module.exports = { register, login, adminLogin, getMe, logout };

