import React from "react";
import { useNavigate } from "react-router-dom";
import { useModule, MODULES } from "../context/ModuleContext";
import { ArrowRight } from "lucide-react";

const ModulePage = () => {
  const { selectModule } = useModule();
  const navigate = useNavigate();

  const handleModuleClick = (mod) => {
    selectModule(mod.id);
    navigate("/");
  };

  return (
    <div className="page-container">
      <div className="lite-card-empty">
        <h2 className="lite-card-title">Modules</h2>
        <p className="lite-card-subtitle">Select a module to get started</p>
      </div>

      <div className="lite-card-module-container">
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => handleModuleClick(mod)}
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
              className="lite-card-module-button"
            >
              {/* Icon Chip */}
              <div
                style={{
                  background: mod.bg,
                }}
                className="lite-card-module-icon-chip"
              >
                <Icon size={24} color={mod.color} />
              </div>

              {/* Text */}
              <div className="lite-card-module-content">
                <div className="lite-card-module-title">{mod.label}</div>
                <div className="lite-card-module-description">
                  {mod.description}
                </div>
                <div className="lite-card-module-tags">
                  {mod.menus.slice(0, 3).map((menu) => (
                    <span
                      key={menu.label}
                      style={{
                        background: mod.bg,
                        color: mod.color,
                      }}
                      className="lite-card-module-tag"
                    >
                      {menu.label}
                    </span>
                  ))}
                  {mod.menus.length > 3 && (
                    <span className="lite-card-module-more">
                      +{mod.menus.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              <ArrowRight size={18} color="var(--text-secondary)" />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ModulePage;
