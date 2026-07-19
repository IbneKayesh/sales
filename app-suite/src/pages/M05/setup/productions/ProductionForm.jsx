import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
import InputNumber from "@/components/InputNumber";
import AuditData from "@/components/AuditData";
import {
  IconClose,
  IconPlus,
  IconEdit,
  IconDelete,
  IconCheck,
  IconSave,
  IconWarning,
  IconInfo,
} from "@/icons";

const ProductionForm = ({
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
        <div className="col-span-6">
          <InputText
            label="Production Name"
            placeholder="Enter Production Name"
            value={formData.prods_cname}
            onChange={(e) => onChange("prods_cname", e.target.value)}
            error={formErrors.prods_cname}
            required
            disabled={readOnly}
          />
        </div>
        <div className="col-span-6">
          <InputNumber
            label="No of Process"
            placeholder="Enter No of Process"
            value={formData.prods_prono}
            onChange={(e) => onChange("prods_prono", e.target.value)}
            min={1}
            max={50}
            step={1}
            error={formErrors.prods_prono}
            required
            disabled={readOnly}
          />
        </div>
      </div>
      {formData?.id && (
        <AuditData
          actve={formData.prods_actve}
          cname={formData.crusr_cname}
          cdate={formData.prods_crdat}
          uname={formData.upusr_cname}
          udate={formData.prods_updat}
          rvnmr={formData.prods_rvnmr}
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
export default ProductionForm;
