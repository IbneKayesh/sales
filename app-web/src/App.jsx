import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";

import { AppUIProvider } from "@/hooks/useAppUI.jsx";
import { AuthProvider, useAuth } from "@/hooks/useAuth.jsx";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Layout from "@/pages/layout/Layout.jsx";
// Routes list
const HomePage = React.lazy(() => import("./pages/HomePage"));
const LoginPage = React.lazy(() => import("./pages/auth/LoginPage"));
const LoginPopup = React.lazy(() => import("./pages/auth/LoginPopup"));

import AppRoutesList from "./routes";



function App() {
  return (
    <AppUIProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </AppUIProvider>
  );
}

function AppRoutes() {
  const { user, loading, showLoginPopup, setShowLoginPopup } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div
      className="app-container"
      style={{ minHeight: "100vh", backgroundColor: "var(--bg-main)" }}
    >     
      <Router>
        <React.Suspense fallback={<LoadingSpinner />}>
          <LoginPopup
            visible={showLoginPopup}
            onHide={() => setShowLoginPopup(false)}
          />
          <Routes>
            <Route
              path="/login"
              element={user ? <Navigate to="/" /> : <LoginPage />}
            />
            <Route
              path="/"
              element={user ? <Layout /> : <Navigate to="/login" />}
            >
              <Route index element={<HomePage />} />
              {AppRoutesList}
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </div>
  );
}

export default App;
