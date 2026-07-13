import { Outlet } from "react-router-dom";

import AppBar from "./AppBar";

const DesktopUI = () => {
  return (
    <div className="desktop-ui">
      <AppBar />
      <Outlet />
    </div>
  );
};
export default DesktopUI;
