import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { authAPI } from "@/api/auth/authAPI";
import { generateGuid } from "@/utils/guid";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";

interface AuthContextType {
  user: any;
  business: any;
  isMobileView: boolean;
  login: (formData: any) => Promise<any>;
  logout: () => Promise<void>;
  register: (data: any) => Promise<any>;
  recoverPassword: (data: any) => Promise<any>;
  resetPassword: (data: any) => Promise<any>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [business, setBusiness] = useState<any>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storageData = getStorageData();
    if (storageData.user) {
      setUser(storageData.user);
    }
    if (storageData.business) {
      setBusiness(storageData.business);
    }
    setLoading(false);
  }, []);

  const login = async (formDataBody: any) => {
    try {
      const reqBody = {
        users_email: formDataBody.users_email,
        users_pswrd: formDataBody.users_pswrd,
      };
      const response = await authAPI.login(reqBody);
      if (response.success) {
        const { ...restData } = response.data;
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

        const businessData = {
          users_bsins: restData.users_bsins,
          bsins_bname: restData.bsins_bname,
          bsins_addrs: restData.bsins_addrs,
          bsins_email: restData.bsins_email,
          bsins_cntct: restData.bsins_cntct,
          bsins_binno: restData.bsins_binno,
          bsins_btags: restData.bsins_btags,
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
      throw error;
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

  const register = async (data: any) => {
    try {
      const { bsinsBname, usersEmail, usersPswrd, usersRecky, usersOname } = data;
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
      return await authAPI.register(reqBody);
    } catch (error) {
      console.error("Register error:", error);
      throw error;
    }
  };

  const recoverPassword = async (data: any) => {
    try {
      const reqBody = {
        users_email: data.usersEmail,
        users_recky: data.usersRecky,
      };
      return await authAPI.recoverPassword(reqBody);
    } catch (error) {
      console.error("Recover password error:", error);
      throw error;
    }
  };

  const resetPassword = async (data: any) => {
    try {
      const { usersEmail, usersPswrd, usersRecky } = data;
      if (usersPswrd === usersRecky) {
        return {
          success: false,
          message: "Password and recovery key are same",
          data: null,
        };
      }
      const reqBody = {
        id: data.id,
        users_email: usersEmail,
        users_pswrd: usersPswrd,
        users_recky: usersRecky,
      };
      return await authAPI.resetPassword(reqBody);
    } catch (error) {
      console.error("Reset password error:", error);
      throw error;
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
