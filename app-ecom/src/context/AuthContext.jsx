import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: 'guest-' + Date.now(),
    name: 'Guest User',
    email: null,
    isGuest: true
  });

  const isAuthenticated = user && !user.isGuest;
  const isGuest = user?.isGuest || true;

  const updateUser = useCallback((userData) => {
    setUser(prev => ({
      ...prev,
      ...userData,
      isGuest: false
    }));
  }, []);

  const clearSession = useCallback(() => {
    setUser({
      id: 'guest-' + Date.now(),
      name: 'Guest User',
      email: null,
      isGuest: true
    });
  }, []);

  const value = {
    user,
    setUser: updateUser,
    isAuthenticated,
    isGuest,
    clearSession
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
