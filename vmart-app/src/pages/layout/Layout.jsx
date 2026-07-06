import { useState } from "react";
import { Outlet } from "react-router-dom";
import heroImg from "../../assets/vite.svg";

import Topbar from "./Topbar";
import BottomBar from "./BottomBar";
import LeftFlyout from "./LeftFlyout";

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="phone">
        <LeftFlyout open={open} onClose={() => setOpen(false)} />

        <Topbar onMenu={() => setOpen(true)} />

        <main className="content">
          <Outlet />
        </main>

        <BottomBar />
      </div>
    </>
  );
}
