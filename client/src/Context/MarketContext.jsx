import { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const MarketContext = createContext();
export const MarketProvider = ({ children }) => {
  const [stock, setStock] = useState([]);
  const [loading, setLoading] = useState(true);

  const getStock = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/market/");
      setStock(res.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getStock();

    const syncId = setInterval(getStock, 90000); // 90s
    return () => clearInterval(syncId);
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
