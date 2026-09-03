import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("ALL"); // 'ALL' | 'BUY' | 'SELL'
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/trade/history");
      if (res.data && res.data.history) {
        setHistory(res.data.history);
      }
    } catch (err) {
      console.error("Failed to fetch trade history:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const totalTrades = history.length;
  const buyTrades = history.filter((t) => t.type === "BUY").length;
  const sellTrades = history.filter((t) => t.type === "SELL").length;
  const totalVolume = history.reduce(
    (acc, curr) => acc + (curr.totalPrice || 0),
    0,
  );

  const filteredHistory = history.filter((item) => {
    const matchesType = filterType === "ALL" || item.type === filterType;
    const matchesSearch = item.symbol
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

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
            {/* Header & Stats Overview */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 shadow-sm">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Total Orders
                </span>
                <div className="text-xl font-bold font-mono text-white mt-1">
                  {totalTrades}
                </div>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 shadow-sm">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Buy Orders
                </span>
                <div className="text-xl font-bold font-mono text-emerald-400 mt-1">
                  {buyTrades}
                </div>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 shadow-sm">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Sell Orders
                </span>
                <div className="text-xl font-bold font-mono text-rose-400 mt-1">
                  {sellTrades}
                </div>
              </div>
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 shadow-sm">
                <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                  Total Turnover
                </span>
                <div className="text-xl font-bold font-mono text-teal-400 mt-1">
                  ₹
                  {totalVolume.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Filter Buttons and Search Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mt-1">
              <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 border border-zinc-800 rounded-xl">
                {["ALL", "BUY", "SELL"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                      filterType === type
                        ? "bg-teal-500 text-zinc-950 shadow-md"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {type === "ALL"
                      ? "All Orders"
                      : type === "BUY"
                        ? "Buys Only"
                        : "Sells Only"}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
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
                  placeholder="Search by Symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-8.5 w-full rounded-full pl-10 pr-4 bg-zinc-950/40 border border-zinc-800 focus:outline-none focus:border-teal-500 text-white placeholder-zinc-500 text-xs transition-all font-sans"
                />
              </div>
            </div>

            {/* History Table Container */}
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar rounded-xl border border-zinc-800/80 bg-zinc-950/40">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredHistory.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                  <div className="w-14 h-14 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 mb-3 text-2xl">
                    📜
                  </div>
                  <h4 className="text-base font-bold text-zinc-200">
                    {searchQuery || filterType !== "ALL"
                      ? "No transactions match your search/filter criteria"
                      : "No order history found"}
                  </h4>
                  <p className="text-xs text-zinc-400 mt-1 max-w-sm">
                    {searchQuery || filterType !== "ALL"
                      ? "Try resetting your filter or searching for another stock symbol."
                      : "Once you place buy or sell orders, your full transaction ledger will be logged here."}
                  </p>
                  {!searchQuery && filterType === "ALL" && (
                    <Link
                      to="/dashboard"
                      className="mt-4 px-5 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
                    >
                      Trade Now
                    </Link>
                  )}
                </div>
              ) : (
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-zinc-900/90 backdrop-blur-sm text-zinc-400 uppercase text-[11px] font-semibold border-b border-zinc-800 z-10">
                    <tr>
                      <th className="py-3 px-4">Date & Time</th>
                      <th className="py-3 px-4">Order Type</th>
                      <th className="py-3 px-4">Symbol</th>
                      <th className="py-3 px-4 text-right">Shares</th>
                      <th className="py-3 px-4 text-right">Execution Price</th>
                      <th className="py-3 px-4 text-right">Total Amount</th>
                      <th className="py-3 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60 font-medium">
                    {filteredHistory.map((item) => {
                      const isBuy = item.type === "BUY";
                      const dateObj = new Date(item.createdAt);
                      const formattedDate = dateObj.toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        },
                      );
                      const formattedTime = dateObj.toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      );

                      return (
                        <tr
                          key={item._id}
                          className="hover:bg-zinc-900/40 transition-colors"
                        >
                          <td className="py-3 px-4 text-zinc-400 font-mono text-[11px]">
                            <div>{formattedDate}</div>
                            <div className="text-zinc-500 text-[10px]">
                              {formattedTime}
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                isBuy
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              }`}
                            >
                              {isBuy ? "↗ BUY" : "↘ SELL"}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold text-sm text-white font-mono">
                            <Link
                              to={`/market/${item.symbol}`}
                              className="hover:text-teal-400 transition-colors"
                            >
                              {item.symbol}
                            </Link>
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-zinc-200">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-4 text-right font-mono text-zinc-300">
                            ₹{item.price ? item.price.toFixed(2) : "0.00"}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-teal-300">
                            ₹
                            {(
                              item.totalPrice ||
                              item.totalprice ||
                              0
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                              Executed
                            </span>
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

export default History;
