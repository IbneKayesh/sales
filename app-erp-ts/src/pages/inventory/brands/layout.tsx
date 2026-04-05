import React from "react";
import { Outlet } from "react-router-dom";

const BrandLayout: React.FC = () => {
  return (
    <div className="p-4">
      <Outlet />
    </div>
  );
};

export default BrandLayout;
