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
  const mitem_iname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.mitem_icode}</div>
        <div className="text-sm">{rowData.mitem_iname}</div>
      </div>
    );
  };

  const cnstk_mtmqt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">Recipe: {rowData.frmla_mtmqt}</div>
        <div className="text-md font-bold">Required: {rowData.cnstk_mtmqt}</div>
        <div className="text-md">Stock: {rowData.cnstk_mstkq}</div>
      </div>
    );
  };

  const sitem_iname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.sitem_icode}</div>
        <div className="text-sm">{rowData.sitem_iname}</div>
      </div>
    );
  };

  const cnstk_stmqt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">Recipe: {rowData.frmla_stmqt}</div>
        <div
          className={`text-md font-bold ${rowData.cnstk_stmqt > rowData.cnstk_sstkq && "text-red-500"}`}
        >
          Required: {rowData.cnstk_stmqt}
        </div>
        <div className="text-md">Stock: {rowData.cnstk_sstkq}</div>
      </div>
    );
  };

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
          <label htmlFor="cnstk_cnqty" className="block font-bold mb-2">
            Convert Stock Qty
          </label>
          <InputNumber
            name="cnstk_cnqty"
            value={formData.cnstk_cnqty}
            onValueChange={(e) => onChange("cnstk_cnqty", e.value)}
            className="w-full"
            inputClassName="w-10rem"
            placeholder="Convert Qty"
            minFractionDigits={0}
          />
          <RequiredText text={errors.cnstk_cnqty} />
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
            disabled={(formData.cnstk_cnqty || 0) < 1}
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
        <Column
          field="mitem_iname"
          header="Master Item"
          body={mitem_iname_BT}
          sortable
        />
        <Column
          field="cnstk_mtmqt"
          header="Master Qty"
          body={cnstk_mtmqt_BT}
          sortable
        />
        <Column
          field="sitem_iname"
          header="Associate Item"
          body={sitem_iname_BT}
          sortable
        />
        <Column
          field="cnstk_stmqt"
          header="Associate Qty"
          body={cnstk_stmqt_BT}
          sortable
        />
        <Column field="cnstk_cnqty" header="Convert Qty" sortable />
      </DataTable>
    </>
  );
};
export default ConvertFormComp;
