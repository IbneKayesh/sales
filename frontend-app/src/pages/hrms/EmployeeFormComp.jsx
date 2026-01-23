import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmrb_emply from "@/models/hrms/tmrb_emply.json";
import { InputSwitch } from "primereact/inputswitch";

const EmployeeFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_ecode"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_ecode.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="emply_ecode"
          value={formData.emply_ecode}
          onChange={(e) => onChange("emply_ecode", e.target.value)}
          className={`w-full ${errors.emply_ecode ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_ecode.label}`}
        />
        {errors.emply_ecode && (
          <small className="mb-3 text-red-500">{errors.emply_ecode}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_pswrd"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_pswrd.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="emply_pswrd"
          value={formData.emply_pswrd}
          onChange={(e) => onChange("emply_pswrd", e.target.value)}
          className={`w-full ${errors.emply_pswrd ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_pswrd.label}`}
        />
        {errors.emply_pswrd && (
          <small className="mb-3 text-red-500">{errors.emply_pswrd}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="emply_ename"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_ename.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="emply_ename"
          value={formData.emply_ename}
          onChange={(e) => onChange("emply_ename", e.target.value)}
          className={`w-full ${errors.emply_ename ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_ename.label}`}
        />
        {errors.emply_ename && (
          <small className="mb-3 text-red-500">{errors.emply_ename}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_econt"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_econt.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="emply_econt"
          value={formData.emply_econt}
          onChange={(e) => onChange("emply_econt", e.target.value)}
          className={`w-full ${errors.emply_econt ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_econt.label}`}
        />
        {errors.emply_econt && (
          <small className="mb-3 text-red-500">{errors.emply_econt}</small>
        )}
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="emply_addrs"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_addrs.label}
        </label>
        <InputText
          name="emply_addrs"
          value={formData.emply_addrs}
          onChange={(e) => onChange("emply_addrs", e.target.value)}
          className={`w-full ${errors.emply_addrs ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_addrs.label}`}
        />
        {errors.emply_addrs && (
          <small className="mb-3 text-red-500">{errors.emply_addrs}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_desig"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_desig.label} <span className="text-red-500">*</span>
        </label>
        <InputText
          name="emply_desig"
          value={formData.emply_desig}
          onChange={(e) => onChange("emply_desig", e.target.value)}
          className={`w-full ${errors.emply_desig ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmrb_emply.emply_desig.label}`}
        />
        {errors.emply_desig && (
          <small className="mb-3 text-red-500">{errors.emply_desig}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_login"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_login.label} <span className="text-red-500">*</span>
        </label>
        <InputSwitch
          name="emply_login"
          checked={formData.emply_login === 1}
          onChange={(e) => onChange("emply_login", e.value ? 1 : 0)}
          className={`${errors.emply_login ? "p-invalid" : ""}`}
        />
        {errors.emply_login && (
          <small className="mb-3 text-red-500">{errors.emply_login}</small>
        )}
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_jndat"
          className="block text-900 font-medium mb-2"
        >
          {tmrb_emply.emply_jndat.label} <span className="text-red-500">*</span>
        </label>
        <Calendar
          name="emply_jndat"
          value={
            formData.emply_jndat
              ? typeof formData.emply_jndat === "string" &&
                !formData.emply_jndat.includes("T")
                ? new Date(formData.emply_jndat + "T00:00:00")
                : new Date(formData.emply_jndat)
              : null
          }
          onChange={(e) => onChange("emply_jndat", e.target.value)}
          className={`w-full ${errors.emply_jndat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmrb_emply.emply_jndat.label}`}
        />
        {errors.emply_jndat && (
          <small className="mb-3 text-red-500">{errors.emply_jndat}</small>
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
            size="small"
            loading={isBusy}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeFormComp;
