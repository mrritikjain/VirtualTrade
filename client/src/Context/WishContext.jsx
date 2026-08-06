import { createContext, useContext, useState } from "react";
const WishContext = createContext();

export const WishProvider = ({ children }) => {
  const [wishlist, setWishList] = useState([]);

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

  return (
    <WishContext.Provider value={{ wishlist, getWishList }}>
      {children}
    </WishContext.Provider>
  );
};

export const useWish = () => {
  return useContext(WishContext);
};
