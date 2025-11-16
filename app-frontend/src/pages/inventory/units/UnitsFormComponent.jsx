import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import t_units from "@/models/inventory/t_units.json";

const UnitsFormComponent = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="p-1">
      <div className="grid">
        <div className="col-12 md:col-6">
          <label
            htmlFor="unit_name"
            className="block text-900 font-medium mb-2"
          >
            {t_units.t_units.unit_name.name}{" "}
            <span className="text-red-500">*</span>
          </label>
          <InputText
            name="unit_name"
            value={formData.unit_name}
            onChange={(e) => onChange("unit_name", e.target.value)}
            className={`w-full ${errors.unit_name ? "p-invalid" : ""}`}
            placeholder={`Enter ${t_units.t_units.unit_name.name}`}
          />
          {errors.unit_name && (
            <small className="mb-3 text-red-500">{errors.unit_name}</small>
          )}
        </div>
        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.unit_id ? "Update" : "Save"}
              icon={isBusy ? "pi pi-spin pi-spinner" : "pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UnitsFormComponent;
