import React, { createContext, useContext, useState, useEffect } from "react";
import { loadWishlist, saveWishlist } from "@/utils/vmartStorage";

const WishlistContext = createContext();

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
};

export const WishlistProvider = ({ children, customerId }) => {
  const [wishlist, setWishlist] = useState(() => loadWishlist(customerId));

  useEffect(() => {
    saveWishlist(customerId, wishlist);
  }, [customerId, wishlist]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, wishlistCount: wishlist.length }}>
      {children}
    </WishlistContext.Provider>
  );
};
