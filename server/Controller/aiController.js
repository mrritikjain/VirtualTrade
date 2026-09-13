const { predictStock, batchPredictStocks, getModelMetadata, chatWithAssistant } = require("../Services/aiService");
const { getStockQuote } = require("../Services/FinnhubServices");

// Fallback stock universe if Finnhub symbols are rate limited
const DEFAULT_MARKET_SYMBOLS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "INTC", name: "Intel Corp." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "DIS", name: "Walt Disney Co." }
];

/**
 * GET /api/ai/predict/:symbol
 * Predicts price and signal for an individual stock
 */
const getStockPrediction = async (req, res) => {
  try {
    const symbol = (req.params.symbol || "").toUpperCase();
    if (!symbol) {
      return res.status(400).json({ success: false, message: "Stock symbol is required" });
    }

    let quote = null;
    try {
      quote = await getStockQuote(symbol);
    } catch (e) {
      console.warn(`Finnhub quote fetch error for ${symbol}, using estimate`);
    }

    let quoteData;
    if (quote && quote.c) {
      quoteData = {
        symbol,
        currentPrice: quote.c,
        open: quote.o || quote.c,
        high: quote.h || quote.c * 1.01,
        low: quote.l || quote.c * 0.99,
        previousClose: quote.pc || quote.c,
        volume: 25000000
      };
    } else {
      // Fallback base prices if API rate-limited
      const basePrices = {
        AAPL: 228.5, TSLA: 235.0, NVDA: 125.0, MSFT: 428.0,
        GOOGL: 165.0, AMZN: 188.0, META: 510.0, AMD: 155.0,
        NFLX: 680.0, INTC: 21.0, JPM: 215.0, DIS: 95.0
      };
      const base = basePrices[symbol] || 150.0;
      quoteData = {
        symbol,
        currentPrice: base,
        open: base * 0.995,
        high: base * 1.015,
        low: base * 0.985,
        previousClose: base * 0.992,
        volume: 30000000
      };
    }

    const prediction = await predictStock(quoteData);

    return res.status(200).json({
      success: true,
      data: prediction
    });
  } catch (error) {
    console.error("AI Controller predict error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate AI stock prediction"
    });
  }
};

/**
 * GET /api/ai/forecast
 * Returns AI predictions, rankings, and sentiment across top market equities
 */
const getMarketForecast = async (req, res) => {
  try {
    const stocksToForecast = await Promise.all(
      DEFAULT_MARKET_SYMBOLS.map(async (item) => {
        try {
          const q = await getStockQuote(item.symbol);
          if (q && q.c) {
            return {
              symbol: item.symbol,
              companyName: item.name,
              currentPrice: q.c,
              open: q.o || q.c,
              high: q.h || q.c * 1.01,
              low: q.l || q.c * 0.99,
              previousClose: q.pc || q.c,
              volume: 25000000
            };
          }
        } catch (e) {
          // ignore
        }
        // Fallback default
        const bases = {
          AAPL: 228.5, TSLA: 235.0, NVDA: 125.0, MSFT: 428.0,
          GOOGL: 165.0, AMZN: 188.0, META: 510.0, AMD: 155.0,
          NFLX: 680.0, INTC: 21.0, JPM: 215.0, DIS: 95.0
        };
        const p = bases[item.symbol] || 120.0;
        return {
          symbol: item.symbol,
          companyName: item.name,
          currentPrice: p,
          open: p * 0.995,
          high: p * 1.012,
          low: p * 0.988,
          previousClose: p * 0.993,
          volume: 20000000
        };
      })
    );

    const predictions = await batchPredictStocks(stocksToForecast);

    // Merge company name
    const enriched = predictions.map((pred) => {
      const found = DEFAULT_MARKET_SYMBOLS.find((s) => s.symbol === pred.symbol);
      return {
        ...pred,
        companyName: found ? found.name : pred.symbol
      };
    });

    // Sort by highest expected upside percentage
    enriched.sort((a, b) => b.predictedChangePercent - a.predictedChangePercent);

    // Calculate Market Sentiment Stats
    const bullishCount = enriched.filter((p) => p.predictedChangePercent > 0.4).length;
    const bearishCount = enriched.filter((p) => p.predictedChangePercent < -0.4).length;
    const neutralCount = enriched.length - bullishCount - bearishCount;

    const sentimentSummary = {
      bullishPercent: Math.round((bullishCount / enriched.length) * 100),
      bearishPercent: Math.round((bearishCount / enriched.length) * 100),
      neutralPercent: Math.round((neutralCount / enriched.length) * 100),
      overallSentiment: bullishCount > bearishCount ? "Bullish" : (bearishCount > bullishCount ? "Bearish" : "Neutral"),
      topPicks: enriched.slice(0, 3),
      riskWatch: enriched.filter((p) => p.predictedChangePercent < 0).slice(-2)
    };

    return res.status(200).json({
      success: true,
      count: enriched.length,
      sentiment: sentimentSummary,
      data: enriched
    });
  } catch (error) {
    console.error("AI Controller market forecast error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to generate market forecast"
    });
  }
};

/**
 * GET /api/ai/model-info
 * Returns model architecture, metrics, and training bounds
 */
const getModelInfo = async (req, res) => {
  try {
    const meta = await getModelMetadata();
    return res.status(200).json({
      success: true,
      data: meta
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch model info"
    });
  }
};

/**
 * POST /api/ai/chat
 * Conversational endpoint for the trading assistant widget
 */
const chatWithAi = async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message string is required."
      });
    }

    const reply = await chatWithAssistant(message.trim(), history || []);
    return res.status(200).json({
      success: true,
      reply
    });
  } catch (error) {
    console.error("AI Controller chat error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to communicate with AI Assistant"
    });
  }
};

module.exports = {
  getStockPrediction,
  getMarketForecast,
  getModelInfo,
  chatWithAi
};
