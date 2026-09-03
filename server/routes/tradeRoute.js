const express = require('express');
const router = express.Router();
const { buyStock, sellStock, getPortfolio, getHistory } = require('../Controller/tradeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/buy', buyStock);
router.post('/sell', sellStock);
router.get('/portfolio', getPortfolio);
router.get('/history', getHistory);

module.exports = router;
