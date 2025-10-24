import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import AllFiles from "./pages/AllFiles";
import SharedFileView from "./pages/SharedFileView";
import StarredPage from "./pages/StarredPage";
import RecycleBinPage from "./pages/RecycleBinPage";
import SettingsPage from "./pages/SettingsPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function Layout({ children }) {
  const location = useLocation();
  const hideSidebar = ["/login", "/signup"].includes(location.pathname); // hide on login/signup

  return (
    <div className="flex min-h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 p-6 overflow-y-auto">{children}</main>
    </div>
  );
}
  
export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/"
            element={isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 🔒 Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/files"
            element={
              <ProtectedRoute>
                <AllFiles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shared"
            element={
              <ProtectedRoute>
                <SharedFileView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/starred"
            element={
              <ProtectedRoute>
                <StarredPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recycle"
            element={
              <ProtectedRoute>
                <RecycleBinPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}