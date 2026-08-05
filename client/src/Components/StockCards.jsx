import React from "react";
import { useMarket } from "../Context/MarketContext.jsx";

const StockCards = () => {
  const { stock, loading } = useMarket();

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 w-full">
        <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-5 text-white">
      {stock &&
        stock.map((item, idx) => {
          const isUp = item.change >= 0;

          return (
            <div
              key={idx}
              className="p-6 bg-gradient-to-br from-zinc-900/90 to-zinc-950/95 border border-zinc-800/80 rounded-2xl w-64 hover:border-teal-500/40 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(20,184,166,0.06)] transition-all duration-300 flex flex-col justify-between gap-5 cursor-pointer group"
            >
              {/* Top Row: Symbol & Sparkline */}
              <div className="flex justify-between items-start w-full">
                <div className="flex flex-col">
                  <h4 className="font-extrabold text-white text-lg tracking-tight group-hover:text-teal-400 transition-colors">
                    {item.symbol}
                  </h4>
                  <p className="text-xs text-zinc-400 font-medium truncate max-w-[140px] mt-0.5 group-hover:text-zinc-300 transition-colors">
                    {item.companyName}
                  </p>
                </div>
                {/* Decorative Mini Sparkline SVG for Premium trading feel */}
                <div className="w-14 h-8 opacity-60 group-hover:opacity-100 transition-opacity pr-1">
                  <svg className="w-full h-full" viewBox="0 0 60 20">
                    <path
                      d={isUp ? "M 0 15 Q 15 5 30 12 T 60 3" : "M 0 5 Q 15 15 30 8 T 60 17"}
                      fill="none"
                      stroke={isUp ? "#34d399" : "#fb7185"}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Price & Change Row */}
              <div className="flex items-end justify-between mt-1">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-wider">Price</span>
                  <span className="text-2xl font-black text-white tracking-tight group-hover:text-teal-50 transition-colors">
                    ₹
                    {item.currentPrice.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                {/* Styled pill-shaped badge for P&L */}
                <span
                  className={`text-[11px] font-bold font-mono px-2.5 py-1.5 rounded-xl border flex items-center gap-1 shadow-sm transition-all duration-300 ${
                    isUp
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-emerald-500/5 group-hover:bg-emerald-500/20"
                      : "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-rose-500/5 group-hover:bg-rose-500/20"
                  }`}
                >
                  {isUp ? "↗" : "↘"} {isUp ? "+" : ""}
                  {item.changePercent ? item.changePercent.toFixed(2) : "0.00"}%
                </span>
              </div>
            </div>
          );
        })}
    </div>
  );
};

export default StockCards;
