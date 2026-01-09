import { useEffect, useState } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { paymentModeOptions } from "@/utils/vtable";
import { useAccounts } from "@/hooks/accounts/useAccounts";

const TransferFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  const { accountsListDdl, fetchAccountsListDdl } = useAccounts();

  useEffect(() => {
    fetchAccountsListDdl();
  }, []);

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_bacts_from"
            className="block text-900 font-medium mb-2"
          >
            From Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_bacts_from"
            value={formData.ledgr_bacts_from}
            options={accountsListDdl
              .filter((item) => Number(item.bacts_crbln) > 0)
              .map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_bacts_from", e.value)}
            className={`w-full ${errors.ledgr_bacts_from ? "p-invalid" : ""}`}
            placeholder={`Select From Account`}
            filter
            showClear
          />
          {errors.ledgr_bacts_from && (
            <small className="mb-3 text-red-500">
              {errors.ledgr_bacts_from}
            </small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_bacts_to"
            className="block text-900 font-medium mb-2"
          >
            To Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_bacts_to"
            value={formData.ledgr_bacts_to}
            options={accountsListDdl}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_bacts_to", e.value)}
            className={`w-full ${errors.ledgr_bacts_to ? "p-invalid" : ""}`}
            placeholder={`Select To Account`}
            filter
            showClear
          />
          {errors.ledgr_bacts_to && (
            <small className="mb-3 text-red-500">{errors.ledgr_bacts_to}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_pymod"
            className="block text-900 font-medium mb-2"
          >
            Mode
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="ledgr_pymod"
            value={formData.ledgr_pymod}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("ledgr_pymod", e.value)}
            className={`w-full ${errors.ledgr_pymod ? "p-invalid" : ""}`}
            placeholder={`Select Mode`}
            filter
            showClear
          />
          {errors.ledgr_pymod && (
            <small className="mb-3 text-red-500">{errors.ledgr_pymod}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_trdat"
            className="block text-900 font-medium mb-2"
          >
            Ledger Date <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="ledgr_trdat"
            value={formData.ledgr_trdat ? new Date(formData.ledgr_trdat) : null}
            onChange={(e) =>
              onChange(
                "ledgr_trdat",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.ledgr_trdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select Ledger Date`}
          />
          {errors.ledgr_trdat && (
            <small className="mb-3 text-red-500">{errors.ledgr_trdat}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_refno"
            className="block text-900 font-medium mb-2"
          >
            Ledger Ref
          </label>
          <InputText
            name="ledgr_refno"
            value={formData.ledgr_refno}
            onChange={(e) => onChange("ledgr_refno", e.target.value)}
            className={`w-full ${errors.ledgr_refno ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Ref`}
          />
          {errors.ledgr_refno && (
            <small className="mb-3 text-red-500">{errors.ledgr_refno}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledgr_notes"
            className="block text-900 font-medium mb-2"
          >
            Note
          </label>
          <InputText
            name="ledgr_notes"
            value={formData.ledgr_notes}
            onChange={(e) => onChange("ledgr_notes", e.target.value)}
            className={`w-full ${errors.ledgr_notes ? "p-invalid" : ""}`}
            placeholder={`Enter Note`}
          />
          {errors.ledgr_notes && (
            <small className="mb-3 text-red-500">{errors.ledgr_notes}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledgr_dbamt"
            className="block text-900 font-medium mb-2"
          >
            Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="ledgr_dbamt"
            value={formData.ledgr_dbamt}
            onValueChange={(e) => onChange("ledgr_dbamt", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`${errors.ledgr_dbamt ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.ledgr_dbamt && (
            <small className="mb-3 text-red-500">{errors.ledgr_dbamt}</small>
          )}
        </div>
      </div>

      <div className="flex justify-content-end">
        <Button
          type="button"
          label={formData.id ? "Update" : "Save"}
          icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
          severity="success"
          size="small"
          loading={isBusy}
          onClick={onSave}
        />
      </div>
    </>
  );
};

export default TransferFormComp;
