import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import { IconPlus, IconClose, IconSave } from "@/icons";
import InputLabel from "@/components/InputLabel";

const InvoiceForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  route_Options,
  cntct_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-2">
          <Dropdown
            label="Delivery Route"
            options={route_Options}
            value={formData.rtcnt_route}
            onChange={(e) => onChange("rtcnt_route", e.target.value)}
            error={formErrors.rtcnt_route}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            clearable
          />
        </div>
        <div className="col-span-4">
          <Dropdown
            label="Customer"
            options={cntct_Options}
            value={formData.invcm_cntct}
            onChange={(e) => onChange("invcm_cntct", e.target.value)}
            error={formErrors.invcm_cntct}
            required
            placeholder="Select..."
            disabled={readOnly || stopEdit}
            optionValue="id"
            optionLabel="cntct_cname"
          />
        </div>
        <div className="col-span-2">
          <InputLabel label="Payable" value={formData.invcm_pyamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Paid" value={formData.invcm_pdamt} />
        </div>
        <div className="col-span-2">
          <InputLabel label="Due" value={formData.invcm_duamt} />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="secondary" onClick={onCancel} disabled={isBusy}>
          <IconPlus size={16} className="icon-left" />
          Add Item
        </Button>
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
export default InvoiceForm;
