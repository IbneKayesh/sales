import DataTable from "@/components/DataTable";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import InputText from "@/components/InputText";
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
  readOnly,
  stopEdit,
  formData,
  formErrors,
  onChange,
}) => {
  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="col-span-6">
          <InputText
            label="Production Name"
            placeholder="Enter Production Name"
            value={formData.prods_cname}
            name="prods_cname"
            onChange={(e) => onChange("prods_cname", e.target.value)}
            error={formErrors.prods_cname}
            required
            disabled={readOnly}
          />
        </div>
      </div>
    </div>
  );
};
export default ProductionForm;
