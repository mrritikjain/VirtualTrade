import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { useMarket } from "../Context/MarketContext.jsx";
import { useAuth } from "../Context/AuthContent.jsx";
import Header from "../Components/Header.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import Ticker from "../Components/Ticker.jsx";
import StockDetailChart from "../Components/StockDetailChart.jsx";

const StockdetailPage = () => {
  const { symbol } = useParams();
  const { stock, loading: marketLoading } = useMarket();
  const { user, getProfile } = useAuth();

  const [tradeType, setTradeType] = useState("BUY"); // 'BUY' | 'SELL'
  const [quantity, setQuantity] = useState(1);
  const [holding, setHolding] = useState(null);
  const [loadingHolding, setLoadingHolding] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);

  const selectedStock = stock.find(
    (item) => item.symbol.toUpperCase() === symbol?.toUpperCase()
  );

  const fetchHolding = async () => {
    try {
      setLoadingHolding(true);
      const res = await axios.get("/api/trade/portfolio");
      if (res.data && res.data.holdings) {
        const found = res.data.holdings.find(
          (h) => h.symbol.toUpperCase() === symbol?.toUpperCase()
        );
        setHolding(found || null);
      }
    } catch (err) {
      console.error("Failed to fetch holding details:", err);
    } finally {
      setLoadingHolding(false);
    }
  };

  useEffect(() => {
    fetchHolding();
  }, [symbol]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  if (marketLoading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-zinc-950">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedStock) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-white gap-4">
        <h3 className="text-xl font-bold">Stock not found in Market!</h3>
        <Link
          to="/dashboard"
          className="px-5 py-2 bg-teal-500 rounded-full font-bold text-black text-sm hover:bg-teal-400 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isUp = selectedStock.change >= 0;
  const currentPrice = selectedStock.currentPrice;
  const totalCost = currentPrice * quantity;
  const ownedQuantity = holding ? holding.quantity : 0;
  const userCash = user ? Number(user.credits || 0) : 0;
  const maxAffordable = currentPrice > 0 ? Math.floor(userCash / currentPrice) : 0;

  const handleExecuteTrade = async () => {
    if (quantity <= 0) {
      showNotification("error", "Quantity must be at least 1.");
      return;
    }

    if (tradeType === "BUY") {
      if (userCash < totalCost) {
        showNotification(
          "error",
          `Insufficient cash balance! Needed: ₹${totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}, Available: ₹${userCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
        );
        return;
      }
    } else {
      if (ownedQuantity < quantity) {
        showNotification(
          "error",
          `Insufficient shares! You own ${ownedQuantity} share(s) but tried to sell ${quantity}.`
        );
        return;
      }
    }

    try {
      setIsSubmitting(true);
      const endpoint = tradeType === "BUY" ? "/api/trade/buy" : "/api/trade/sell";
      const res = await axios.post(endpoint, {
        symbol: selectedStock.symbol,
        quantity: quantity,
        price: currentPrice,
      });

      if (res.data.success) {
        showNotification(
          "success",
          res.data.msg || `Successfully ${tradeType === "BUY" ? "bought" : "sold"} ${quantity} share(s) of ${selectedStock.symbol}!`
        );
        await getProfile();
        await fetchHolding();
      }
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        (err.response?.status === 404
          ? "Server error (404): Please restart your backend server with 'npm run dev' to register the new trade routes."
          : err.message || "Failed to execute order.");
      showNotification("error", errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-zinc-950 text-white">
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <div className="flex-1 min-h-0 md:px-8 px-4 py-5 bg-gradient-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-4 flex flex-col overflow-y-auto no-scrollbar mb-4 shadow-2xl relative">
            
            {/* Notification Toast */}
            {notification && (
              <div
                className={`sticky top-2 z-50 flex items-center justify-between gap-3 px-4 py-3 mb-3 rounded-xl border shadow-2xl backdrop-blur-md transition-all ${
                  notification.type === "success"
                    ? "bg-emerald-950/95 border-emerald-500/60 text-emerald-200"
                    : "bg-rose-950/95 border-rose-500/60 text-rose-200"
                }`}
              >
                <div className="flex items-center gap-2 text-sm font-medium">
                  <span className="text-lg">{notification.type === "success" ? "✓" : "⚠"}</span>
                  <span>{notification.message}</span>
                </div>
                <button
                  onClick={() => setNotification(null)}
                  className="text-xs px-2 py-1 rounded-md bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300"
                >
                  ✕
                </button>
              </div>
            )}

            {/* Back Button */}
            <Link
              to="/dashboard"
              className="text-zinc-400 hover:text-teal-400 w-max text-xs font-semibold uppercase tracking-wider mb-2 flex items-center gap-1 transition-colors"
            >
              ← Back to Market
            </Link>

            {/* Header: Symbol & Price */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/60 pb-3">
              <div>
                <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2">
                  {selectedStock.symbol}
                  <span className="text-xs font-normal text-zinc-400 border border-zinc-800 rounded-full px-3 py-0.5 bg-zinc-900">
                    {selectedStock.companyName}
                  </span>
                </h2>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xl md:text-2xl font-black text-white font-mono">
                    ₹{selectedStock.currentPrice.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      isUp
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {isUp ? "↗ +" : "↘ "}
                    {selectedStock.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>

              {/* User Holding Pill */}
              <div className="bg-zinc-900/90 border border-zinc-800 px-4 py-2 rounded-xl flex items-center gap-5">
                <div>
                  <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Your Position</div>
                  <div className="text-sm font-bold text-teal-400 font-mono">
                    {loadingHolding ? "..." : `${ownedQuantity} Shares`}
                  </div>
                </div>
                {holding && (
                  <div className="border-l border-zinc-800 pl-4">
                    <div className="text-[11px] text-zinc-400 font-medium uppercase tracking-wider">Avg. Buy Price</div>
                    <div className="text-sm font-semibold text-zinc-200 font-mono">
                      ₹{holding.averagePrice.toFixed(2)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Main Area: Chart & Order Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-4 flex-1">
              
              {/* Left 2 Cols: Chart */}
              <div className="lg:col-span-2 bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col min-h-[380px]">
                <StockDetailChart symbol={symbol} />
              </div>

              {/* Right Col: Order Card */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col justify-between shadow-2xl">
                <div>
                  {/* Buy / Sell Tab Toggle */}
                  <div className="grid grid-cols-2 gap-1.5 p-1 bg-zinc-900/90 rounded-xl border border-zinc-800/80 mb-4">
                    <button
                      type="button"
                      onClick={() => setTradeType("BUY")}
                      className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        tradeType === "BUY"
                          ? "bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-950/50"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Buy Stock
                    </button>
                    <button
                      type="button"
                      onClick={() => setTradeType("SELL")}
                      className={`py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                        tradeType === "SELL"
                          ? "bg-rose-500 text-zinc-950 shadow-md shadow-rose-950/50"
                          : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      Sell Stock
                    </button>
                  </div>

                  {/* Available Balance Status */}
                  <div className="flex justify-between items-center text-xs mb-3 text-zinc-400 border-b border-zinc-900 pb-2">
                    <span>{tradeType === "BUY" ? "Available Cash" : "Owned Shares"}</span>
                    <span className="font-mono font-bold text-white">
                      {tradeType === "BUY"
                        ? `₹${userCash.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        : `${ownedQuantity} Shares`}
                    </span>
                  </div>

                  {/* Quantity Input */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs">
                      <label className="text-zinc-300 font-medium">Quantity</label>
                      <span className="text-zinc-500 text-[11px]">
                        {tradeType === "BUY"
                          ? `Max: ${maxAffordable} shares`
                          : `Max: ${ownedQuantity} shares`}
                      </span>
                    </div>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      max={tradeType === "BUY" ? maxAffordable : ownedQuantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setQuantity(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-full h-10 bg-zinc-900 border border-zinc-800 rounded-xl px-3 text-white focus:outline-none focus:border-teal-500 font-mono text-sm font-bold"
                    />

                    {/* Quick increment selectors */}
                    <div className="grid grid-cols-4 gap-1.5 pt-1">
                      {[1, 5, 10, 25].map((val) => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setQuantity(val)}
                          className="py-1 text-[11px] font-mono font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all"
                        >
                          +{val}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Summary Breakdown */}
                  <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                    <div className="flex justify-between text-zinc-400">
                      <span>Price / Share</span>
                      <span className="font-mono text-white font-medium">₹{currentPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Order Type</span>
                      <span className={`font-mono font-bold ${tradeType === "BUY" ? "text-emerald-400" : "text-rose-400"}`}>
                        MARKET {tradeType}
                      </span>
                    </div>
                    <div className="border-t border-zinc-800/80 pt-2 flex justify-between items-center text-sm">
                      <span className="font-bold text-zinc-200">
                        {tradeType === "BUY" ? "Estimated Cost" : "Estimated Proceeds"}
                      </span>
                      <span className="font-mono font-black text-teal-400 text-base">
                        ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <div className="pt-4">
                  <button
                    onClick={handleExecuteTrade}
                    disabled={
                      isSubmitting ||
                      (tradeType === "BUY" && userCash < totalCost) ||
                      (tradeType === "SELL" && ownedQuantity < quantity) ||
                      quantity <= 0
                    }
                    className={`w-full py-3.5 font-bold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer select-none active:scale-98 disabled:opacity-40 disabled:cursor-not-allowed shadow-xl flex items-center justify-center gap-2 ${
                      tradeType === "BUY"
                        ? "bg-emerald-500 hover:bg-emerald-400 text-zinc-950 shadow-emerald-950/40"
                        : "bg-rose-500 hover:bg-rose-400 text-zinc-950 shadow-rose-950/40"
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                    ) : tradeType === "BUY" ? (
                      `Buy ${quantity} ${selectedStock.symbol}`
                    ) : (
                      `Sell ${quantity} ${selectedStock.symbol}`
                    )}
                  </button>
                  {tradeType === "SELL" && ownedQuantity === 0 && (
                    <p className="text-[11px] text-zinc-500 text-center mt-2">
                      You do not own shares of {selectedStock.symbol} to sell.
                    </p>
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

export default StockdetailPage;
