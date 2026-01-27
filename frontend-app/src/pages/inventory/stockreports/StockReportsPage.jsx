import { useStockReports } from "@/hooks/inventory/useStockReports";
import PBookingListComp from "./PBookingListComp";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";

const StockReportsPage = () => {
  const { dataList, isBusy, handleLoadPurchaseBooking } = useStockReports();

  const [reportFilter, setReportFilter] = useState("");
  useEffect(() => {
    if (reportFilter === "pbooking") {
      handleLoadPurchaseBooking();
    }
  }, [reportFilter]);
  const reportFilterOptions = [
    { label: "Purchase Booking", value: "pbooking" },
  ];

  const handleReportFilterChange = (e) => {
    setReportFilter(e.value);
  };

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">Inventory Reports</h3>
        <div className="flex gap-2">
          <Dropdown
            value={reportFilter}
            options={reportFilterOptions}
            onChange={handleReportFilterChange}
            placeholder="Select Filter"
            className="p-inputtext-sm w-full md:w-18rem"
            checkmark={true}
          />

          <Button
            icon="pi pi-refresh"
            size="small"
            severity="secondary"
            onClick={handleLoadPurchaseBooking}
            tooltip="Refresh Data"
            disabled={isBusy}
          />
        </div>
      </div>
    );
  };

  return (
    <Card header={getHeader()} className="border-round p-3">
      <PBookingListComp dataList={dataList} isBusy={isBusy} />
    </Card>
  );
};

export default StockReportsPage;
