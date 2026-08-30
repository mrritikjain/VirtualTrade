import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Pages/Landing";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Portfolio from "./Pages/Portfolio";
import Watchlist from "./Pages/Watchlist";
import History from "./Pages/History";
import Advisor from "./Pages/Advisor";
import StockdetailPage from "./Pages/StockdetailPage.jsx";
import { AuthProvider, useAuth } from "./Context/AuthContent.jsx";
import { MarketProvider } from "./Context/MarketContext.jsx";
import { WishProvider } from "./Context/WishContext.jsx";

// ProtectedRoute Wrapper Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-zinc-950">
        <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <MarketProvider>
        <WishProvider>
          <BrowserRouter>
            <div className="bg-zinc-950 text-zinc-100 min-h-screen font-sans selection:bg-teal-500/30 selection:text-teal-200 antialiased overflow-x-hidden ">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Private Protected Routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/portfolio" element={<ProtectedRoute><Portfolio /></ProtectedRoute>} />
                <Route path="/watchlist" element={<ProtectedRoute><Watchlist /></ProtectedRoute>} />
                <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
                <Route path="/advisor" element={<ProtectedRoute><Advisor /></ProtectedRoute>} />
                <Route path="/market/:symbol" element={<ProtectedRoute><StockdetailPage /></ProtectedRoute>} />
              </Routes>
            </div>
          </BrowserRouter>
        </WishProvider>
      </MarketProvider>
    </AuthProvider>
  );
};

export default App;
