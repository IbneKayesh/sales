import { InputText } from "primereact/inputtext";
import RequiredText from "@/components/RequiredText";
import { useProductsSgd } from "@/hooks/inventory/useProductsSgd";
import { useEffect } from "react";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const FormulaFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  dataList,
  onDelete,
}) => {
  const { dataList: itemList, handleGetByCode } = useProductsSgd();

  useEffect(() => {
    if (formData.mitem_icode === formData.sitem_icode) {
      ClearSupportItem();
    } else if (formData.sitem_icode) {
      handleGetByCode(formData.sitem_icode);
    }
  }, [formData.sitem_icode]);

  useEffect(() => {
    if (itemList) {
      onChange("frmla_sitem", itemList.id);
      onChange("sitem_icode", itemList.items_icode);
      onChange("sitem_iname", itemList.items_iname);
      onChange("sitem_untnm", itemList.iuofm_untnm);
    } else {
      ClearSupportItem();
    }
  }, [itemList]);

  const ClearSupportItem = () => {
    onChange("frmla_sitem", "");
    //onChange("sitem_icode", "");
    onChange("sitem_iname", "");
    onChange("sitem_untnm", "");
  };
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.sitem_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData);
      },
      reject: () => {
        // Do nothing on reject
      },
    });
  };
  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={() => handleDelete(rowData)}
          label={"Delete"}
          icon={"pi pi-trash"}
          severity="danger"
          size="small"
          loading={isBusy}
        />
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
          <label htmlFor="frmla_mtmqt" className="block font-bold mb-2">
            Master Item Qty
          </label>
          <InputNumber
            name="frmla_mtmqt"
            value={formData.frmla_mtmqt}
            onValueChange={(e) => onChange("frmla_mtmqt", e.value)}
            className="w-full"
            inputClassName="w-10rem"
            placeholder="Master Qty"
            minFractionDigits={0}
          />
          <RequiredText text={errors.frmla_mtmqt} />
        </div>
      </div>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label htmlFor="sitem_icode" className="block font-bold mb-2">
            Support Item Code
          </label>
          <InputText
            name="sitem_icode"
            value={formData.sitem_icode}
            onChange={(e) => onChange("sitem_icode", e.target.value)}
            className={`w-full ${errors.sitem_icode ? "p-invalid" : ""}`}
            placeholder={`Enter Item Code`}
          />
          <RequiredText text={errors.sitem_icode} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="sitem_iname" className="block font-bold mb-2">
            Support Item Name
          </label>
          <InputText
            name="sitem_iname"
            value={formData.sitem_iname}
            className={`w-full ${errors.sitem_iname ? "p-invalid" : ""}`}
            placeholder={`Enter Item Name`}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.sitem_iname} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="sitem_untnm" className="block font-bold mb-2">
            Support Item Unit
          </label>
          <InputText
            name="sitem_untnm"
            value={formData.sitem_untnm}
            className={`w-full ${errors.sitem_untnm ? "p-invalid" : ""}`}
            placeholder={`Enter Item Unit`}
            variant="filled"
            disabled={true}
          />
          <RequiredText text={errors.sitem_untnm} />
        </div>
        <div className="col-12 md:col-2">
          <label htmlFor="frmla_stmqt" className="block font-bold mb-2">
            Support Item Qty
          </label>
          <InputNumber
            name="frmla_stmqt"
            value={formData.frmla_stmqt}
            onValueChange={(e) => onChange("frmla_stmqt", e.value)}
            className="w-full"
            inputClassName="w-10rem"
            placeholder="Support Qty"
            minFractionDigits={0}
          />
          <RequiredText text={errors.frmla_stmqt} />
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
      <ConfirmDialog />
      <DataTable
        value={dataList}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
      >
        <Column field="frmla_mtmqt" header="Master Qty" sortable />
        <Column field="sitem_iname" header="Support Item" sortable />
        <Column field="sitem_untnm" header="Support Unit" sortable />
        <Column field="frmla_stmqt" header="Support Qty" sortable />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </>
  );
};
export default FormulaFormComp;
