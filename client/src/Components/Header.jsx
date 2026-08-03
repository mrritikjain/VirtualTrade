import React, { useEffect, useState } from "react";
import axios from "axios";
const Header = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3000/auth/profile",
          { withCredentials: true }, // cookie bhejne ke liye zaroori
        );
        setUser(data.user);
      } catch (err) {
        console.error("Not logged in", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
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
          <h3>CASH</h3>
          <h4 className="font-bold">₹10,00,000</h4>
        </div>

        <div className="">
          <h3>CASH</h3>
          <h4 className="font-bold">₹10,00,000</h4>
        </div>
        <div className="">
          <h3>CASH</h3>
          <h4 className="font-bold">₹10,00,000</h4>
        </div>
      </div>
    </div>
  );
};

export default Header;
