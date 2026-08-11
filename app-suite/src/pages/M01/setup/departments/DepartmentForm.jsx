import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import InputSwitch from "@/components/InputSwitch";
import AuditData from "@/components/AuditData";
import { IconClose, IconSave } from "@/icons";
import { bool_Options } from "@/utils/vtable.js";

const DepartmentForm = ({
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
        <div className="col-span-4">
          <InputText
            label="Department Name"
            placeholder="Enter department name"
            value={formData.dpart_cname}
            onChange={(e) => onChange("dpart_cname", e.target.value)}
            error={formErrors.dpart_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Employee Limit"
            placeholder="Enter capacity"
            value={formData.dpart_emcap}
            onChange={(e) => onChange("dpart_emcap", e.target.value)}
            min={1}
            error={formErrors.dpart_emcap}
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Office Address"
            placeholder="Enter office address"
            value={formData.dpart_ofadr}
            onChange={(e) => onChange("dpart_ofadr", e.target.value)}
            error={formErrors.dpart_ofadr}
            disabled={readOnly}
          />
        </div>

        <div className="col-span-2 p-3">
          {/* <Dropdown
            label="Stop Distributor"
            options={bool_Options}
            value={formData.dpart_stdst}
            onChange={(e) => onChange("dpart_stdst", e.target.value)}
            error={formErrors.dpart_stdst}
            placeholder="Select..."
            disabled={readOnly}
          /> */}
          <InputSwitch
            label={`${formData.dpart_stdst ? "Distributor Disabled" : "Distributor Enabled"}`}
            checked={formData.dpart_stdst}
            onChange={(e) => onChange("dpart_stdst", e.target.checked)}
          />
        </div>
        <div className="col-span-2 p-3">
          <InputSwitch
            label={`${formData.dpart_stpur ? "Purchase Disabled" : "Purchase Enabled"}`}
            checked={formData.dpart_stpur}
            onChange={(e) => onChange("dpart_stpur", e.target.checked)}
          />
        </div>
        <div className="col-span-2 p-3">
          <InputSwitch
            label={`${formData.dpart_stsal ? "Sale Disabled" : "Sale Enabled"}`}
            checked={formData.dpart_stsal}
            onChange={(e) => onChange("dpart_stsal", e.target.checked)}
          />
        </div>
        <div className="col-span-2 p-3">
          <InputSwitch
            label={`${formData.dpart_stnsf ? "Transfer Disabled" : "Transfer Enabled"}`}
            checked={formData.dpart_stnsf}
            onChange={(e) => onChange("dpart_stnsf", e.target.checked)}
          />
        </div>
        <div className="col-span-2 p-3">
          <InputSwitch
            label={`${formData.dpart_stpro ? "Production Disabled" : "Production Enabled"}`}
            checked={formData.dpart_stpro}
            onChange={(e) => onChange("dpart_stpro", e.target.checked)}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.dpart_actve}
          cname={formData.crusr_cname}
          cdate={formData.dpart_crdat}
          uname={formData.upusr_cname}
          udate={formData.dpart_updat}
          rvnmr={formData.dpart_rvnmr}
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
export default DepartmentForm;
