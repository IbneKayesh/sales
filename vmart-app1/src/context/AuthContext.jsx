import { useState, useEffect, createContext, useContext } from "react";
import { DEMO_USERS, findUser as findDemoUser } from "@/hooks/useVmartData";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";
import { loadRegisteredUsers, saveRegisteredUser } from "@/utils/vmartStorage";
import { apiLogin } from "@/utils/api";

const findUser = (userId) => {
  const trimmed = userId.trim().toLowerCase();
  const registered = loadRegisteredUsers().find(
    (u) =>
      u.email?.toLowerCase() === trimmed ||
      u.mobile === userId.trim() ||
      u.email?.toLowerCase() === userId.trim().toLowerCase(),
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
  const checkUserId = async (userId) => {
    try {
      const reqBody = {
        users_id: userId,
      };
      const resp = await apiLogin("/auth/v1/vmart/login", {
        body: reqBody,
      });
      //console.log("resp", resp);
      return { found: resp.data.users || null };
    } catch (error) {
      console.log("error", error);
      //return error;
      return { found: null };
    }
  };

  // ── Step 2: attempt login with password ───────────────────────────────────
  const login = async ({ userId, password }) => {
    try {
      const reqBody = {
        users_id: userId,
        users_pswrd: password,
      };
      const resp = await apiLogin("/auth/v1/vmart/login-with-password", {
        body: reqBody,
      });
      //console.log("resp", resp);
      if (resp.success) {
        const found = resp.data.users;

        const userData = {
          id: found.id,
          email: found.users_email,
          mobile: found.users_cntno,
          name: found.users_cname,
          account: found.users_pname,
          address: found.users_addrs,
          role: found.users_crole,
          shopId: found.bsins_id,
          userId: found.users_id
        };

        setUser(userData);
      }
      return resp;
    } catch (error) {
      console.log("error", error);
      return error;
    }
  };

  // ── Step 3: self-register new CUSTOMER and auto-login ────────────────────
  const register = async ({ userId, password, name, address, shop }) => {
    const { found } = await checkUserId(userId.trim());
    if (found && Object.keys(found).length > 0) {
      return {
        success: false,
        message: "Account already exists. Please log in.",
      };
    }
    const reqBody = {
      id: Date.now(),
      email: userId.trim(),
      password,
      name: name.trim(),
      address: address.trim(),
      role: "CUSTOMER",
      shopId: shop,
    };
    const resp = await apiLogin("/auth/v1/vmart/register", {
      body: reqBody,
    });
    //console.log("resp", resp);
    if (resp.success) {
      const found = resp.data.users;

      const userData = {
        id: found.id,
        email: found.users_email,
        mobile: found.users_cntno,
        name: found.users_cname,
        account: found.users_pname,
        address: found.users_addrs,
        role: found.users_crole,
        shopId: found.bsins_id,
      };

      setUser(userData);
      return {
        success: true,
        message: "Account created successfully",
        user: userData,
      };
    } else {
      return {
        success: false,
        message: resp.message,
        user: {},
      };
    }
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
