import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Dashboard from "./Dashboard";
import { useAuth } from "../Context/AuthContent.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { user: authUser, getProfile } = useAuth();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (user.name.length < 3) {
      alert("Username must be at least 3 characters long");
      return;
    } else if (user.password !== user.confirmPassword) {
      alert("Passwords do not match");
      return;
    } else if (user.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    } else if (!user.email.includes("@")) {
      alert("Invalid email");
      return;
    }
    try {
      const { data } = await axios.post(
        "http://localhost:3000/auth/register",
        user,
        { withCredentials: true },
      );
      alert(data.message);
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
        <h2 className="text-2xl font-bold text-white mb-4">Create Account</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Join Virtual Trade and start trading!
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Choose a username"
              value={user.name}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

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
              onChange={(e) =>
                setUser((prev) => ({ ...prev, email: e.target.value }))
              }
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
              placeholder="Create a password"
              value={user.password}
              onChange={(e) =>
                setUser((prev) => ({ ...prev, password: e.target.value }))
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Confirm your password"
              value={user.confirmPassword}
              onChange={(e) =>
                setUser((prev) => ({
                  ...prev,
                  confirmPassword: e.target.value,
                }))
              }
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded-lg transition duration-200 mt-2 cursor-pointer"
          >
            Register
          </button>
        </form>

        {/* Already have an account? */}
        <p className="text-center text-zinc-400 text-sm mt-6">
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-teal-500 hover:text-teal-400 font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
