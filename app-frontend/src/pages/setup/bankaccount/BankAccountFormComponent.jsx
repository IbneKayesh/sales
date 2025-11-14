import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import t_bank_account from "@/models/setup/t_bank_account.json";

const BankAccountFormComponent = ({ isBusy, errors, formData, onChange, onSave, banks }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="bank_id"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.bank_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="bank_id"
            value={formData.bank_id}
            options={banks.map(bank => ({ label: bank.bank_name, value: bank.bank_id }))}
            onChange={(e) => onChange("bank_id", e.value)}
            className={`w-full ${errors.bank_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_bank_account.t_bank_account.bank_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.bank_id && (
            <small className="mb-3 text-red-500">{errors.bank_id}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="account_name"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.account_name.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="account_name"
            value={formData.account_name}
            onChange={(e) => onChange("account_name", e.target.value)}
            className={`w-full ${errors.account_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_account.t_bank_account.account_name.name}`}
          />
          {errors.account_name && (
            <small className="mb-3 text-red-500">{errors.account_name}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="account_number"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.account_number.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="account_number"
            value={formData.account_number}
            onChange={(e) => onChange("account_number", e.target.value)}
            className={`w-full ${errors.account_number ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_bank_account.t_bank_account.account_number.name}`}
          />
          {errors.account_number && (
            <small className="mb-3 text-red-500">{errors.account_number}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="opening_date"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.opening_date.name} <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="opening_date"
            value={formData.opening_date ? new Date(formData.opening_date) : null}
            onChange={(e) => onChange("opening_date", e.value ? e.value.toISOString().split('T')[0] : "")}
            className={`w-full ${errors.opening_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_bank_account.t_bank_account.opening_date.name}`}
          />
          {errors.opening_date && (
            <small className="mb-3 text-red-500">{errors.opening_date}</small>
          )}
        </div>

        <div className="col-12 md:col-6">
          <label
            htmlFor="debit_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.debit_balance.name}
          </label>
          <InputNumber
            name="debit_balance"
            value={formData.debit_balance}
            onValueChange={(e) => onChange("debit_balance", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.debit_balance ? "p-invalid" : ""}`}
            disabled
          />
          {errors.debit_balance && (
            <small className="mb-3 text-red-500">{errors.debit_balance}</small>
          )}
        </div>

        <div className="col-12 md:col-6">
          <label
            htmlFor="credit_balance"
            className="block text-900 font-medium mb-2"
          >
            {t_bank_account.t_bank_account.credit_balance.name}
          </label>
          <InputNumber
            name="credit_balance"
            value={formData.credit_balance}
            onValueChange={(e) => onChange("credit_balance", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.credit_balance ? "p-invalid" : ""}`}
            disabled
          />
          {errors.credit_balance && (
            <small className="mb-3 text-red-500">{errors.credit_balance}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.bank_account_id ? "Update" : "Save"}
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

export default BankAccountFormComponent;
