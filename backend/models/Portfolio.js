const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    stock: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Stock',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    averagePrice: {
      type: Number,
      required: true,
      min: 0,
    },
    investedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

portfolioSchema.index({ user: 1, stock: 1 }, { unique: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);

