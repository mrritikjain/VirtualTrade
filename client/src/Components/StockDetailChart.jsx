import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useSymbolHistory } from "../Hooks/UseSymbolHistory.jsx";

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 rounded-xl p-3 shadow-xl">
      <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-0.5">
        Price
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-white font-extrabold text-sm font-mono">
          ₹
          {payload[0].value.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
          })}
        </span>
      </div>
      <p className="text-zinc-400 text-[9px] mt-0.5">
        {payload[0].payload.time}
      </p>
    </div>
  );
};

const StockDetailChart = ({ symbol }) => {
  const data = useSymbolHistory(symbol);

  if (data.length < 2) {
    return (
      <div className="h-72 flex items-center justify-center text-zinc-500 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Waiting for price data…</span>
        </div>
      </div>
    );
  }

  // Determine trend color (emerald if price has gone up, rose if down)
  const isUp = data[data.length - 1].price >= data[0].price;
  const strokeColor = isUp ? "#10b981" : "#f43f5e";

  return (
    <div className="w-full h-72 mt-2 flex flex-col justify-end">
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={strokeColor} stopOpacity={0.25} />
              <stop offset="95%" stopColor={strokeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#27272a"
            opacity={0.2}
          />
          <XAxis
            dataKey="time"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a", fontSize: 9 }}
            dy={8}
          />
          <YAxis
            domain={["auto", "auto"]}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "#71717a", fontSize: 9 }}
            tickFormatter={(value) => `₹${value.toFixed(2)}`}
            dx={-8}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{
              stroke: strokeColor,
              strokeWidth: 1,
              strokeDasharray: "3 3",
            }}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke={strokeColor}
            strokeWidth={2}
            fill="url(#chartGradient)"
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0, fill: strokeColor }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockDetailChart;
