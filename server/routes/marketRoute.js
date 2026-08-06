const express = require('express');
const routes = express.Router();
const marketController = require("../Controller/marketController");

routes.get("/",marketController.getAllStocks);

module.exports = routes