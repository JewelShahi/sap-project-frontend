import { createContext, useContext, useState, useEffect } from "react";
import api from "@/components/api/api";

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

  const logout = async (redirectPath = "/login") => {
    const access = localStorage.getItem("access");
    const refresh = localStorage.getItem("refresh");

    try {
      if (access && refresh) {
        await api.post(
          "/users/logout/",
          { refresh },
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${access}`,
            },
          }
        );
      }
    } catch (err) {
      console.error("Logout API error:", err.response?.data || err.message);
    } finally {
      localStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
      window.location.href = redirectPath;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setUser, login, logout, ready }}>
      {ready ? children : <div className="min-h-screen bg-base-100" />}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);