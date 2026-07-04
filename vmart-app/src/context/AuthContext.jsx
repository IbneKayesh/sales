import { useState, useEffect, createContext, useContext } from "react";
import { DEMO_USERS, findUser as findDemoUser } from "@/hooks/useVmartData";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";
import { loadRegisteredUsers, saveRegisteredUser } from "@/utils/vmartStorage";

const findUser = (userId) => {
  const trimmed = userId.trim().toLowerCase();
  const registered = loadRegisteredUsers().find(
    (u) =>
      u.email?.toLowerCase() === trimmed ||
      u.mobile === userId.trim() ||
      u.email?.toLowerCase() === userId.trim().toLowerCase()
  );
  if (registered) return registered;
  return findDemoUser(userId);
};

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStorageData()?.vmartUser;
    if (stored) setUser(stored);
    setLoading(false);
  }, []);

  // ── Step 1: check if user ID exists in demo data ─────────────────────────
  const checkUserId = (userId) => {
    const found = findUser(userId.trim());
    return { found: !!found, user: found || null };
  };

  // ── Step 2: attempt login with password ───────────────────────────────────
  const login = async ({ userId, password }) => {
    const found = findUser(userId.trim());
    if (!found) {
      return { success: false, message: "User not found" };
    }
    if (found.password !== password) {
      return { success: false, message: "Incorrect password" };
    }
    const userData = {
      id: found.id,
      email: found.email,
      mobile: found.mobile,
      name: found.name,
      address: found.address,
      role: found.role,
      shopId: found.shopId,
    };
    setUser(userData);
    setStorageData({ vmartUser: userData });
    return { success: true, message: "Login successful", user: userData };
  };

  // ── Step 3: self-register new CUSTOMER and auto-login ────────────────────
  const register = async ({ userId, password, name, address }) => {
    if (findUser(userId.trim())) {
      return { success: false, message: "Account already exists. Please log in." };
    }
    const credUser = {
      id: Date.now(),
      email: userId.includes("@") ? userId.trim() : "",
      mobile: !userId.includes("@") ? userId.trim() : "",
      password,
      name: name.trim(),
      address: address.trim(),
      role: "CUSTOMER",
      shopId: null,
    };
    saveRegisteredUser(credUser);
    const userData = {
      id: credUser.id,
      email: credUser.email,
      mobile: credUser.mobile,
      name: credUser.name,
      address: credUser.address,
      role: credUser.role,
      shopId: null,
    };
    setUser(userData);
    setStorageData({ vmartUser: userData });
    return { success: true, message: "Account created successfully", user: userData };
  };

  const changePassword = async ({ currentPassword, newPassword }) => {
    const stored = findUser(user?.email || user?.mobile || "");
    if (!stored || stored.password !== currentPassword) {
      return { success: false, message: "Current password is incorrect" };
    }
    const updated = { ...stored, password: newPassword };
    saveRegisteredUser(updated);
    return { success: true, message: "Password updated successfully" };
  };

  // ── Update profile (name, address) ───────────────────────────────────────
  const updateProfile = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    setStorageData({ vmartUser: updated });
  };

  const logout = () => {
    setUser(null);
    clearStorageData();
  };

  const value = {
    user,
    loading,
    checkUserId,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
