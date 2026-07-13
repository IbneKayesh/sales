import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);

// Mock user database
const MOCK_USERS = [
  { username: 'admin', password: 'admin123', name: 'Admin User', role: 'System Manager', avatar: 'AD' },
  { username: 'manager', password: 'manager123', name: 'Sarah Manager', role: 'Operations Manager', avatar: 'SM' },
  { username: 'staff', password: 'staff123', name: 'John Staff', role: 'Inventory Staff', avatar: 'JS' },
];

// Role-based permissions
const ROLE_PERMISSIONS = {
  'System Manager': {
    routes: ['/', '/sales', '/sales/create', '/sales/returns', '/purchase', '/purchase/create', '/inventory', '/inventory/categories', '/reports', '/hr', '/accounting', '/crm', '/manufacturing', '/projects', '/supplychain', '/assets', '/settings', '/demo/modals'],
    permissions: ['read', 'write', 'delete', 'manage-users'],
  },
  'Operations Manager': {
    routes: ['/', '/sales', '/sales/create', '/sales/returns', '/purchase', '/purchase/create', '/inventory', '/inventory/categories', '/hr', '/crm', '/projects'],
    permissions: ['read', 'write'],
  },
  'Inventory Staff': {
    routes: ['/', '/inventory', '/inventory/categories', '/manufacturing', '/supplychain'],
    permissions: ['read', 'write'],
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (username, password) => {
    setLoading(true);
    setError(null);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const found = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      setLoading(false);
      return { success: true };
    } else {
      setError('Invalid username or password');
      setLoading(false);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const hasPermission = useCallback((permission) => {
    if (!user) return false;
    const rolePerms = ROLE_PERMISSIONS[user.role];
    if (!rolePerms) return false;
    return rolePerms.permissions.includes(permission);
  }, [user]);

  const canAccessRoute = useCallback((path) => {
    if (!user) return false;
    const rolePerms = ROLE_PERMISSIONS[user.role];
    if (!rolePerms) return false;
    return rolePerms.routes.includes(path);
  }, [user]);

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
    hasPermission,
    canAccessRoute,
    clearError: () => setError(null),
  }), [user, loading, error, login, logout, hasPermission, canAccessRoute]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
