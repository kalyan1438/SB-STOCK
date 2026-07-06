const express = require('express');
const { body } = require('express-validator');
const { register, login, adminLogin, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');
const validateRequest = require('../middlewares/validateRequest');

const router = express.Router();

const loginValidation = [
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  validateRequest,
  register
);
router.post('/login', loginValidation, validateRequest, login);
router.post('/admin/login', loginValidation, validateRequest, adminLogin);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);

module.exports = router;

