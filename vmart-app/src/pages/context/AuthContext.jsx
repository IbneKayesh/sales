import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("USER");

  useEffect(() => {
    const stored = getStorageData()?.users;
    //console.log("stored",stored)
    if (stored) {
      setUser(stored);
      setRole(stored.users_crole);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStorageData();
  }, []);

  const saveLoggedAuth = useCallback((updates) => {
    setUser(updates);
  }, []);

  const value = useMemo(
    () => ({
      user,
      role,
      saveLoggedAuth,
      logout,
    }),
    [user, role, saveLoggedAuth, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
