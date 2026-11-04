import { ChevronLeft, ChevronRight, Database } from "lucide-react";
import { Button } from "../ui/Button";

export function Topbar({ page, collapsed, onToggleSidebar }) {
  const Icon = page.icon;

  return (
    <header className="topbar">
      <Button
        variant="ghost"
        iconOnly
        className="topbar__toggle"
        onClick={onToggleSidebar}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
      </Button>

      <span className="topbar__icon">
        <Icon size={17} aria-hidden="true" />
      </span>
      <h1 className="topbar__title">{page.title}</h1>
      <span className="topbar__subtitle">{page.subtitle}</span>
      <span className="topbar__spacer" />
      <span className="storage-chip">
        <Database size={13} aria-hidden="true" />
        Local JSON files
      </span>
    </header>
  );
}
