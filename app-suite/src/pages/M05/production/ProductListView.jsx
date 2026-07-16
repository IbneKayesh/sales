import CollapsiblePanel from "@/components/CollapsiblePanel/CollapsiblePanel";
import { IconPackage } from "@/assets/icons";
import { TextInput } from "@/components/Form";

const ProductListView = ({ formData, formErrors, onChange }) => {
  return (
    <CollapsiblePanel
      title="Production List"
      icon={<IconPackage />}
      defaultOpen
      size="md"
    >
      <div className="grid">
        <div className="col-6">
          <TextInput
            id={"prods_cname"}
            value={formData.prods_cname}
            required={true}
            disabled={false}
            onChange={onChange}
            label={"Production name"}
            error={formErrors.prods_cname}
            placeholder="Enter production name"
          />
        </div>
        <div className="col-6">
          <TextInput
            id={"prods_prono"}
            value={formData.prods_prono}
            required={true}
            disabled={false}
            onChange={onChange}
            label="No of process"
            error={formErrors.prods_prono}
            placeholder="Enter no of process"
          />
        </div>
      </div>
    </CollapsiblePanel>
  );
};

export default ProductListView;
