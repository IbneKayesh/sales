import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./PrintComp.css";

const HeldInvComp = ({
  currencyIcon,
  showHeldInvoices,
  setShowHeldInvoices,
  heldInvoices,
  onOpenHeldInvoice,
  onClearHeldInvoice,
}) => {
  const dialogFooter = (
    <div className="print-actions no-print">
      <Button
        label="Back"
        icon="pi pi-arrow-left"
        severity="secondary"
        onClick={() => setShowHeldInvoices(false)}
      />
    </div>
  );

  return (
    <Dialog
      visible={showHeldInvoices}
      onHide={() => setShowHeldInvoices(false)}
      header="Held Invoices"
      footer={dialogFooter}
      style={{ width: "50%" }}
      modal
    >
      {heldInvoices && heldInvoices.length === 0 ? (
        <p className="text-red-500 text-md font-bold text-center">
          <i className="pi pi-info-circle mr-2"></i>
          No held invoices found.
        </p>
      ) : (
        <div className="flex flex-column gap-3 mt-3">
          {heldInvoices?.map((hold) => (
            <div
              key={hold.id}
              className="p-3 border-1 border-round border-gray-300 flex flex-column gap-2"
              style={{
                borderColor: "#d1d5db",
                borderWidth: "1px",
                borderStyle: "solid",
                borderRadius: "8px",
              }}
            >
              <div className="flex justify-content-between align-items-center">
                <span className="font-bold">
                  {hold.customer ? hold.customer.site_name : "Walk-in Customer"}
                </span>
                <span className="text-sm text-gray-500">{hold.date}</span>
              </div>
              <div className="text-sm">
                Items: {hold.cart.reduce((acc, item) => acc + item.qty, 0)} |
                Total: {currencyIcon} {hold.total ? hold.total.toFixed(2) : 0}
              </div>
              <div className="flex gap-2 mt-2">
                <Button
                  label="Open"
                  icon="pi pi-folder-open"
                  size="small"
                  className="flex-1"
                  onClick={() => {
                    onOpenHeldInvoice(hold);
                    setShowHeldInvoices(false);
                  }}
                />
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  size="small"
                  onClick={() => onClearHeldInvoice(hold.id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </Dialog>
  );
};

export default HeldInvComp;
