import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import RequiredText from "@/components/RequiredText";
import AuditFields from "@/components/AuditFields";
import HeaderComp from "./efrm/HeaderComp";
import ItemsComp from "./efrm/ItemsComp";
import CostingComp from "./efrm/CostingComp";
import ItemsSumComp from "./efrm/ItemsSumComp";
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
  onAddItemsClick,
  onRemoveItemsClick,
  //costing
  formDataCosting,
  dataListCosting,
  mrrcs_csmod_Options,
  mrrcs_clmod_Options,
  mrrcs_chead_Options,
  onChangeCosting,
  onAddCostingClick,
  onRemoveCostingClick,
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
        onAddItemsClick={onAddItemsClick}
        onRemoveItemsClick={onRemoveItemsClick}
      />
      <div className="grid m-2">
        <CostingComp
          readOnly={readOnly}
          formData={formDataCosting}
          errors={errors}
          onChange={onChangeCosting}
          mrrcs_csmod_Options={mrrcs_csmod_Options}
          mrrcs_clmod_Options={mrrcs_clmod_Options}
          mrrcs_chead_Options={mrrcs_chead_Options}
          dataList={dataListCosting}
          onAddItemsClick={onAddCostingClick}
          onRemoveItemsClick={onRemoveCostingClick}
        />

        <ItemsSumComp
          readOnly={readOnly}
          formData={formData}
          errors={errors}
          onChange={onChange}
        />
        <PaymComp
          readOnly={readOnly}
          formData={formDataCosting}
          errors={errors}
          onChange={onChangeCosting}
          mrrcs_csmod_Options={mrrcs_csmod_Options}
          mrrcs_clmod_Options={mrrcs_clmod_Options}
          mrrcs_chead_Options={mrrcs_chead_Options}
          dataList={dataListCosting}
          onAddItemsClick={onAddCostingClick}
          onRemoveItemsClick={onRemoveCostingClick}
        />
      </div>
      {/* <PaymComp
        formData={formData}
        errors={errors}
        onChange={onChange}
        formDataCosting={formDataCosting}
        onChangeCosting={onChangeCosting}
        mrrcs_csmod_Options={mrrcs_csmod_Options}
        mrrcs_clmod_Options={mrrcs_clmod_Options}
        mrrcs_cname_Options={mrrcs_cname_Options}
        dataListCosting={dataListCosting}
        onAddCostingClick={onAddCostingClick}
        onRemoveCostingClick={onRemoveCostingClick}
      /> */}
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
