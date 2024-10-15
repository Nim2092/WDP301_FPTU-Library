import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const isTokenExpired = (token) => {
  const decodedToken = jwtDecode(token);
  if (decodedToken.exp * 1000 < Date.now()) {
    return true;
  }
  return false;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("accessToken"));

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !isTokenExpired(token)) {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ ...decodedToken });
        setToken(token);
      } catch (error) {
        console.error("Error decoding token", error);
        logout();
      }
    } else {
      logout();
    }
  }, []);

  const login = (token) => {
    return new Promise((resolve, reject) => {
      try {
        const decodedToken = jwtDecode(token);
        setUser({ ...decodedToken });
        localStorage.setItem("accessToken", token);
        setToken(token);
        resolve();
      } catch (error) {
        console.error("Error decoding token", error);
        reject(error);
      }
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("accessToken");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
