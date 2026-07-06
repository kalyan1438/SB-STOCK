const express = require('express');
const { getUserDashboard, getAdminDashboard } = require('../controllers/dashboardController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserDashboard);
router.get('/admin', protect, admin, getAdminDashboard);

module.exports = router;

