const {getStockQuote, getStockSymbols} = require("../Services/FinnhubServices");


const getAllStocks = async (req, res) => {
    try {
        const symbols = await getStockSymbols();
        const stocksToFetch = symbols.slice(0,50);
        const stocks = await Promise.all(stocksToFetch.map(async(stock)=>{
        const quote = await getStockQuote(stock.symbol);
        return {
          symbol: stock.symbol, 
          companyName: stock.description,

          currentPrice: quote.c,
          change: quote.d,
          changePercent: quote.dp,

          high: quote.h,
          low: quote.l,
          open: quote.o,
          previousClose: quote.pc,
        }; 
        }))
      res.status(200).json({
        succss: true,
        count :stocks.length,
        data : stocks
      });
    } catch (error) {
        console.log(error);
        res.status(500).json({message : "Error in fetching the stocks !"});
    }
}

module.exports = {getAllStocks}