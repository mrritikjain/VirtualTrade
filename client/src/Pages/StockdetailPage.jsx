import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMarket } from "../Context/MarketContext.jsx";
import Header from "../Components/Header.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import Ticker from "../Components/Ticker.jsx";
import StockDetailChart from "../Components/StockDetailChart.jsx";
const StockdetailPage = () => {
  const { symbol } = useParams();
  const { stock, loading } = useMarket();
  const [quantity, setQuantity] = useState(1);

  const selectedStock = stock.find((item) => item.symbol === symbol);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-zinc-950">
        <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedStock) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-screen bg-zinc-950 text-white gap-4">
        <h3 className="text-xl font-bold">Stock not found in Market!</h3>
        <Link
          to="/dashboard"
          className="px-5 py-2 bg-teal-500 rounded-full font-bold text-black text-sm"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const isUp = selectedStock.change >= 0;
  const totalCost = selectedStock.currentPrice * quantity;

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-zinc-950">
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <div className="flex-1 min-h-0 gap-2 md:px-10 px-5 py-6 bg-linear-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col lg:overflow-hidden overflow-y-auto no-scrollbar mb-5 shadow-2xl">
            {/* Back Button */}
            <Link
              to="/dashboard"
              className="text-zinc-400 hover:text-zinc-100 w-max text-sm font-medium mb-2"
            >
              ← Market
            </Link>

            {/* Header section with symbol info */}
            <h2 className="text-2xl md:text-3xl font-bold my-2 tracking-tight text-white flex items-baseline gap-2">
              {selectedStock.symbol}
              <span className="md:text-sm text-xs text-zinc-300 border border-zinc-800/80 rounded-full px-5 py-1 bg-zinc-800/60">
                {selectedStock.companyName}
              </span>
            </h2>

            {/* Price Indicator */}
            <div className="flex items-center gap-3 mb-4">
              <span className="text-xl md:text-2xl font-bold text-white">
                ₹
                {selectedStock.currentPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full ${
                  isUp
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {isUp ? "↗ +" : "↘ "}
                {selectedStock.changePercent.toFixed(2)}%
              </span>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0 lg:overflow-hidden mt-4">
              <div className="flex-1 bg-zinc-950/20 border border-zinc-800/80 rounded-xl p-4 relative min-h-75">
                <StockDetailChart symbol={symbol} />
              </div>

              <div className="w-full lg:w-80 bg-zinc-950 border border-zinc-800/80 rounded-2xl p-6 flex flex-col gap-6 shadow-2xl">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                    Place Order
                  </h3>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs text-zinc-500 font-medium">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      min="1"
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        setQuantity(isNaN(val) || val < 1 ? 1 : val);
                      }}
                      className="w-full h-11 bg-zinc-900 border border-zinc-800 rounded-xl px-4 text-white focus:outline-none focus:border-teal-500 transition-colors text-base"
                    />
                  </div>
                </div>

                {/* Estimate Cost Details */}
                <div className="flex flex-col gap-3 border-t border-zinc-800/60 pt-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-zinc-550">Stock Price</span>
                    <span className="text-zinc-300 font-semibold font-mono">
                      ₹{selectedStock.currentPrice.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-zinc-400 font-bold">
                      Total Cost
                    </span>
                    <span className="text-base font-black text-teal-400 font-mono">
                      ₹
                      {totalCost.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  {" "}
                  <button
                    onClick={() => {
                      alert(
                        `Order successful: Bought ${quantity} shares of ${symbol}`,
                      );
                    }}
                    className="w-full py-3 bg-green-500  text-black rounded-xl transition-all cursor-pointer select-none active:scale-[0.90] text-sm uppercase tracking-wider font-bold hover:bg-transparent hover:border hover:border-green-500 hover:text-green-400"
                  >
                    Buy
                  </button>
                  <button
                    onClick={() => {
                      alert(
                        `Order successful: Sold ${quantity} shares of ${symbol}`,
                      );
                    }}
                    className="w-full py-3 bg-rose-500  text-black  rounded-xl transition-all cursor-pointer select-none active:scale-[0.90] text-sm uppercase tracking-wider font-bold hover:bg-transparent hover:border hover:border-rose-500 hover:text-rose-400"
                  >
                    Sell
                  </button>
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
