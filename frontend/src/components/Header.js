// src/components/Header.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add this
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail"); // check login status

  const handleLogout = () => {
    localStorage.removeItem("userEmail"); // remove login info
    navigate("/auth"); // redirect to home page
  };
  return (
    <header className="main-header">
      <div className="logo-section">
        <img
          src="TNMC.png"
          alt="Logo"
          className="logo"
        />
        <h1>Greater Nellai Corporation</h1>
      </div>
      <nav className="nav-links">
        <a href="/home">Home</a>
        <a href="/message">Feedback</a>
        {/* Single Login/Register Button */}
        <Link
          to="/auth?mode=user"
          className="auth-btn"
          style={{
            marginLeft: '10px',
            padding: '6px 12px',
            backgroundColor: '#007BFF',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Login / Register
        </Link>
        {/* Logout button if logged in */}
        {userEmail && (
          <button
            onClick={handleLogout}
            style={{
              marginLeft: '10px',
              padding: '6px 12px',
              backgroundColor: '#FF4136',
              color: '#fff',
              borderRadius: '5px',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Logout
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
