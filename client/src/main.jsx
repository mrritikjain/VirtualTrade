import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import axios from "axios";
import "./index.css";
import App from "./App.jsx";

// Configure axios base URL and credentials
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";
axios.defaults.withCredentials = true;

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

