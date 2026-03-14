import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { useShopSgd } from "@/hooks/reports/useShopSgd";
import { useEffect } from "react";

const DashboardPage_o = () => {
const {dataList, handleGetShopDashboard} = useShopSgd();

useEffect(() => {
  handleGetShopDashboard();
}, []);


  const categories = [
    {
      label: "Purchase",
      icon: "pi pi-shopping-bag",
      color: "bg-blue-100 text-blue-700",
      items: ["Booking", "Received", "Invoice", "Return", "Booking Cancel"],
    },
    {
      label: "Sales",
      icon: "pi pi-chart-line",
      color: "bg-green-100 text-green-700",
      items: ["Booking", "Received", "Invoice", "Return", "Sales Cancel"],
    },
    {
      label: "Transfer",
      icon: "pi pi-sync",
      color: "bg-orange-100 text-orange-700",
      items: ["In", "Out", "Adjust In", "Adjust Out"],
    },
    {
      label: "Orders",
      icon: "pi pi-shopping-cart",
      color: "bg-purple-100 text-purple-700",
      items: ["Orders", "Delivery", "Collections"],
    },
    {
      label: "Accounts",
      icon: "pi pi-wallet",
      color: "bg-cyan-100 text-cyan-700",
      items: [
        "Payable Dues",
        "Payable Payments",
        "Receivable Dues",
        "Receivable Received",
        "Expense",
      ],
    },
  ];

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
      <div className="flex gap-2">
        <ButtonGroup>
          <Button
            icon="pi pi-refresh"
            size="small"
            severity="secondary"
            rounded
            text
            tooltip="Refresh Data"
          />
          <Button
            label="Action"
            icon="pi pi-bolt"
            size="small"
            severity="primary"
            raised
            className="hidden sm:inline-flex"
          />
          <Button
            label="Back"
            icon="pi pi-arrow-left"
            size="small"
            severity="help"
            raised
          />
        </ButtonGroup>
      </div>
    </div>
  );

  return (
    <div className="surface-ground p-3 min-h-screen">
      <Card
        header={getHeader()}
        className="border-round-xl shadow-4 border-none mb-4 overflow-hidden"
      >
        {JSON.stringify(dataList)}
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

        <div className="grid mt-3">
          {categories.map((cat, index) => (
            <div key={index} className="col-12 md:col-6 lg:col-4 p-3 font-sans">
              <div className="surface-card p-4 border-round-xl border-1 surface-border hover:shadow-2 transition-all transition-duration-300">
                <div className="flex align-items-center justify-content-between mb-4">
                  <div className="flex align-items-center gap-3">
                    <div
                      className={`w-3.5rem h-3.5rem flex align-items-center justify-content-center border-round-xl shadow-1 ${cat.color}`}
                    >
                      <i className={`${cat.icon} text-2xl`}></i>
                    </div>
                    <div>
                      <span className="text-xl font-bold text-900 block">
                        {cat.label}
                      </span>
                      <small className="text-500 uppercase tracking-wider">
                        {cat.items.length} Activities
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
                  {cat.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex align-items-center justify-content-between p-2 border-round-lg hover:surface-100 transition-colors"
                    >
                      <span className="text-700 font-medium">{item}</span>
                      <div className="flex align-items-center gap-2">
                        <span className="text-900 font-bold bg-surface-50 px-3 py-1 border-round-md border-1 surface-border">
                          0
                        </span>
                        <i className="pi pi-angle-right text-400 text-xs"></i>
                      </div>
                    </div>
                  ))}
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
          ))}
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage_o;