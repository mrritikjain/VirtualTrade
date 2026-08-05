import React from "react";
import Sidebar from "../Components/Sidebar";
import Header from "../Components/Header";
import Ticker from "../Components/Ticker";
import StockCards from "../Components/StockCards";

const Dashboard = () => {
  return (
    <div className="h-screen overflow-hidden flex flex-col">
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          <div className="flex-1 min-h-0 gap-2 px-10 py-6 bg-gradient-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl">
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-zinc-100 font-bold text-xl tracking-tight">Market Overview</h2>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-zinc-500">
                  <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  className="h-10 w-72 rounded-full pl-10 pr-4 bg-zinc-950/40 border border-zinc-800 focus:outline-none focus:border-teal-500/80 focus:ring-4 focus:ring-teal-500/10 text-white placeholder-zinc-500 transition-all duration-200 text-sm"
                  placeholder="Search Stocks..."
                />
              </div>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pr-2">
              <StockCards />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
