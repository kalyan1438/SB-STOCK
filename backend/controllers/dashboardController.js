const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User');
const Stock = require('../models/Stock');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');

const money = (value) => Number(value.toFixed(2));

const getUserDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const holdings = await Portfolio.find({ user: user._id }).populate('stock');
  const recentTransactions = await Transaction.find({ user: user._id })
    .populate('stock', 'symbol name currentPrice')
    .sort({ createdAt: -1 })
    .limit(5);
  const watchlist = await Stock.find().sort({ changePercent: -1 }).limit(5);

  const portfolioValue = holdings.reduce(
    (sum, item) => sum + item.quantity * item.stock.currentPrice,
    0
  );
  const investedAmount = holdings.reduce((sum, item) => sum + item.investedAmount, 0);

  res.json({
    balance: user.virtualBalance,
    portfolioValue: money(portfolioValue),
    investedAmount: money(investedAmount),
    totalEquity: money(user.virtualBalance + portfolioValue),
    gainLoss: money(portfolioValue - investedAmount),
    holdingsCount: holdings.length,
    recentTransactions,
    watchlist,
  });
});

const getAdminDashboard = asyncHandler(async (req, res) => {
  const [usersCount, stocksCount, ordersCount, transactionsCount, volumeResult, recentTransactions] =
    await Promise.all([
      User.countDocuments({ role: 'user' }),
      Stock.countDocuments(),
      Order.countDocuments(),
      Transaction.countDocuments(),
      Transaction.aggregate([{ $group: { _id: null, totalVolume: { $sum: '$total' } } }]),
      Transaction.find()
        .populate('user', 'name email')
        .populate('stock', 'symbol name')
        .sort({ createdAt: -1 })
        .limit(8),
    ]);

  res.json({
    usersCount,
    stocksCount,
    ordersCount,
    transactionsCount,
    tradeVolume: money(volumeResult[0]?.totalVolume || 0),
    recentTransactions,
  });
});

module.exports = { getUserDashboard, getAdminDashboard };

