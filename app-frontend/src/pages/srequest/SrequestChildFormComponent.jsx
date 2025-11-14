import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import t_so_child from "@/models/srequest/t_so_child.json";

const SrequestChildFormComponent = ({ isBusy, errors, formData, onChange, onSave, items, soMasters }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="so_master_id"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.so_master_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="so_master_id"
            value={formData.so_master_id}
            options={soMasters.map(master => ({ label: `SO #${master.so_master_id} - ${master.contact_name}`, value: master.so_master_id }))}
            onChange={(e) => onChange("so_master_id", e.value)}
            className={`w-full ${errors.so_master_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_so_child.t_so_child.so_master_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.so_master_id && (
            <small className="mb-3 text-red-500">{errors.so_master_id}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_id"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.item_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="item_id"
            value={formData.item_id}
            options={items.map(item => ({ label: item.item_name, value: item.item_id }))}
            onChange={(e) => onChange("item_id", e.value)}
            className={`w-full ${errors.item_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_so_child.t_so_child.item_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.item_id && (
            <small className="mb-3 text-red-500">{errors.item_id}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.item_rate.name} <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="item_rate"
            value={formData.item_rate}
            onValueChange={(e) => onChange("item_rate", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.item_rate ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.item_rate.name}`}
          />
          {errors.item_rate && (
            <small className="mb-3 text-red-500">{errors.item_rate}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="order_item_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.order_item_qty.name} <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="order_item_qty"
            value={formData.order_item_qty}
            onValueChange={(e) => onChange("order_item_qty", e.value)}
            className={`w-full ${errors.order_item_qty ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.order_item_qty.name}`}
          />
          {errors.order_item_qty && (
            <small className="mb-3 text-red-500">{errors.order_item_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="return_item_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.return_item_qty.name}
          </label>
          <InputNumber
            name="return_item_qty"
            value={formData.return_item_qty}
            onValueChange={(e) => onChange("return_item_qty", e.value)}
            className={`w-full ${errors.return_item_qty ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.return_item_qty.name}`}
          />
          {errors.return_item_qty && (
            <small className="mb-3 text-red-500">{errors.return_item_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.item_qty.name} <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="item_qty"
            value={formData.item_qty}
            onValueChange={(e) => onChange("item_qty", e.value)}
            className={`w-full ${errors.item_qty ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.item_qty.name}`}
          />
          {errors.item_qty && (
            <small className="mb-3 text-red-500">{errors.item_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="discount_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.discount_amount.name}
          </label>
          <InputNumber
            name="discount_amount"
            value={formData.discount_amount}
            onValueChange={(e) => onChange("discount_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.discount_amount ? "p-invalid" : ""}`}
          />
          {errors.discount_amount && (
            <small className="mb-3 text-red-500">{errors.discount_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_amount"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.item_amount.name} <span className="text-red-500">*</span>
          </label>
          <InputNumber
            name="item_amount"
            value={formData.item_amount}
            onValueChange={(e) => onChange("item_amount", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.item_amount ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.item_amount.name}`}
          />
          {errors.item_amount && (
            <small className="mb-3 text-red-500">{errors.item_amount}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_note"
            className="block text-900 font-medium mb-2"
          >
            {t_so_child.t_so_child.item_note.name}
          </label>
          <InputText
            name="item_note"
            value={formData.item_note}
            onChange={(e) => onChange("item_note", e.target.value)}
            className={`w-full ${errors.item_note ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_so_child.t_so_child.item_note.name}`}
          />
          {errors.item_note && (
            <small className="mb-3 text-red-500">{errors.item_note}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.id ? "Update" : "Save"}
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

export default SrequestChildFormComponent;
