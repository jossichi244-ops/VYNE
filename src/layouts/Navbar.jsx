import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/navbar.scss";

const CyberNavbar = () => {
  const { token, logout, wallet } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ⚡ Xác định walletAddress và username an toàn
  const walletAddress = token && wallet ? wallet : null;
  const username = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(
        walletAddress.length - 4
      )}`
    : "Guest";

  const handleConnectWallet = () => {
    if (token) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  // ✅ Chỉ khai báo navItems 1 lần, ngoài render
  const navItems = [
    { name: "Dashboard", path: "/dashboard", requiresAuth: true },
    { name: "User List", path: "/", requiresAuth: false },
    { name: "Profile", path: "/profile", requiresAuth: true },
    { name: "Tạo Đơn Hàng", path: "/orders/create", requiresAuth: true },
  ];

  return (
    <nav className="cyber-navbar">
      {/* Logo/Tên dự án */}
      <NavLink to="/" className="navbar-logo">
        <span className="logo-main">VYNE</span>
        <span className="logo-glow">APP</span>
      </NavLink>

      {/* Menu cho Desktop */}
      <div className={`navbar-links ${isMenuOpen ? "open" : ""}`}>
        {navItems.map((item) =>
          item.requiresAuth && !token ? null : (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                isActive ? "nav-item active-link" : "nav-item"
              }
              onClick={() => setIsMenuOpen(false)}>
              {item.name}
            </NavLink>
          )
        )}
      </div>

      {/* Hành động & Nút Connect Wallet */}
      <div className="navbar-actions">
        {walletAddress ? (
          <>
            <div
              className="wallet-indicator"
              onClick={() => navigate("/profile")}
              title={walletAddress}>
              <span className="status-dot-nav"></span>
              <span className="wallet-name">{username}</span>
            </div>
            <button className="action-button disconnect-glow" onClick={logout}>
              Disconnect
            </button>
          </>
        ) : (
          <button
            className="action-button connect-glow"
            onClick={handleConnectWallet}>
            Connect Wallet
          </button>
        )}

        {/* Nút Toggle cho Mobile */}
        <button
          className="menu-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {/* Icon Menu nếu cần */}
          {isMenuOpen ? "✖" : "☰"}
        </button>
      </div>
    </nav>
  );
};

export default CyberNavbar;
