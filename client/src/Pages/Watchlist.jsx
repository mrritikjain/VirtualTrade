import React from "react";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
import { useWish } from "../Context/WishContext.jsx";

const Watchlist = () => {
  const { wishlist, getWishList } = useWish();

  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <div className="flex-1 min-h-0 gap-2 px-10 py-6 bg-linear-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-zinc-100 font-bold text-xl tracking-tight">
                My Watchlist
              </h2>
            </div>

            {wishlist.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-zinc-500 gap-3">
                <svg
                  className="w-16 h-16 text-zinc-700 animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.564-.373-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
                <div className="text-center">
                  <h3 className="text-zinc-300 font-semibold text-base">
                    Your Watchlist is empty
                  </h3>
                  <p className="text-zinc-500 text-xs mt-1">
                    Add stocks from the Market Dashboard to track them here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-1">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800 text-[10px] font-extrabold uppercase tracking-wider text-zinc-500">
                      <th className="py-4.5 px-4">Symbol</th>
                      <th className="py-4.5 px-4">Name</th>
                      <th className="py-4.5 px-4 text-center">Price</th>
                      <th className="py-4.5 px-4 text-center">Change %</th>
                      <th className="py-4.5 px-4 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {wishlist.map((stock, idx) => {
                      const isUp = stock.change >= 0;
                      return (
                        <tr
                          key={idx}
                          className="border-b border-zinc-800/40 hover:bg-zinc-900/40 transition-colors duration-150 group"
                        >
                          {/* Symbol */}
                          <td className="py-4 px-4">
                            <span className="bg-zinc-800/60 text-white font-extrabold px-2.5 py-1 rounded-lg text-xs tracking-tight border border-zinc-700/50 group-hover:border-teal-500/20 group-hover:text-teal-400 transition-all duration-200">
                              {stock.symbol}
                            </span>
                          </td>
                          {/* Company Name */}
                          <td className="py-4 px-4 text-zinc-300 font-semibold text-sm max-w-50 truncate">
                            {stock.companyName}
                          </td>
                          {/* Price */}
                          <td className="py-4 px-4 text-center text-zinc-100 font-black text-sm">
                            ₹
                            {stock.currentPrice.toLocaleString(undefined, {
                              minimumFractionDigits: 2,
                            })}
                          </td>
                          {/* Change % */}
                          <td className="py-4 px-4 text-center">
                            <span
                              className={`text-xs font-bold font-mono inline-flex items-center gap-1 ${
                                isUp ? "text-emerald-400" : "text-rose-500"
                              }`}
                            >
                              {isUp ? "↗" : "↘"} {isUp ? "+" : ""}
                              {stock.changePercent
                                ? stock.changePercent.toFixed(2)
                                : "0.00"}
                              %
                            </span>
                          </td>
                          {/* Action */}
                          <td className="py-4 px-4 text-center">
                            <button
                              onClick={() => getWishList(stock)}
                              className="px-3.5 py-1.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-white rounded-full text-xs font-extrabold tracking-wider transition-all duration-200 cursor-pointer shadow-sm hover:shadow-rose-500/10"
                            >
                              REMOVE
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
