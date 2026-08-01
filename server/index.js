const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AuthRoute = require('./routes/AuthRoute');
dotenv.config();

connectDB();

app.use("/auth", AuthRoute);

app.listen(3000, ()=>{
    console.log("server started on port 3000");
})
