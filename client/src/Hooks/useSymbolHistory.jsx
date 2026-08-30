import { useMarket } from "../Context/MarketContext";
import { useState, useRef, useEffect } from "react";

export function useSymbolHistory(symbol, maxPoints = 40) {
  const { stock } = useMarket();
  const [history, setHistory] = useState([]);
  const lastPriceRef = useRef(null);

  useEffect(() => {
    const current = stock.find((s) => s.symbol === symbol);
    if (!current) return;

    // 1. If history is empty, generate realistic initial data points
    if (history.length === 0) {
      const points = [];
      const openPrice = current.open || current.previousClose || current.currentPrice;
      const currentPrice = current.currentPrice;
      const high = current.high || Math.max(openPrice, currentPrice) * 1.02;
      const low = current.low || Math.min(openPrice, currentPrice) * 0.98;
      const spread = high - low || openPrice * 0.04;

      const now = Date.now();
      const intervalMs = 5 * 60 * 1000; // 5-minute intervals

      for (let i = maxPoints - 1; i >= 0; i--) {
        const timePoint = new Date(now - i * intervalMs);
        const progress = (maxPoints - 1 - i) / (maxPoints - 1);
        
        // Linear path from open price to current price
        const baseTrend = openPrice + (currentPrice - openPrice) * progress;
        
        // Add random walk variance using sine/cosine curves + noise
        const noise = (Math.sin(progress * Math.PI * 2.5) + Math.cos(progress * Math.PI * 5) * 0.5) * (spread * 0.3) + 
                      (Math.random() - 0.5) * (spread * 0.1);
        
        let priceVal = baseTrend + noise;
        
        // Clamp within high and low limits
        priceVal = Math.min(priceVal, high);
        priceVal = Math.max(priceVal, low);

        // Make sure the last point matches current price exactly
        if (i === 0) {
          priceVal = currentPrice;
        }

        points.push({
          time: timePoint.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          price: Number(priceVal.toFixed(2))
        });
      }
      setHistory(points);
      lastPriceRef.current = currentPrice;
      return;
    }

    // 2. If new price comes from real-time sync, append it to history
    if (lastPriceRef.current === current.currentPrice) return;
    lastPriceRef.current = current.currentPrice;

    setHistory((prev) => {
      const next = [
        ...prev,
        { 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
          price: current.currentPrice 
        },
      ];
      return next.length > maxPoints ? next.slice(-maxPoints) : next;
    });
  }, [stock, symbol, history.length, maxPoints]);

  return history;
}
