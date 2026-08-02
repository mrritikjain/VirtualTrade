const express = require('express');
const routes = express.Router();
const {register, login, logout, Profile} = require('../Controller/authController');
const { authMiddleware } = require('../middleware/authMiddleware');



routes.post("/register", register);
routes.post("/login", login);
routes.post("/logout", logout)
routes.get("/profile", authMiddleware, Profile)

module.exports = routes;