import { useState } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import TableColumns from "@/components/common/TableColumns";
import { tabColumnsAPI } from "@/api/M01/tabColumnsAPI.js";
import { getStorageLoginData, setStorageLoginData } from "@/utils/storage";
import { useUI } from "@/context/AppUIContext.jsx";
import {
  IconBox,
  IconPurchase,
  IconSettings,
  IconChevronRight,
  IconClose,
} from "@/icons";

/* ─── Setup groups: Module > Group > Option ───────────────────── */

const mrrItemsDefaultColumns = [
  { label: "Discount", key: "mrrdc_dsamt", value: true },
  { label: "iVAT", key: "mrrdc_ivpct", value: true },
  { label: "VAT", key: "mrrdc_vtpct", value: true },
  { label: "TAX", key: "mrrdc_txpct", value: true },
  { label: "Fix Cost", key: "mrrdc_fcpct", value: true },
  { label: "Other Cost", key: "mrrdc_icamt", value: true },
  { label: "Unit Cost", key: "mrrdc_csrat", value: true },
];

const setupGroups = [
  {
    id: "G01",
    name: "MRR",
    icon: "Purchase",
    color: "#06b6d4",
    order: 1,
    options: [
      {
        id: "M01-G01-O001",
        name: "Items",
        icon: "Box",
        color: "#06b6d4",
        order: 1,
        tabcl_cname: "SYS_MRR_DIRECT",
        defaultColumns: mrrItemsDefaultColumns,
        desc: "Configure visible columns in the MRR Items list",
      },
    ],
  },
];

const STORAGE_PREFIX = "SYS_TAB_COLUMNS_";

const iconMap = {
  Box: IconBox,
  Purchase: IconPurchase,
  Settings: IconSettings,
};

const resolveIcon = (name, size = 18) => {
  const Icon = iconMap[name];
  return Icon ? <Icon size={size} /> : null;
};

/** Normalize API / storage rows into the { key, label, value } shape TableColumns expects */
const normalizeColumns = (list) =>
  (Array.isArray(list) ? list : [])
    .map((c) => ({
      key: c?.key ?? c?.tabcl_key ?? c?.col_key,
      label: c?.label ?? c?.tabcl_label ?? c?.col_label,
      value: c?.value ?? c?.tabcl_value ?? true,
    }))
    .filter((c) => c.key && c.label);

const searchWrapStyles = {
  wrap: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    width: "100%",
    maxWidth: 320,
  },
  input: {
    width: "100%",
    padding: "8px 32px 8px 12px",
    borderRadius: 8,
    border: "1px solid var(--border, #e0e0e0)",
    background: "var(--surface, #fff)",
    color: "var(--text, #111)",
    fontSize: 14,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  clear: {
    position: "absolute",
    right: 8,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    cursor: "pointer",
    padding: 4,
    color: "var(--text-muted, #888)",
    fontSize: 14,
    lineHeight: 1,
  },
};

