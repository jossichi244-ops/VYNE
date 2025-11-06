import React, { useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.scss";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginWithMetaMask, loading, token } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/profile");
    }
  }, [token, navigate]);

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>🚖 VYNE DApp Login</h1>
        <p>Đăng nhập bằng ví MetaMask của bạn</p>
        <button
          className="btn-metamask"
          onClick={loginWithMetaMask}
          disabled={loading}>
          {loading ? "Đang xử lý..." : "Kết nối MetaMask"}
        </button>
      </div>
    </div>
  );
};

export default Login;
