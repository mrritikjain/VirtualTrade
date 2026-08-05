const express = require('express');
const routes = express.Router();
const {authMiddleware} = require("../middleware/authMiddleware");
const marketController = require("../Controller/marketController");

routes.get("/",authMiddleware,marketController.getAllStocks);

module.exports = routes