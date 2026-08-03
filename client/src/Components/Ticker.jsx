import React from "react";

const Ticker = () => {
  return (
    <div className="w-full h-8 bg-zinc-900 border-b border-zinc-800 shrink-0 flex items-center ">
      <marquee className="">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4 text-teal-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
            />
          </svg>
          <span className="text-sm font-medium text-zinc-300">NIFTY 50</span>
        </div>
      </marquee>
    </div>
  );
};

export default Ticker;
