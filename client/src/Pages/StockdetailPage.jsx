import { Link, useParams } from "react-router-dom";
import { useMarket } from "../Context/MarketContext.jsx";
import Header from "../Components/Header.jsx";
import Sidebar from "../Components/Sidebar.jsx";
import Ticker from "../Components/Ticker.jsx";

const StockdetailPage = () => {
  const { symbol } = useParams();
  const { stock, loading } = useMarket();

  const selectedStock = stock.find((item) => item.symbol === symbol);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen">
        <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!selectedStock) {
    return <div>Stock not found in Market!</div>;
  }

  return (
    <div>
      <div>
        <Ticker />
      </div>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <Header />
          <div className="flex-1 min-h-0 gap-2 px-10 py-6 bg-linear-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl">
            <Link
              to="/dashboard"
              className="text-zinc-400 hover:text-zinc-100 w-max text-sm font-medium"
            >
              ← Market
            </Link>
            <h2 className="text-3xl font-bold my-2 tracking-tight">
              {selectedStock.symbol}
              {"  "}
              <span className="text-sm text-zinc-400 ml-2">
                {selectedStock.companyName}
              </span>
            </h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl font-bold">
                ₹
                {selectedStock.currentPrice.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>

              {/* CHANGE % */}
              <span
                className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full ${
                  selectedStock.change >= 0
                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                    : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                }`}
              >
                {selectedStock.change >= 0 ? "↗ +" : "↘ -"}
                {selectedStock.changePercent.toFixed(2)}%
              </span>
            </div>
            <div className="flex">
              <div className="flex-3/4"></div>
              <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl flex-1/4">
                <h2>Quantity</h2>
                <input type="number" />
                <button className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600">
                  Buy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StockdetailPage;
