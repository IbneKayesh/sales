import {
  useState,
  useEffect,
  createContext,
  useContext,
  useCallback,
} from "react";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
  getStorageLoginData,
} from "@/utils/storage";
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
  const [emply, setEmply] = useState(null);
  const [user, setUser] = useState(null);
  const [business, setBusiness] = useState(null);
  const [userMenus, setUserMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const logout = useCallback(async (showPopup = false) => {
    const stored = getStorageLoginData();
    setEmply(null);
    setUser(null);
    setBusiness(null);
    clearStorageData();

    // If user was saved, show the re-login popup instead of just going to login page
    if (showPopup && stored && stored.is_saved) {
      setShowLoginPopup(true);
    }
  }, []);

  useEffect(() => {
    const storedEmply = getStorageData()?.emply;
    if (storedEmply) {
      setEmply(storedEmply);
    }
    const storedUser = getStorageData()?.users;
    //console.log("storedUser", storedUser);
    if (storedUser) {
      setUser(storedUser);
    }
    const storedBusiness = getStorageData()?.bsins;
    if (storedBusiness) {
      setBusiness(storedBusiness);
    }

    const storedMenus = getStorageData()?.menus;
    if (storedMenus) {
      setUserMenus(storedMenus);
    }

    setLoading(false);
  }, []);

  const login = async (fromData) => {
    try {
      const reqBody = {
        users_email: fromData.username,
        users_pswrd: fromData.password,
      };
      const resp = await apiLogin({
        body: reqBody,
      });
      //console.log("resp", resp);
      if (resp.success) {
        setEmply(resp.data.emply);
        setUser(resp.data.users);
        setBusiness(resp.data.bsins);
        setUserMenus(resp.data.menus);
      }
      return resp;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      const stored = getStorageLoginData();
      if (stored && stored.is_saved) {
        setShowLoginPopup(true);
      } else {
        // Fallback or force logout
        logout();
      }
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  const getPageAuth = useCallback(
    (menuId) => {
      const menu = userMenus.find((m) => m.id === menuId);
      //console.log("menu",menu)
      if (menu) {
        return {
          extpr: menu.mnemp_extpr || false,
          addpr: menu.mnemp_addpr || false,
          edtpr: menu.mnemp_edtpr || false,
          delpr: menu.mnemp_delpr || false,
        };
      }
      return { extpr: false, addpr: false, edtpr: false, delpr: false };
    },
    [userMenus],
  );

  const value = {
    emply,
    user,
    business,
    getPageAuth,
    loading,
    login,
    logout,
    showLoginPopup,
    setShowLoginPopup,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
