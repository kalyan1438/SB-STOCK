const mongoose = require('mongoose');

const historySchema = new mongoose.Schema(
  {
    date: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    volume: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const stockSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      unique: true,
      uppercase: true,
      trim: true,
      maxlength: 10,
    },
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: 120,
    },
    exchange: {
      type: String,
      required: true,
      trim: true,
      default: 'NSE',
    },
    sector: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    currentPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changePercent: {
      type: Number,
      default: 0,
    },
    marketCap: {
      type: Number,
      default: 0,
    },
    volume: {
      type: Number,
      default: 0,
    },
    dayHigh: {
      type: Number,
      default: 0,
    },
    dayLow: {
      type: Number,
      default: 0,
    },
    logoUrl: {
      type: String,
      trim: true,
    },
    history: [historySchema],
  },
  { timestamps: true }
);

stockSchema.index({ name: 'text', symbol: 'text', sector: 'text' });

module.exports = mongoose.model('Stock', stockSchema);

