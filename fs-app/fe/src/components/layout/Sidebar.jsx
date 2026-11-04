import { Database } from "lucide-react";
import { NAV_SECTIONS } from "../../app/navigation";

export function Sidebar({ activePath, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="brand-mark" aria-hidden="true">
          <Database size={18} />
        </span>
        <span className="brand-text">
          <span className="brand-title">BankBase</span>
          <span className="brand-subtitle">Accounts Manager</span>
        </span>
      </div>

      <nav className="sidebar__nav" aria-label="Main navigation">
        {NAV_SECTIONS.map((section) => (
          <div key={section.label} className="nav__section">
            <div className="nav__label">{section.label}</div>

            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePath === item.path;

              return (
                <a
                  key={item.id}
                  href={item.path}
                  title={item.label}
                  className={`nav__item${isActive ? " is-active" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.path);
                  }}
                >
                  <span className="nav__icon">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <span className="nav__text">{item.label}</span>
                </a>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="sidebar__footer">
        <Database size={13} aria-hidden="true" />
        <span>Local JSON files</span>
      </div>
    </aside>
  );
}
