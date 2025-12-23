import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { useBanks } from "@/hooks/accounts/useBanks";
import { paymentModeOptions } from "@/utils/vtable";

const TransferFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  const { accountList, fetchAllAccountList } = useBanks();

  useEffect(() => {
    fetchAllAccountList();
  }, [fetchAllAccountList]);



  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-5">
          <label
            htmlFor="account_id"
            className="block text-900 font-medium mb-2"
          >
            From Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="account_id"
            value={formData.account_id}
            options={accountList
              .filter((a) => a.current_balance > 0)
              .map((account) => ({
                label: account.account_name + " - " + account.bank_name + " - " + account.current_balance,
                value: account.account_id,
              }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("account_id", e.value)}
            className={`w-full ${errors.account_id ? "p-invalid" : ""}`}
            placeholder={`Select Account`}
            filter
            showClear
          />
          {errors.account_id && (
            <small className="mb-3 text-red-500">{errors.account_id}</small>
          )}
        </div>
        <div className="col-12 md:col-5">
          <label
            htmlFor="to_account_id"
            className="block text-900 font-medium mb-2"
          >
            To Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="to_account_id"
            value={formData.to_account_id}
            options={accountList.map((account) => ({
              label: account.account_name + " - " + account.bank_name + " - " + account.current_balance,
              value: account.account_id,
            }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("to_account_id", e.value)}
            className={`w-full ${errors.to_account_id ? "p-invalid" : ""}`}
            placeholder={`Select To Account`}
            filter
            showClear
          />
          {errors.to_account_id && (
            <small className="mb-3 text-red-500">{errors.to_account_id}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="ledger_date"
            className="block text-900 font-medium mb-2"
          >
            Ledger Date <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="ledger_date"
            value={formData.ledger_date ? new Date(formData.ledger_date) : null}
            onChange={(e) =>
              onChange(
                "ledger_date",
                e.value ? e.value.toISOString().split("T")[0] : ""
              )
            }
            className={`w-full ${errors.ledger_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select Ledger Date`}
          />
          {errors.ledger_date && (
            <small className="mb-3 text-red-500">{errors.ledger_date}</small>
          )}
        </div>

        <div className="col-12 md:col-4">
          <label
            htmlFor="ledger_ref"
            className="block text-900 font-medium mb-2"
          >
            Ledger Ref
          </label>
          <InputText
            name="ledger_ref"
            value={formData.ledger_ref}
            onChange={(e) => onChange("ledger_ref", e.target.value)}
            className={`w-full ${errors.ledger_ref ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Ref`}
          />
          {errors.ledger_ref && (
            <small className="mb-3 text-red-500">{errors.ledger_ref}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="ledger_note"
            className="block text-900 font-medium mb-2"
          >
            Ledger Note
          </label>
          <InputText
            name="ledger_note"
            value={formData.ledger_note}
            onChange={(e) => onChange("ledger_note", e.target.value)}
            className={`w-full ${errors.ledger_note ? "p-invalid" : ""}`}
            placeholder={`Enter Ledger Note`}
          />
          {errors.ledger_note && (
            <small className="mb-3 text-red-500">{errors.ledger_note}</small>
          )}
        </div>
        <div className="col-12 md:col-3">
          <label
            htmlFor="payment_mode"
            className="block text-900 font-medium mb-2"
          >
            Payment Mode
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="payment_mode"
            value={formData.payment_mode}
            options={paymentModeOptions}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("payment_mode", e.value)}
            className={`w-full ${errors.payment_mode ? "p-invalid" : ""}`}
            placeholder={`Select Payment Mode`}
            filter
            showClear
          />
          {errors.payment_mode && (
            <small className="mb-3 text-red-500">{errors.payment_mode}</small>
          )}
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="transfer_amount"
            className="block text-900 font-medium mb-2"
          >
           Transfer Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="transfer_amount"
            value={formData.transfer_amount}
            onValueChange={(e) => onChange("transfer_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`${errors.transfer_amount ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.transfer_amount && (
            <small className="mb-3 text-red-500">{errors.transfer_amount}</small>
          )}
        </div>
      </div>

      <div className="flex justify-content-end">
        <Button
          type="button"
          label={formData.ledger_id ? "Update" : "Save"}
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

export default TransferFormComponent;
