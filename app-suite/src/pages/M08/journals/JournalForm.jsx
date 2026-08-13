import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import InputCalendar from "@/components/InputCalendar";
import Dropdown from "@/components/Dropdown";
import InputLabel from "@/components/InputLabel";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave, IconPlus } from "@/icons";
import { jrnlm_trtyp_Options } from "@/utils/vtable.js";

const JournalForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  dpart_Options,
  fsyar_Options,
  acprd_Options,
  onShowAddToList,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-5">
          <Dropdown
            label="Department"
            options={dpart_Options}
            value={formData.jrnlm_dpart}
            onChange={(e) => onChange("jrnlm_dpart", e.target.value)}
            error={formErrors.jrnlm_dpart}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="dpart_cname"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Fiscal Year"
            options={fsyar_Options}
            value={formData.jrnlm_fsyar}
            onChange={(e) => onChange("jrnlm_fsyar", e.target.value)}
            error={formErrors.jrnlm_fsyar}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="fsyar_cname"
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Period No"
            options={acprd_Options}
            value={formData.jrnlm_acprd}
            onChange={(e) => onChange("jrnlm_acprd", e.target.value)}
            error={formErrors.jrnlm_acprd}
            required
            placeholder="Select..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="acprd_cname"
          />
        </div>
        <div className="col-span-1">
          <InputLabel label="Currency" value={formData.jrnlm_crncy} />
        </div>
        <div className="col-span-2">
          <InputCalendar
            label="Journal Date"
            value={formData.jrnlm_trdat}
            onChange={(e) => onChange("jrnlm_trdat", e.target.value)}
            placeholder="Select..."
            error={formErrors.jrnlm_trdat}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputText
            label="Reference No"
            placeholder="Enter reference number"
            value={formData.jrnlm_refno}
            onChange={(e) => onChange("jrnlm_refno", e.target.value)}
            error={formErrors.jrnlm_refno}
            required={false}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <Dropdown
            label="Journal Type"
            options={jrnlm_trtyp_Options}
            value={formData.jrnlm_trtyp}
            onChange={(e) => onChange("jrnlm_trtyp", e.target.value)}
            error={formErrors.jrnlm_trtyp}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-4">
          <InputText
            label="Narration"
            placeholder="Enter narration"
            value={formData.jrnlm_narrt}
            onChange={(e) => onChange("jrnlm_narrt", e.target.value)}
            error={formErrors.jrnlm_narrt}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Debit Value" value={formData.jrnlm_drval} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Credit Value" value={formData.jrnlm_crval} />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.jrnlm_actve}
          cname={formData.crusr_cname}
          cdate={formData.jrnlm_crdat}
          uname={formData.upusr_cname}
          udate={formData.jrnlm_updat}
          rvnmr={formData.jrnlm_rvnmr}
        />
      )}
      <div className="form-actions">
        <Button
          variant="outline"
          onClick={() => onShowAddToList("ITEM")}
          disabled={isBusy || readOnly}
        >
          <IconPlus size={16} className="icon-left" />
          Add Line
        </Button>
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
export default JournalForm;
