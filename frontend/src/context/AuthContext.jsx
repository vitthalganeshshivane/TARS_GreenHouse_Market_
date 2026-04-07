import { createContext, useState, useEffect } from "react";
import API from "../api/axios";
import { setToken, getToken, removeToken } from "../utils/token";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // login
  const login = async (formData) => {
    const { data } = await API.post("/auth/login", formData);
    setToken(data.token);
    setUser(data.user);
  };

  // logout
  const logout = () => {
    removeToken();
    setUser(null);
  };

  // signup
  const signup = async (formData) => {
    const { data } = await API.post("/auth/signup", formData);
    setToken(data.token);
    setUser(data.user);
  };

  // GET CURRENT USER
  const getProfile = async () => {
    try {
      const res = await API.get("/auth/me");
      setUser(res.data.user);
    } catch (err) {
      removeToken(); // invalid token cleanup
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (getToken) {
      getProfile();
    } else {
      setLoading(false);
    }
  }, []);
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, signup }}>
      {children}
    </AuthContext.Provider>
  );
};
