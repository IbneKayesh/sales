import { useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { useAttributesSgd } from "@/hooks/inventory/useAttributesSgd";
import { InputText } from "primereact/inputtext";
import { attribTypeOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";
import ActiveRowCell from "@/components/ActiveRowCell";

const AttributesComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  onDelete,
  categoryId,
}) => {
  const { dataList, handleGetAllAttribCategory } = useAttributesSgd();
  useEffect(() => {
    handleGetAllAttribCategory(categoryId);
  }, [categoryId, formData.id]);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.attrb_aname}"?`,
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

  const attrb_aname_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.attrb_aname} status={rowData.attrb_actve} />
    );
  };

  const action_BT = (rowData) => {
    return (
      <div className="flex flex-wrap gap-2">
        <Button
          icon="pi pi-trash"
          size="small"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          severity="danger"
          onClick={() => handleDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <div className="p-1">
      <div className="p-3 border-round-xl shadow-2 bg-white mb-3">
        <div className="grid formgrid p-fluid">
          <div className="field col-12 md:col-6">
            <label htmlFor="attrb_aname">Attribute Name</label>
            <InputText
              name="attrb_aname"
              value={formData.attrb_aname}
              onChange={(e) => onChange("attrb_aname", e.target.value)}
              className={errors.attrb_aname ? "p-invalid" : ""}
              placeholder="Enter Attribute Name"
            />
            {errors.attrb_aname && (
              <small className="p-error">{errors.attrb_aname}</small>
            )}
          </div>

          <div className="field col-12 md:col-4">
            <label htmlFor="attrb_dtype">Attribute Type</label>
            <Dropdown
              name="attrb_dtype"
              value={formData.attrb_dtype}
              onChange={(e) => onChange("attrb_dtype", e.value)}
              options={attribTypeOptions}
              optionLabel="label"
              optionValue="value"
              className={`w-full ${errors.attrb_dtype ? "p-invalid" : ""}`}
              placeholder={`Enter type`}
            />
            {errors.attrb_dtype && (
              <small className="p-error">{errors.attrb_dtype}</small>
            )}
          </div>
          <div className="field col-12 md:col-2 justify-content-end mt-4">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={"Add Attribute"}
              icon={"pi pi-check"}
              severity="success"
              size="small"
            />
          </div>
        </div>
      </div>
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={15}
        rowsPerPageOptions={[15, 50, 100]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
        header={"Attributes"}
      >
        <Column
          field="attrb_aname"
          header="Name"
          sortable
          body={attrb_aname_BT}
        />
        <Column field="attrb_dtype" header="Type" />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};
export default AttributesComp;
