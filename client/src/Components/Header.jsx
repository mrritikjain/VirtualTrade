import React from "react";
import { useAuth } from "../Context/AuthContent";

const Header = () => {
  const { user } = useAuth();
  return (
    <div className="px-6 py-8 flex justify-between w-full">
      <div className="w-3/4">
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
      <div className="flex justify-between w-1/4">
        <div className="">
          <h3 className="text-zinc-400 text-sm tracking-wide">Cash Balance</h3>
          <h4 className="font-bold">₹ {user ? user.credits : "-"}</h4>
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
