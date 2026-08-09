// components/StockDetailChart.jsx
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSymbolHistory } from "../Hooks/UseSymbolHistory.jsx";
import { useRef } from "react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-xs">
      <p className="text-zinc-400">{label}</p>
      <p className="text-white font-bold">₹{payload[0].value.toFixed(2)}</p>
    </div>
  );
};

export default function StockDetailChart({ symbol }) {
  const data = useSymbolHistory(symbol);

  if (data.length < 2) {
    return (
      <div className="h-64 flex items-center justify-center text-zinc-400 text-md font-bold">
        Chart is loading....
      </div>
    );
  }

  const isUp = data[data.length - 1].price >= data[0].price;
  const strokeColor = isUp ? "#10b981" : "#f43f5e"; // emerald / rose — aapke card colors se match

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={strokeColor} stopOpacity={0.35} />
            <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="time" hide />
        <YAxis domain={["auto", "auto"]} hide />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="price"
          stroke={strokeColor}
          strokeWidth={2}
          fill="url(#priceGradient)"
          isAnimationActive={false}
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
