import React from "react";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
const Portfolio = () => {
  return (
    <div>
      <div>
        <Ticker />
      </div>
      <div className="flex flex-1 min-h-0">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <Header />
          </div>
      </div>
    </div>
  );
};

export default Portfolio;
