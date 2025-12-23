import { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useBanks } from "@/hooks/accounts/useBanks";
import { paymentModeOptions } from "@/utils/vtable";
import { useContacts } from "@/hooks/setup/useContacts";
import { useAccountsHeads } from "@/hooks/accounts/useAccountsHeads";

const LedgerFormComponent = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  setSelectedHead,
}) => {
  const { accountsHeadsList } = useAccountsHeads();
  const { accountList, fetchAllAccountList } = useBanks();
  const { internalContactList } = useContacts();

  useEffect(() => {
    fetchAllAccountList();
  }, [fetchAllAccountList]);

   const handleChange = (e) => {
    const value = e?.value ?? e?.target?.value;

    onChange("head_id", value);

    const selectedHead = accountsHeadsList?.find(
      (f) => f.head_id === value
    );

    setSelectedHead(selectedHead || null);
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-3">
          <label
            htmlFor="account_id"
            className="block text-900 font-medium mb-2"
          >
            Account
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="account_id"
            value={formData.account_id}
            options={accountList.map((account) => ({
              label: account.account_name + " - " + account.bank_name,
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
        <div className="col-12 md:col-3">
          <label htmlFor="head_id" className="block text-900 font-medium mb-2">
            Head Name
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="head_id"
            value={formData.head_id}
            options={accountsHeadsList.map((head) => ({
              label:
                head.head_name +
                " - " +
                head.group_name +
                " - " +
                head.group_type,
              value: head.head_id,
            }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => handleChange(e)}
            className={`w-full ${errors.head_id ? "p-invalid" : ""}`}
            placeholder={`Select Head Name`}
            filter
            showClear
          />
          {errors.head_id && (
            <small className="mb-3 text-red-500">{errors.head_id}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="contact_id"
            className="block text-900 font-medium mb-2"
          >
            Contact
            <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_id"
            value={formData.contact_id}
            options={internalContactList.map((account) => ({
              label: account.contact_name,
              value: account.contact_id,
            }))}
            optionLabel="label"
            optionValue="value"
            onChange={(e) => onChange("contact_id", e.value)}
            className={`w-full ${errors.contact_id ? "p-invalid" : ""}`}
            placeholder={`Select Contact`}
            filter
            showClear
          />
          {errors.contact_id && (
            <small className="mb-3 text-red-500">{errors.contact_id}</small>
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
            htmlFor="credit_amount"
            className="block text-900 font-medium mb-2"
          >
            Amount <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="credit_amount"
            value={formData.credit_amount}
            onValueChange={(e) => onChange("credit_amount", e.value)}
            mode="currency"
            currency="BDT"
            locale="en-US"
            className={`${errors.credit_amount ? "p-invalid" : ""}`}
            style={{ width: "100%" }}
            inputStyle={{ width: "100%" }}
          />
          {errors.credit_amount && (
            <small className="mb-3 text-red-500">{errors.credit_amount}</small>
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

export default LedgerFormComponent;
