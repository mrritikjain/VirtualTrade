import { useMarket } from "../Context/MarketContext";
import { useState, useRef, useEffect } from "react";

export function useSymbolHistory(symbol, maxPoints = 40) {
  const { stock } = useMarket();
  const [history, setHistory] = useState([]);
  const lastPriceRef = useRef(null);
  useEffect(() => {
    const current = stock.find((s) => s.symbol === symbol);
    if (!current) return;

    if (lastPriceRef.current === current.currentPrice) return;
    lastPriceRef.current = current.currentPrice;

    setHistory((prev) => {
      const next = [
        ...prev,
        { time: new Date().toLocaleTimeString(), price: current.currentPrice },
      ];
      return next.length > maxPoints ? next.slice(-maxPoints) : next;
    });
  }, [stock, symbol]);
  return history;
}
