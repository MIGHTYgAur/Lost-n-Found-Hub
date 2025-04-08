import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
// Create the AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => useContext(AuthContext);

// AuthProvider component to wrap your app
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // To handle initial loading state
  const [user, setUser] = useState(null); // To store user information
  // Check login state on component mount

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/me', {
          withCredentials: true, // Sends cookies (like JWT) along with request
        });
  
        if (response.status === 200) {
          setIsLoggedIn(true);
          console.log('User is logged in:', response.data);
          setUser(response.data.user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsLoggedIn(false);
      } finally {
        setLoading(false);
      }
    };
  
    checkAuthStatus();
  }, []);
  
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };
  // Logout function
  const logout = async () => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/logout',
        {},
        { withCredentials: true } // Ensures cookies are sent with the request
      );
      if (response.status === 200) {
        setIsLoggedIn(false);
        setUser(null); // Clear user information on logout
        console.log('Logout successful');
      } else {
        console.error('Failed to logout');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};