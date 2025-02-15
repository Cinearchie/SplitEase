const express = require('express');
const authRoutes = require('./authRoutes');
const roomRoutes = require('./roomRoutes');
const expenseRoutes = require('./expenseRoutes');
const settlementController = require('../controllers/settlementController');

const router = express.Router();

router.use('/', authRoutes);
router.use('/', roomRoutes);
router.use('/', expenseRoutes);
router.get('/settlements/:roomId', settlementController.getSettlements);

module.exports = router;