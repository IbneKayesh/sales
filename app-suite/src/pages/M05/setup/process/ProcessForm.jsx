import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { inout_Options } from "@/utils/vtable.js";

const ProcessForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  bom_Options,
  units_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.promf_dpart}
            onChange={(e) => onChange("promf_dpart", e.target.value)}
            error={formErrors.promf_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="BOM"
            options={bom_Options}
            value={formData.promf_bommf}
            onChange={(e) => onChange("promf_bommf", e.target.value)}
            error={formErrors.promf_bommf}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="bommf_cname"
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Process Name"
            placeholder="Enter process name"
            value={formData.promf_cname}
            onChange={(e) => onChange("promf_cname", e.target.value)}
            error={formErrors.promf_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Process No"
            placeholder="Enter Process No"
            value={formData.promf_prono}
            onChange={(e) => onChange("promf_prono", e.target.value)}
            min={1}
            max={50}
            step={1}
            error={formErrors.promf_prono}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Transaction No"
            placeholder="Enter transaction no"
            value={formData.promf_trnno}
            onChange={(e) => onChange("promf_trnno", e.target.value)}
            error={formErrors.promf_trnno}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputCalendar
            label="Transaction Date"
            value={formData.promf_trdat}
            onChange={(e) => onChange("promf_trdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.promf_trdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.promf_units}
            onChange={(e) => onChange("promf_units", e.target.value)}
            error={formErrors.promf_units}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="BOM Qty"
            placeholder="Enter Qty"
            value={formData.promf_bmqty}
            onChange={(e) => onChange("promf_bmqty", e.target.value)}
            min={1}
            error={formErrors.promf_bmqty}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="BOM Value"
            placeholder="Enter Value"
            value={formData.promf_bmval}
            onChange={(e) => onChange("promf_bmval", e.target.value)}
            min={1}
            error={formErrors.promf_bmval}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Process Qty"
            placeholder="Enter Qty"
            value={formData.promf_prqty}
            onChange={(e) => onChange("promf_prqty", e.target.value)}
            min={1}
            error={formErrors.promf_prqty}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Process Value"
            placeholder="Enter Value"
            value={formData.promf_prval}
            onChange={(e) => onChange("promf_prval", e.target.value)}
            min={1}
            error={formErrors.promf_prval}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputCalendar
            label="From Date"
            value={formData.promf_frdat}
            onChange={(e) => onChange("promf_frdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.promf_frdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputCalendar
            label="To Date"
            value={formData.promf_todat}
            onChange={(e) => onChange("promf_todat", e.target.value)}
            placeholder="Select..."
            error={formErrors.promf_todat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Process Time (Min)"
            placeholder="Enter minutes"
            value={formData.promf_prtim}
            onChange={(e) => onChange("promf_prtim", e.target.value)}
            min={1}
            max={4320}
            step={1}
            error={formErrors.promf_prtim}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputText
            label="Note"
            placeholder="Enter note"
            value={formData.promf_notes}
            onChange={(e) => onChange("promf_notes", e.target.value)}
            error={formErrors.promf_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.promf_actve}
          cname={formData.crusr_cname}
          cdate={formData.promf_crdat}
          uname={formData.upusr_cname}
          udate={formData.promf_updat}
          rvnmr={formData.promf_rvnmr}
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
export default ProcessForm;
