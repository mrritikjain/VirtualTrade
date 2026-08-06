import React from "react";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
import { useWish } from "../Context/WishContext.jsx";
import StockCards from "../Components/StockCards";
const Watchlist = () => {
  const { wishlist } = useWish();
  return (
    <div>
      <div>
        <Ticker />
      </div>
      <div className="flex">
        <Sidebar />
        <div className="w-full">
          <Header />
          <div className="flex-1 min-h-0 gap-2 px-10 py-6 bg-gradient-to-b from-zinc-900 to-zinc-950/95 border border-zinc-800/80 rounded-2xl mx-5 flex flex-col overflow-hidden mb-5 shadow-2xl">
            <div className="flex justify-between items-center mb-7">
              <h2 className="text-zinc-100 font-bold text-xl tracking-tight">
                WatchList
              </h2>
            </div>
            {wishlist.length == 0 ? (
              <div className="flex items-center justify-center h-full">
                <h2 className="text-zinc-400 font-semibold text-lg tracking-tight">
                  Your WatchList is Empty
                </h2>
              </div>
            ) : (
              <>
                <div className="flex justify-between w-full">
                  <h2>Symbol</h2>
                  <h2>Stock Name</h2>
                  <h2>Price</h2>
                  <h2>Change %</h2>
                  <h2></h2>
                </div>
                {wishlist.map((stock) => (
                  <div className="flex justify-between w-full">
                    <h2>{stock.symbol}</h2>
                    <h2>{stock.companyName}</h2>
                    <h2>
                      {stock.currentPrice.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                      })}
                    </h2>
                    <h2>{stock.pChange}</h2>
                    <h2>
                      <button onClick={() => handleRemove(stock.symbol)}>
                        Remove
                      </button>
                    </h2>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watchlist;
