import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/AuthContent.jsx";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        "/auth/logout",
        {},
      );

      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || error.message || "Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  const getLinkClasses = (path) => {
    const base =
      "flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 font-medium text-sm";
    if (isActive(path)) {
      return `${base} bg-teal-500/10 text-teal-400 border border-teal-500/20 shadow-sm shadow-teal-500/5`;
    }
    return `${base} text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 border border-transparent`;
  };

  return (
    <div className="sticky top-12 h-[calc(100vh-2rem)] bg-zinc-900 border-r border-zinc-800 ">
      {/* Top Section */}
      <div className="shrink-0 md:flex hidden flex-col md:justify-between p-6 h-full md:w-64">
        {/* Logo */}
        <div>
          <Link
            to={"/dashboard"}
            className="flex items-center gap-3 cursor-pointer mb-10"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg
                className="w-5 h-5 text-zinc-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Virtual<span className="text-teal-400 font-extrabold">Trade</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2">
            {/* Dashboard */}
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span>Market</span>
            </Link>

            {/* Portfolio */}
            <Link to="/portfolio" className={getLinkClasses("/portfolio")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <span>Portfolio</span>
            </Link>

            {/* Watchlist */}
            <Link to="/watchlist" className={getLinkClasses("/watchlist")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.564-.373-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
              <span>Watchlist</span>
            </Link>

            {/* History */}
            <Link to="/history" className={getLinkClasses("/history")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>History</span>
            </Link>

            {/* AI Advisor */}
            <Link to="/advisor" className={getLinkClasses("/advisor")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
              <span>AI Advisor</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Section (Logout) */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 font-medium text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent cursor-pointer w-full text-left"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Logout</span>
        </button>
      </div>
      <div className="shrink-0 md:hidden flex flex-col justify-between p-2 h-full w-16">
        {/* Logo */}
        <div>
          <Link
            to={"/dashboard"}
            className="flex items-center justify-center gap-3 cursor-pointer mb-10"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <svg
                className="w-5 h-5 text-zinc-950"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col justify-center items-center gap-2">
            {/* Dashboard */}
            <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>

            {/* Portfolio */}
            <Link to="/portfolio" className={getLinkClasses("/portfolio")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </Link>

            {/* Watchlist */}
            <Link to="/watchlist" className={getLinkClasses("/watchlist")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.36 1.246.588 1.81l-3.97 2.883a1 1 0 00-.364 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.971-2.883a1 1 0 00-1.17 0l-3.97 2.883c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.364-1.118L2.98 10.1c-.773-.564-.373-1.81.588-1.81h4.908a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            </Link>

            {/* History */}
            <Link to="/history" className={getLinkClasses("/history")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </Link>

            {/* AI Advisor */}
            <Link to="/advisor" className={getLinkClasses("/advisor")}>
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </Link>
          </nav>
        </div>

        {/* Bottom Section (Logout) */}
        <button
          onClick={handleLogout}
          className="flex justify-center items-center gap-3 py-2.5 px-3 rounded-xl transition-all duration-200 font-medium text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent cursor-pointer w-full text-left"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
