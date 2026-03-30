import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_scyle from "@/models/hrms/tmhb_scyle.json";
import RequiredText from "@/components/RequiredText";
import { InputSwitch } from "primereact/inputswitch";
import { Calendar } from "primereact/calendar";
import { classNames } from "primereact/utils";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { scyle_gnameOptions } from "@/utils/vtable";

const SalaryCycleFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
}) => {
  return (
    <div className="grid">
      {/* {JSON.stringify(formData)} */}

      <div className="col-12 md:col-2">
        <label
          htmlFor="scyle_gname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_scyle.scyle_gname.label}
        </label>
        <Dropdown
          name="scyle_gname"
          value={formData.scyle_gname}
          onChange={(e) => onChange("scyle_gname", e.value)}
          options={scyle_gnameOptions}
          optionLabel="label"
          optionValue="value"
          className={`w-full ${errors.scyle_gname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_scyle.scyle_gname.label}`}
        />
        <RequiredText text={errors.scyle_gname} />
      </div>

      <div className="col-12 md:col-4">
        <label
          htmlFor="scyle_cname"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_scyle.scyle_cname.label}
        </label>
        <InputText
          name="scyle_cname"
          value={formData.scyle_cname}
          onChange={(e) => onChange("scyle_cname", e.target.value)}
          className={`w-full ${errors.scyle_cname ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_scyle.scyle_cname.label}`}
        />
        <RequiredText text={errors.scyle_cname} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="scyle_yerid"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_scyle.scyle_yerid.label}
        </label>
        <InputText
          keyfilter="int"
          name="scyle_yerid"
          value={
            formData.scyle_yerid !== undefined && formData.scyle_yerid !== null
              ? formData.scyle_yerid
              : ""
          }
          onChange={(e) =>
            onChange(
              "scyle_yerid",
              e.target.value ? parseInt(e.target.value, 10) : "",
            )
          }
          className={`w-full ${errors.scyle_yerid ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_scyle.scyle_yerid.label}`}
        />
        <RequiredText text={errors.scyle_yerid} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="scyle_frdat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_scyle.scyle_frdat.label}
        </label>
        <Calendar
          name="scyle_frdat"
          value={formData.scyle_frdat ? new Date(formData.scyle_frdat) : null}
          onChange={(e) => onChange("scyle_frdat", e.value)}
          dateFormat="dd-M-yy"
          placeholder="Select From Date"
          showIcon
          className={classNames("w-full", { "p-invalid": errors.scyle_frdat })}
        />
        <RequiredText text={errors.scyle_frdat} />
      </div>

      <div className="col-12 md:col-2">
        <label
          htmlFor="scyle_todat"
          className="block font-bold mb-2 text-red-800"
        >
          {tmhb_scyle.scyle_todat.label}
        </label>
        <Calendar
          name="scyle_todat"
          value={formData.scyle_todat ? new Date(formData.scyle_todat) : null}
          onChange={(e) => onChange("scyle_todat", e.value)}
          dateFormat="dd-M-yy"
          placeholder="Select To Date"
          showIcon
          className={classNames("w-full", { "p-invalid": errors.scyle_todat })}
        />
        <RequiredText text={errors.scyle_todat} />
      </div>

      <div className="col-12">
        <label htmlFor="scyle_notes" className="block font-bold mb-2">
          {tmhb_scyle.scyle_notes.label}
        </label>
        <InputTextarea
          name="scyle_notes"
          value={formData.scyle_notes || ""}
          onChange={(e) => onChange("scyle_notes", e.target.value)}
          rows={3}
          className={`w-full ${errors.scyle_notes ? "p-invalid" : ""}`}
          placeholder={`Enter ${tmhb_scyle.scyle_notes.label}`}
        />
        <RequiredText text={errors.scyle_notes} />
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

export default SalaryCycleFormComp;
