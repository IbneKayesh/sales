import Button from "@/components/Button";
import InputText from "@/components/InputText";
import Dropdown from "@/components/Dropdown";
import { IconSearch, IconSave } from "@/icons";

const StandardForm = ({
  isBusy,
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
  onSubmit,
  rptList_Options,
  //others
  formDataReport,
}) => {
  return (
    <div className="form-wrap mb-5">
      <div className="grid">
        <div className="col-span-6">
          <Dropdown
            label="Report Name"
            options={rptList_Options}
            value={formData.rpt_name}
            onChange={(e) => onChange("rpt_name", e.target.value)}
            error={formErrors.rpt_name}
            required
            placeholder="Select..."
            disabled={readOnly}
          />
        </div>

        {formDataReport?.params?.map((field) => (
          <div className="col-span-2" key={field.value}>
            <InputText
              label={field.label}
              placeholder={`Enter ${field.label.toLowerCase()}`}
              value={formData[field.value] || ""}
              onChange={(e) => onChange(field.value, e.target.value)}
              error={formErrors[field.value]}
              required={field.required}
              disabled={readOnly}
            />
          </div>
        ))}
      </div>
      <div className="form-actions">
        <Button variant="info" onClick={onSubmit} disabled={isBusy}>
          <IconSearch size={16} className="icon-left" />
          Search
        </Button>
      </div>
    </div>
  );
};
export default StandardForm;
