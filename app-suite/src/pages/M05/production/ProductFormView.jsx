import CollapsiblePanel from "@/components/CollapsiblePanel/CollapsiblePanel";
import { IconPackage, IconDollar, IconPlus, IconMinus } from "@/assets/icons";
import {
  InputText,
  InputNumber,
  TextArea,
  Dropdown,
  Checkbox,
  TextInput,
} from "@/components/Form";

const ProductFormView = ({formData, Errors, onChange}) => {
  return (
    <CollapsiblePanel
      title="Production Information"
      icon={<IconPackage />}
      defaultOpen
      size="md"
    >
      <div className="grid">
        <div className="col-2">
          <TextInput
            id="text-input"
            value={name}
            required={true}
            disabled={false}
            onChange={onChange}
            label="text-input-label"
            error="tes"
            placeholder="Enter text input"
          />
        </div>
        <div className="col-2"></div>
      </div>
    </CollapsiblePanel>
  );
};

export default ProductFormView;
