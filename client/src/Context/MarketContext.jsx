import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const MarketContext = createContext();
export const MarketProvider = ({ children }) => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:3000/api/market/`, {
        withCredentials: true,
      });
      setStock(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getStock();
    const interval = setInterval(() => {
      getStock();
    }, 20000);
    return () => clearInterval(interval);
  }, []);
  return (
    <MarketContext.Provider value={{ stock, loading }}>
      {children}
    </MarketContext.Provider>
  );
};

export const useMarket = () => {
  return useContext(MarketContext);
};
