const express = require('express');
const router = express.Router();
const { getStockPrediction, getMarketForecast, getModelInfo } = require('../Controller/aiController');

// AI Price Forecast Routes
router.get('/predict/:symbol', getStockPrediction);
router.get('/forecast', getMarketForecast);
router.get('/model-info', getModelInfo);

module.exports = router;
