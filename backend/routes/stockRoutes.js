const express = require('express');
const { body } = require('express-validator');
const {
  getStocks,
  getStockById,
  createStock,
  updateStock,
  deleteStock,
} = require('../controllers/stockController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const stockValidation = [
  body('symbol').trim().isLength({ min: 1, max: 10 }).withMessage('Symbol is required'),
  body('name').trim().notEmpty().withMessage('Company name is required'),
  body('exchange').trim().notEmpty().withMessage('Exchange is required'),
  body('sector').trim().notEmpty().withMessage('Sector is required'),
  body('currentPrice').isFloat({ gt: 0 }).withMessage('Price must be greater than 0').toFloat(),
  body('change').optional().isFloat().withMessage('Change must be a number').toFloat(),
  body('changePercent').optional().isFloat().withMessage('Change percent must be a number').toFloat(),
  body('marketCap').optional().isFloat({ min: 0 }).withMessage('Market cap must be positive').toFloat(),
  body('volume').optional().isInt({ min: 0 }).withMessage('Volume must be positive').toInt(),
  body('dayHigh').optional().isFloat({ min: 0 }).withMessage('Day high must be positive').toFloat(),
  body('dayLow').optional().isFloat({ min: 0 }).withMessage('Day low must be positive').toFloat(),
];

router.get('/', getStocks);
router.get('/:id', getStockById);
router.post('/', protect, admin, stockValidation, validateRequest, createStock);
router.put('/:id', protect, admin, stockValidation, validateRequest, updateStock);
router.delete('/:id', protect, admin, deleteStock);

module.exports = router;

