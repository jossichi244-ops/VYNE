import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, AuthProvider } from "../context/AuthContext";
import Login from "../pages/LoginPage";
import Dashboard from "../pages/Dashboard";
import UserProfilePage from "../pages/UserProfilePage";
import UserDashboardPage from "../pages/UserDashboardPage";
import MainLayout from "../layouts/MainLayout";
const ProtectedRoute = ({ children }) => {
  const { token } = useContext(AuthContext);
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

// ✅ Router chính của ứng dụng
const AppRoutes = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <UserProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              <MainLayout>
                <UserDashboardPage />
              </MainLayout>
            }
          />

          <Route path="*" element={<h2>404 - Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default AppRoutes;
