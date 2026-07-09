import {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorageData()?.users ?? null);
  const [role, setRole] = useState(
    () => getStorageData()?.users?.users_crole ?? "USER",
  );

  const logout = useCallback(() => {
    setUser(null);
    clearStorageData();
  }, []);

  const saveLoggedAuth = useCallback((updates) => {
    setUser(updates);
    setRole(updates?.users_crole ?? "USER");
    setStorageData({ users: updates });
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
