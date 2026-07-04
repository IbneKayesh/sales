import { STATUS_COLORS } from "@/hooks/useVmartData";
import "./shared.css";

const StatusBadge = ({ status, className = "" }) => {
  const style = STATUS_COLORS[status] || { bg: "#f1f5f9", color: "#64748b" };
  return (
    <span
      className={`ui-status-badge ${className}`}
      style={{ background: style.bg, color: style.color }}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
