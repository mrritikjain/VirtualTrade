import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Portfolio from "./Pages/Portfolio";
import Watchlist from "./Pages/Watchlist";
import History from "./Pages/History";
import Advisor from "./Pages/Advisor";
import StockdetailPage from "./Pages/StockdetailPage.jsx";
import { AuthProvider } from "./Context/AuthContent.jsx";
import { MarketProvider } from "./Context/MarketContext.jsx";
import { WishProvider } from "./Context/WishContext.jsx";

const App = () => {
  return (
    <AuthProvider>
      <MarketProvider>
        <WishProvider>
          <BrowserRouter>
            <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200 antialiased overflow-x-hidden ">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/portfolio" element={<Portfolio />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/history" element={<History />} />
                <Route path="/advisor" element={<Advisor />} />
                <Route path="/market/:symbol" element={<StockdetailPage />} />
              </Routes>
            </div>
          </BrowserRouter>
        </WishProvider>
      </MarketProvider>
    </AuthProvider>
  );
};

export default App;
