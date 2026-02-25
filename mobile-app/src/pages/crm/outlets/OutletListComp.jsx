import { useRef } from "react";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";

/** Returns up to 2 uppercase initials from a name string */
const getInitials = (name = "") =>
  name
    .trim()
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

const OutletListComp = ({
  dataList,
  isBusy,
  searchData,
  setSearchData,
  onEdit,
  onViewOnly,
}) => {
  const op = useRef(null);

  return (
    <div className="lite-card">
      {/* ── Search Bar ── */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <IconField iconPosition="left" className="search-field">
            <InputIcon className="pi pi-search" />
            <InputText
              placeholder="Search outlets…"
              size="small"
              className="w-full"
              value={searchData.search}
              onChange={(e) =>
                setSearchData({ ...searchData, search: e.target.value })
              }
            />
          </IconField>
          <Button
            icon="pi pi-filter"
            rounded
            text
            severity="secondary"
            size="small"
            className="search-filter-btn"
            onClick={(e) => op.current.toggle(e)}
            tooltip="Filter"
            tooltipOptions={{ position: "left" }}
          />
        </div>

        <OverlayPanel ref={op} dismissable>
          <div className="grid w-20rem">
            <div className="col-12">
              <label className="form-field-label">Filter by Status</label>
            </div>
            <div className="col-12">
              <Dropdown
                value={searchData.status}
                onChange={(e) =>
                  setSearchData({ ...searchData, status: e.value })
                }
                placeholder="Select Status"
                className="w-full"
                size="small"
              />
            </div>
            <div className="col-12">
              <Calendar
                value={searchData.date}
                onChange={(e) =>
                  setSearchData({ ...searchData, date: e.value })
                }
                placeholder="Select Date"
                className="w-full"
                size="small"
              />
            </div>
          </div>
        </OverlayPanel>
      </div>

      <div className="lite-card-divider" />

      {/* ── Section Header ── */}
      <div className="page-section-header">
        <div className="page-section-header-bar" />
        <span className="page-section-header-title">Outlet List</span>
        <span className="page-section-header-count">{dataList.length}</span>
      </div>

      {/* ── List ── */}
      <div className="list-container">
        {dataList.length === 0 && (
          <div className="empty-state">
            <span className="pi pi-inbox empty-state-icon" />
            <span className="empty-state-text">No outlets found</span>
          </div>
        )}

        {dataList.map((item) => (
          <div key={item.id} className="lite-card-item">
            {/* Avatar */}
            <div
              className="lite-card-item-left"
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <div className="list-item-avatar">
                {getInitials(item.cntct_cntnm)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <div className="lite-card-item-left-title">
                  {item.cntct_cntnm}
                </div>
                <div className="lite-card-item-left-subtitle">
                  {item.cntct_cntps} · {item.cntct_cntno}
                </div>
              </div>
            </div>

            {/* Right — location + zone badge */}
            <div className="lite-card-item-right">
              <div
                className="lite-card-item-right-value"
                style={{ fontSize: 11 }}
              >
                {item.cntct_ofadr}
              </div>
              <span className="status-badge status-badge--undelivered">
                {item.tarea_tname}, {item.dzone_dname}
              </span>
            </div>

            {/* Footer actions */}
            <div className="lite-card-item-footer">
              <button
                className="lite-button lite-button-info lite-button-sm"
                onClick={() => onViewOnly(item)}
              >
                <span className="pi pi-eye mr-1 text-xs" />
                View
              </button>
              <button
                className="lite-button lite-button-warning lite-button-sm"
                onClick={() => onEdit(item)}
              >
                <span className="pi pi-pencil mr-1 text-xs" />
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletListComp;
