import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Avatar } from "primereact/avatar";
import tm_role from "@/models/setup/tm_role.json";
import { useAuth } from "@/hooks/useAuth";
import { InputSwitch } from "primereact/inputswitch";
import { Dropdown } from "primereact/dropdown";
import { Chips } from "primereact/chips";
import {
  businessTagsOptions,
  countryOptions,
  businessTypeOptions,
} from "@/utils/vtable";

const LevelFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {


  return (
    <div className="grid">
      <div className="col-12 md:col-3">
        <label
          htmlFor="bsins_bname"
          className="block text-900 font-medium mb-2"
        >
          {tm_role.bsins_bname.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_bname"
          value={formData.bsins_bname}
          onChange={(e) => onChange("bsins_bname", e.target.value)}
          className={`w-full ${errors.bsins_bname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tm_role.bsins_bname.label}`}
        />
        {errors.bsins_bname && (
          <small className="mb-3 text-red-500">{errors.bsins_bname}</small>
        )}
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="bsins_addrs"
          className="block text-900 font-medium mb-2"
        >
          {tm_role.bsins_addrs.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="bsins_addrs"
          value={formData.bsins_addrs}
          onChange={(e) => onChange("bsins_addrs", e.target.value)}
          className={`w-full ${errors.bsins_addrs ? "p-invalid" : ""}`}
          placeholder={`Enter ${tm_role.bsins_addrs.label}`}
        />
        {errors.bsins_addrs && (
          <small className="mb-3 text-red-500">{errors.bsins_addrs}</small>
        )}
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={formData.id ? "Update" : "Save"}
            icon={"pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default LevelFormComp;
