import { useState, useEffect, useRef } from "react";

function PriceCell({ price }) {
  const [flash, setFlash] = useState(null);
  const prevRef = useRef(price);

  useEffect(() => {
    if (prevRef.current !== price) {
      setFlash(price > prevRef.current ? "up" : "down");
      prevRef.current = price;
      const t = setTimeout(() => setFlash(null), 700);
      return () => clearTimeout(t);
    }
  }, [price]);

  return (
    <span
      className={`text-2xl font-black tracking-tight transition-colors duration-500 ${
        flash === "up"
          ? "text-emerald-400"
          : flash === "down"
            ? "text-rose-400"
            : "text-white"
      }`}
    >
      ₹{price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
    </span>
  );
}

export default PriceCell;
