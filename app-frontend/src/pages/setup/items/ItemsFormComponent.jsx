import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Dropdown } from "primereact/dropdown";
import t_items from "@/models/setup/t_items.json";

const ItemsFormComponent = ({ isBusy, errors, formData, onChange, onSave, units }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_name"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.item_name.name} <span className="text-red-500">*</span>
          </label>
          <InputText
            name="item_name"
            value={formData.item_name}
            onChange={(e) => onChange("item_name", e.target.value)}
            className={`w-full ${errors.item_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.item_name.name}`}
          />
          {errors.item_name && (
            <small className="mb-3 text-red-500">{errors.item_name}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="item_description"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.item_description.name}
          </label>
          <InputText
            name="item_description"
            value={formData.item_description}
            onChange={(e) => onChange("item_description", e.target.value)}
            className={`w-full ${errors.item_description ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.item_description.name}`}
          />
          {errors.item_description && (
            <small className="mb-3 text-red-500">{errors.item_description}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="small_unit_id"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.small_unit_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="small_unit_id"
            value={formData.small_unit_id}
            options={units.map(unit => ({ label: unit.unit_name, value: unit.unit_id }))}
            onChange={(e) => onChange("small_unit_id", e.value)}
            className={`w-full ${errors.small_unit_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_items.t_items.small_unit_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.small_unit_id && (
            <small className="mb-3 text-red-500">{errors.small_unit_id}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="unit_difference_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.unit_difference_qty.name}
          </label>
          <InputNumber
            name="unit_difference_qty"
            value={formData.unit_difference_qty}
            onValueChange={(e) => onChange("unit_difference_qty", e.value)}
            className={`w-full ${errors.unit_difference_qty ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.unit_difference_qty.name}`}
          />
          {errors.unit_difference_qty && (
            <small className="mb-3 text-red-500">{errors.unit_difference_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="big_unit_id"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.big_unit_id.name} <span className="text-red-500">*</span>
          </label>
          <Dropdown
            name="big_unit_id"
            value={formData.big_unit_id}
            options={units.map(unit => ({ label: unit.unit_name, value: unit.unit_id }))}
            onChange={(e) => onChange("big_unit_id", e.value)}
            className={`w-full ${errors.big_unit_id ? "p-invalid" : ""}`}
            placeholder={`Select ${t_items.t_items.big_unit_id.name}`}
            optionLabel="label"
            optionValue="value"
          />
          {errors.big_unit_id && (
            <small className="mb-3 text-red-500">{errors.big_unit_id}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="stock_qty"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.stock_qty.name}
          </label>
          <InputNumber
            name="stock_qty"
            value={formData.stock_qty}
            onValueChange={(e) => onChange("stock_qty", e.value)}
            className={`w-full ${errors.stock_qty ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.stock_qty.name}`}
            disabled
          />
          {errors.stock_qty && (
            <small className="mb-3 text-red-500">{errors.stock_qty}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="purchase_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.purchase_rate.name}
          </label>
          <InputNumber
            name="purchase_rate"
            value={formData.purchase_rate}
            onValueChange={(e) => onChange("purchase_rate", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.purchase_rate ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.purchase_rate.name}`}
          />
          {errors.purchase_rate && (
            <small className="mb-3 text-red-500">{errors.purchase_rate}</small>
          )}
        </div>
        <div className="col-12 md:col-4">
          <label
            htmlFor="sales_rate"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.sales_rate.name}
          </label>
          <InputNumber
            name="sales_rate"
            value={formData.sales_rate}
            onValueChange={(e) => onChange("sales_rate", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.sales_rate ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.sales_rate.name}`}
          />
          {errors.sales_rate && (
            <small className="mb-3 text-red-500">{errors.sales_rate}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="discount_percent"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.discount_percent.name}
          </label>
          <InputNumber
            name="discount_percent"
            value={formData.discount_percent}
            onValueChange={(e) => onChange("discount_percent", e.value)}
            suffix="%"
            min={0}
            max={100}
            className={`w-full ${errors.discount_percent ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.discount_percent.name}`}
          />
          {errors.discount_percent && (
            <small className="mb-3 text-red-500">{errors.discount_percent}</small>
          )}
        </div>
        <div className="col-12 md:col-6">
          <label
            htmlFor="approx_profit"
            className="block text-900 font-medium mb-2"
          >
            {t_items.t_items.approx_profit.name}
          </label>
          <InputNumber
            name="approx_profit"
            value={formData.approx_profit}
            onValueChange={(e) => onChange("approx_profit", e.value)}
            mode="currency"
            currency="USD"
            locale="en-US"
            className={`w-full ${errors.approx_profit ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_items.t_items.approx_profit.name}`}
            disabled
          />
          {errors.approx_profit && (
            <small className="mb-3 text-red-500">{errors.approx_profit}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.item_id ? "Update" : "Save"}
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

export default ItemsFormComponent;
