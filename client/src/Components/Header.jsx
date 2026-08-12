import React from "react";
import { useAuth } from "../Context/AuthContent.jsx";

const Header = () => {
  const { user } = useAuth();
  return (
    <div className="md:px-6 md-py-8 px-4 py-4 md:flex md:justify-between block w-full">
      <div className="md:w-3/4 w-full">
        <h2 className="text-zinc-200 text-2xl font-bold leading-none tracking-wide">
          Namaste,{" "}
          {user
            ? user.name.charAt(0).toUpperCase() + user.name.slice(1)
            : "User"}
        </h2>
        <p className="text-zinc-400 mt-2 text-sm">
          Let's start trading with virtual cash!
        </p>
      </div>
      <div className="flex justify-between md:w-1/4 w-full mt-5 md:mt-0">
        <div className="">
          <h3 className="text-zinc-400 text-sm tracking-wide">Cash Balance</h3>
          <h4 className="font-bold">
            ₹ {user ? user.credits || "1,00,000" : "-"}
          </h4>
        </div>

        <div className="">
          <h3 className="text-zinc-400 text-sm tracking-wide">
            Portfolio Value
          </h3>
          <h4 className="font-bold">₹10,00,000</h4>
        </div>
        <div className="">
          <h3 className="text-zinc-400 text-sm tracking-wide">Total P&L</h3>
          <h4 className="font-bold text-green-500">
            + ₹0 <span className="text-zinc-400 text-sm"> (0.00%)</span>
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
