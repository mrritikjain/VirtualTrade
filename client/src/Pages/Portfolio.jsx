import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
import { useMarket } from "../Context/MarketContext";
import { useAuth } from "../Context/AuthContent";

const Portfolio = () => {
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { stock: marketStocks } = useMarket();
  const { user } = useAuth();

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/trade/portfolio");
      if (res.data && res.data.holdings) {
        setHoldings(res.data.holdings);
      }
    } catch (err) {
      console.error("Error fetching portfolio:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Compute portfolio metrics
  const portfolioItems = holdings.map((item) => {
    const liveStock = marketStocks.find(
      (s) => s.symbol.toUpperCase() === item.symbol.toUpperCase(),
    );
    const currentPrice = liveStock ? liveStock.currentPrice : item.averagePrice;
    const invested = item.quantity * item.averagePrice;
    const currentValue = item.quantity * currentPrice;
    const pnl = currentValue - invested;
    const pnlPercent = invested > 0 ? (pnl / invested) * 100 : 0;
    const companyName = liveStock ? liveStock.companyName : item.symbol;
    const dayChangePercent = liveStock ? liveStock.changePercent : 0;

    return {
      ...item,
      companyName,
      currentPrice,
      invested,
      currentValue,
      pnl,
      pnlPercent,
      dayChangePercent,
    };
  });

  const totalInvested = portfolioItems.reduce(
    (acc, curr) => acc + curr.invested,
    0,
  );
  const totalStockValue = portfolioItems.reduce(
    (acc, curr) => acc + curr.currentValue,
    0,
  );
  const totalPnL = totalStockValue - totalInvested;
  const totalPnLPercent =
    totalInvested > 0 ? (totalPnL / totalInvested) * 100 : 0;
  const cashBalance = user ? Number(user.credits || 0) : 0;
  const totalNetWorth = totalStockValue + cashBalance;

  const filteredHoldings = portfolioItems.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-screen overflow-hidden flex flex-col bg-zinc-950 text-white">
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <div className="flex-1 min-h-0 gap-4 px-5 md:px-10 py-6 bg-linear-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Total Net Worth */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Net Worth
                </span>
                <div className="my-2">
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ₹
                    {totalNetWorth.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Stocks + Cash Balance
                </div>
              </div>

              {/* Total Invested */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Current Holdings Value
                </span>
                <div className="my-2">
                  <div className="text-2xl font-extrabold text-teal-400 font-mono">
                    ₹
                    {totalStockValue.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Invested: ₹
                  {totalInvested.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>

              {/* Total P&L */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Total Profit & Loss
                </span>
                <div className="my-2 flex items-baseline gap-2">
                  <span
                    className={`text-2xl font-extrabold font-mono ${
                      totalPnL >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {totalPnL >= 0 ? "+ ₹" : "- ₹"}
                    {Math.abs(totalPnL).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      totalPnL >= 0
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                    }`}
                  >
                    {totalPnL >= 0 ? "↗ +" : "↘ "}
                    {totalPnLPercent.toFixed(2)}%
                  </span>
                </div>
                <div className="text-xs text-zinc-500">Overall Returns</div>
              </div>

              {/* Liquid Cash */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-2xl p-4 shadow-lg flex flex-col justify-between">
                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Available Cash
                </span>
                <div className="my-2">
                  <div className="text-2xl font-extrabold text-white font-mono">
                    ₹
                    {cashBalance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
                <div className="text-xs text-zinc-500">
                  Ready for new orders
                </div>
              </div>
            </div>

            {/* Header & Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Your Stock Holdings ({portfolioItems.length})
                </h3>
              </div>

              <div className="relative w-full sm:w-72">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <svg
                    className="w-4 h-4 fill-none stroke-current"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
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
                  placeholder="Filter holdings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-full pl-10 pr-4 bg-zinc-950/40 border border-zinc-800 focus:outline-none focus:border-teal-500 text-white placeholder-zinc-500 text-xs transition-all"
                />
              </div>
            </div>

            {/* Holdings Table / Content Container */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar rounded-xl border border-zinc-800/80 bg-zinc-950/40">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredHoldings.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3 text-2xl">
                    📊
                  </div>
                  <h4 className="text-base font-bold text-zinc-200">
                    {searchQuery
                      ? "No matching stocks in your portfolio"
                      : "No stock holdings yet"}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    {searchQuery
                      ? "Try searching for a different stock symbol or clear the filter."
                      : "Start building your portfolio by buying shares from the market overview."}
                  </p>
                  {!searchQuery && (
                    <Link
                      to="/dashboard"
                      className="mt-4 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                    >
                      Explore Market
                    </Link>
                  )}
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-sm text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-800 z-10">
                    <tr>
                      <th className="py-3.5 px-4">Asset</th>
                      <th className="py-3.5 px-4 text-right">Shares</th>
                      <th className="py-3.5 px-4 text-right">Avg. Price</th>
                      <th className="py-3.5 px-4 text-right">Current Price</th>
                      <th className="py-3.5 px-4 text-right">Current Value</th>
                      <th className="py-3.5 px-4 text-right">
                        Total Returns (P&L)
                      </th>
                      <th className="py-3.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {filteredHoldings.map((item) => {
                      const isProfit = item.pnl >= 0;
                      return (
                        <tr
                          key={item._id || item.symbol}
                          className="hover:bg-zinc-900/40 transition-colors group"
                        >
                          <td className="py-3 px-4">
                            <Link
                              to={`/market/${item.symbol}`}
                              className="flex flex-col group-hover:text-teal-400 transition-colors"
                            >
                              <span className="font-bold text-sm text-white font-mono flex items-center gap-1.5">
                                {item.symbol}
                              </span>
                              <span className="text-[11px] text-zinc-400 font-normal truncate max-w-40">
                                {item.companyName}
                              </span>
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-zinc-200 text-sm">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-zinc-300">
                            ₹{item.averagePrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-white font-semibold">
                            ₹{item.currentPrice.toFixed(2)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-teal-300 font-bold">
                            ₹
                            {item.currentValue.toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 text-right font-mono">
                            <div
                              className={`font-bold ${isProfit ? "text-emerald-400" : "text-rose-400"}`}
                            >
                              {isProfit ? "+ ₹" : "- ₹"}
                              {Math.abs(item.pnl).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </div>
                            <div
                              className={`text-[10px] ${isProfit ? "text-emerald-500" : "text-rose-500"}`}
                            >
                              {isProfit ? "↗ +" : "↘ "}
                              {item.pnlPercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <Link
                              to={`/market/${item.symbol}`}
                              className="px-3 py-1.5 bg-zinc-800 hover:bg-teal-500 hover:text-zinc-950 text-zinc-300 rounded-lg text-xs font-semibold transition-all inline-block"
                            >
                              Trade
                            </Link>
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
  );
};

export default Portfolio;
