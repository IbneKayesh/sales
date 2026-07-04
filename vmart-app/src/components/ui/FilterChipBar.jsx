import { STATUS_COLORS } from "@/hooks/useVmartData";
import "./shared.css";

const FilterChipBar = ({ options, value, onChange, useStatusColors = false }) => (
  <div className="ui-filter-strip">
    {options.map((opt) => {
      const active = value === opt.value;
      const statusStyle = useStatusColors ? STATUS_COLORS[opt.value] : null;
      return (
        <button
          key={opt.value ?? opt.label}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`ui-filter-chip ${active ? "active" : ""}`}
          style={
            active
              ? {
                  background: statusStyle?.color || "var(--primary)",
                  borderColor: statusStyle?.color || "var(--primary)",
                }
              : statusStyle
                ? { color: statusStyle.color, borderColor: statusStyle.color }
                : undefined
          }
        >
          {opt.label}
        </button>
      );
    })}
  </div>
);

export default FilterChipBar;
