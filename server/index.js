const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AuthRoute = require('./routes/AuthRoute');
const cookieParser = require('cookie-parser');
dotenv.config();

connectDB();

app.use(express.json());
app.use(cookieParser());
app.use("/auth", AuthRoute);


app.listen(3000, ()=>{
    console.log("server started on port 3000");
})
