import { useState, useEffect, createContext, useContext } from "react";
import { authAPI } from "@/api/auth/authAPI";

import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getStorageData()?.users;
    if (storedUser) {
      setUser(storedUser);
    }
    const storedBusiness = getStorageData()?.bsins;
    if (storedBusiness) {
      setBusiness(storedBusiness);
    }

    setLoading(false);
  }, []);

  const login = async (formDataBody) => {
    console.log("formDataBody", formDataBody);
    try {
      const reqBody = {
        users_email: formDataBody.users_email,
        users_pswrd: formDataBody.users_pswrd,
        customer_name: formDataBody.customer_name,
        customer_address: formDataBody.customer_address,
        virtual_mart: formDataBody.virtual_mart,
        page_type: formDataBody.page_type,
      };

      const response = await authAPI.login(reqBody);
      if (response.success) {
        const userData1 = response.data.users;

        const userData = {
          id: restData.id,
          emply_users: restData.emply_users,
          emply_bsins: restData.emply_bsins,
          emply_ecode: restData.emply_ecode,
          emply_crdno: restData.emply_crdno,
          emply_ename: restData.emply_ename,
          emply_econt: restData.emply_econt,
          emply_email: restData.emply_email,
        };
        setUser(userData);
        setStorageData({ user: userData });

        const businessData = {
          emply_bsins: restData.emply_bsins,
        };
        setBusiness(businessData);
        setStorageData({ business: businessData });
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
    setBusiness(null);
    clearStorageData();
    localStorage.removeItem("sgdMobile25");
  };

  const value = {
    user,
    business,
    login,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
