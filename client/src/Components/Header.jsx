import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../Context/AuthContent.jsx";
import { useMarket } from "../Context/MarketContext.jsx";

const Header = () => {
  const { user } = useAuth();
  const { stock } = useMarket();
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalPnL, setTotalPnL] = useState(0);
  const [pnlPercent, setPnlPercent] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchPortfolioMetrics = async () => {
      try {
        const res = await axios.get("/api/trade/portfolio");
        if (res.data && res.data.holdings && isMounted) {
          const holdings = res.data.holdings;
          let currentStockVal = 0;
          let investedVal = 0;

          holdings.forEach((h) => {
            const liveStock = stock.find(
              (s) => s.symbol.toUpperCase() === h.symbol.toUpperCase()
            );
            const livePrice = liveStock ? liveStock.currentPrice : h.averagePrice;
            investedVal += h.quantity * h.averagePrice;
            currentStockVal += h.quantity * livePrice;
          });

          const pnl = currentStockVal - investedVal;
          const pnlPct = investedVal > 0 ? (pnl / investedVal) * 100 : 0;

          setPortfolioValue(currentStockVal);
          setTotalPnL(pnl);
          setPnlPercent(pnlPct);
        }
      } catch (err) {
        // Silent catch for header polling
      }
    };

    fetchPortfolioMetrics();

    return () => {
      isMounted = false;
    };
  }, [stock, user]);

  const cashCredits = user ? Number(user.credits || 0) : 0;
  const netWorth = portfolioValue + cashCredits;
  const isProfit = totalPnL >= 0;

  return (
    <div className="md:px-6 md:py-6 px-4 py-4 md:flex md:justify-between items-center block w-full">
      <div className="md:w-1/2 w-full">
        <h2 className="text-zinc-100 text-2xl font-bold leading-none tracking-tight">
          Namaste,{" "}
          <span className="text-teal-400">
            {user
              ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
              : "User"}
          </span>
        </h2>
        <p className="text-zinc-400 mt-2 text-xs">
          Virtual trading environment & portfolio simulation
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 md:gap-6 mt-4 md:mt-0 font-mono">
        <div>
          <h3 className="text-zinc-500 text-[11px] font-sans font-medium uppercase tracking-wider">
            Cash Balance
          </h3>
          <h4 className="font-bold text-sm text-zinc-100 mt-0.5">
            ₹{cashCredits.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
        </div>

        <div>
          <h3 className="text-zinc-500 text-[11px] font-sans font-medium uppercase tracking-wider">
            Total Net Worth
          </h3>
          <h4 className="font-bold text-sm text-teal-400 mt-0.5">
            ₹{netWorth.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h4>
        </div>

        <div>
          <h3 className="text-zinc-500 text-[11px] font-sans font-medium uppercase tracking-wider">
            Total P&L
          </h3>
          <h4 className={`font-bold text-sm mt-0.5 ${isProfit ? "text-emerald-400" : "text-rose-400"}`}>
            {isProfit ? "+ ₹" : "- ₹"}
            {Math.abs(totalPnL).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            <span className="text-[10px] font-sans ml-1 text-zinc-400">
              ({pnlPercent.toFixed(2)}%)
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
