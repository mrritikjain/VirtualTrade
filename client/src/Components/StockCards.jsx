import React, { useEffect, useState } from "react";
import { useMarket } from "../Context/MarketContext.jsx";

const StockCards = ({ searchQuery }) => {
  const { stock, loading } = useMarket();
  const [CurrentPage, setCurrentPage] = useState(1);
  const stockPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredStock = stock.filter(
    (item) =>
      item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const lastindex = CurrentPage * stockPerPage;
  const firstindex = lastindex - stockPerPage;
  const currentStock = filteredStock.slice(firstindex, lastindex);
  const totalPages = Math.ceil(filteredStock.length / stockPerPage);

  const nextPage = () => {
    if (CurrentPage < totalPages) {
      setCurrentPage(CurrentPage + 1);
    }
  };

  const prevPage = () => {
    if (CurrentPage > 1) {
      setCurrentPage(CurrentPage - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 w-full">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full text-white">
      {/* 1. Stock Grid */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-5">
        {currentStock &&
          currentStock.map((item, idx) => {
            const isUp = item.change >= 0;

            return (
              <div
                key={idx}
                className="p-6 bg-linear-to-br from-zinc-900/90 to-zinc-950/95 border border-zinc-800/80 rounded-2xl w-64 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(20,184,166,0.06)] transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer group"
              >
                <div className="flex justify-between items-start w-full">
                  <div className="flex flex-col">
                    <h4 className="font-extrabold text-white text-lg tracking-tight group-hover:text-teal-400 transition-colors">
                      {item.symbol}
                    </h4>
                    <p className="text-xs text-zinc-400 font-medium truncate max-w-35 mt-0.5 group-hover:text-zinc-300 transition-colors">
                      {item.companyName}
                    </p>
                  </div>

                  <div className="w-14 h-8 opacity-60 group-hover:opacity-100 transition-opacity pr-1">
                    <svg className="w-full h-full" viewBox="0 0 60 20">
                      <path
                        d={
                          isUp
                            ? "M 0 15 Q 15 5 30 12 T 60 3"
                            : "M 0 5 Q 15 15 30 8 T 60 17"
                        }
                        fill="none"
                        stroke={isUp ? "#34d399" : "#fb7185"}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                <div className="flex items-end justify-between mt-1">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">
                      Price
                    </span>
                    <span className="text-2xl font-black text-white tracking-tight group-hover:text-teal-50 transition-colors">
                      ₹
                      {item.currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] font-bold font-mono px-2.5 py-1.5 rounded-xl border flex items-center gap-1 shadow-sm transition-all duration-300 ${
                      isUp
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5 group-hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5 group-hover:bg-rose-500/20"
                    }`}
                  >
                    {isUp ? "↗" : "↘"} {isUp ? "+" : ""}
                    {item.changePercent
                      ? item.changePercent.toFixed(2)
                      : "0.00"}
                    %
                  </span>
                </div>
              </div>
            );
          })}
      </div>
      <div className="flex justify-between items-center py-4 border-t border-zinc-800/60 mt-4">
        <button
          onClick={prevPage}
          disabled={CurrentPage === 1}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-all cursor-pointer"
        >
          Previous
        </button>
        <span className="text-sm font-semibold text-zinc-400">
          Page <span className="text-white">{CurrentPage}</span> of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={CurrentPage === totalPages}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-all cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StockCards;
