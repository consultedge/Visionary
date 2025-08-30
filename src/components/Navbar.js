import React from "react";
import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;
  const linkStyle = (path) =>
    `px-3 py-2 rounded-md text-sm font-medium cursor-pointer ${
      isActive(path)
        ? "bg-yellow-400 text-black"
        : "text-white hover:bg-indigo-500 hover:text-white"
    }`;

  return (
    <nav className="bg-indigo-600 flex items-center justify-between p-4 shadow-md">
      <div className="text-white text-2xl font-bold">AI Calling Agent</div>
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className={linkStyle("/")}>
            Dashboard
          </Link>
        </li>
        <li>
          <Link to="/analytics" className={linkStyle("/analytics")}>
            Analytics
          </Link>
        </li>
        <li>
          <Link to="/call-management" className={linkStyle("/call-management")}>
            Call Management
          </Link>
        </li>
        <li>
          <Link to="/file-upload" className={linkStyle("/file-upload")}>
            File Upload
          </Link>
        </li>
        <li>
          <Link to="/settings" className={linkStyle("/settings")}>
            Settings
          </Link>
        </li>

        {/* 🔹 External redirect instead of internal route */}
        <li>
          <a
            href="https://ceg-uat-01.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-md text-sm font-medium text-white hover:bg-indigo-500 hover:text-white"
          >
            EMI Reminder
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
