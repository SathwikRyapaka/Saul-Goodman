import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock login
    setIsAuthenticated(true);
    setUser({ name: 'Arjun Rao', email: email || 'user@example.com', id: '1' });
  };

  const loginAsGuest = () => {
    setIsAuthenticated(true);
    setUser({ name: 'Guest User', email: 'guest@example.com', id: 'guest' });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
