// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("hirehub_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post("/v1/user/login", { email, password });

      if (!data.success) throw new Error(data.message || "Login failed");

      setUser(data.user);
      localStorage.setItem("hirehub_user", JSON.stringify(data.user));
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const register = async (fullname, email, password, role) => {
    try {
      const { data } = await api.post("/v1/user/register", { fullname, email, password, role });

      if (!data.success) throw new Error(data.message || "Register failed");

      setUser(data.user);
      localStorage.setItem("hirehub_user", JSON.stringify(data.user));
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hirehub_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
