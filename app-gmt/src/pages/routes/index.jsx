import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../HomePage';
import DemoPage from '../demo/DemoPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/demo" element={<DemoPage />} />
      {/* Add more routes here as needed */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
};

export default AppRoutes;