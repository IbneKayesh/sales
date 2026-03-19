import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { useShopSgd } from "@/hooks/reports/useShopSgd";
import { useState } from "react";

const DashboardPage = () => {
  const { isBusy, dataList, handleGetShopDashboard } = useShopSgd();

  const [dateFilter, setDateFilter] = useState("today");
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  const filterOptions = [
    { label: "Today", value: "today" },
    { label: "Yesterday", value: "yesterday" },
    { label: "Last 3 Days", value: "last_3_days" },
    { label: "Last 7 Days", value: "last_7_days" },
    { label: "Last 15 Days", value: "last_15_days" },
    { label: "Last 30 Days", value: "last_30_days" },
    { label: "Custom Date", value: "custom" },
  ];

  const handleFindData = () => {
    let start = new Date(fromDate);
    let end = new Date(toDate);

    if (dateFilter === "today") {
      start = new Date();
      end = new Date();
    } else if (dateFilter === "yesterday") {
      start = new Date();
      start.setDate(start.getDate() - 1);
      end = new Date(start); // same day (correct for yesterday)
    } else if (dateFilter === "last_3_days") {
      end = new Date(); // today
      start = new Date();
      start.setDate(start.getDate() - 2); // include today = 3 days
    } else if (dateFilter === "last_7_days") {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - 6);
    } else if (dateFilter === "last_15_days") {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - 14);
    } else if (dateFilter === "last_30_days") {
      end = new Date();
      start = new Date();
      start.setDate(start.getDate() - 29);
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      const year = d.getFullYear();
      return `${year}-${month}-${day}`;
    };

    handleGetShopDashboard(formatDate(start), formatDate(end));
  };

  const getHeader = () => (
    <div className="flex align-items-center justify-content-between p-2">
      <div className="flex align-items-center gap-3">
        <div className="w-3rem h-3rem bg-primary border-circle flex align-items-center justify-content-center shadow-2">
          <i className="pi pi-th-large text-white text-xl"></i>
        </div>
        <div>
          <h3 className="m-0 font-bold text-900">Reports Dashboard</h3>
          <small className="text-500">Business overview and analytics</small>
        </div>
      </div>
      <div className="flex gap-2 align-items-center">
        <Dropdown
          value={dateFilter}
          options={filterOptions}
          onChange={(e) => setDateFilter(e.value)}
          placeholder="Select Range"
          className="w-11rem"
        />
        {dateFilter === "custom" && (
          <>
            <Calendar
              value={fromDate}
              onChange={(e) => setFromDate(e.value)}
              placeholder="From Date"
              dateFormat="yy-mm-dd"
              className="w-9rem"
            />
            <Calendar
              value={toDate}
              onChange={(e) => setToDate(e.value)}
              placeholder="To Date"
              dateFormat="yy-mm-dd"
              className="w-9rem"
            />
          </>
        )}
        <Button
          label="Find"
          icon="pi pi-search"
          onClick={handleFindData}
          loading={isBusy}
        />
      </div>
    </div>
  );

  return (
    <div className="surface-ground min-h-screen">
      <Card
        header={getHeader()}
        className="border-round-xl shadow-4 border-none mb-4 overflow-hidden"
      >
        {/* Footer stats summary */}
        <div className="grid">
          <div className="col-12 sm:col-6 lg:col-3 p-2">
            <div className="surface-card shadow-1 p-3 border-round-lg flex align-items-center gap-3">
              <i className="pi pi-wallet text-3xl text-blue-500"></i>
              <div>
                <div className="text-500 font-medium mb-1">Total Assets</div>
                <div className="text-900 font-bold text-xl">$0.00</div>
              </div>
            </div>
          </div>
          <div className="col-12 sm:col-6 lg:col-3 p-2">
            <div className="surface-card shadow-1 p-3 border-round-lg flex align-items-center gap-3">
              <i className="pi pi-tag text-3xl text-purple-500"></i>
              <div>
                <div className="text-500 font-medium mb-1">Profit/Loss</div>
                <div className="text-900 font-bold text-xl">$0.00</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid mt-2">
          <div className="col-12 md:col-4 p-1">
            <div className="surface-card p-2 border-round-xl border-1 surface-border hover:shadow-2 transition-all transition-duration-300">
              <div className="flex align-items-center justify-content-between mb-4">
                <div className="flex align-items-center gap-3">
                  <div className="w-3.5rem h-3.5rem flex align-items-center justify-content-center border-round-xl shadow-1 bg-blue-100 text-blue-700">
                    <i className="pi pi-shopping-bag text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-900 block">
                      Purchase Total Of
                    </span>
                    <small className="text-500 uppercase tracking-wider">
                      {dataList.purchase &&
                        dataList.purchase.length > 0 &&
                        dataList.purchase[0]?.id + " Activities"}
                    </small>
                  </div>
                </div>
                <Button
                  icon="pi pi-ellipsis-v"
                  severity="secondary"
                  text
                  rounded
                />
              </div>

              <div className="flex flex-column gap-2">
                {dataList.purchase &&
                  dataList.purchase.length > 0 &&
                  (() => {
                    const pData = dataList.purchase[0];
                    const labels = [
                      { key: "odamt", label: "Order (1)" },
                      { key: "dsamt", label: "Discount (2)" },
                      { key: "vtamt", label: "VAT (3)" },
                      { key: "incst", label: "Including Cost (4)" },
                      { key: "rnamt", label: "Rounded (5)" },
                      { key: "ttamt", label: "Total (6) [1+3+4-2+5]" },
                      { key: "pyamt", label: "Payable (7)" },
                      { key: "pdamt", label: "Paid (8)" },
                      { key: "duamt", label: "Due (9) [7-8]" },
                      { key: "excst", label: "Excluding Cost (10)" },
                    ];
                    return labels.map((l, i) => (
                      <div
                        key={i}
                        className="flex align-items-center justify-content-between p-2 border-round-lg hover:surface-100 transition-colors"
                      >
                        <span className="text-700 font-medium">{l.label}</span>
                        <div className="flex align-items-center gap-2">
                          <span className="text-900 font-bold bg-surface-50 px-3 py-1 border-round-md border-1 surface-border">
                            {Number(pData[l.key] || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
              </div>

              <div className="mt-4 pt-3 border-top-1 surface-border flex justify-content-end">
                <Button
                  label="View Details"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
          <div className="col-12 md:col-4 p-1">
            <div className="surface-card p-2 border-round-xl border-1 surface-border hover:shadow-2 transition-all transition-duration-300">
              <div className="flex align-items-center justify-content-between mb-4">
                <div className="flex align-items-center gap-3">
                  <div className="w-3.5rem h-3.5rem flex align-items-center justify-content-center border-round-xl shadow-1 bg-blue-100 text-blue-700">
                    <i className="pi pi-shopping-bag text-2xl"></i>
                  </div>
                  <div>
                    <span className="text-xl font-bold text-900 block">
                      Sales Total Of
                    </span>
                    <small className="text-500 uppercase tracking-wider">
                      {dataList.sales &&
                        dataList.sales.length > 0 &&
                        dataList.sales[0]?.id + " Activities"}
                    </small>
                  </div>
                </div>
                <Button
                  icon="pi pi-ellipsis-v"
                  severity="secondary"
                  text
                  rounded
                />
              </div>

              <div className="flex flex-column gap-2">
                {dataList.sales &&
                  dataList.sales.length > 0 &&
                  (() => {
                    const pData = dataList.sales[0];
                    const labels = [
                      { key: "odamt", label: "Order (1)" },
                      { key: "dsamt", label: "Discount (2)" },
                      { key: "vtamt", label: "VAT (3)" },
                      { key: "incst", label: "Including Cost (4)" },
                      { key: "rnamt", label: "Rounded (5)" },
                      { key: "ttamt", label: "Total (6) [1+3+4-2+5]" },
                      { key: "pyamt", label: "Payable (7)" },
                      { key: "pdamt", label: "Paid (8)" },
                      { key: "duamt", label: "Due (9) [7-8]" },
                      { key: "excst", label: "Excluding Cost (10)" },
                    ];
                    return labels.map((l, i) => (
                      <div
                        key={i}
                        className="flex align-items-center justify-content-between p-2 border-round-lg hover:surface-100 transition-colors"
                      >
                        <span className="text-700 font-medium">{l.label}</span>
                        <div className="flex align-items-center gap-2">
                          <span className="text-900 font-bold bg-surface-50 px-3 py-1 border-round-md border-1 surface-border">
                            {Number(pData[l.key] || 0).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ));
                  })()}
              </div>

              <div className="mt-4 pt-3 border-top-1 surface-border flex justify-content-end">
                <Button
                  label="View Details"
                  icon="pi pi-arrow-right"
                  iconPos="right"
                  size="small"
                  text
                />
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
