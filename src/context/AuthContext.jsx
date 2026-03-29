import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem("access");
      const storedUser = localStorage.getItem("user");
      
      if (token && storedUser) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error("Failed to parse stored user", e);
          localStorage.clear();
        }
      }
      setReady(true);
    };

    initializeAuth();
  }, []);

  const login = (tokens, userData) => {
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    localStorage.setItem("user", JSON.stringify(userData));
    
    setUser(userData);
    setIsAuthenticated(true);
  };

  const logout = (redirectPath = "/login") => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    // Use window.location for a hard reset to clear all states
    window.location.href = redirectPath;
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout, ready }}>
      {/* We wait for 'ready' to avoid flickering or false redirects */}
      {ready ? children : <div className="min-h-screen bg-base-100" />} 
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);