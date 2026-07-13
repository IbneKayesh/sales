import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import DesktopLayout from './layouts/DesktopLayout/DesktopLayout';
import LoginPage from './pages/LoginPage';
import FilesPage from './pages/FilesPage';
import GalleryPage from './pages/GalleryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DesktopLayout />}>
              <Route path="/" element={null} />
              <Route path="/files" element={<FilesPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/sales" element={null} />
              <Route path="/documents" element={null} />
              <Route path="/trash" element={null} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
