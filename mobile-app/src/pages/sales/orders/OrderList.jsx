import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { useRef, useState } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/datetime";

const OrderList = ({
  dataList,
  isBusy,
  searchData,
  setSearchData,
  orderStatusOptions,
  filteredOrders,
  onCreateOrder,
}) => {
  const navigate = useNavigate();
  const op = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "#2e7d32";
      case "Pending":
        return "#ed6c02";
      case "Overdue":
        return "#d32f2f";
      default:
        return "#666";
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case "Paid":
        return "#f0fdf4";
      case "Pending":
        return "#fffbeb";
      case "Overdue":
        return "#fef2f2";
      default:
        return "var(--background)";
    }
  };
  const viewOrder = (id) => {
    navigate(`/invoice/view/${id}`);
  };

  const printOrder = (id) => {
    navigate(`/invoice/print/${id}`);
  };
  return (
    <div className="lite-card">
      <div className="search-bar">
        <div className="search-input-wrapper">
          <IconField iconPosition="left" className="search-field">
            <InputIcon className="pi pi-search" />
            <InputText
              placeholder="Search"
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
          />
        </div>

        <OverlayPanel ref={op} dismissable>
          <div className="grid w-20rem">
            <div className="col-12">
              <label className="filter-label">Filter by Status</label>
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
      <div className="lite-card-divider"></div>
      <div className="list-container">
        {dataList.length === 0 && (
          <div className="lite-card-item">
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">No orders found</div>
            </div>
          </div>
        )}
        {filteredOrders.map((item) => (
          <div
            key={item.id}
            className="lite-card-item"
            style={{
              background: item.fodrm_odamt === 0 ? "#fffbeb" : "#ffffff",
            }}
          >
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">
                {item.cnrut_srlno}. {item.cntct_cntnm}
              </div>
              <div className="lite-card-item-left-subtitle">
                {formatDate(item.cnrut_lvdat)}, {item.rutes_dname},{" "}
                {item.rutes_rname}
              </div>
            </div>
            <div className="lite-card-item-right">
              <div className="lite-card-item-right-value">
                {item.fodrm_odamt}
              </div>
              <div className="lite-card-item-right-tag">
                <span
                  className="badge-pill"
                  style={{
                    background: getStatusBg(item.fodrm_stats),
                    color: getStatusColor(item.fodrm_stats),
                  }}
                >
                  {item.fodrm_stats}
                </span>
              </div>
            </div>
            <div className="lite-card-item-footer">
              {item.fodrm_stats === "Pending" ? (
                <>
                  <button
                    className="lite-button lite-button-primary lite-button-sm"
                    onClick={() => onCreateOrder(item)}
                  >
                    <span className="pi pi-pencil mr-1 text-xs"></span>
                    Create
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="lite-button lite-button-info lite-button-sm"
                    onClick={() => viewOrder(item.id)}
                  >
                    <span className="pi pi-eye mr-1 text-xs"></span>
                    View
                  </button>

                  <button
                    className="lite-button lite-button-info lite-button-sm"
                    onClick={() => printOrder(item.id)}
                  >
                    <span className="pi pi-print mr-1 text-xs"></span>
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
export default OrderList;
