import Button from "@/components/Button";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import {
  txcod_txtyp_Options,
  txmod_Options,
  txcod_trcod_Options,
} from "@/utils/vtable.js";

const TaxForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={txcod_txtyp_Options}
            value={formData.txcod_txtyp}
            onChange={(e) => onChange("txcod_txtyp", e.target.value)}
            error={formErrors.txcod_txtyp}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Mode"
            options={txmod_Options}
            value={formData.txcod_txmod}
            onChange={(e) => onChange("txcod_txmod", e.target.value)}
            error={formErrors.txcod_txmod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Applicable"
            options={txcod_trcod_Options}
            value={formData.txcod_trcod}
            onChange={(e) => onChange("txcod_trcod", e.target.value)}
            error={formErrors.txcod_trcod}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <InputNumber
            label="Tax %"
            placeholder="Enter tax %"
            value={formData.txcod_txrat}
            onChange={(e) => onChange("txcod_txrat", e.target.value)}
            error={formErrors.txcod_txrat}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.txcod_actve}
          cname={formData.crusr_cname}
          cdate={formData.txcod_crdat}
          uname={formData.upusr_cname}
          udate={formData.txcod_updat}
          rvnmr={formData.txcod_rvnmr}
        />
      )}
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconClose size={16} className="icon-left" />
          Cancel
        </Button>
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSave size={16} className="icon-left" />
          {formData?.id ? "Update" : "Create"}
        </Button>
      </div>
    </div>
  );
};
export default TaxForm;
