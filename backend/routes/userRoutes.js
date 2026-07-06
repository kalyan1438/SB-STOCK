const express = require('express');
const { body } = require('express-validator');
const {
  getProfile,
  updateProfile,
  getUsers,
  getAllTransactions,
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put(
  '/profile',
  protect,
  [
    body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('password')
      .optional({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  updateProfile
);
router.get('/', protect, admin, getUsers);
router.get('/transactions', protect, admin, getAllTransactions);

module.exports = router;

