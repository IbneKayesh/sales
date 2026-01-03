import { useState, useEffect, createContext, useContext } from 'react';
import { authAPI } from '@/api/authAPI';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (from localStorage for now, can be improved with tokens later)
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (userEmail, userPassword) => {
    try {
      //console.log(userEmail, userPassword)
      const reqBody = {
        user_email: userEmail,
        user_password: userPassword
      }
      const response = await authAPI.login(reqBody);
      if (response.success) {
        console.log("response " + JSON.stringify(response))
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    localStorage.removeItem('user');
  };

  const register = async (register) => {
    try {
      //console.log(username, password)
      const { shopName, userEmail, userPassword } = register;
      const reqBody = {
        shop_name: shopName,
        user_email: userEmail,
        user_password: userPassword
      }
      const response = await authAPI.register(reqBody);
      if (response.success) {
        console.log("response " + JSON.stringify(response))
        setUser(response.user);
        localStorage.setItem('user', JSON.stringify(response.user));
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: 'Login failed' };
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};