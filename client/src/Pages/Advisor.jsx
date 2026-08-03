import React from "react";
import Sidebar from "../Components/Sidebar";
import Ticker from "../Components/Ticker";
import Header from "../Components/Header";
const Advisor = () => {
  return (
    <div>
      <div>
        <Ticker />
      </div>
      <div className="flex">
        <Sidebar />
        <Header />
      </div>
    </div>
  );
};

export default Advisor;
