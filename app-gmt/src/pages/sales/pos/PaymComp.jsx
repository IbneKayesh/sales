import { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import "./PaymComp.css";
import { Button } from "primereact/button";

const PaymComp = ({
  currencyIcon,
  formData,
  onChange,
  onSubmitClick,
  paymentModes,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = parseFloat(formData.price_total);
      const decimal = value % 1;
      onChange("disc_addti", decimal.toFixed(3));
    }
  };

  return (
    <div className="paym-comp">
      <div className="paym-header">
        <h3>Payment Processing</h3>
      </div>
      <div className="paym-body">
        {/* {JSON.stringify(formData)} */}
        <div className="paym-summary">
          <div className="summary-row">
            <span>Subtotal</span>
            <span>
              {currencyIcon} {formData.sub_total.toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Total VAT</span>
            <span>
              {currencyIcon} {formData.vat_total.toFixed(2)}
            </span>
          </div>
          <div className="summary-row">
            <span>Total Discount</span>
            <span>
              -{currencyIcon} {formData.disc_total.toFixed(2)}
            </span>
          </div>
          {Number(formData.disc_addti || 0) > 0 && (
            <div className="summary-row font-bold text-red-500">
              <span>Additional Discount</span>
              <span>
                -{currencyIcon} {Number(formData.disc_addti || 0).toFixed(2)}
              </span>
            </div>
          )}
          <div className="summary-row">
            <span>Balance</span>
            <span>
              {currencyIcon} {formData.site_blnc.toFixed(2)}
            </span>
          </div>
          <div className="summary-row total">
            <span>Grand Total</span>
            <span>
              {currencyIcon} {formData.price_total.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="paym-inputs">
          <div className="input-group">
            <label>Payment Mode</label>
            <Dropdown
              value={formData.paym_mode}
              onChange={(e) => onChange("paym_mode", e.value)}
              options={paymentModes}
              optionValue="clpt_id"
              optionLabel="clpt_name"
              placeholder="Select a Payment Mode"
              className="w-full"
              size="small"
            />
          </div>
          <div className="input-group">
            <label>Additional Discount</label>
            <input
              type="number"
              className="p-inputtext"
              placeholder="0.00"
              value={formData.disc_addti}
              onChange={(e) => onChange("disc_addti", e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>
          <div className="input-group">
            <label>Amount Paid</label>
            <input
              type="number"
              className="p-inputtext"
              placeholder="0.00"
              value={formData.paid_amount}
              onChange={(e) => onChange("paid_amount", e.target.value)}
            />
          </div>
          <div className="change-display">
            <label>Change Due</label>
            <div className="change-amount">
              {currencyIcon}{" "}
              {formData.change_due > 0
                ? formData.change_due.toFixed(2)
                : "0.00"}
            </div>
          </div>
        </div>

        <Button
          label="Complete Transaction"
          icon="pi pi-check-circle"
          className="complete-btn"
          disabled={formData.price_total === 0 || formData.change_due < 0}
          onClick={() => onSubmitClick()}
        />
      </div>
    </div>
  );
};

export default PaymComp;
