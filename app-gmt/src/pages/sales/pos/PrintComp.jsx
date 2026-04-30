import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./PrintComp.css";

const PrintComp = ({
  currencyIcon,
  selectedCustomer,
  dataListCart,
  paymentDetails,
  onClose,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const billNo = `INV-${Math.floor(Date.now() / 1000)}`;
  const billDate = new Date().toLocaleString();

  const dialogFooter = (
    <div className="print-actions no-print">
      <Button
        label="Back"
        icon="pi pi-arrow-left"
        severity="secondary"
        onClick={onClose}
      />
      <Button label="Print" icon="pi pi-print" onClick={handlePrint} />
    </div>
  );

  return (
    <Dialog
      visible={true}
      onHide={onClose}
      header="Print"
      footer={dialogFooter}
      className="print-dialog"
      style={{ width: "550px" }}
      modal
    >
      <div className="print-container">
        <div className="invoice-wrapper">
          <div className="invoice-header">
            <h2>Demo Company Ltd.</h2>
            <p>Address: 123 Demo Street, Tech City, 10001</p>
            <p>GSTIN: 22AAAAA0000A1Z5</p>
            <p>Phone: +1 234 567 8900</p>
          </div>

          <div className="invoice-meta">
            <div className="meta-left">
              <p>
                <strong>Bill No:</strong> {billNo}
              </p>
              <p>
                <strong>Date:</strong> {billDate}
              </p>
            </div>
            <div className="meta-right">
              <p>
                <strong>Customer:</strong>{" "}
                {selectedCustomer
                  ? selectedCustomer.site_name
                  : "Walk-in Customer"}
              </p>
              {selectedCustomer && selectedCustomer.site_mob1 && (
                <p>
                  <strong>Mobile:</strong> {selectedCustomer.site_mob1}
                </p>
              )}
              {selectedCustomer && selectedCustomer.site_adrs && (
                <p>
                  <strong>Address:</strong> {selectedCustomer.site_adrs}
                </p>
              )}
            </div>
          </div>

          <div className="invoice-items">
            <table className="items-table">
              <tbody>
                {dataListCart.map((item, index) => {
                  const qty = item.qty || 1;
                  const price = item.amim_mrpp || 0;
                  const disc = item.pldt_dfds || 0;
                  const vat = item.amim_pvat || item.amim_pexc || 0;

                  const itemSubtotal = price * qty;
                  const itemDiscount = price * (disc / 100) * qty;
                  const itemTax =
                    (price - price * (disc / 100)) * (vat / 100) * qty;
                  const amount = itemSubtotal - itemDiscount + itemTax;

                  return (
                    <React.Fragment key={item.amim_id}>
                      <tr className="item-row-name">
                        <td colSpan="5">
                          {index + 1}. {item.amim_name}
                        </td>
                      </tr>
                      <tr className="item-row-details">
                        <td>
                          {qty} x {price.toFixed(2)}
                        </td>
                        <td>D:{disc}%</td>
                        <td>V:{vat}%</td>
                        <td className="text-right">
                          {currencyIcon} {amount.toFixed(2)}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>

          {paymentDetails && (
            <div className="invoice-summary">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>
                  {currencyIcon} {paymentDetails.sub_total.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Total VAT:</span>
                <span>
                  {currencyIcon} {paymentDetails.vat_total.toFixed(2)}
                </span>
              </div>
              <div className="summary-row">
                <span>Item Discount:</span>
                <span>
                  -{currencyIcon} {paymentDetails.disc_total.toFixed(2)}
                </span>
              </div>
              {parseFloat(paymentDetails.disc_addti) > 0 && (
                <div className="summary-row">
                  <span>Additional Discount:</span>
                  <span>
                    -{currencyIcon}{" "}
                    {parseFloat(paymentDetails.disc_addti).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="summary-row">
                <span>Balance:</span>
                <span>
                  {currencyIcon} {paymentDetails.site_blnc.toFixed(2)}
                </span>
              </div>
              <div className="summary-row grand-total">
                <span>Grand Total:</span>
                <span>
                  {currencyIcon} {paymentDetails.price_total.toFixed(2)}
                </span>
              </div>

              <div className="payment-info mt-4">
                <div className="summary-row">
                  <span>Payment Mode:</span>
                  <span className="capitalize">{paymentDetails.paym_mode_name}</span>
                </div>
                <div className="summary-row">
                  <span>Amount Paid:</span>
                  <span>
                    {currencyIcon}{" "}
                    {(parseFloat(paymentDetails.paid_amount) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="summary-row">
                  <span>Change Due:</span>
                  <span>
                    {currencyIcon} {paymentDetails.change_due.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="invoice-footer">
            <p>Thank you for your business!</p>
            <p>Please visit us again.</p>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default PrintComp;
