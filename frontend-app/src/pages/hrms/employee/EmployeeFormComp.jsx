import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmhb_emply from "@/models/hrms/tmhb_emply.json";
import { InputSwitch } from "primereact/inputswitch";
import RequiredText from "@/components/RequiredText";
import {
  genderOptions,
  maritalOptions,
  bloodGroupOptions,
  religionOptions,
  educationGradeOptions,
  designationOptions,
  employeeTypeOptions,
  employeeStatusOptions,
} from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";

const EmployeeFormComp = ({ isBusy, errors, formData, onChange, onSave }) => {
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label htmlFor="emply_ecode" className="block font-bold mb-2">
          {tmhb_emply.emply_ecode.label}
        </label>
        <InputText
          name="emply_ecode"
          value={formData.emply_ecode}
          onChange={(e) => onChange("emply_ecode", e.target.value)}
          className={`w-full ${errors.emply_ecode ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_ecode.label}`}
        />
        <RequiredText text={errors.emply_ecode} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_crdno" className="block font-bold mb-2">
          {tmhb_emply.emply_crdno.label}
        </label>
        <InputText
          name="emply_crdno"
          value={formData.emply_crdno}
          onChange={(e) => onChange("emply_crdno", e.target.value)}
          className={`w-full ${errors.emply_crdno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_crdno.label}`}
        />
        <RequiredText text={errors.emply_crdno} />
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="emply_ename"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_ename.label}
        </label>
        <InputText
          name="emply_ename"
          value={formData.emply_ename}
          onChange={(e) => onChange("emply_ename", e.target.value)}
          className={`w-full ${errors.emply_ename ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_ename.label}`}
        />
        <RequiredText text={errors.emply_ename} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_econt"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_econt.label}
        </label>
        <InputText
          name="emply_econt"
          value={formData.emply_econt}
          onChange={(e) => onChange("emply_econt", e.target.value)}
          className={`w-full ${errors.emply_econt ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_econt.label}`}
        />
        <RequiredText text={errors.emply_econt} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_email" className="block font-bold mb-2">
          {tmhb_emply.emply_email.label}
        </label>
        <InputText
          name="emply_email"
          value={formData.emply_email}
          onChange={(e) => onChange("emply_email", e.target.value)}
          className={`w-full ${errors.emply_email ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_email.label}`}
        />
        <RequiredText text={errors.emply_email} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_natid" className="block font-bold mb-2">
          {tmhb_emply.emply_natid.label}
        </label>
        <InputText
          name="emply_natid"
          value={formData.emply_natid}
          onChange={(e) => onChange("emply_natid", e.target.value)}
          className={`w-full ${errors.emply_natid ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_natid.label}`}
        />
        <RequiredText text={errors.emply_natid} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_bdate"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_bdate.label}
        </label>
        <Calendar
          name="emply_bdate"
          value={
            formData.emply_bdate
              ? typeof formData.emply_bdate === "string" &&
                !formData.emply_bdate.includes("T")
                ? new Date(formData.emply_bdate + "T00:00:00")
                : new Date(formData.emply_bdate)
              : null
          }
          onChange={(e) => onChange("emply_bdate", e.target.value)}
          className={`w-full ${errors.emply_bdate ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmhb_emply.emply_bdate.label}`}
        />
        <RequiredText text={errors.emply_bdate} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_prnam" className="block font-bold mb-2">
          {tmhb_emply.emply_prnam.label}
        </label>
        <InputText
          name="emply_prnam"
          value={formData.emply_prnam}
          onChange={(e) => onChange("emply_prnam", e.target.value)}
          className={`w-full ${errors.emply_prnam ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_prnam.label}`}
        />
        <RequiredText text={errors.emply_prnam} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_gendr" className="block font-bold mb-2">
          {tmhb_emply.emply_gendr.label}
        </label>
        <Dropdown
          name="emply_gendr"
          value={formData.emply_gendr}
          onChange={(e) => onChange("emply_gendr", e.value)}
          options={genderOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_gendr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_gendr.label}`}
        />
        <RequiredText text={errors.emply_gendr} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_mstas" className="block font-bold mb-2">
          {tmhb_emply.emply_mstas.label}
        </label>
        <Dropdown
          name="emply_mstas"
          value={formData.emply_mstas}
          onChange={(e) => onChange("emply_mstas", e.value)}
          options={maritalOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_mstas ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_mstas.label}`}
        />
        <RequiredText text={errors.emply_mstas} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_bgrup" className="block font-bold mb-2">
          {tmhb_emply.emply_bgrup.label}
        </label>
        <Dropdown
          name="emply_bgrup"
          value={formData.emply_bgrup}
          onChange={(e) => onChange("emply_bgrup", e.value)}
          options={bloodGroupOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_bgrup ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_bgrup.label}`}
        />
        <RequiredText text={errors.emply_bgrup} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_rlgon" className="block font-bold mb-2">
          {tmhb_emply.emply_rlgon.label}
        </label>
        <Dropdown
          name="emply_rlgon"
          value={formData.emply_rlgon}
          onChange={(e) => onChange("emply_rlgon", e.value)}
          options={religionOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_rlgon ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_rlgon.label}`}
        />
        <RequiredText text={errors.emply_rlgon} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_edgrd" className="block font-bold mb-2">
          {tmhb_emply.emply_edgrd.label}
        </label>
        <Dropdown
          name="emply_edgrd"
          value={formData.emply_edgrd}
          onChange={(e) => onChange("emply_edgrd", e.value)}
          options={educationGradeOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_edgrd ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_edgrd.label}`}
        />
        <RequiredText text={errors.emply_edgrd} />
      </div>
      <div className="col-12 md:col-4">
        <label
          htmlFor="emply_psadr"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_psadr.label}
        </label>
        <InputText
          name="emply_psadr"
          value={formData.emply_psadr}
          onChange={(e) => onChange("emply_psadr", e.target.value)}
          className={`w-full ${errors.emply_psadr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_psadr.label}`}
        />
        <RequiredText text={errors.emply_psadr} />
      </div>
      <div className="col-12 md:col-4">
        <label htmlFor="emply_pradr" className="block font-bold mb-2">
          {tmhb_emply.emply_pradr.label}
        </label>
        <InputText
          name="emply_pradr"
          value={formData.emply_pradr}
          onChange={(e) => onChange("emply_pradr", e.target.value)}
          className={`w-full ${errors.emply_pradr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_pradr.label}`}
        />
        <RequiredText text={errors.emply_pradr} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_desig"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_desig.label}
        </label>
        <Dropdown
          name="emply_desig"
          value={formData.emply_desig}
          onChange={(e) => onChange("emply_desig", e.value)}
          options={designationOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_desig ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_desig.label}`}
        />
        <RequiredText text={errors.emply_desig} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_jndat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_jndat.label}
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
          placeholder={`Select ${tmhb_emply.emply_jndat.label}`}
        />
        <RequiredText text={errors.emply_jndat} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_cndat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_cndat.label}
        </label>
        <Calendar
          name="emply_cndat"
          value={
            formData.emply_cndat
              ? typeof formData.emply_cndat === "string" &&
                !formData.emply_cndat.includes("T")
                ? new Date(formData.emply_cndat + "T00:00:00")
                : new Date(formData.emply_cndat)
              : null
          }
          onChange={(e) => onChange("emply_cndat", e.target.value)}
          className={`w-full ${errors.emply_cndat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmhb_emply.emply_cndat.label}`}
        />
        <RequiredText text={errors.emply_cndat} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="emply_rgdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_emply.emply_rgdat.label}
        </label>
        <Calendar
          name="emply_rgdat"
          value={
            formData.emply_rgdat
              ? typeof formData.emply_rgdat === "string" &&
                !formData.emply_rgdat.includes("T")
                ? new Date(formData.emply_rgdat + "T00:00:00")
                : new Date(formData.emply_rgdat)
              : null
          }
          onChange={(e) => onChange("emply_rgdat", e.target.value)}
          className={`w-full ${errors.emply_rgdat ? "p-invalid" : ""}`}
          dateFormat="yy-mm-dd"
          placeholder={`Select ${tmhb_emply.emply_rgdat.label}`}
        />
        <RequiredText text={errors.emply_rgdat} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_gssal" className="block font-bold mb-2">
          {tmhb_emply.emply_gssal.label}
        </label>
        <InputText
          name="emply_gssal"
          value={formData.emply_gssal}
          onChange={(e) => onChange("emply_gssal", e.target.value)}
          className={`w-full ${errors.emply_gssal ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_gssal.label}`}
          variant="filled"
          disabled={true}
        />
        <RequiredText text={errors.emply_gssal} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_otrat" className="block font-bold mb-2">
          {tmhb_emply.emply_otrat.label}
        </label>
        <InputText
          name="emply_otrat"
          value={formData.emply_otrat}
          onChange={(e) => onChange("emply_otrat", e.target.value)}
          className={`w-full ${errors.emply_otrat ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_otrat.label}`}
        />
        <RequiredText text={errors.emply_otrat} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_etype" className="block font-bold mb-2">
          {tmhb_emply.emply_etype.label}
        </label>
        <Dropdown
          name="emply_etype"
          value={formData.emply_etype}
          onChange={(e) => onChange("emply_etype", e.value)}
          options={employeeTypeOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_etype ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_etype.label}`}
        />
        <RequiredText text={errors.emply_etype} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_pyacc" className="block font-bold mb-2">
          {tmhb_emply.emply_pyacc.label}
        </label>
        <InputText
          name="emply_pyacc"
          value={formData.emply_pyacc}
          onChange={(e) => onChange("emply_pyacc", e.target.value)}
          className={`w-full ${errors.emply_pyacc ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_pyacc.label}`}
        />
        <RequiredText text={errors.emply_pyacc} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_slcyl" className="block font-bold mb-2">
          {tmhb_emply.emply_slcyl.label}
        </label>
        <InputText
          name="emply_slcyl"
          value={formData.emply_slcyl}
          onChange={(e) => onChange("emply_slcyl", e.target.value)}
          className={`w-full ${errors.emply_slcyl ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_slcyl.label}`}
        />
        <RequiredText text={errors.emply_slcyl} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_wksft" className="block font-bold mb-2">
          {tmhb_emply.emply_wksft.label}
        </label>
        <InputText
          name="emply_wksft"
          value={formData.emply_wksft}
          onChange={(e) => onChange("emply_wksft", e.target.value)}
          className={`w-full ${errors.emply_wksft ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_wksft.label}`}
        />
        <RequiredText text={errors.emply_wksft} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_supid" className="block font-bold mb-2">
          {tmhb_emply.emply_supid.label}
        </label>
        <InputText
          name="emply_supid"
          value={formData.emply_supid}
          onChange={(e) => onChange("emply_supid", e.target.value)}
          className={`w-full ${errors.emply_supid ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_supid.label}`}
        />
        <RequiredText text={errors.emply_supid} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_notes" className="block font-bold mb-2">
          {tmhb_emply.emply_notes.label}
        </label>
        <InputText
          name="emply_notes"
          value={formData.emply_notes}
          onChange={(e) => onChange("emply_notes", e.target.value)}
          className={`w-full ${errors.emply_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_notes.label}`}
        />
        <RequiredText text={errors.emply_notes} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_login" className="block font-bold mb-2">
          {tmhb_emply.emply_login.label}
        </label>
        <InputSwitch
          name="emply_login"
          checked={formData.emply_login === 1}
          onChange={(e) => onChange("emply_login", e.value ? 1 : 0)}
          className={`${errors.emply_login ? "p-invalid" : ""}`}
        />
        <RequiredText text={errors.emply_login} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_pswrd" className="block font-bold mb-2">
          {tmhb_emply.emply_pswrd.label}
        </label>
        <InputText
          name="emply_pswrd"
          value={formData.emply_pswrd}
          onChange={(e) => onChange("emply_pswrd", e.target.value)}
          className={`w-full ${errors.emply_pswrd ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_pswrd.label}`}
        />
        <RequiredText text={errors.emply_pswrd} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_pictr" className="block font-bold mb-2">
          {tmhb_emply.emply_pictr.label}
        </label>
        <InputText
          name="emply_pictr"
          value={formData.emply_pictr}
          onChange={(e) => onChange("emply_pictr", e.target.value)}
          className={`w-full ${errors.emply_pictr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_pictr.label}`}
          variant="filled"
          disabled={true}
        />
        <RequiredText text={errors.emply_pictr} />
      </div>
      <div className="col-12 md:col-2">
        <label htmlFor="emply_stats" className="block font-bold mb-2">
          {tmhb_emply.emply_stats.label}
        </label>
        <Dropdown
          name="emply_stats"
          value={formData.emply_stats}
          onChange={(e) => onChange("emply_stats", e.value)}
          options={employeeStatusOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.emply_stats ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_emply.emply_stats.label}`}
        />
        <RequiredText text={errors.emply_stats} />
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
