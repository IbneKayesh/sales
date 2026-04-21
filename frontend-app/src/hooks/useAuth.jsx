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
    try {
      const reqBody = {
        users_email: formDataBody.users_email,
        users_pswrd: formDataBody.users_pswrd,
      };
      const response = await authAPI.login(reqBody);
      if (response.success) {
        const { users, bsins, token } = response.data;
        //console.log("users", users);
        setUser(users);
        setBusiness(bsins);
      }
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const logout = async () => {
    setUser(null);
    setBusiness(null);
    clearStorageData();
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
