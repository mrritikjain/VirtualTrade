const express = require('express');
const app = express();
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const AuthRoute = require('./routes/AuthRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const marketRoute = require('./routes/marketRoute');
const tradeRoute = require('./routes/tradeRoute');
dotenv.config();

connectDB();

const corsOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
app.use(cors({
  origin: corsOrigin,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use("/auth", AuthRoute);
app.use("/api/market", marketRoute);
app.use("/api/trade", tradeRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
    console.log(`server started on port ${PORT}`);
})
