const axios = require("axios");
const dotenv = require("dotenv");
dotenv.config();
const FINNHUB_BASE_URL = "https://finnhub.io/api/v1";

const getStockSymbols =async()=>{
    const response = await axios.get(`${FINNHUB_BASE_URL}/stock/symbol`, 
        {
            params : {
                exchange : "US",
                mic      : "XNYS",
                token    : process.env.FINNHUB_API_KEY 
            }
        }
    )
    return response.data;

}

const getStockQuote = async(symbol)=>{
const response = await axios.get(`${FINNHUB_BASE_URL}/quote`, 
        {
            params : {
               symbol,
                token    : process.env.FINNHUB_API_KEY 
            }
        }
    )
    return response.data;
    
}

module.exports = {
    getStockSymbols,
    getStockQuote
}