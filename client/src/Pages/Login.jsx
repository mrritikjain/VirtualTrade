import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import { useAuth } from "../Context/AuthContent.jsx";

const Login = () => {
  const navigate = useNavigate();
  const { user: authUser, getProfile } = useAuth();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/login",
        user,
        {
          withCredentials: true,
        },
      );

      await getProfile();
      navigate("/dashboard");
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "An error occurred",
      );
    }
  };

  if (authUser) {
    return <Dashboard />;
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-zinc-800 rounded-2xl p-8 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-4">Welcome Back</h2>
        <p className="text-zinc-400 text-sm mb-6">Sign in to your account</p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter your password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-2 cursor-pointer"
          >
            Login
          </button>
        </form>

        {/* Don't have an account? */}
        <p className="text-center text-zinc-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to={"/register"}
            className="text-teal-500 hover:text-teal-400 font-medium"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
