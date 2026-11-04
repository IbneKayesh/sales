import { useCallback, useEffect, useState } from "react";
import { navigate } from "../../lib/router";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const STORAGE_KEY = "bankbase.sidebar.collapsed";

function readCollapsed() {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "true";
  } catch {
    return false;
  }
}

export function Layout({ page, activePath, children }) {
  const [collapsed, setCollapsed] = useState(readCollapsed);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(collapsed));
    } catch {
      // Storage can be unavailable (private mode) - the UI still works.
    }
  }, [collapsed]);

  const toggleSidebar = useCallback(() => {
    setCollapsed((current) => !current);
  }, []);

  return (
    <div className={`app-shell${collapsed ? " is-collapsed" : ""}`}>
      <Sidebar activePath={activePath} onNavigate={navigate} />
      <div className="app-main">
        <Topbar
          page={page}
          collapsed={collapsed}
          onToggleSidebar={toggleSidebar}
        />
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
