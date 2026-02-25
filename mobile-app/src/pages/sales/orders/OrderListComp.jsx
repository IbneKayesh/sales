import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/datetime";

const statusBadgeClass = (status) => {
  switch (status) {
    case "Paid":
      return "status-badge status-badge--paid";
    case "Pending":
      return "status-badge status-badge--pending";
    case "Overdue":
      return "status-badge status-badge--overdue";
    default:
      return "status-badge status-badge--undelivered";
  }
};

const statusIcon = (status) => {
  switch (status) {
    case "Paid":
      return "pi-check-circle";
    case "Pending":
      return "pi-clock";
    case "Overdue":
      return "pi-exclamation-circle";
    default:
      return "pi-minus-circle";
  }
};

const OrderListComp = ({
  dataList,
  isBusy,
  searchData,
  setSearchData,
  orderStatusOptions,
  filteredOrders,
  onCreateNew,
}) => {
  const navigate = useNavigate();
  const op = useRef(null);

  const viewOrder = (id) => navigate(`/invoice/view/${id}`);
  const printOrder = (id) => navigate(`/invoice/print/${id}`);

  return (
    <div className="lite-card">
      {/* ── Search Bar ── */}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <IconField iconPosition="left" className="search-field">
            <InputIcon className="pi pi-search" />
            <InputText
              placeholder="Search orders…"
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
                options={orderStatusOptions}
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
        <span className="page-section-header-title">Order List</span>
        <span className="page-section-header-count">
          {filteredOrders.length}
        </span>
      </div>

      {/* ── List ── */}
      <div className="list-container">
        {filteredOrders.length === 0 && (
          <div className="empty-state">
            <span className="pi pi-file-o empty-state-icon" />
            <span className="empty-state-text">No orders found</span>
          </div>
        )}

        {filteredOrders.map((item) => (
          <div key={item.id} className="lite-card-item">
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">
                <span
                  style={{ color: "var(--text-secondary)", marginRight: 4 }}
                >
                  #{item.cnrut_srlno}
                </span>
                {item.cntct_cntnm}
              </div>
              <div className="lite-card-item-left-subtitle">
                {formatDate(item.cnrut_lvdat)} · {item.rutes_dname} —{" "}
                {item.rutes_rname}
              </div>
            </div>

            <div className="lite-card-item-right">
              <div className="lite-card-item-right-value">
                {item.fodrm_odamt}
              </div>
              <span className={statusBadgeClass(item.fodrm_stats)}>
                <span
                  className={`pi ${statusIcon(item.fodrm_stats)} text-xs`}
                />
                {item.fodrm_stats}
              </span>
            </div>

            <div className="lite-card-item-footer">
              {item.fodrm_stats === "Pending" ? (
                <button
                  className="lite-button lite-button-primary lite-button-sm"
                  onClick={() => onCreateNew(item)}
                >
                  <span className="pi pi-file-edit mr-1 text-xs" />
                  Create Order
                </button>
              ) : (
                <>
                  <button
                    className="lite-button lite-button-info lite-button-sm"
                    onClick={() => viewOrder(item.id)}
                  >
                    <span className="pi pi-eye mr-1 text-xs" />
                    View
                  </button>
                  <button
                    className="lite-button lite-button-outline lite-button-sm"
                    onClick={() => printOrder(item.id)}
                  >
                    <span className="pi pi-print mr-1 text-xs" />
                    Print
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderListComp;