const SetupPage = () => {
  const { showToast } = useUI();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeOption, setActiveOption] = useState(null);
  const [columnsByOption, setColumnsByOption] = useState({});
  const [dirty, setDirty] = useState(false);

  const applyDefaults = (option) =>
    option.defaultColumns.map((c) => ({ ...c }));

  const handleOptionClick = async (option) => {
    setActiveOption(option);
    setDirty(false);
    // Show the defaults immediately so the popup never opens empty,
    // then replace with the saved config when it arrives.
    setColumnsByOption((prev) => ({
      ...prev,
      [option.id]: applyDefaults(option),
    }));
    try {
      // Server-side config first, then local storage, then built-in defaults
      const resp = await tabColumnsAPI.getAll({
        tabcl_cname: option.tabcl_cname,
      });
      let columns = normalizeColumns(resp?.data);
      if (!columns.length) {
        columns = normalizeColumns(
          getStorageLoginData()?.[STORAGE_PREFIX + option.tabcl_cname],
        );
      }
      if (columns.length) {
        setColumnsByOption((prev) => ({
          ...prev,
          [option.id]: columns,
        }));
      }
    } catch {
      /* defaults already applied */
    }
  };

  const handleColumnsChange = (next) => {
    if (!activeOption) return;
    setColumnsByOption((prev) => ({ ...prev, [activeOption.id]: next }));
    setDirty(true);
    // Persist locally — storage writes are handled here (SetupPage)
    setStorageLoginData({
      [STORAGE_PREFIX + activeOption.tabcl_cname]: next,
    });
    // Best-effort server sync so other screens (e.g. the MRR Items list)
    // pick up the same configuration.
    tabColumnsAPI.update({
      tabcl_cname: activeOption.tabcl_cname,
      columns: next,
    });
  };

  const handleCloseColumns = () => {
    if (activeOption && dirty) {
      showToast("Column settings saved", { type: "success" });
    }
    setActiveOption(null);
    setDirty(false);
  };

  // Config shown in the popup belongs to the active option
  const cfColumns = activeOption ? columnsByOption[activeOption.id] || [] : [];
  const defaultCfColumns = activeOption ? applyDefaults(activeOption) : [];

  const searchLC = searchQuery.trim().toLowerCase();
  const isSearching = searchLC.length > 0;
  const visibleGroups = setupGroups
    .map((g) => ({
      ...g,
      options: g.options
        .filter((o) => o.name.toLowerCase().includes(searchLC))
        .sort((a, b) => a.order - b.order),
    }))
    .filter((g) => !isSearching || g.options.length > 0)
    .sort((a, b) => a.order - b.order);

  const totalOptions = setupGroups.reduce(
    (sum, g) => sum + g.options.length,
    0,
  );

  const optionMeta = (option) => {
    const saved = columnsByOption[option.id];
    if (saved && saved.length) {
      return {
        total: saved.length,
        visible: saved.filter((c) => c.value !== false).length,
      };
    }
    return {
      total: option.defaultColumns.length,
      visible: option.defaultColumns.filter((c) => c.value !== false).length,
    };
  };

  const OptionCard = ({ option }) => {
    const [hovered, setHovered] = useState(false);
    const meta = optionMeta(option);
    return (
      <button
        type="button"
        onClick={() => handleOptionClick(option)}
        title={`Configure ${option.name} columns`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "6px 8px",
          border: `1px solid ${hovered ? option.color + "40" : "var(--border)"}`,
          borderRadius: "var(--radius-xl)",
          background: hovered ? `${option.color}0d` : "var(--surface)",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          textAlign: "left",
          outline: "none",
          boxSizing: "border-box",
          transition: "all 0.15s ease",
          flex: "0 1 auto",
          minWidth: 260,
          boxShadow: hovered ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          transform: hovered ? "translateY(-1px)" : "none",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            background: `${option.color}18`,
            color: option.color,
            fontSize: 18,
          }}
        >
          {resolveIcon(option.icon)}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            flex: 1,
            minWidth: 0,
          }}
        >
          <span
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--text-primary)",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
            }}
          >
            {option.name}
          </span>
          <span
            style={{
              fontSize: "var(--fs-xs)",
              color: "var(--text-muted)",
              lineHeight: 1.3,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {option.desc}
          </span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              marginTop: 3,
              fontSize: "var(--fs-xs)",
              fontWeight: 600,
              color: hovered ? option.color : "var(--text-muted)",
            }}
          >
            <IconSettings size={12} />
            {meta.visible} of {meta.total} columns visible
          </span>
        </div>
        <IconChevronRight
          size={16}
          style={{
            color: hovered ? option.color : "var(--text-muted)",
            transition: "transform 0.15s ease",
            transform: hovered ? "translateX(2px)" : "none",
            flexShrink: 0,
          }}
        />
      </button>
    );
  };

  return (
    <div className="page-wrap">
      <div className="module-page__header">
        <div>
          <h2 className="module-page__title">Setup Options</h2>
          <p className="module-page__subtitle">
            {setupGroups.length} groups &middot; {totalOptions} options &middot;{" "}
            configure table column visibility
          </p>
        </div>
        <div style={searchWrapStyles.wrap}>
          <input
            type="text"
            style={searchWrapStyles.input}
            placeholder="Search options…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--primary, #7c3aed)";
              e.target.style.boxShadow = "0 0 0 2px rgba(124, 58, 237, 0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border, #e0e0e0)";
              e.target.style.boxShadow = "none";
            }}
            aria-label="Search setup options"
          />
          {searchQuery && (
            <button
              type="button"
              style={searchWrapStyles.clear}
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              title="Clear search"
            >
              <IconClose size={14} />
            </button>
          )}
        </div>
      </div>

      {isSearching && visibleGroups.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "48px 16px",
            color: "var(--text-muted, #888)",
          }}
        >
          <p style={{ fontSize: 16, margin: 0 }}>
            No options match &quot;{searchQuery}&quot;
          </p>
        </div>
      )}

      <div className="module-page__list">
        {visibleGroups.map((group) => (
          <PageCard key={group.id}>
            <PageCardHeader>
              <div className="module-page__card-header">
                <div
                  className="module-page__card-icon"
                  style={{
                    background: `${group.color}18`,
                    color: group.color,
                  }}
                >
                  {resolveIcon(group.icon, 20)}
                </div>
                <PageCardTitle
                  title={`${group.name} (${group.id})`}
                  subtitle={`${group.options.length} option${
                    group.options.length === 1 ? "" : "s"
                  }`}
                />
              </div>
            </PageCardHeader>
            <PageCardBody>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  alignItems: "stretch",
                }}
              >
                {group.options.map((option) => (
                  <OptionCard key={option.id} option={option} />
                ))}
              </div>
            </PageCardBody>
          </PageCard>
        ))}
      </div>

      {activeOption && (
        <TableColumns
          open={Boolean(activeOption)}
          onClose={handleCloseColumns}
          cfColumns={cfColumns}
          defaultCfColumns={defaultCfColumns}
          onChange={handleColumnsChange}
        />
      )}
    </div>
  );
};

export default SetupPage;
