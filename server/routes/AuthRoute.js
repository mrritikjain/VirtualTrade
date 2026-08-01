const express = require('express');
const routes = express.Router();
const {register, login, logout} = require('../Controller/authController');



routes.post("/register", register);
routes.post("/login", login);
routes.post("logout", logout)

module.exports = routes;