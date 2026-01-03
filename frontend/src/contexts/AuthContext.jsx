import { createContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";
import APP_CONFIG from "../config/app.config";

export const headeAuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(APP_CONFIG.storageKeys.token);
    const storedUser = localStorage.getItem(APP_CONFIG.storageKeys.user);

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem(APP_CONFIG.storageKeys.token, token);
      localStorage.setItem(APP_CONFIG.storageKeys.user, JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      const { user, token } = response.data;

      setUser(user);
      setToken(token);
      localStorage.setItem(APP_CONFIG.storageKeys.token, token);
      localStorage.setItem(APP_CONFIG.storageKeys.user, JSON.stringify(user));

      return { success: true, user };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(APP_CONFIG.storageKeys.token);
    localStorage.removeItem(APP_CONFIG.storageKeys.user);
  };

  const isAuthenticated = () => !!token;
  const isCitizen = () => user?.type === "citizen";
  const isAuthority = () => user?.type === "authority";

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    isAuthenticated,
    isCitizen,
    isAuthority,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
