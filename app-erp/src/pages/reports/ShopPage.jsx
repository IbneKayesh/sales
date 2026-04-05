import { useShopSgd } from "@/hooks/reports/useShopSgd";
import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";

const ShopPage = () => {
  const { dataList, handleLoadShopSummary } = useShopSgd();
  const [dates, setDates] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  const calculateSummary = (item) => {
    const isSales = item.paybl_srcnm.toLowerCase().includes("sales");
    const amount = isSales
      ? parseFloat(item.paybl_dbamt)
      : parseFloat(item.paybl_cramt);
    const payment = isSales
      ? parseFloat(item.paybl_cramt)
      : parseFloat(item.paybl_dbamt);
    const due = amount - payment;
    return { amount, payment, due };
  };

  const getIcon = (name) => {
    if (name.includes("Booking")) return "pi pi-shopping-bag";
    if (name.includes("Receipt")) return "pi pi-receipt";
    if (name.includes("Invoice") && name.includes("Purchase"))
      return "pi pi-file-import";
    if (name.includes("Invoice") && name.includes("Sales"))
      return "pi pi-file-export";
    return "pi pi-chart-line";
  };

  const getColor = (name) => {
    if (name.includes("Booking")) return "indigo";
    if (name.includes("Receipt")) return "teal";
    if (name.includes("Purchase") && name.includes("Invoice")) return "orange";
    if (name.includes("Sales")) return "pink";
    return "blue";
  };

  const handleSearch = () => {
    if (!dates) return;

    const formatDateLocal = (date) => {
      if (!date) return null;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    let startDate, endDate;

    if (Array.isArray(dates)) {
      // Range mode
      startDate = formatDateLocal(dates[0]);
      endDate = formatDateLocal(dates[1]) || startDate;
    } else {
      // Single date mode
      startDate = formatDateLocal(dates);
      endDate = startDate;
    }

    if (startDate && endDate) {
      handleLoadShopSummary(startDate, endDate);
    }
  };

  // Calculate totals for primary cards
  const totalAmount = dataList.reduce(
    (acc, curr) => acc + calculateSummary(curr).amount,
    0,
  );
  const totalPaid = dataList.reduce(
    (acc, curr) => acc + calculateSummary(curr).payment,
    0,
  );
  const totalDue = dataList.reduce(
    (acc, curr) => acc + calculateSummary(curr).due,
    0,
  );

  return (
    <div
      className="p-4 surface-ground border-round-xl shadow-1"
      style={{ minHeight: "calc(100vh - 4rem)" }}
    >
      {/* Header Section with Title and Date Filter */}
      <div className="flex flex-column lg:flex-row lg:align-items-center justify-content-between mb-5 gap-3">
        <div>
          <h1 className="m-0 font-bold text-3xl md:text-4xl text-900">
            Shop Summary Dashboard
          </h1>
          <p className="text-600 m-0 mt-2 font-medium">
            Business financial performance and transaction overview
          </p>
        </div>

        {/* Modern Date Selection UI */}
        <div className="flex flex-column sm:flex-row align-items-center gap-3 bg-white p-3 border-round-xl shadow-2">
          <div className="flex flex-column gap-1">
            <label
              htmlFor="date_range"
              className="text-xs font-bold text-600 uppercase tracking-widest"
            >
              Select Period
            </label>
            <Calendar
              id="date_range"
              value={dates}
              onChange={(e) => setDates(e.value)}
              selectionMode="range"
              readOnlyInput
              showIcon
              placeholder="Single or Range"
              className="w-full sm:w-16rem"
              showButtonBar
              dateFormat="yy-mm-dd"
            />
          </div>
          <Button
            label="Load Summary"
            icon="pi pi-search"
            className="p-button-primary mt-auto px-4 font-bold border-round-lg h-3rem"
            onClick={handleSearch}
            disabled={!dates}
            size="small"
          />
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid mb-5">
        <div className="col-12 md:col-4">
          <div className="surface-card p-4 shadow-2 border-round-xl border-left-3 border-blue-500">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-bold mb-3 uppercase tracking-wider text-xs">
                  Total Transaction Value
                </span>
                <div className="text-900 font-bold text-3xl">
                  {formatCurrency(totalAmount)}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-blue-100 border-round"
                style={{ width: "3.5rem", height: "3.5rem" }}
              >
                <i className="pi pi-wallet text-blue-500 text-3xl"></i>
              </div>
            </div>
            <div className="flex align-items-center">
              <span className="text-blue-500 font-bold mr-2">100%</span>
              <span className="text-500">Gross Vol</span>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="surface-card p-4 shadow-2 border-round-xl border-left-3 border-green-500">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-bold mb-3 uppercase tracking-wider text-xs">
                  Received / Paid
                </span>
                <div className="text-900 font-bold text-3xl text-green-600">
                  {formatCurrency(totalPaid)}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-green-100 border-round"
                style={{ width: "3.5rem", height: "3.5rem" }}
              >
                <i className="pi pi-check-circle text-green-500 text-3xl"></i>
              </div>
            </div>
            <div className="flex align-items-center">
              <span className="text-green-500 font-bold mr-2">
                {totalAmount > 0
                  ? ((totalPaid / totalAmount) * 100).toFixed(1)
                  : 0}
                %
              </span>
              <span className="text-500">Settled</span>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-4">
          <div className="surface-card p-4 shadow-2 border-round-xl border-left-3 border-red-500">
            <div className="flex justify-content-between mb-3">
              <div>
                <span className="block text-500 font-bold mb-3 uppercase tracking-wider text-xs">
                  Net Outstanding
                </span>
                <div className="text-900 font-bold text-3xl text-red-600">
                  {formatCurrency(totalDue)}
                </div>
              </div>
              <div
                className="flex align-items-center justify-content-center bg-red-100 border-round"
                style={{ width: "3.5rem", height: "3.5rem" }}
              >
                <i className="pi pi-info-circle text-red-500 text-3xl"></i>
              </div>
            </div>
            <div className="flex align-items-center">
              <span className="text-red-500 font-bold mr-2">
                {totalAmount > 0
                  ? ((totalDue / totalAmount) * 100).toFixed(1)
                  : 0}
                %
              </span>
              <span className="text-500">Remaining</span>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <h3 className="text-900 font-bold mb-4 flex align-items-center">
        <i className="pi pi-th-large mr-2 text-primary"></i> Category Overview
      </h3>
      <div className="grid">
        {dataList.length > 0 ? (
          dataList.map((item, index) => {
            const { amount, payment, due } = calculateSummary(item);
            const color = getColor(item.paybl_srcnm);
            return (
              <div key={index} className="col-12 md:col-6 lg:col-3">
                <Card className="shadow-2 border-round-xl border-none h-full hover:surface-100 transition-all transition-duration-200">
                  <div className="flex justify-content-between mb-4">
                    <div>
                      <span className="block text-700 font-bold mb-1 uppercase text-xs tracking-widest">
                        {item.paybl_srcnm}
                      </span>
                      <div className="text-900 font-bold text-2xl">
                        {formatCurrency(amount)}
                      </div>
                    </div>
                    <div
                      className={`flex align-items-center justify-content-center bg-${color}-100 border-round-circle`}
                      style={{ width: "3rem", height: "3rem" }}
                    >
                      <i
                        className={`${getIcon(item.paybl_srcnm)} text-${color}-600 text-xl`}
                      ></i>
                    </div>
                  </div>

                  <div className="flex flex-column gap-2 mt-2">
                    <div className="flex justify-content-between align-items-center surface-100 p-2 border-round">
                      <span className="text-600 text-sm font-medium">
                        Payment Done
                      </span>
                      <span className="text-900 font-bold text-sm">
                        {formatCurrency(payment)}
                      </span>
                    </div>
                    <div className="flex justify-content-between align-items-center p-2">
                      <span className="text-800 font-bold text-sm">
                        Balance
                      </span>
                      <span
                        className={`font-bold px-2 py-1 border-round text-xs ${due > 0 ? `bg-red-100 text-red-700` : `bg-green-100 text-green-700`}`}
                      >
                        {formatCurrency(due)}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })
        ) : (
          <div className="col-12">
            <div className="surface-card p-6 text-center border-round-xl shadow-1">
              <i className="pi pi-calendar-times text-400 text-6xl mb-4"></i>
              <div className="text-900 font-bold text-2xl">
                No snapshot data
              </div>
              <p className="text-600 mt-2 text-lg">
                Pick a single date or a date range and click Load Summary to
                refresh the dashboard.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Transaction Details Table */}
      {dataList.length > 0 && (
        <div className="mt-6 mb-4">
          <div className="surface-card shadow-2 border-round-xl overflow-hidden">
            <div className="p-4 border-bottom-1 surface-border bg-gray-50 flex align-items-center justify-content-between">
              <div className="flex align-items-center">
                <i className="pi pi-list mr-2 text-primary font-bold"></i>
                <span className="text-900 font-bold text-lg">
                  Detailed Analytics
                </span>
              </div>
              <Tag
                value={`${dataList.length} Entries`}
                severity="secondary"
                className="px-3"
              ></Tag>
            </div>
            <DataTable
              value={dataList.map((item) => ({
                ...item,
                ...calculateSummary(item),
              }))}
              responsiveLayout="scroll"
              stripedRows
              className="p-datatable-sm"
              emptyMessage="No results found."
            >
              <Column
                field="paybl_srcnm"
                header="Type"
                sortable
                style={{ minWidth: "200px" }}
              ></Column>
              <Column
                body={(rowData) => (
                  <span className="text-900 font-bold">
                    {formatCurrency(rowData.amount)}
                  </span>
                )}
                header="Total Value"
                sortable
                headerClassName="text-right"
                className="text-right"
              ></Column>
              <Column
                body={(rowData) => (
                  <span className="text-green-600 font-bold">
                    {formatCurrency(rowData.payment)}
                  </span>
                )}
                header="Settled"
                sortable
                headerClassName="text-right"
                className="text-right"
              ></Column>
              <Column
                body={(rowData) => (
                  <div className="flex justify-content-end">
                    <Tag
                      severity={rowData.due > 0 ? "danger" : "success"}
                      value={formatCurrency(rowData.due)}
                      className="font-bold border-round-xl px-3"
                    />
                  </div>
                )}
                header="Outcome"
                headerClassName="text-right"
                className="text-right"
              ></Column>
            </DataTable>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopPage;
