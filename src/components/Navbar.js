import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.scss"; // Tạo file này nếu muốn style riêng

export default function Navbar() {
  return (
    <nav className="app-navbar">
      <ul>
        <li>
          <NavLink
            to="/upload"
            className={({ isActive }) => (isActive ? "active" : "")}>
            Upload
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/pipeline"
            className={({ isActive }) => (isActive ? "active" : "")}>
            Pipeline
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}
