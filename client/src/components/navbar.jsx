import React, { useState } from 'react';
import { Shield, LogIn, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth

export default function Navbar() {
  const Navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth(); // Get login state and logout function
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8" />
            <span className="text-xl font-bold">Campus FindIt</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <a href="/" className="hover:text-blue-200 transition">Home</a>
            <a href="/report" className="hover:text-blue-200 transition">Report Item</a>
            <a href="/browse" className="hover:text-blue-200 transition">Browse Lost Items</a>
            <a href="/faq" className="hover:text-blue-200 transition">FAQ</a>

            {isLoggedIn ? (
              <button
                onClick={() => {
                  logout();
                  Navigate('/login');
                }}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center space-x-1 hover:bg-blue-100 transition"
              >
                <span>Logout</span>
              </button>
            ) : (
              <button
                onClick={() => Navigate('/login')}
                className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center space-x-1 hover:bg-blue-100 transition"
              >
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-blue-600 px-4 py-2 pb-4">
            <div className="flex flex-col space-y-3">
              <a href="/" className="hover:text-blue-200 transition py-1">Home</a>
              <a href="/report" className="hover:text-blue-200 transition py-1">Report Item</a>
              <a href="/browse" className="hover:text-blue-200 transition py-1">Browse Lost Items</a>
              <a href="/faq" className="hover:text-blue-200 transition py-1">FAQ</a>
              {isLoggedIn ? (
                <button
                  onClick={() => {
                    logout();
                    Navigate('/login');
                  }}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-1 hover:bg-blue-100 transition"
                >
                  <span>Logout</span>
                </button>
              ) : (
                <button
                  onClick={() => Navigate('/login')}
                  className="bg-white text-blue-600 px-4 py-2 rounded-md font-medium flex items-center justify-center space-x-1 hover:bg-blue-100 transition"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}