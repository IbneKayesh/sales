import { useState, useEffect, createContext, useContext } from "react";
import { getStorageData, setStorageData, clearStorageData } from "@/utils/storage";
import { apiLogin } from "@/utils/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  //auth guard or session holder
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getStorageData()?.users;
    //console.log("storedUser", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (fromData) => {
    try {
      const reqBody = {
        email: fromData.username,
        password: fromData.password,
        auto_login: '1',
      }
      const resp = await apiLogin({
        body: reqBody,
      });
      //console.log("resp", resp);
      if (resp.result) {
        setUser(resp);
      }
      return resp;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };
  
  const logout = async () => {
    setUser(null);
    clearStorageData();
  };

  const value = {
    user,
    loading,
    login,
    logout
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
