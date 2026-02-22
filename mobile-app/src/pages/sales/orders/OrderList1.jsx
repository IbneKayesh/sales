import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Eye, Printer, Filter, ChevronRight } from "lucide-react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import useOrders from "@/hooks/sales/useOrders.js";

const OrderList1 = () => {
  const navigate = useNavigate();
  const {
    dataList,
    isBusy,
    errors,
    formData,
    currentView,
    searchData,
    setSearchData,
    orderStatusOptions,
    handleCreateOrder,
  } = useOrders();


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
    <div className="app-container">
      <div className="items-list-container">
        {filteredOrders.map((inv) => (
          <div key={inv.id} className="card item-card">
            <div className="card-row-between">
              <div onClick={() => viewOrder(inv.id)} className="card-main-info">
                <div className="card-title">
                  {inv.cnrut_srlno} {inv.cntct_cntnm}
                </div>
                <div className="card-subtitle">{inv.rutes_rname}</div>
                <div className="card-meta-text">
                  {inv.cnrut_lvdat} - {inv.rutes_dname}
                </div>
              </div>
              <div className="card-right-aside">
                <div className="card-highlight-text">{inv.fodrm_odamt}</div>
                <span
                  className="badge-pill"
                  style={{
                    background: getStatusBg(inv.fodrm_stats),
                    color: getStatusColor(inv.fodrm_stats),
                  }}
                >
                  {inv.fodrm_stats}
                </span>
              </div>
            </div>

            <div className="card-actions-footer">
              {inv.fodrm_stats === "Pending" ? (
                <Button
                  icon="pi pi-pencil"
                  label="Create"
                  onClick={() => createOrder(inv.id)}
                  severity="info"
                  text
                  className="p-button-ghost"
                />
              ) : (
                <>
                  {" "}
                  <Button
                    icon="pi pi-eye"
                    label="View"
                    onClick={() => viewOrder(inv.id)}
                    severity="info"
                    text
                    className="p-button-ghost"
                  />
                  <Button
                    icon="pi pi-print"
                    label="Print"
                    onClick={() => printOrder(inv.id)}
                    severity="secondary"
                    text
                    className="p-button-ghost"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      <Button
        icon="pi pi-plus"
        className="btn-fab"
        onClick={handleCreateOrder}
        rounded
      />
    </div>
  );
};

export default OrderList1;
