import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import { load, save, KEYS } from "../../utils/storage";

const AUTH_KEY = "vmart_auth";
const ROLES = { CUSTOMER: "CUSTOMER", SHOP: "SHOP" };

function loadAuth() {
  try {
    const data = localStorage.getItem(AUTH_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

function saveAuth(data) {
  try {
    localStorage.setItem(AUTH_KEY, JSON.stringify(data));
  } catch {}
}

function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY);
  } catch {}
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadAuth());
  const [isAuthenticated, setIsAuthenticated] = useState(!!loadAuth());

  useEffect(() => {
    if (user) {
      saveAuth(user);
      setIsAuthenticated(true);
    }
  }, [user]);

  /* ── User registry helpers ── */
  const registerUser = useCallback((profile) => {
    const registry = load(KEYS.USERS_REGISTRY);
    const existing = registry.findIndex(
      (u) => u.name === profile.name && u.role === profile.role,
    );
    const entry = {
      name: profile.name,
      role: profile.role,
      shopName: profile.shopName || "",
      contact: profile.contact || "",
      address: profile.address || "",
      password: profile.password || "",
      securityQuestion:
        profile.securityQuestion || registry[existing]?.securityQuestion || "",
      securityAnswer:
        profile.securityAnswer || registry[existing]?.securityAnswer || "",
    };
    if (existing !== -1) {
      registry[existing] = {
        ...registry[existing],
        ...entry,
        password: entry.password || registry[existing].password,
      };
    } else {
      registry.push(entry);
    }
    save(KEYS.USERS_REGISTRY, registry);
  }, []);

  const lookupUser = useCallback((name, role) => {
    const registry = load(KEYS.USERS_REGISTRY);
    return registry.find((u) => u.name === name && u.role === role) || null;
  }, []);

  const verifyPassword = useCallback((name, role, password) => {
    const registry = load(KEYS.USERS_REGISTRY);
    const user = registry.find((u) => u.name === name && u.role === role);
    if (!user) return { valid: false, reason: "User not found" };
    if (!user.password) return { valid: true, data: user };
    if (user.password !== password)
      return { valid: false, reason: "Incorrect password" };
    return { valid: true, data: user };
  }, []);

  const loginAsCustomer = useCallback(
    (profile) => {
      const authData = {
        name: profile.name,
        contact: profile.contact || "",
        address: profile.address || "",
        role: ROLES.CUSTOMER,
        password: profile.password || "",
        securityQuestion: profile.securityQuestion || "",
        securityAnswer: profile.securityAnswer || "",
        loggedInAt: new Date().toISOString(),
      };
      registerUser(profile);
      setUser(authData);
      setIsAuthenticated(true);
    },
    [registerUser],
  );

  const loginAsShop = useCallback(
    (profile) => {
      const authData = {
        name: profile.name,
        shopName: profile.shopName || profile.name,
        contact: profile.contact || "",
        address: profile.address || "",
        role: ROLES.SHOP,
        password: profile.password || "",
        securityQuestion: profile.securityQuestion || "",
        securityAnswer: profile.securityAnswer || "",
        loggedInAt: new Date().toISOString(),
      };
      registerUser(profile);
      setUser(authData);
      setIsAuthenticated(true);
    },
    [registerUser],
  );

  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    clearAuth();
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updates };
      saveAuth(updated);
      return updated;
    });
  }, []);

  const changePassword = useCallback((oldPassword, newPassword) => {
    return new Promise((resolve, reject) => {
      setUser((prev) => {
        if (!prev) {
          reject(new Error("Not authenticated"));
          return prev;
        }
        /* If a password is set, verify old password */
        if (prev.password && prev.password !== oldPassword) {
          reject(new Error("Current password is incorrect"));
          return prev;
        }
        /* Allow setting/updating password */
        const updated = { ...prev, password: newPassword };
        saveAuth(updated);
        resolve(true);
        return updated;
      });
    });
  }, []);

  const hasPassword = !!user?.password;

  const verifySecurityAnswer = useCallback((name, role, answer) => {
    const registry = load(KEYS.USERS_REGISTRY);
    const user = registry.find((u) => u.name === name && u.role === role);
    if (!user) return { valid: false, reason: "User not found" };
    if (!user.securityAnswer)
      return { valid: false, reason: "No security question set" };
    if (user.securityAnswer.toLowerCase() !== answer.toLowerCase().trim()) {
      return { valid: false, reason: "Incorrect answer" };
    }
    return { valid: true, data: user };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      role: user?.role || null,
      isCustomer: user?.role === ROLES.CUSTOMER,
      isShop: user?.role === ROLES.SHOP,
      hasPassword,
      lookupUser,
      verifyPassword,
      verifySecurityAnswer,
      registerUser,
      loginAsCustomer,
      loginAsShop,
      logout,
      updateProfile,
      changePassword,
    }),
    [
      user,
      isAuthenticated,
      hasPassword,
      lookupUser,
      verifyPassword,
      registerUser,
      loginAsCustomer,
      loginAsShop,
      logout,
      updateProfile,
      changePassword,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export { ROLES };
