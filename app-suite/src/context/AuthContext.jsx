import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import avatarImg from '../assets/avatar.png';

const AuthContext = createContext();

const USERS_KEY = 'os_users';
const SESSION_KEY = 'os_current_session';

const defaultDemoUser = {
  id: 'demo-user-id',
  username: 'demo',
  password: 'demo123',
  displayName: 'Sarah Jenkins',
  email: 'sarah.jenkins@os.dev',
  avatar: null, // null = use default asset
  role: 'System Administrator',
  createdAt: '2026-01-01T00:00:00.000Z',
};

const loadUsers = () => {
  try {
    const stored = localStorage.getItem(USERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {
    // ignore
  }
  const initial = [defaultDemoUser];
  localStorage.setItem(USERS_KEY, JSON.stringify(initial));
  return initial;
};

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Strip password before storing in session
const sanitizeUser = (user) => {
  const { password, ...safe } = user;
  return safe;
};

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(loadUsers);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) {
        const parsed = JSON.parse(session);
        // Re-sync from the users db in case profile was updated
        const freshUsers = loadUsers();
        const found = freshUsers.find((u) => u.id === parsed.id);
        if (found) {
          setCurrentUser(sanitizeUser(found));
          setIsAuthenticated(true);
        }
      }
    } catch {
      // ignore
    }
    setLoading(false);
  }, []);

  const login = useCallback((usernameOrEmail, password) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const freshUsers = loadUsers();
        const user = freshUsers.find(
          (u) =>
            (u.username === usernameOrEmail || u.email === usernameOrEmail) &&
            u.password === password
        );
        if (user) {
          const safe = sanitizeUser(user);
          sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
          setCurrentUser(safe);
          setIsAuthenticated(true);
          setLoading(false);
          resolve(safe);
        } else {
          setLoading(false);
          reject(new Error('Invalid username or password'));
        }
      }, 900);
    });
  }, []);

  const register = useCallback(({ displayName, username, email, password }) => {
    setLoading(true);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const freshUsers = loadUsers();
        if (freshUsers.find((u) => u.username === username)) {
          setLoading(false);
          reject(new Error('Username is already taken'));
          return;
        }
        if (freshUsers.find((u) => u.email === email)) {
          setLoading(false);
          reject(new Error('Email address is already registered'));
          return;
        }
        const newUser = {
          id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          username,
          password,
          displayName,
          email,
          avatar: null,
          role: 'Standard User',
          createdAt: new Date().toISOString(),
        };
        const updated = [...freshUsers, newUser];
        saveUsers(updated);
        setUsers(updated);
        const safe = sanitizeUser(newUser);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
        setCurrentUser(safe);
        setIsAuthenticated(true);
        setLoading(false);
        resolve(safe);
      }, 900);
    });
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY);
    setCurrentUser(null);
    setIsAuthenticated(false);
  }, []);

  const updateProfile = useCallback((updates) => {
    if (!currentUser) return;
    const freshUsers = loadUsers();
    const updated = freshUsers.map((u) =>
      u.id === currentUser.id ? { ...u, ...updates } : u
    );
    saveUsers(updated);
    setUsers(updated);
    const updatedUser = updated.find((u) => u.id === currentUser.id);
    const safe = sanitizeUser(updatedUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safe));
    setCurrentUser(safe);
  }, [currentUser]);

  const changePassword = useCallback((currentPassword, newPassword) => {
    if (!currentUser) return Promise.reject(new Error('Not authenticated'));
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const freshUsers = loadUsers();
        const user = freshUsers.find((u) => u.id === currentUser.id);
        if (!user) {
          reject(new Error('User not found'));
          return;
        }
        if (user.password !== currentPassword) {
          reject(new Error('Current password is incorrect'));
          return;
        }
        const updated = freshUsers.map((u) =>
          u.id === currentUser.id ? { ...u, password: newPassword } : u
        );
        saveUsers(updated);
        setUsers(updated);
        resolve(true);
      }, 500);
    });
  }, [currentUser]);

  const deleteUser = useCallback((userId) => {
    const freshUsers = loadUsers();
    const filtered = freshUsers.filter((u) => u.id !== userId);
    if (filtered.length === freshUsers.length) return false; // user not found
    saveUsers(filtered);
    setUsers(filtered);
    return true;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        updateProfile,
        deleteUser,
        changePassword,
        defaultAvatarImg: avatarImg,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
