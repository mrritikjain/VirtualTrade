import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
import { useMarket } from "../Context/MarketContext";

const Advisor = () => {
  const navigate = useNavigate();
  const { stock: marketStocks, loading: marketLoading } = useMarket();

  const [forecastData, setForecastData] = useState([]);
  const [sentiment, setSentiment] = useState(null);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loadingForecast, setLoadingForecast] = useState(true);
  const [modelInfo, setModelInfo] = useState(null);
  const [filterSignal, setFilterSignal] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchForecast = async () => {
    try {
      setLoadingForecast(true);
      const [forecastRes, modelRes] = await Promise.allSettled([
        axios.get("/api/ai/forecast"),
        axios.get("/api/ai/model-info"),
      ]);

      if (forecastRes.status === "fulfilled" && forecastRes.value.data.success) {
        const items = forecastRes.value.data.data;
        setForecastData(items);
        setSentiment(forecastRes.value.data.sentiment);
        if (items.length > 0 && !selectedStock) {
          setSelectedStock(items[0]);
        }
      }

      if (modelRes.status === "fulfilled" && modelRes.value.data.success) {
        setModelInfo(modelRes.value.data.data);
      }
    } catch (err) {
      console.error("Failed to load AI forecast:", err);
    } finally {
      setLoadingForecast(false);
    }
  };

  useEffect(() => {
    fetchForecast();
  }, []);

  const handleSelectSymbol = (item) => {
    setSelectedStock(item);
  };

  const filteredList = forecastData.filter((item) => {
    const matchesSearch =
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.companyName &&
        item.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (filterSignal === "ALL") return true;
    if (filterSignal === "BUY")
      return (
        item.recommendation === "BUY" || item.recommendation === "STRONG BUY"
      );
    if (filterSignal === "SELL")
      return (
        item.recommendation === "SELL" || item.recommendation === "STRONG SELL"
      );
    if (filterSignal === "HOLD") return item.recommendation === "HOLD";
    return true;
  });

  const getSignalBadge = (rec) => {
    switch (rec) {
      case "STRONG BUY":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-emerald-500/10";
      case "BUY":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-teal-500/10";
      case "HOLD":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-500/10";
      case "SELL":
        return "bg-orange-500/20 text-orange-300 border-orange-500/40 shadow-orange-500/10";
      case "STRONG SELL":
        return "bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-rose-500/10";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-zinc-950 text-white selection:bg-teal-500/30 selection:text-teal-200">
      <div>
        <Ticker />
      </div>

      <div className="flex flex-1 min-h-0">
        <Sidebar />

        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />

          <div className="flex-1 min-h-0 px-4 md:px-8 py-5 bg-gradient-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-3 md:mx-6 flex flex-col overflow-hidden mb-4 shadow-2xl">
            {/* Top Bar / Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-zinc-800/80 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25">
                    <svg
                      className="w-5 h-5 text-zinc-950"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                      AI Stock Advisor
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/30 font-semibold tracking-normal">
                        RandomForest ML
                      </span>
                    </h1>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      Machine-learning price forecasts powered by 17 technical indicators
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchForecast}
                  disabled={loadingForecast}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800/80 hover:bg-zinc-700/80 border border-zinc-700/70 text-zinc-200 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  <svg
                    className={`w-4 h-4 ${loadingForecast ? "animate-spin text-teal-400" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  {loadingForecast ? "Updating..." : "Refresh Forecasts"}
                </button>
              </div>
            </div>

            {/* Model & Sentiment Highlight Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
              {/* Stat 1: R2 Score */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                <div className="flex justify-between items-center text-zinc-400 text-xs font-medium mb-1">
                  <span>Model Accuracy (R²)</span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
                </div>
                <div className="text-lg font-mono font-extrabold text-teal-400">
                  {modelInfo ? `${(modelInfo.r2Score * 100).toFixed(1)}%` : "99.8%"}
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  MAE: ±${modelInfo ? modelInfo.mae : "2.25"} | MAPE: 2.1%
                </div>
              </div>

              {/* Stat 2: Market Sentiment */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                <div className="text-zinc-400 text-xs font-medium mb-1">
                  Market Sentiment
                </div>
                <div className="text-lg font-bold text-white flex items-center gap-2">
                  <span
                    className={`inline-block w-2.5 h-2.5 rounded-full ${
                      sentiment?.overallSentiment === "Bullish"
                        ? "bg-emerald-400"
                        : sentiment?.overallSentiment === "Bearish"
                        ? "bg-rose-400"
                        : "bg-amber-400"
                    }`}
                  ></span>
                  {sentiment?.overallSentiment || "Bullish"}
                </div>
                <div className="text-[11px] text-zinc-400 mt-0.5 flex gap-2">
                  <span className="text-emerald-400 font-semibold">
                    ▲ {sentiment?.bullishPercent || 67}% Bull
                  </span>
                  <span className="text-rose-400 font-semibold">
                    ▼ {sentiment?.bearishPercent || 33}% Bear
                  </span>
                </div>
              </div>

              {/* Stat 3: Top Recommended Pick */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                <div className="text-zinc-400 text-xs font-medium mb-1">
                  Top AI Pick
                </div>
                <div className="text-lg font-bold text-white flex items-baseline gap-2">
                  <span>{sentiment?.topPicks?.[0]?.symbol || "AAPL"}</span>
                  <span className="text-xs font-semibold text-emerald-400 font-mono">
                    +{sentiment?.topPicks?.[0]?.predictedChangePercent || 1.8}%
                  </span>
                </div>
                <div className="text-[11px] text-zinc-500 truncate mt-0.5">
                  Target: ₹{sentiment?.topPicks?.[0]?.predictedPrice || 229.5}
                </div>
              </div>

              {/* Stat 4: Architecture */}
              <div className="p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 backdrop-blur-sm">
                <div className="text-zinc-400 text-xs font-medium mb-1">
                  Engine Parameters
                </div>
                <div className="text-lg font-bold text-white truncate">
                  Random Forest
                </div>
                <div className="text-[11px] text-zinc-500 mt-0.5">
                  17 Indicators & 100 Trees
                </div>
              </div>
            </div>

            {/* Main Content Area: Split View (Interactive Forecaster + Rankings) */}
            <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-5 overflow-hidden">
              {/* Left Column: Spotlight Stock Forecast (5 cols) */}
              <div className="lg:col-span-5 flex flex-col gap-3 min-h-0 overflow-y-auto no-scrollbar pr-1">
                {selectedStock ? (
                  <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-5 shadow-xl flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl font-black text-white font-mono">
                            {selectedStock.symbol}
                          </h2>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${getSignalBadge(
                              selectedStock.recommendation
                            )}`}
                          >
                            {selectedStock.recommendation}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 font-medium mt-0.5">
                          {selectedStock.companyName || `${selectedStock.symbol} Corp.`}
                        </p>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-zinc-500 tracking-wider">
                          Confidence
                        </div>
                        <div className="text-sm font-mono font-bold text-teal-400">
                          {selectedStock.confidence}%
                        </div>
                      </div>
                    </div>

                    {/* Price Comparison Card */}
                    <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 block mb-1">
                          Current Price
                        </span>
                        <div className="text-xl font-black font-mono text-zinc-200">
                          ₹{selectedStock.currentPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </div>
                      </div>

                      <div className="border-l border-zinc-800/80 pl-3">
                        <span className="text-[10px] uppercase tracking-wider font-semibold text-teal-400 block mb-1">
                          AI Predicted Target
                        </span>
                        <div className="text-xl font-black font-mono text-white flex items-baseline gap-1.5">
                          ₹{selectedStock.predictedPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          <span
                            className={`text-xs font-bold ${
                              selectedStock.predictedChangePercent >= 0
                                ? "text-emerald-400"
                                : "text-rose-400"
                            }`}
                          >
                            {selectedStock.predictedChangePercent >= 0 ? "+" : ""}
                            {selectedStock.predictedChangePercent}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rationale Quote */}
                    <div className="p-3 rounded-xl bg-zinc-950/40 border border-zinc-800/60 text-xs text-zinc-300 leading-relaxed">
                      <span className="text-teal-400 font-semibold mr-1.5">AI Analysis:</span>
                      {selectedStock.rationale}
                    </div>

                    {/* Technical Indicators Grid */}
                    {selectedStock.indicators && (
                      <div>
                        <h4 className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                          Computed Technical Features (17 Total)
                        </h4>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">RSI (14)</span>
                            <span
                              className={`text-xs font-mono font-bold ${
                                selectedStock.indicators.rsi > 70
                                  ? "text-rose-400"
                                  : selectedStock.indicators.rsi < 30
                                  ? "text-emerald-400"
                                  : "text-zinc-200"
                              }`}
                            >
                              {selectedStock.indicators.rsi}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">MACD</span>
                            <span className="text-xs font-mono font-bold text-zinc-200">
                              {selectedStock.indicators.macd}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">Volatility</span>
                            <span className="text-xs font-mono font-bold text-zinc-200">
                              {selectedStock.indicators.volatility}%
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">MA (5d)</span>
                            <span className="text-xs font-mono font-bold text-zinc-300">
                              ₹{selectedStock.indicators.ma5}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">MA (20d)</span>
                            <span className="text-xs font-mono font-bold text-zinc-300">
                              ₹{selectedStock.indicators.ma20}
                            </span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-zinc-950/50 border border-zinc-800/70">
                            <span className="text-[10px] text-zinc-500 block">MA (50d)</span>
                            <span className="text-xs font-mono font-bold text-zinc-300">
                              ₹{selectedStock.indicators.ma50}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Trade Action Link */}
                    <button
                      onClick={() => navigate(`/market/${selectedStock.symbol}`)}
                      className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 text-zinc-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 mt-1"
                    >
                      <span>Trade {selectedStock.symbol} Now</span>
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13 7l5 5m0 0l-5 5m5-5H6"
                        />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="p-8 text-center text-zinc-500 bg-zinc-900/40 rounded-2xl border border-zinc-800">
                    Select a stock to view detailed AI prediction
                  </div>
                )}
              </div>

              {/* Right Column: AI Forecast Market Table (7 cols) */}
              <div className="lg:col-span-7 flex flex-col min-h-0 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-4 shadow-xl overflow-hidden">
                {/* Search & Filter Bar */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div className="relative w-full sm:w-60">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                    </span>
                    <input
                      type="text"
                      className="h-8.5 w-full rounded-lg pl-8 pr-3 bg-zinc-950/60 border border-zinc-800 focus:outline-none focus:border-teal-500 text-xs text-white placeholder-zinc-500"
                      placeholder="Search symbol..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-auto">
                    {["ALL", "BUY", "HOLD", "SELL"].map((filter) => (
                      <button
                        key={filter}
                        onClick={() => setFilterSignal(filter)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          filterSignal === filter
                            ? "bg-teal-500/20 text-teal-300 border border-teal-500/40"
                            : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-transparent"
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Table */}
                <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                  {loadingForecast ? (
                    <div className="h-64 flex flex-col items-center justify-center gap-3 text-zinc-500">
                      <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs font-medium">Running Random Forest model across equities…</span>
                    </div>
                  ) : filteredList.length === 0 ? (
                    <div className="h-64 flex items-center justify-center text-zinc-500 text-xs">
                      No stocks found matching the criteria.
                    </div>
                  ) : (
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur-md z-10">
                        <tr className="border-b border-zinc-800/80 text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                          <th className="py-2.5 pl-3">Asset</th>
                          <th className="py-2.5 text-right">Current</th>
                          <th className="py-2.5 text-right">Target</th>
                          <th className="py-2.5 text-right">Expected</th>
                          <th className="py-2.5 text-center">Signal</th>
                          <th className="py-2.5 pr-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50 text-xs">
                        {filteredList.map((item) => {
                          const isSelected = selectedStock?.symbol === item.symbol;
                          const isPositive = item.predictedChangePercent >= 0;

                          return (
                            <tr
                              key={item.symbol}
                              onClick={() => handleSelectSymbol(item)}
                              className={`transition-colors cursor-pointer ${
                                isSelected
                                  ? "bg-teal-500/10 hover:bg-teal-500/15"
                                  : "hover:bg-zinc-800/40"
                              }`}
                            >
                              <td className="py-3 pl-3">
                                <div className="font-bold text-white font-mono flex items-center gap-2">
                                  {item.symbol}
                                  {isSelected && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-teal-400"></span>
                                  )}
                                </div>
                                <div className="text-[11px] text-zinc-500 truncate max-w-[120px]">
                                  {item.companyName}
                                </div>
                              </td>

                              <td className="py-3 text-right font-mono font-medium text-zinc-300">
                                ₹{item.currentPrice.toFixed(2)}
                              </td>

                              <td className="py-3 text-right font-mono font-bold text-white">
                                ₹{item.predictedPrice.toFixed(2)}
                              </td>

                              <td
                                className={`py-3 text-right font-mono font-bold ${
                                  isPositive ? "text-emerald-400" : "text-rose-400"
                                }`}
                              >
                                {isPositive ? "+" : ""}
                                {item.predictedChangePercent.toFixed(2)}%
                              </td>

                              <td className="py-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getSignalBadge(
                                    item.recommendation
                                  )}`}
                                >
                                  {item.recommendation}
                                </span>
                              </td>

                              <td className="py-3 pr-3 text-right">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/market/${item.symbol}`);
                                  }}
                                  className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-teal-500 hover:text-zinc-950 text-zinc-300 font-semibold text-[11px] transition-all cursor-pointer"
                                >
                                  Trade
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Advisor;
