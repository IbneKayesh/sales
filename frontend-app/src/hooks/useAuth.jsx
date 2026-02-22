import { useState, useEffect, createContext, useContext } from "react";
import { authAPI } from "@/api/auth/authAPI";
import { generateGuid } from "@/utils/guid";
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = getStorageData()?.user;
    if (storedUser) {
      setUser(storedUser);
    }
    const storedBusiness = getStorageData()?.business;
    if (storedBusiness) {
      setBusiness(storedBusiness);
    }

    // Restore view preference from sessionStorage (not localStorage)
    const sessionView = sessionStorage.getItem("users_sview");
    if (sessionView) {
      setIsMobileView(sessionView === "mobile");
    }

    setLoading(false);
  }, []);

  const login = async (formDataBody) => {
    try {
      const reqBody = {
        users_email: formDataBody.users_email,
        users_pswrd: formDataBody.users_pswrd,
      };
      const response = await authAPI.login(reqBody);
      if (response.success) {
        const { users_sview, ...restData } = response.data;

        const userData = {
          id: restData.id,
          users_email: restData.users_email,
          users_oname: restData.users_oname,
          users_cntct: restData.users_cntct,
          users_bsins: restData.users_bsins,
          users_drole: restData.users_drole,
          users_users: restData.users_users,
          users_stats: restData.users_stats,
          users_regno: restData.users_regno,
          users_wctxt: restData.users_wctxt,
          users_notes: restData.users_notes,
          users_nofcr: restData.users_nofcr,
          users_isrgs: restData.users_isrgs,
        };
        setUser(userData);
        setStorageData({ user: userData });

        // Handle view preference - store only in memory and sessionStorage
        const viewMode = users_sview || "web";
        setIsMobileView(viewMode === "mobile");
        sessionStorage.setItem("users_sview", viewMode);

        const businessData = {
          users_bsins: restData.users_bsins,
          bsins_bname: restData.bsins_bname,
          bsins_addrs: restData.bsins_addrs,
          bsins_email: restData.bsins_email,
          bsins_cntct: restData.bsins_cntct,
          bsins_image: null,
          bsins_binno: restData.bsins_binno,
          bsins_btags : restData.bsins_btags,
          bsins_cntry: restData.bsins_cntry,
          bsins_bstyp: restData.bsins_bstyp,
          bsins_tstrn: restData.bsins_tstrn,
          bsins_prtrn: restData.bsins_prtrn,
          bsins_sltrn: restData.bsins_sltrn,
          bsins_stdat: restData.bsins_stdat,
          bsins_pbviw: restData.bsins_pbviw,
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
    setIsMobileView(false);
    clearStorageData();
    sessionStorage.removeItem("users_sview");    
    localStorage.removeItem("sgdWeb25");
  };

  const register = async (register) => {
    try {
      //console.log("register", register);
      const { bsinsBname, usersEmail, usersPswrd, usersRecky, usersOname } =
        register;

      if (usersPswrd === usersRecky) {
        return {
          success: false,
          message: "Password and recovery key are same",
          data: null,
        };
      }

      const reqBody = {
        id: generateGuid(),
        bsins_bname: bsinsBname,
        users_email: usersEmail,
        users_pswrd: usersPswrd,
        users_recky: usersRecky,
        users_oname: usersOname,
      };
      const response = await authAPI.register(reqBody);
      //console.log("response", response);
      if (response.success) {
        //console.log("response " + JSON.stringify(response));
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const recoverPassword = async (user) => {
    try {
      //console.log("user", user);
      const reqBody = {
        users_email: user.usersEmail,
        users_recky: user.usersRecky,
      };
      const response = await authAPI.recoverPassword(reqBody);
      //console.log("response", response);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const resetPassword = async (user) => {
    try {
      //console.log("user", user);
      const { id, usersEmail, usersPswrd, usersRecky } = user;

      if (usersPswrd === usersRecky) {
        return {
          success: false,
          message: "Password and recovery key are same",
          data: null,
        };
      }

      const reqBody = {
        id: user.id,
        users_email: usersEmail,
        users_pswrd: usersPswrd,
        users_recky: usersRecky,
      };
      const response = await authAPI.resetPassword(reqBody);
      //console.log("response", response);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const value = {
    user,
    business,
    isMobileView,
    login,
    logout,
    register,
    recoverPassword,
    resetPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
