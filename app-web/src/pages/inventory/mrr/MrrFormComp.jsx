import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";
import HeaderComp from "./efrm/HeaderComp";
import ItemsComp from "./efrm/ItemsComp";
import PaymComp from "./efrm/PaymComp";

const MrrFormComp = ({
  readOnly,
  formData,
  errors,
  onChange,
  mrrmt_cntct_Options,
  mrrdt_items_Options,
  dataListItems,
  formDataItems,
  onChangeItems,
  onAddToListClick,
  onRemoveItemsClick,
}) => {
  return (
    <>
      <HeaderComp
        formData={formData}
        errors={errors}
        onChange={onChange}
        mrrmt_cntct_Options={mrrmt_cntct_Options}
      />
      <ItemsComp
        readOnly={readOnly}
        formData={formDataItems}
        errors={errors}
        onChange={onChangeItems}
        mrrdt_items_Options={mrrdt_items_Options}
        dataList={dataListItems}
        onAddToListClick={onAddToListClick}
        onRemoveItemsClick={onRemoveItemsClick}
      />
      <PaymComp
        formData={formData}
        errors={errors}
        onChange={onChange}
      />
      <div className="grid">
        {formData.id && (
          <AuditFields
            active={formData.mrrmt_actve}
            createdBy={formData.crusr_cname}
            createdAt={formData.mrrmt_crdat}
            updatedBy={formData.upusr_cname}
            updatedAt={formData.mrrmt_updat}
            revNo={formData.mrrmt_rvnmr}
          />
        )}
      </div>
    </>
  );
};
export default MrrFormComp;
