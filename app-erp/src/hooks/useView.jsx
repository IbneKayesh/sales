import React, { createContext, useContext, useState, useEffect } from "react";
import { getStorageData, setStorageData } from "../utils/storage";

const ViewContext = createContext();

export const ViewProvider = ({ children }) => {
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const data = getStorageData();
    setIsMobileView(data.isMobileView || false);
  }, []);

  const toggleView = () => {
    const newValue = !isMobileView;
    setIsMobileView(newValue);
    setStorageData({ isMobileView: newValue });
  };

  const setMobileView = (value) => {
    setIsMobileView(value);
    setStorageData({ isMobileView: value });
  };

  return (
    <ViewContext.Provider value={{ isMobileView, toggleView, setMobileView }}>
      {children}
    </ViewContext.Provider>
  );
};

export const useView = () => {
  const context = useContext(ViewContext);
  if (context === undefined) {
    throw new Error("useView must be used within a ViewProvider");
  }
  return context;
};
