import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const ConvertFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  dataList,
}) => {

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label htmlFor="mitem_icode" className="block font-bold mb-2">
            Master Item Code
          </label>
          <InputText
            name="mitem_icode"
            value={formData.mitem_icode}
            className={`w-full ${errors.mitem_icode ? "p-invalid" : ""}`}
            placeholder={`Enter Item Code`}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.frmla_mitem} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="mitem_iname" className="block font-bold mb-2">
            Master Item Name
          </label>
          <InputText
            name="mitem_iname"
            value={formData.mitem_iname}
            className={`w-full ${errors.mitem_iname ? "p-invalid" : ""}`}
            placeholder={`Enter Item Name`}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.mitem_iname} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="mitem_untnm" className="block font-bold mb-2">
            Master Item Unit
          </label>
          <InputText
            name="mitem_untnm"
            value={formData.mitem_untnm}
            className={`w-full ${errors.mitem_untnm ? "p-invalid" : ""}`}
            placeholder={`Enter Item Unit`}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.mitem_untnm} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="cnstk_mstkq" className="block font-bold mb-2">
            Current Stock
          </label>
          <InputNumber
            name="cnstk_mstkq"
            value={formData.cnstk_mstkq}
            className="w-full"
            inputClassName="w-10rem"
            placeholder="Master Stock Qty"
            minFractionDigits={0}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.cnstk_mstkq} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="cnstk_mtmqt" className="block font-bold mb-2">
            Master Item Qty
          </label>
          <InputNumber
            name="cnstk_mtmqt"
            value={formData.cnstk_mtmqt}
            onValueChange={(e) => onChange("cnstk_mtmqt", e.value)}
            className="w-full"
            inputClassName="w-10rem"
            placeholder="Master Qty"
            minFractionDigits={0}
          />
          <RequiredText text={errors.cnstk_mtmqt} />
        </div>
      </div>
      <div className="col-12">
        <div className="flex flex-row-reverse flex-wrap">
          <Button
            type="button"
            onClick={(e) => onSave(e)}
            label={"Save"}
            icon={"pi pi-check"}
            severity="success"
            size="small"
            loading={isBusy}
            disabled={!formData.frmla_sitem}
          />
        </div>
      </div>
      <DataTable
        value={dataList}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
      >
        <Column field="sitem_iname" header="Support Item" sortable />
        <Column field="sitem_untnm" header="Support Unit" sortable />
        <Column field="frmla_stmqt" header="Support Qty" sortable />
        <Column field="frmla_mtmqt" header="Required Qty" sortable />
      </DataTable>
    </>
  );
};
export default ConvertFormComp;
