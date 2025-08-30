import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => (location.pathname === path ? 'active' : '');

  const handleLogout = () => {
    logout();
    sessionStorage.removeItem('isLoggedIn');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/dashboard">
          <i className="fas fa-phone me-2"></i>
          AI Calling Agent
        </Link>
        {/* ... other nav items ... */}
        <ul className="navbar-nav me-auto">
          {/* ...existing nav items... */}
          <li className="nav-item">
            <Link
              className={`nav-link ${isActive('/ai-reminder')}`}
              to="/ai-reminder"
            >
              <i className="fas fa-bell me-1"></i>
              AI Reminder (Test)
            </Link>
          </li>
        </ul>
        {/* User dropdown ... */}
      </div>
    </nav>
  );
}

export default Navbar;
