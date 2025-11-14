import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import t_bank_trans from "@/models/setup/t_bank_trans.json";

const BankTransactionFormComponent = ({ isBusy, errors, formData, onChange, onSave, bankAccounts }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="bank_account_id"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.bank_account_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="bank_account_id"
            value={formData.bank_account_id}
            options={bankAccounts.map(account => ({ label: `${account.account_name} (${account.bank_name})`, value: account.bank_account_id }))}
            onChange={(e) => onChange("bank_account_id", e.value)}
            className={`w-full ${errors.bank_account_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_trans.t_bank_trans.bank_account_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.bank_account_id && (
            <small className="mb-3 text-red-500">{errors.bank_account_id}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="transaction_date"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.transaction_date.name} <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="transaction_date"
            value={formData.transaction_date ? new Date(formData.transaction_date) : null}
            onChange={(e) => onChange("transaction_date", e.value ? e.value.toISOString().split('T')[0] : "")}
            className={`w-full ${errors.transaction_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_bank_trans.t_bank_trans.transaction_date.name}`}
          />
          {errors.transaction_date && (
            <small className="mb-3 text-red-500">{errors.transaction_date}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="transaction_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.transaction_name.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="transaction_name"
            value={formData.transaction_name}
            onChange={(e) => onChange("transaction_name", e.target.value)}
            className={`w-full ${errors.transaction_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.transaction_name.name}`}
          />
          {errors.transaction_name && (
            <small className="mb-3 text-red-500">{errors.transaction_name}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="reference_no"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.reference_no.name}
          </label>
          <InputText
            name="reference_no"
            value={formData.reference_no}
            onChange={(e) => onChange("reference_no", e.target.value)}
            className={`w-full ${errors.reference_no ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.reference_no.name}`}
          />
          {errors.reference_no && (
            <small className="mb-3 text-red-500">{errors.reference_no}</small>
          )}
        </div>
        <div className="col-12">
          <label
            htmlFor="transaction_details"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.transaction_details.name}
          </label>
          <InputText
            name="transaction_details"
            value={formData.transaction_details}
            onChange={(e) => onChange("transaction_details", e.target.value)}
            className={`w-full ${errors.transaction_details ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.transaction_details.name}`}
          />
          {errors.transaction_details && (
            <small className="mb-3 text-red-500">{errors.transaction_details}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="debit_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.debit_amount.name}
          </label>
          <InputNumber
            name="debit_amount"
            value={formData.debit_amount}
            onValueChange={(e) => onChange("debit_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.debit_amount ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.debit_amount.name}`}
          />
          {errors.debit_amount && (
            <small className="mb-3 text-red-500">{errors.debit_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="credit_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_trans.t_bank_trans.credit_amount.name}
          </label>
          <InputNumber
            name="credit_amount"
            value={formData.credit_amount}
            onValueChange={(e) => onChange("credit_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.credit_amount ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_trans.t_bank_trans.credit_amount.name}`}
          />
          {errors.credit_amount && (
            <small className="mb-3 text-red-500">{errors.credit_amount}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.bank_transactions_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              loading={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankTransactionFormComponent;
