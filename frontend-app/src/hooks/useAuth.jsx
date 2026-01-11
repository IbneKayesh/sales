import { useState, useEffect, createContext, useContext } from "react";
import { authAPI } from "@/api/auth/authAPI";
import { generateGuid } from "@/utils/guid";
import { setStorageData } from "@/utils/storage";

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage for now, can be improved with tokens later)
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (formDataBody) => {
    try {
      //console.log("formDataBody", formDataBody);
      const reqBody = {
        users_email: formDataBody.users_email,
        users_pswrd: formDataBody.users_pswrd,
      };
      const response = await authAPI.login(reqBody);
      if (response.success) {
        //console.log("response " + JSON.stringify(response))
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setStorageData({ user: response.data });
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
    localStorage.removeItem("user");
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
      console.log("response", response);
      if (response.success) {
        console.log("response " + JSON.stringify(response));
        setUser(response.data);
        localStorage.setItem("user", JSON.stringify(response.data));
        setStorageData({ user: response.data });
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

  const setPassword = async (user) => {
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
      const response = await authAPI.setPassword(reqBody);
      //console.log("response", response);
      return response;
    } catch (error) {
      console.error("Login error:", error);
      return error;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    recoverPassword,
    setPassword,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
