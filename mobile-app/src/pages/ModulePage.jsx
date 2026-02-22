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
    <div className="app-content">
      <div style={{ padding: "16px 12px 8px" }}>
        <h2
          style={{
            margin: "0 0 4px",
            fontSize: "20px",
            color: "var(--on-background)",
          }}
        >
          Modules
        </h2>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "var(--text-secondary)",
          }}
        >
          Select a module to get started
        </p>
      </div>

      <div
        style={{
          padding: "8px 12px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {MODULES.map((mod) => {
          const Icon = mod.icon;
          return (
            <button
              key={mod.id}
              onClick={() => handleModuleClick(mod)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "14px",
                padding: "14px",
                cursor: "pointer",
                width: "100%",
                textAlign: "left",
                boxShadow: "var(--shadow)",
                transition: "transform 0.15s, box-shadow 0.15s",
              }}
              onMouseDown={(e) =>
                (e.currentTarget.style.transform = "scale(0.98)")
              }
              onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {/* Icon Chip */}
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: mod.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Icon size={24} color={mod.color} />
              </div>

              {/* Text */}
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: "15px",
                    color: "var(--on-surface)",
                  }}
                >
                  {mod.label}
                </div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "var(--text-secondary)",
                    marginTop: "2px",
                  }}
                >
                  {mod.description}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "6px",
                    marginTop: "8px",
                    flexWrap: "wrap",
                  }}
                >
                  {mod.menus.slice(0, 3).map((menu) => (
                    <span
                      key={menu.label}
                      style={{
                        fontSize: "10px",
                        background: mod.bg,
                        color: mod.color,
                        borderRadius: "6px",
                        padding: "2px 8px",
                        fontWeight: 600,
                      }}
                    >
                      {menu.label}
                    </span>
                  ))}
                  {mod.menus.length > 3 && (
                    <span
                      style={{
                        fontSize: "10px",
                        color: "var(--text-secondary)",
                        padding: "2px 0",
                      }}
                    >
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
