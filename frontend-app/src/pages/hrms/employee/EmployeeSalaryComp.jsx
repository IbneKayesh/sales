import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import tmhb_empsl from "@/models/hrms/tmhb_empsl.json";
import { InputSwitch } from "primereact/inputswitch";
import RequiredText from "@/components/RequiredText";
import { empsl_slcatOptions } from "@/utils/vtable";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { SplitButton } from "primereact/splitbutton";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

const EmployeeSalaryComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  dataList,
  onDelete
}) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.empsl_slcat}"?`,
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
          icon="pi pi-trash"
          size="small"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDelete(rowData)}
          disabled={rowData.edit_stop}
          severity="danger"
        />
      </div>
    );
  };

  const crAmount = dataList
    .reduce((sum, item) => sum + Number(item.empsl_cramt || 0), 0)
    .toFixed(2);

  const dbAmount = dataList
    .reduce((sum, item) => sum + Number(item.empsl_dbamt || 0), 0)
    .toFixed(2);
  const empsl_slcat_FT = () => {
    return (
      <div className="flex flex-row-reverse">
        Total: {Number(crAmount - dbAmount).toFixed(2)}
      </div>
    );
  };

  const empsl_cramt_FT = () => {
    return <>{crAmount}</>;
  };

  const empsl_dbamt_FT = () => {
    return <>{dbAmount}</>;
  };

  return (
    <>
      <ConfirmDialog />
      <div className="grid mb-3">
        <div className="col-12 md:col-3">
          <label htmlFor="empsl_slcat" className="block font-bold mb-2">
            {tmhb_empsl.empsl_slcat.label}
          </label>
          <Dropdown
            name="empsl_slcat"
            value={formData.empsl_slcat}
            onChange={(e) => onChange("empsl_slcat", e.value)}
            options={empsl_slcatOptions}
            optionLabel="label"
            optionValue="value"
            className={`w-full ${errors.empsl_slcat ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmhb_empsl.empsl_slcat.label}`}
          />
          <RequiredText text={errors.empsl_slcat} />
        </div>

        <div className="col-12 md:col-2">
          <label htmlFor="empsl_cramt" className="block font-bold mb-2">
            {tmhb_empsl.empsl_cramt.label}
          </label>
          <InputText
            name="empsl_cramt"
            value={formData.empsl_cramt}
            onChange={(e) => onChange("empsl_cramt", e.target.value)}
            className={`w-full ${errors.empsl_cramt ? "p-invalid" : ""}`}
            placeholder={tmhb_empsl.empsl_cramt.placeholder}
          />
          <RequiredText text={errors.empsl_cramt} />
        </div>

        <div className="col-12 md:col-2">
          <label htmlFor="empsl_dbamt" className="block font-bold mb-2">
            {tmhb_empsl.empsl_dbamt.label}
          </label>
          <InputText
            name="empsl_dbamt"
            value={formData.empsl_dbamt}
            onChange={(e) => onChange("empsl_dbamt", e.target.value)}
            className={`w-full ${errors.empsl_dbamt ? "p-invalid" : ""}`}
            placeholder={tmhb_empsl.empsl_dbamt.placeholder}
          />
          <RequiredText text={errors.empsl_dbamt} />
        </div>

        <div className="col-12 md:col-5">
          <label htmlFor="empsl_notes" className="block font-bold mb-2">
            {tmhb_empsl.empsl_notes.label}
          </label>
          <InputText
            name="empsl_notes"
            value={formData.empsl_notes}
            onChange={(e) => onChange("empsl_notes", e.target.value)}
            className={`w-full ${errors.empsl_notes ? "p-invalid" : ""}`}
            placeholder={tmhb_empsl.empsl_notes.placeholder}
          />
          <RequiredText text={errors.empsl_notes} />
        </div>

        <div className="col-12">
          <div className="flex flex-row-reverse flex-wrap">
            <Button
              type="button"
              onClick={(e) => onSave(e)}
              label={formData.id ? "Update" : "Save"}
              icon={"pi pi-check"}
              severity="success"
              size="small"
              loading={isBusy}
            />
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="col-12">
          <DataTable
            value={dataList}
            emptyMessage="No data found."
            size="small"
            rowHover
            showGridlines
          >
            <Column
              field="empsl_slcat"
              header="Category"
              footer={empsl_slcat_FT}
            />
            <Column
              field="empsl_cramt"
              header="Credit"
              footer={empsl_cramt_FT}
            />
            <Column
              field="empsl_dbamt"
              header="Debit"
              footer={empsl_dbamt_FT}
            />
            <Column field="empsl_notes" header="Notes" />

            <Column header={dataList?.length + " rows"} body={action_BT} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default EmployeeSalaryComp;
