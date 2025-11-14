import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { Checkbox } from "primereact/checkbox";
import t_so_master from "@/models/srequest/t_so_master.json";

const SrequestMasterFormComponent = ({ isBusy, errors, formData, onChange, onSave, contacts }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="transaction_date"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.transaction_date.name} <span className="text-red-500">*</span>
          </label>
          <Calendar
            name="transaction_date"
            value={formData.transaction_date ? new Date(formData.transaction_date) : null}
            onChange={(e) => onChange("transaction_date", e.value ? e.value.toISOString().split('T')[0] : "")}
            className={`w-full ${errors.transaction_date ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${t_so_master.t_so_master.transaction_date.name}`}
          />
          {errors.transaction_date && (
            <small className="mb-3 text-red-500">{errors.transaction_date}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="contacts_id"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.contacts_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contacts_id"
            value={formData.contacts_id}
            options={contacts.map(contact => ({ label: contact.contact_name, value: contact.contact_id }))}
            onChange={(e) => onChange("contacts_id", e.value)}
            className={`w-full ${errors.contacts_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_so_master.t_so_master.contacts_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.contacts_id && (
            <small className="mb-3 text-red-500">{errors.contacts_id}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="transaction_note"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.transaction_note.name}
          </label>
          <InputText
            name="transaction_note"
            value={formData.transaction_note}
            onChange={(e) => onChange("transaction_note", e.target.value)}
            className={`w-full ${errors.transaction_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_master.t_so_master.transaction_note.name}`}
          />
          {errors.transaction_note && (
            <small className="mb-3 text-red-500">{errors.transaction_note}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="total_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.total_amount.name}
          </label>
          <InputNumber
            name="total_amount"
            value={formData.total_amount}
            onValueChange={(e) => onChange("total_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.total_amount ? "p-invalid" : ""}`}
          />
          {errors.total_amount && (
            <small className="mb-3 text-red-500">{errors.total_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="paid_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.paid_amount.name}
          </label>
          <InputNumber
            name="paid_amount"
            value={formData.paid_amount}
            onValueChange={(e) => onChange("paid_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.paid_amount ? "p-invalid" : ""}`}
          />
          {errors.paid_amount && (
            <small className="mb-3 text-red-500">{errors.paid_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="is_paid"
            className="block text-900 font-medium mb-2"
          >
            {t_so_master.t_so_master.is_paid.name}
          </label>
          <div className="flex align-items-center">
            <Checkbox
              name="is_paid"
              checked={formData.is_paid}
              onChange={(e) => onChange("is_paid", e.checked)}
              className={errors.is_paid ? "p-invalid" : ""}
            />
            <label htmlFor="is_paid" className="ml-2">Paid</label>
          </div>
          {errors.is_paid && (
            <small className="mb-3 text-red-500">{errors.is_paid}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.so_master_id ? "Update" : "Save"}
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

export default SrequestMasterFormComponent;
