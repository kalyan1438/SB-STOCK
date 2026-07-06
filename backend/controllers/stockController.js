const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const generateHistory = require('../utils/generateHistory');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');

const getStockSort = (sort) => {
  const sortMap = {
    'price-asc': { currentPrice: 1 },
    'price-desc': { currentPrice: -1 },
    'change-desc': { changePercent: -1 },
    'change-asc': { changePercent: 1 },
    name: { name: 1 },
    symbol: { symbol: 1 },
  };

  return sortMap[sort] || sortMap.symbol;
};

const getStocks = asyncHandler(async (req, res) => {
  const { q, sector, sort } = req.query;
  const filter = {};

  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ symbol: regex }, { name: regex }, { sector: regex }];
  }

  if (sector && sector !== 'All') {
    filter.sector = sector;
  }

  const stocks = await Stock.find(filter).sort(getStockSort(sort));
  res.json(stocks);
});

const getStockById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  let stock = null;

  if (mongoose.Types.ObjectId.isValid(id)) {
    stock = await Stock.findById(id);
  }

  if (!stock) {
    stock = await Stock.findOne({ symbol: id.toUpperCase() });
  }

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  res.json(stock);
});

const createStock = asyncHandler(async (req, res) => {
  const payload = {
    ...req.body,
    symbol: req.body.symbol.toUpperCase(),
    history: req.body.history?.length
      ? req.body.history
      : generateHistory(req.body.currentPrice, 60),
  };

  const stock = await Stock.create(payload);
  res.status(201).json({ message: 'Stock created successfully', stock });
});

const updateStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  const nextData = { ...req.body };
  if (nextData.symbol) {
    nextData.symbol = nextData.symbol.toUpperCase();
  }

  Object.assign(stock, nextData);

  if (!stock.history || stock.history.length === 0) {
    stock.history = generateHistory(stock.currentPrice, 60);
  }

  const savedStock = await stock.save();
  res.json({ message: 'Stock updated successfully', stock: savedStock });
});

const deleteStock = asyncHandler(async (req, res) => {
  const stock = await Stock.findById(req.params.id);

  if (!stock) {
    res.status(404);
    throw new Error('Stock not found');
  }

  const activeHoldings = await Portfolio.countDocuments({ stock: stock._id, quantity: { $gt: 0 } });
  if (activeHoldings > 0) {
    res.status(409);
    throw new Error('Cannot delete a stock that exists in user portfolios');
  }

  await stock.deleteOne();
  res.json({ message: 'Stock deleted successfully' });
});

module.exports = { getStocks, getStockById, createStock, updateStock, deleteStock };

