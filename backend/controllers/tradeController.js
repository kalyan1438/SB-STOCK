const asyncHandler = require('../utils/asyncHandler');
const Stock = require('../models/Stock');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Order = require('../models/Order');
const Transaction = require('../models/Transaction');

const money = (value) => Number(value.toFixed(2));

const formatPortfolioItem = (item) => {
  const currentPrice = item.stock.currentPrice;
  const currentValue = money(item.quantity * currentPrice);
  const gainLoss = money(currentValue - item.investedAmount);
  const gainLossPercent = item.investedAmount
    ? money((gainLoss / item.investedAmount) * 100)
    : 0;

  return {
    _id: item._id,
    stock: item.stock,
    quantity: item.quantity,
    averagePrice: item.averagePrice,
    investedAmount: item.investedAmount,
    currentValue,
    gainLoss,
    gainLossPercent,
    updatedAt: item.updatedAt,
  };
};

const getPortfolio = asyncHandler(async (req, res) => {
  const holdings = await Portfolio.find({ user: req.user._id })
    .populate('stock')
    .sort({ updatedAt: -1 });

  const items = holdings.map(formatPortfolioItem);
  const summary = items.reduce(
    (acc, item) => {
      acc.investedAmount += item.investedAmount;
      acc.currentValue += item.currentValue;
      acc.gainLoss += item.gainLoss;
      return acc;
    },
    { investedAmount: 0, currentValue: 0, gainLoss: 0 }
  );

  res.json({
    holdings: items,
    summary: {
      investedAmount: money(summary.investedAmount),
      currentValue: money(summary.currentValue),
      gainLoss: money(summary.gainLoss),
      gainLossPercent: summary.investedAmount
        ? money((summary.gainLoss / summary.investedAmount) * 100)
        : 0,
    },
  });
});

const buyStock = asyncHandler(async (req, res) => {
  const { stockId, quantity } = req.body;
  const stock = await Stock.findById(stockId);

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  const user = await User.findById(req.user._id);
  const price = stock.currentPrice;
  const total = money(price * quantity);

  if (user.virtualBalance < total) {
    res.status(400);
    throw new Error('Insufficient virtual balance');
  }

  let portfolio = await Portfolio.findOne({ user: user._id, stock: stock._id });
  if (portfolio) {
    const newQuantity = portfolio.quantity + quantity;
    const newInvestedAmount = money(portfolio.investedAmount + total);
    portfolio.quantity = newQuantity;
    portfolio.investedAmount = newInvestedAmount;
    portfolio.averagePrice = money(newInvestedAmount / newQuantity);
  } else {
    portfolio = new Portfolio({
      user: user._id,
      stock: stock._id,
      quantity,
      averagePrice: price,
      investedAmount: total,
    });
  }

  user.virtualBalance = money(user.virtualBalance - total);
  await user.save();
  await portfolio.save();

  const order = await Order.create({
    user: user._id,
    stock: stock._id,
    type: 'BUY',
    quantity,
    price,
    total,
  });

  const transaction = await Transaction.create({
    user: user._id,
    stock: stock._id,
    order: order._id,
    type: 'BUY',
    quantity,
    price,
    total,
    balanceAfter: user.virtualBalance,
    note: `Bought ${quantity} shares of ${stock.symbol}`,
  });

  const populatedPortfolio = await Portfolio.findById(portfolio._id).populate('stock');
  res.status(201).json({
    message: 'Stock purchased successfully',
    balance: user.virtualBalance,
    order,
    transaction,
    portfolio: formatPortfolioItem(populatedPortfolio),
  });
});

const sellStock = asyncHandler(async (req, res) => {
  const { stockId, quantity } = req.body;
  const stock = await Stock.findById(stockId);

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  const portfolio = await Portfolio.findOne({ user: req.user._id, stock: stock._id });
  if (!portfolio || portfolio.quantity < quantity) {
    res.status(400);
    throw new Error('Not enough shares in portfolio');
  }

  const user = await User.findById(req.user._id);
  const price = stock.currentPrice;
  const total = money(price * quantity);

  portfolio.quantity -= quantity;
  portfolio.investedAmount = money(portfolio.averagePrice * portfolio.quantity);

  if (portfolio.quantity === 0) {
    await portfolio.deleteOne();
  } else {
    await portfolio.save();
  }

  user.virtualBalance = money(user.virtualBalance + total);
  await user.save();

  const order = await Order.create({
    user: user._id,
    stock: stock._id,
    type: 'SELL',
    quantity,
    price,
    total,
  });

  const transaction = await Transaction.create({
    user: user._id,
    stock: stock._id,
    order: order._id,
    type: 'SELL',
    quantity,
    price,
    total,
    balanceAfter: user.virtualBalance,
    note: `Sold ${quantity} shares of ${stock.symbol}`,
  });

  res.status(201).json({
    message: 'Stock sold successfully',
    balance: user.virtualBalance,
    order,
    transaction,
  });
});

const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate('stock', 'symbol name currentPrice')
    .populate('order', 'status')
    .sort({ createdAt: -1 });

  res.json(transactions);
});

const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .populate('stock', 'symbol name currentPrice')
    .sort({ createdAt: -1 });

  res.json(orders);
});

module.exports = { getPortfolio, buyStock, sellStock, getTransactions, getOrders };

