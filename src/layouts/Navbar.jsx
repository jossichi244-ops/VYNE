import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FiGrid,
  FiUsers,
  FiUser,
  FiPlusSquare,
  FiLogOut,
  FiMenu,
  FiX,
  FiTruck,
  FiAirplay,
  FiZap,
} from "react-icons/fi";
import "../styles/navbar.scss";

const Navbar = () => {
  const { token, logout, wallet } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const walletAddress = token && wallet ? wallet : null;
  const username = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "Guest";

  const handleConnectWallet = () => {
    token ? navigate("/profile") : navigate("/login");
  };

  // ✅ Cập nhật navItems tích hợp OrderIntakeConsole
  const navItems = [
    { name: "Dashboard", path: "/dashboard", requiresAuth: true, icon: FiGrid },
    {
      name: "Orders Intake",
      path: "/orders/intake",
      // requiresAuth: true,
      icon: FiPlusSquare,
    },
    {
      name: "CSE",
      path: "/carrier-control",
      // requiresAuth: true,
      icon: FiAirplay,
    },
    {
      name: "Delivery Promise", // ✅ Thêm mục Checkout/Promise vào đây
      path: "/checkout",
      requiresAuth: false,
      icon: FiTruck,
    },
    {
      name: "Execution Centre",
      path: "/execution",
      requiresAuth: false,
      icon: FiZap,
    },
    { name: "User List", path: "/", requiresAuth: false, icon: FiUsers },
    { name: "Profile", path: "/profile", requiresAuth: true, icon: FiUser },
  ];

  return (
    <nav className="cyber-navbar-container">
      <div className="navbar-glow-line"></div>

      <div className="navbar-content">
        {/* Logo Section */}
        <NavLink to="/" className="navbar-logo">
          <div className="logo-hex">
            <img
              src="https://res.cloudinary.com/dgpbxb8dq/image/upload/v1755786774/ChatGPT_Image_May_25__2025__10_03_19_PM-removebg-preview_auiivy.png"
              alt="VYNE Logo"
            />
          </div>
          <span className="logo-text">
            VYNE<span className="text-cyan">CORE</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${isMenuOpen ? "is-open" : ""}`}>
          {navItems.map((item) =>
            item.requiresAuth && !token ? null : (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
                onClick={() => setIsMenuOpen(false)}>
                <item.icon className="nav-icon" />
                <span className="nav-text">{item.name}</span>
                <div className="active-glow"></div>
              </NavLink>
            ),
          )}
        </div>

        {/* Action Controls */}
        <div className="navbar-actions">
          {walletAddress ? (
            <div className="user-profile-group">
              <div className="wallet-pill" onClick={() => navigate("/profile")}>
                <div className="status-indicator">
                  <div className="pulse-dot"></div>
                </div>
                <span className="wallet-address">{username}</span>
              </div>
              <button
                className="logout-icon-btn"
                onClick={logout}
                title="Disconnect">
                <FiLogOut />
              </button>
            </div>
          ) : (
            <button
              className="connect-wallet-btn"
              onClick={handleConnectWallet}>
              <div className="btn-shimmer"></div>
              <span>CONNECT WALLET</span>
            </button>
          )}

          {/* Mobile Toggle */}
          <button
            className="mobile-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
