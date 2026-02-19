import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import { AuthProvider, useAuth } from "./hooks/useAuth.jsx";
import { ToastProvider } from "./hooks/useToast.jsx";

//internal imports
import LandingPage from "./pages/LandingPage";
import Layout from "./pages/layout/Layout.jsx";
import HomePage from "./pages/HomePage.jsx";
import ModulePage from "./pages/ModulePage.jsx";
//auth
import AuthPage from "./pages/auth/AuthPage";

// mobile imports
import MobileLayout from "./mobile/layout";
import MobileHome from "./mobile/home";
import MobileAbout from "./mobile/about";
import MobileMenus from "./mobile/menus";
import MobileSample from "./mobile/sample";

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </ToastProvider>
  );
}

function AppRoutes() {
  const { user, isMobileView } = useAuth();

  if (isMobileView) {
    return (
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<MobileHome />} />
            <Route path="/home" element={<MobileHome />} />
            <Route path="/menus" element={<MobileMenus />} />
            <Route path="/sample" element={<MobileSample />} />
            <Route path="/about" element={<MobileAbout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </MobileLayout>
      </Router>
    );
  }

  return (
    <Router>
      <div style={{ position: "relative" }}>
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
            <Route index element={<HomePage />} />
            <Route path="module" element={<ModulePage />} />
            //auth
            <Route path="*" element={<Navigate to="/home" replace />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
