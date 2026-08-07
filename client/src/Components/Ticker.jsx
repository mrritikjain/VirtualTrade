import React from "react";
import { useMarket } from "../Context/MarketContext.jsx";
const Ticker = () => {
  const { stock } = useMarket();
  return (
    <div className="w-full h-8 bg-zinc-900 border-b border-zinc-800 shrink-0 flex items-center ">
      <marquee className="">
        <div className="flex items-center gap-10">
          {stock.slice(0, 20).map((item) => {
            const isUp = item.change >= 0;
            return (
              <div key={item.symbol} className="flex items-center gap-1">
                <span
                  className={`text-[12px] font-bold font-mono px-2 py-0 rounded-full  flex items-center gap-1 transition-all duration-300 ${
                    isUp ? " text-emerald-400 " : " text-rose-400  "
                  }`}
                >
                  {isUp ? "↗" : "↘"}
                </span>
                <span className="text-sm font-medium text-zinc-300">
                  {item.symbol}
                </span>
                <span className="text-sm font-medium text-zinc-300">
                  {item.currentPrice}
                </span>
              </div>
            );
          })}
        </div>
      </marquee>
    </div>
  );
};

export default Ticker;
