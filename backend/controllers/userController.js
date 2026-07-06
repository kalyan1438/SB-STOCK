const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Transaction = require('../models/Transaction');

const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});

const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password');

  user.name = req.body.name || user.name;
  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();
  res.json({ message: 'Profile updated successfully', user: updatedUser });
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
  res.json(users);
});

const getAllTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find()
    .populate('user', 'name email')
    .populate('stock', 'symbol name currentPrice')
    .populate('order', 'status')
    .sort({ createdAt: -1 });

  res.json(transactions);
});

module.exports = { getProfile, updateProfile, getUsers, getAllTransactions };

