import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { inout_Options } from "@/utils/vtable.js";

const BOMForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  prods_Options,
  units_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.bommf_dpart}
            onChange={(e) => onChange("bommf_dpart", e.target.value)}
            error={formErrors.bommf_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Production"
            options={prods_Options}
            value={formData.bommf_prods}
            onChange={(e) => onChange("bommf_prods", e.target.value)}
            error={formErrors.bommf_prods}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="prods_cname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Process Name"
            placeholder="Enter process name"
            value={formData.bommf_cname}
            onChange={(e) => onChange("bommf_cname", e.target.value)}
            error={formErrors.bommf_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Process No"
            placeholder="Enter Process No"
            value={formData.bommf_prono}
            onChange={(e) => onChange("bommf_prono", e.target.value)}
            min={1}
            max={50}
            step={1}
            error={formErrors.bommf_prono}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Input/Output"
            options={inout_Options}
            value={formData.bommf_inout}
            onChange={(e) => onChange("bommf_inout", e.target.value)}
            error={formErrors.bommf_inout}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.bommf_units}
            onChange={(e) => onChange("bommf_units", e.target.value)}
            error={formErrors.bommf_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Qty"
            placeholder="Enter Qty"
            value={formData.bommf_bmqty}
            onChange={(e) => onChange("bommf_bmqty", e.target.value)}
            min={1}
            max={50}
            step={1}
            error={formErrors.bommf_bmqty}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Value"
            placeholder="Enter Value"
            value={formData.bommf_bmval}
            onChange={(e) => onChange("bommf_bmval", e.target.value)}
            min={1}
            max={50}
            step={1}
            error={formErrors.bommf_bmval}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="From Date"
            value={formData.bommf_frdat}
            onChange={(e) => onChange("bommf_frdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.bommf_frdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="To Date"
            value={formData.bommf_todat}
            onChange={(e) => onChange("bommf_todat", e.target.value)}
            placeholder="Select..."
            error={formErrors.bommf_todat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Est Minute"
            placeholder="Enter Minute"
            value={formData.bommf_estim}
            onChange={(e) => onChange("bommf_estim", e.target.value)}
            min={1}
            max={4320}
            step={1}
            error={formErrors.bommf_estim}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Note"
            placeholder="Enter note"
            value={formData.bommf_notes}
            onChange={(e) => onChange("bommf_notes", e.target.value)}
            error={formErrors.bommf_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.bommf_actve}
          cname={formData.crusr_cname}
          cdate={formData.bommf_crdat}
          uname={formData.upusr_cname}
          udate={formData.bommf_updat}
          rvnmr={formData.bommf_rvnmr}
        />
      )}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy || readOnly}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default BOMForm;
