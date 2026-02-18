import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import tmcb_cntcs from "@/models/crm/tmcb_cntcs.json";
import { useZoneSgd } from "@/hooks/crm/useZoneSgd";
import { useAreasSgd } from "@/hooks/crm/useAreasSgd";
import { useEffect } from "react";
import { contactTypeOptions } from "@/utils/vtable";
import RequiredText from "@/components/RequiredText";

const ContactFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  cntct_sorceOptions,
  cntct_cntryOptions,
}) => {
  const { dataList: dzoneOptions, handleLoadZones } = useZoneSgd();
  const { dataList: tareaOptions, handleLoadAreas } = useAreasSgd();

  useEffect(() => {
    if (formData.cntct_cntry) {
      handleLoadZones(formData.cntct_cntry);
    }

    if (formData.cntct_dzone) {
      handleLoadAreas(formData.cntct_dzone);
    }
  }, [formData.cntct_cntry, formData.cntct_dzone]);
  return (
    <div className="grid">
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_ctype"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_ctype.label}
        </label>
        <Dropdown
          name="cntct_ctype"
          value={formData.cntct_ctype}
          options={contactTypeOptions}
          onChange={(e) => onChange("cntct_ctype", e.value)}
          className={`w-full ${errors.cntct_ctype ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_ctype.label}`}
        />
        <RequiredText text={errors.cntct_ctype} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_sorce"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_sorce.label}
        </label>
        <Dropdown
          name="cntctcntct_sorce_ctype"
          value={formData.cntct_sorce}
          options={cntct_sorceOptions}
          onChange={(e) => onChange("cntct_sorce", e.value)}
          className={`w-full ${errors.cntct_sorce ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_sorce.label}`}
        />
        <RequiredText text={errors.cntct_sorce} />
      </div>
      <div className="col-12 md:col-8">
        <label
          htmlFor="cntct_cntnm"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_cntnm.label}
        </label>
        <InputText
          name="cntct_cntnm"
          value={formData.cntct_cntnm}
          onChange={(e) => onChange("cntct_cntnm", e.target.value)}
          className={`w-full ${errors.cntct_cntnm ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntnm.label}`}
        />
        <RequiredText text={errors.cntct_cntnm} />
      </div>

      <div className="col-12 md:col-3">
        <label
          htmlFor="cntct_cntps"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_cntps.label}
        </label>
        <InputText
          name="cntct_cntps"
          value={formData.cntct_cntps}
          onChange={(e) => onChange("cntct_cntps", e.target.value)}
          className={`w-full ${errors.cntct_cntps ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntps.label}`}
        />
        <RequiredText text={errors.cntct_cntps} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="cntct_cntno"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_cntno.label}
        </label>
        <InputText
          name="cntct_cntno"
          value={formData.cntct_cntno}
          onChange={(e) => onChange("cntct_cntno", e.target.value)}
          className={`w-full ${errors.cntct_cntno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_cntno.label}`}
        />
        <RequiredText text={errors.cntct_cntno} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_email"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_email.label}
        </label>
        <InputText
          name="cntct_email"
          value={formData.cntct_email}
          onChange={(e) => onChange("cntct_email", e.target.value)}
          className={`w-full ${errors.cntct_email ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_email.label}`}
        />
        <RequiredText text={errors.cntct_email} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_tinno"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_tinno.label}
        </label>
        <InputText
          name="cntct_tinno"
          value={formData.cntct_tinno}
          onChange={(e) => onChange("cntct_tinno", e.target.value)}
          className={`w-full ${errors.cntct_tinno ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_tinno.label}`}
        />
        <RequiredText text={errors.cntct_tinno} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_trade"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_trade.label}
        </label>
        <InputText
          name="cntct_trade"
          value={formData.cntct_trade}
          onChange={(e) => onChange("cntct_trade", e.target.value)}
          className={`w-full ${errors.cntct_trade ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_trade.label}`}
        />
        <RequiredText text={errors.cntct_trade} />
      </div>

      <div className="col-12 md:col-6">
        <label
          htmlFor="cntct_ofadr"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_ofadr.label}
        </label>
        <InputText
          name="cntct_ofadr"
          value={formData.cntct_ofadr}
          onChange={(e) => onChange("cntct_ofadr", e.target.value)}
          className={`w-full ${errors.cntct_ofadr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_ofadr.label}`}
        />
        <RequiredText text={errors.cntct_ofadr} />
      </div>
      <div className="col-12 md:col-6">
        <label
          htmlFor="cntct_fcadr"
          className="block font-bold mb-2"
        >
          {tmcb_cntcs.cntct_fcadr.label}
        </label>
        <InputText
          name="cntct_fcadr"
          value={formData.cntct_fcadr}
          onChange={(e) => onChange("cntct_fcadr", e.target.value)}
          className={`w-full ${errors.cntct_fcadr ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmcb_cntcs.cntct_fcadr.label}`}
        />
        <RequiredText text={errors.cntct_fcadr} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_cntry"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_cntry.label}
        </label>
        <Dropdown
          name="cntct_cntry"
          value={formData.cntct_cntry}
          options={cntct_cntryOptions}
          onChange={(e) => onChange("cntct_cntry", e.value)}
          className={`w-full ${errors.cntct_cntry ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_cntry.label}`}
        />
        <RequiredText text={errors.cntct_cntry} />
      </div>

      <div className="col-12 md:col-3">
        <label
          htmlFor="cntct_dzone"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_dzone.label}
        </label>
        <Dropdown
          name="cntct_dzone"
          value={formData.cntct_dzone}
          options={dzoneOptions}
          onChange={(e) => onChange("cntct_dzone", e.value)}
          className={`w-full ${errors.cntct_dzone ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_dzone.label}`}
          optionLabel="dzone_dname"
          optionValue="id"
        />
        <RequiredText text={errors.cntct_dzone} />
      </div>
      <div className="col-12 md:col-3">
        <label
          htmlFor="cntct_tarea"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_tarea.label}
        </label>
        <Dropdown
          name="cntct_tarea"
          value={formData.cntct_tarea}
          options={tareaOptions}
          onChange={(e) => onChange("cntct_tarea", e.value)}
          className={`w-full ${errors.cntct_tarea ? "p-invalid" : ""}`}
          placeholder={`Select ${tmcb_cntcs.cntct_tarea.label}`}
          optionLabel="tarea_tname"
          optionValue="id"
        />
        <RequiredText text={errors.cntct_tarea} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_dspct"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_dspct.label}
        </label>
        <InputNumber
          name="cntct_dspct"
          value={formData.cntct_dspct}
          onChange={(e) => onChange("cntct_dspct", e.value)}
          className={`flex-1 ${errors.cntct_dspct ? "p-invalid" : ""}`}
          placeholder="Discount %"
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
          minFractionDigits={2}
          maxFractionDigits={2}
        />
        <RequiredText text={errors.cntct_dspct} />
      </div>
      <div className="col-12 md:col-2">
        <label
          htmlFor="cntct_crlmt"
          className="block font-bold mb-2 text-red-800"
        >
          {tmcb_cntcs.cntct_crlmt.label}
        </label>
        <InputNumber
          name="cntct_crlmt"
          value={formData.cntct_crlmt}
          onChange={(e) => onChange("cntct_crlmt", e.value)}
          className={`flex-1 ${errors.cntct_crlmt ? "p-invalid" : ""}`}
          placeholder="Credit Limit"
          style={{ width: "100%" }}
          inputStyle={{ width: "100%" }}
          minFractionDigits={2}
          maxFractionDigits={2}
        />
        <RequiredText text={errors.cntct_crlmt} />
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

export default ContactFormComp;
