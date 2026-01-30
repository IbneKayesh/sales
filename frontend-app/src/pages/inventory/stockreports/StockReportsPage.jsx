import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useEffect, useState } from "react";
import { ToggleButton } from "primereact/togglebutton";

import { useStockReports } from "@/hooks/inventory/useStockReports";
import PBookingListComp from "./PBookingListComp";
import PReceiptListComp from "./PReceiptListComp";
import ITransferListComp from "./ITransferListComp";
import PInvoiceListComp from "./PInvoiceListComp";

const StockReportsPage = () => {
  const { dataList, isBusy, handleLoadReports } = useStockReports();

  const [reportFilter, setReportFilter] = useState("");
  const [isSummary, setIsSummary] = useState(false);
  useEffect(() => {
    handleLoadReports(reportFilter);
  }, [reportFilter]);

  const reportFilterOptions = [
    { label: "Purchase Booking", value: "pbooking" },
    { label: "Purchase Receipt", value: "preceipt" },
    { label: "Purchase Invoice", value: "pinvoice" },
    { label: "Inventory Transfer", value: "itransfer" },
  ];

  const handleReportFilterChange = (e) => {
    setReportFilter(e.value);
  };

  const getHeader = () => {
    return (
      <div className="flex align-items-center justify-content-between">
        <h3 className="m-0">
          {reportFilter
            ? reportFilterOptions.find((opt) => opt.value === reportFilter)
                ?.label
            : "Inventory Reports"}
        </h3>
        <div className="flex gap-2">
          <Dropdown
            value={reportFilter}
            options={reportFilterOptions}
            onChange={handleReportFilterChange}
            placeholder="Select Filter"
            className="p-inputtext-sm w-full md:w-18rem"
            checkmark={true}
          />
          <ToggleButton
            onLabel="Summary"
            offLabel="Details"
            onIcon="pi pi-folder"
            offIcon="pi pi-folder-open"
            checked={isSummary}
            onChange={(e) => setIsSummary(e.value)}
          />
          <Button
            icon="pi pi-refresh"
            size="small"
            severity="secondary"
            onClick={() => handleLoadReports(reportFilter)}
            tooltip="Refresh Data"
            disabled={isBusy}
          />
        </div>
      </div>
    );
  };

  return (
    <Card header={getHeader()} className="border-round p-3">
      {reportFilter === "pbooking" && (
        <PBookingListComp
          dataList={dataList}
          isBusy={isBusy}
          isSummary={isSummary}
        />
      )}
      {reportFilter === "preceipt" && (
        <PReceiptListComp
          dataList={dataList}
          isBusy={isBusy}
          isSummary={isSummary}
        />
      )}
      {reportFilter === "pinvoice" && (
        <PInvoiceListComp
          dataList={dataList}
          isBusy={isBusy}
          isSummary={isSummary}
        />
      )}
      {reportFilter === "itransfer" && (
        <ITransferListComp
          dataList={dataList}
          isBusy={isBusy}
          isSummary={isSummary}
        />
      )}
      {reportFilter === "" && (
        <div className="flex align-items-center justify-content-center bg-gray-200 border-round p-5">
          <p className="text-gray-600">Select a filter to view data</p>
        </div>
      )}
    </Card>
  );
};

export default StockReportsPage;
