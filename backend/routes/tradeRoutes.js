const express = require('express');
const { body } = require('express-validator');
const {
  getPortfolio,
  buyStock,
  sellStock,
  getTransactions,
  getOrders,
} = require('../controllers/tradeController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const tradeValidation = [
  body('stockId').notEmpty().withMessage('Stock id is required'),
  body('quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1').toInt(),
];

router.use(protect);
router.get('/portfolio', getPortfolio);
router.get('/transactions', getTransactions);
router.get('/orders', getOrders);
router.post('/buy', tradeValidation, validateRequest, buyStock);
router.post('/sell', tradeValidation, validateRequest, sellStock);

module.exports = router;

