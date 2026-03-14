import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { AppUIProvider } from "./hooks/useAppUI.jsx";
import LoadingSpinner from "@/components/common/LoadingSpinner";

// --- Layout Imports (Static) ---
import Layout from "./pages/layout/Layout.jsx";
import MobileLayout from "./mobile/layout";

// Routes list
import AppRoutesList from "./routes";

// Core Pages (needed for main Routes)
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const AuthPage = React.lazy(() => import("./pages/auth/AuthPage"));

// Mobile Specific
const MobileHome = React.lazy(() => import("./mobile/home"));
const MobileAbout = React.lazy(() => import("./mobile/about"));
const MobileMenus = React.lazy(() => import("./mobile/menus"));
const MobileSample = React.lazy(() => import("./mobile/sample"));

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
  const { user, isMobileView } = useAuth();

  if (isMobileView) {
    return (
      <Router>
        <MobileLayout>
          <React.Suspense
            fallback={
              <LoadingSpinner
                fullScreen
                message="Loading..."
                subMessage="Setting up your experience"
              />
            }
          >
            <Routes>
              <Route path="/" element={<MobileHome />} />
              <Route path="/home" element={<MobileHome />} />
              <Route path="/menus" element={<MobileMenus />} />
              <Route path="/sample" element={<MobileSample />} />
              <Route path="/about" element={<MobileAbout />} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          </React.Suspense>
        </MobileLayout>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ position: "relative" }}>
        <React.Suspense
          fallback={
            <LoadingSpinner
              fullScreen
              message="Loading..."
              subMessage="Preparing your page"
            />
          }
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route
              path="/login"
              element={
                user ? <Navigate to="/home" /> : <AuthPage defComp="login" />
              }
            />
            <Route
              path="/home"
              element={user ? <Layout /> : <Navigate to="/login" />}
            >
              {AppRoutesList}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Route>
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Routes>
        </React.Suspense>
      </div>
    </Router>
  );
}

export default App;
