import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import t_contacts from "@/models/setup/t_contacts.json";

const ContactsFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  const contactTypeOptions = [
    { label: "Customer", value: "Customer" },
    { label: "Supplier", value: "Supplier" },
  ];

  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="contact_name"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.t_contacts.contact_name.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="contact_name"
            value={formData.contact_name}
            onChange={(e) => onChange("contact_name", e.target.value)}
            className={`w-full ${errors.contact_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.t_contacts.contact_name.name}`}
          />
          {errors.contact_name && (
            <small className="mb-3 text-red-500">{errors.contact_name}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="contact_address"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.t_contacts.contact_address.name}
          </label>
          <InputText
            name="contact_address"
            value={formData.contact_address}
            onChange={(e) => onChange("contact_address", e.target.value)}
            className={`w-full ${errors.contact_address ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_contacts.t_contacts.contact_address.name}`}
          />
          {errors.contact_address && (
            <small className="mb-3 text-red-500">{errors.contact_address}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="contact_type"
            className="block text-900 font-medium mb-2"
          >
            {t_contacts.t_contacts.contact_type.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="contact_type"
            value={formData.contact_type}
            options={contactTypeOptions}
            onChange={(e) => onChange("contact_type", e.value)}
            className={`w-full ${errors.contact_type ? "p-invalid" : ""}`}
            placeholder={`Select ${t_contacts.t_contacts.contact_type.name}`}
          />
          {errors.contact_type && (
            <small className="mb-3 text-red-500">{errors.contact_type}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.contact_id ? "Update" : "Save"}
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

export default ContactsFormComponent;
