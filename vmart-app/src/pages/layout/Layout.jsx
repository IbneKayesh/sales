import { useRef, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Topbar from "./Topbar";
import BottomBar from "./BottomBar";
import LeftFlyout from "./LeftFlyout";

export default function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const mainRef = useRef(null);

  /* Scroll to top on every route change */
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="app-shell">
      <LeftFlyout open={open} onClose={() => setOpen(false)} />
      <Topbar onMenu={() => setOpen(true)} />
      <main className="app-main" ref={mainRef}>
        <Outlet />
      </main>
      <BottomBar />
    </div>
  );
}
