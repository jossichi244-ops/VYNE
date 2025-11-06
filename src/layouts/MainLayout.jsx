// /src/layouts/MainLayout.jsx
import React from "react";
import CyberNavbar from "./Navbar";

const MainLayout = ({ children }) => {
  return (
    <div className="app-container-layout">
      <CyberNavbar />

      <main className="main-content-area">{children}</main>
    </div>
  );
};

export default MainLayout;
