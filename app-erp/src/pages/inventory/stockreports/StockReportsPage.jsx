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
import EmptyState from "@/components/EmptyState";
import PriceDlg from "./PriceDlg";
import { Dialog } from "primereact/dialog";

const StockReportsPage = () => {
  const { dataList, isBusy, handleLoadReports, handleUpdatePrice } =
    useStockReports();

  const [reportFilter, setReportFilter] = useState("");
  const [isSummary, setIsSummary] = useState(false);
  const [selectedTrackedItem, setSelectedTrackedItem] = useState(null);

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

  const handleUpdatePriceDlg = (product) => {
    setSelectedTrackedItem(product);
  };

  const onUpdatePrice = () => {
    handleUpdatePrice(selectedTrackedItem);
    setSelectedTrackedItem(null);
  };

 const handleChange = (field, value) => {
    setSelectedTrackedItem((prev) => ({ ...prev, [field]: value }));
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
            label="Refresh"
            icon="pi pi-refresh"
            size="small"
            severity="secondary"
            onClick={() => handleLoadReports(reportFilter)}
            disabled={isBusy}
          />
        </div>
      </div>
    );
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Cancel"
        icon="pi pi-times"
        onClick={() => setSelectedTrackedItem(null)}
        severity="secondary"
      />
      <Button
        label="Save"
        icon="pi pi-save"
        onClick={() => onUpdatePrice()}
        severity="success"
      />
    </div>
  );
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
          onUpdatePriceDlg={handleUpdatePriceDlg}
        />
      )}
      {reportFilter === "itransfer" && (
        <ITransferListComp
          dataList={dataList}
          isBusy={isBusy}
          isSummary={isSummary}
        />
      )}
      {reportFilter === "" && <EmptyState />}

      <Dialog
        header={`Price Update`}
        visible={!!selectedTrackedItem}
        onHide={() => setSelectedTrackedItem(null)}
        closable={true}
        style={{ width: "25vw" }}
        footer={dialogFooter}
      >
        <>
          {selectedTrackedItem && (
            <PriceDlg formData={selectedTrackedItem} onChange={handleChange} />
          )}
        </>
      </Dialog>
    </Card>
  );
};

export default StockReportsPage;
