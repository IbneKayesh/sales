import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import Dropdown from "@/components/Dropdown";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconSave,
} from "@/icons";

const RawMaterialForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onCancel,
  onSubmit,
  itemOptions,
  units_Options,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-3">
          <Dropdown
            label="Item"
            options={itemOptions}
            value={formData.borpm_items}
            onChange={(e) => onChange("borpm_items", e.target.value)}
            error={formErrors.borpm_items}
            required
            placeholder="Select item..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="items_iname"
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Type"
            options={[
              { label: "Raw Material (RM)", value: "RM" },
              { label: "Packing Material (PM)", value: "PM" },
            ]}
            value={formData.borpm_types}
            onChange={(e) => onChange("borpm_types", e.target.value)}
            error={formErrors.borpm_types}
            required
            placeholder="Select type..."
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Quantity"
            placeholder="Enter qty"
            value={formData.borpm_rmqty}
            onChange={(e) => onChange("borpm_rmqty", e.target.value)}
            error={formErrors.borpm_rmqty}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Ratio"
            placeholder="Enter ratio"
            value={formData.borpm_rmrto}
            onChange={(e) => onChange("borpm_rmrto", e.target.value)}
            error={formErrors.borpm_rmrto}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-2">
          <InputNumber
            label="Rate"
            placeholder="Enter rate"
            value={formData.borpm_rmrat}
            onChange={(e) => onChange("borpm_rmrat", e.target.value)}
            error={formErrors.borpm_rmrat}
            step="0.01"
            disabled={readOnly}
          />
        </div>
      </div>
      <div className="grid">
        <div className="col-span-3">
          <InputNumber
            label="Value"
            placeholder="Enter value"
            value={formData.borpm_rmval}
            onChange={(e) => onChange("borpm_rmval", e.target.value)}
            error={formErrors.borpm_rmval}
            step="0.01"
            disabled={readOnly}
          />
        </div>
        <div className="col-span-3">
          <Dropdown
            label="Unit"
            options={units_Options}
            value={formData.borpm_units}
            onChange={(e) => onChange("borpm_units", e.target.value)}
            error={formErrors.borpm_units}
            required
            placeholder="Select unit..."
            disabled={readOnly}
            optionValue="id"
            optionLabel="units_cname"
          />
        </div>
        <div className="col-span-6">
          <InputText
            label="Notes"
            placeholder="Enter notes"
            value={formData.borpm_notes}
            onChange={(e) => onChange("borpm_notes", e.target.value)}
            error={formErrors.borpm_notes}
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.borpm_actve}
          cname={formData.crusr_cname}
          cdate={formData.borpm_crdat}
          uname={formData.upusr_cname}
          udate={formData.borpm_updat}
          rvnmr={formData.borpm_rvnmr}
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
export default RawMaterialForm;
