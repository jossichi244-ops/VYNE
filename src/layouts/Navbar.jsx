import React, { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Đảm bảo đúng đường dẫn
import "../styles/navbar.scss";

const CyberNavbar = () => {
  // ⚡ SỬA LỖI: Context của bạn chỉ cung cấp 'wallet', KHÔNG phải 'user'
  const { token, logout, wallet } = useContext(AuthContext);

  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ Sử dụng 'wallet' để xác định địa chỉ ví
  const walletAddress = token ? wallet : null;

  // ✅ Giả định username là địa chỉ ví rút gọn
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

  const navItems = [
    { name: "Dashboard", path: "/dashboard", requiresAuth: true },
    { name: "User List", path: "/", requiresAuth: false },
    { name: "Profile", path: "/profile", requiresAuth: true },
  ];

  return (
    <nav className="cyber-navbar">
      {/* Logo/Tên dự án */}
      <NavLink to="/" className="navbar-logo">
        <span className="logo-main">DECENTRAL</span>
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
        {token && wallet ? ( // Kiểm tra cả token và wallet
          <>
            <div
              className="wallet-indicator"
              onClick={() => navigate("/profile")}
              title={walletAddress}>
              <span className="status-dot-nav"></span>
              {/* Hiển thị địa chỉ ví rút gọn */}
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
          {/* Thay thế bằng Icon Menu thực tế */}
          {isMenuOpen ? "" : ""}
        </button>
      </div>
    </nav>
  );
};

export default CyberNavbar;
