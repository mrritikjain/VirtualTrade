import React, { useEffect, useState } from "react";
import { useMarket } from "../Context/MarketContext.jsx";
import { useWish } from "../Context/WishContext.jsx";
import { Link } from "react-router-dom";
const StockCards = ({ searchQuery }) => {
  const { stock, loading } = useMarket();
  const { wishlist, getWishList } = useWish();
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
  const firstindex = lastindex - stockPerPage || 0;
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
    <div className="flex flex-col gap-4 w-full text-white">
      {/* 1. Stock Grid */}
      {filteredStock.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-500 gap-2 w-full">
          <svg
            className="w-12 h-12 text-zinc-650"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span className="text-sm font-semibold tracking-wide">
            No stocks found matching your search.
          </span>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-start gap-5">
          {currentStock &&
            currentStock.map((item, idx) => {
              const isUp = item.change >= 0;
              const isWishlisted = wishlist.some(
                (wishItem) => wishItem.symbol === item.symbol,
              );

              return (
                <div
                  key={idx}
                  className="p-6 bg-linear-to-br from-zinc-900/90 to-zinc-950/95 border border-zinc-800/80 rounded-2xl w-64 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(20,184,166,0.06)] transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer group"
                >
                  <Link to={`/market/${item.symbol}`}>
                    <div className="flex justify-between items-start w-full relative">
                      <div className="flex flex-col">
                        <h4 className="font-extrabold text-white text-lg tracking-tight group-hover:text-teal-400 transition-colors">
                          {item.symbol}
                        </h4>
                        <p className="text-xs text-zinc-400 font-medium truncate max-w-35 mt-0.5 group-hover:text-zinc-300 transition-colors">
                          {item.companyName}
                        </p>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          getWishList(item);
                        }}
                        className="absolute top-0 right-0 opacity-60 group-hover:opacity-100 transition-opacity pr-1 cursor-pointer"
                      >
                        {isWishlisted ? (
                          // Filled gold star
                          <svg
                            className="w-5 h-5 text-amber-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                          </svg>
                        ) : (
                          // Outline star
                          <svg
                            className="w-5 h-5 text-zinc-500 hover:text-zinc-300"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.564-.373-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        )}
                      </button>
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
                  </Link>
                </div>
              );
            })}
        </div>
      )}

      {/* 2. Pagination Controls (Only show if results exist) */}
      {filteredStock.length > 0 && (
        <div className="flex justify-between items-center py-4 border-t border-zinc-800/60 mt-4">
          <button
            onClick={prevPage}
            disabled={CurrentPage === 1}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-all cursor-pointer"
          >
            Previous
          </button>
          <span className="text-sm font-semibold text-zinc-400">
            Page <span className="text-white">{CurrentPage}</span> of{" "}
            {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={CurrentPage === totalPages}
            className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-700 transition-all cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default StockCards;
