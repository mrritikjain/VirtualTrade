import { createContext, useContext, useEffect, useState } from "react";
const WishContext = createContext();

export const WishProvider = ({ children }) => {
  const [wishlist, setWishList] = useState(() => {
    try {
      const saved = localStorage.getItem("wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  });
  const getWishList = (stockItem) => {
    const exists = wishlist.find((item) => item.symbol === stockItem.symbol);

    if (exists) {
      return setWishList(
        wishlist.filter((item) => item.symbol !== stockItem.symbol),
      );
    } else {
      return setWishList([...wishlist, stockItem]);
    }
  };
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);
  return (
    <WishContext.Provider value={{ wishlist, getWishList }}>
      {children}
    </WishContext.Provider>
  );
};

export const useWish = () => {
  return useContext(WishContext);
};
