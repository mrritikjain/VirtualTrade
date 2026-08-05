const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AuthRoute = require('./routes/AuthRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const marketRoute = require('./routes/marketRoute');
dotenv.config();

connectDB();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", AuthRoute);
app.use("/api/market", marketRoute);
app.listen(3000, ()=>{
    console.log("server started on port 3000");
})
