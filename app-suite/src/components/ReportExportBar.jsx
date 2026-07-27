import { IconDownload, IconPrint } from "@/icons";
import Button from "@/components/Button";

/**
 * ReportExportBar - A toolbar with Print and Export CSV buttons for report tabs
 *
 * Props:
 *   onPrint      - Function to call when Print is clicked
 *   onExportCSV  - Function to call when Export CSV is clicked
 *   isDisabled   - Disable buttons (e.g. while loading)
 *   compact      - Show smaller buttons (for inline use)
 */
const ReportExportBar = ({ onPrint, onExportCSV, isDisabled = false, compact = false }) => {
  if (!onPrint && !onExportCSV) return null;

  return (
    <div
      className="report-export-bar"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: compact ? "4px 0" : "8px 0",
        borderBottom: compact ? "none" : "1px solid var(--border-light)",
        marginBottom: compact ? 8 : 12,
      }}
    >
      <span
        style={{
          fontSize: "0.75rem",
          color: "var(--text-muted)",
          marginRight: "auto",
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        Export Options
      </span>

      {onExportCSV && (
        <Button
          variant="secondary"
          size={compact ? "sm" : "sm"}
          onClick={onExportCSV}
          disabled={isDisabled}
          title="Export as CSV"
        >
          <IconDownload size={14} className="icon-left" />
          Export CSV
        </Button>
      )}

      {onPrint && (
        <Button
          variant="secondary"
          size={compact ? "sm" : "sm"}
          onClick={onPrint}
          disabled={isDisabled}
          title="Print / Save as PDF"
        >
          <IconPrint size={14} className="icon-left" />
          Print
        </Button>
      )}
    </div>
  );
};

export default ReportExportBar;
