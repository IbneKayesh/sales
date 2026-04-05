import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import tmhb_lvapp from "@/models/hrms/tmhb_lvapp.json";
import RequiredText from "@/components/RequiredText";
import React, { useEffect, useRef, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useAttendStatusSgd } from "@/hooks/hrms/useAttendStatusSgd";
import { formatDate } from "@/utils/datetime";

const EmpLeaveFormComp = ({
  isBusy,
  errors,
  formData,
  onChange,
  onSave,
  onEmpLeaveList,
  dataList,
}) => {
  const { dataList: lvapp_atnstOptions, handleGetAppLeave } =
    useAttendStatusSgd();

  useEffect(() => {
    handleGetAppLeave();
  }, []);

  function lvapp_emply_OnBlur() {
    onEmpLeaveList();
  }

  const lvapp_frdat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">From: {formatDate(rowData.lvapp_frdat)}</span>
        <span className="text-sm">To: {formatDate(rowData.lvapp_todat)}</span>
      </div>
    );
  };

  const lvapp_fsapp_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">{rowData.lvapp_fsapp}</span>
        <span className="text-sm">on Date: {formatDate(rowData.lvapp_fsdat)}</span>
      </div>
    );
  };

  return (
    <>
      <div className="grid">
        <div className="col-12 md:col-2">
          <label
            htmlFor="lvapp_yerid"
            className="block font-bold mb-2 text-red-800"
          >
            {tmhb_lvapp.lvapp_yerid.label}
          </label>
          <InputNumber
            name="lvapp_yerid"
            value={formData.lvapp_yerid}
            onValueChange={(e) => onChange("lvapp_yerid", e.value)}
            className={`w-full ${errors.lvapp_yerid ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmhb_lvapp.lvapp_yerid.label}`}
            useGrouping={false}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.lvapp_yerid} />
        </div>

        <div className="col-12 md:col-2">
          <label htmlFor="lvapp_atnst" className="block font-bold mb-2">
            {tmhb_lvapp.lvapp_atnst.label}
          </label>
          <Dropdown
            name="lvapp_atnst"
            value={formData.lvapp_atnst}
            onChange={(e) => onChange("lvapp_atnst", e.value)}
            options={lvapp_atnstOptions}
            optionLabel="atnst_sname"
            optionValue="id"
            className={`w-full ${errors.lvapp_atnst ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmhb_lvapp.lvapp_atnst.label}`}
          />
          <RequiredText text={errors.lvapp_atnst} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="lvapp_emply"
            className="block font-bold mb-2 text-red-800"
          >
            {tmhb_lvapp.lvapp_emply.label}
          </label>
          <InputText
            name="lvapp_emply"
            value={formData.lvapp_emply}
            onChange={(e) => onChange("lvapp_emply", e.target.value)}
            className={`w-full ${errors.lvapp_emply ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmhb_lvapp.lvapp_emply.label}`}
            onBlur={lvapp_emply_OnBlur}
          />
          <RequiredText text={errors.lvapp_emply} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="lvapp_frdat"
            className="block font-bold mb-2 text-red-800"
          >
            {tmhb_lvapp.lvapp_frdat.label}
          </label>
          <Calendar
            name="lvapp_frdat"
            value={
              formData.lvapp_frdat
                ? typeof formData.lvapp_frdat === "string" &&
                  !formData.lvapp_frdat.includes("T")
                  ? new Date(formData.lvapp_frdat + "T00:00:00")
                  : new Date(formData.lvapp_frdat)
                : null
            }
            onChange={(e) => onChange("lvapp_frdat", e.target.value)}
            className={`w-full ${errors.lvapp_frdat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${tmhb_lvapp.lvapp_frdat.label}`}
          />
          <RequiredText text={errors.lvapp_frdat} />
        </div>
        <div className="col-12 md:col-2">
          <label
            htmlFor="lvapp_todat"
            className="block font-bold mb-2 text-red-800"
          >
            {tmhb_lvapp.lvapp_todat.label}
          </label>
          <Calendar
            name="lvapp_todat"
            value={
              formData.lvapp_todat
                ? typeof formData.lvapp_todat === "string" &&
                  !formData.lvapp_todat.includes("T")
                  ? new Date(formData.lvapp_todat + "T00:00:00")
                  : new Date(formData.lvapp_todat)
                : null
            }
            onChange={(e) => onChange("lvapp_todat", e.target.value)}
            className={`w-full ${errors.lvapp_todat ? "p-invalid" : ""}`}
            dateFormat="yy-mm-dd"
            placeholder={`Select ${tmhb_lvapp.lvapp_todat.label}`}
          />
          <RequiredText text={errors.lvapp_todat} />
        </div>

        <div className="col-12 md:col-2">
          <label
            htmlFor="lvapp_today"
            className="block font-bold mb-2 text-red-800"
          >
            {tmhb_lvapp.lvapp_today.label}
          </label>
          <InputNumber
            name="lvapp_today"
            value={formData.lvapp_today}
            onValueChange={(e) => onChange("lvapp_today", e.value)}
            className={`w-full ${errors.lvapp_today ? "p-invalid" : ""}`}
            placeholder={`Enter ${tmhb_lvapp.lvapp_today.label}`}
            disabled={true}
            variant="filled"
          />
          <RequiredText text={errors.lvapp_today} />
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

      <div className="p-1">
        {/* {JSON.stringify(dataList)} */}
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
        >
          <Column field="lvapp_yerid" header="Year" sortable />
          <Column field="emply_ename" header="Name" sortable />
          <Column field="atnst_sname" header="Leave" sortable />
          <Column
            field="lvapp_frdat"
            header="Date"
            body={lvapp_frdat_BT}
            sortable
          />
          <Column field="lvapp_today" header="Total Days" sortable />
          <Column field="lvapp_notes" header="Notes" sortable />
          <Column
            field="lvapp_fsapp"
            header="Approve"
            body={lvapp_fsapp_BT}
            sortable
          />
        </DataTable>
      </div>
    </>
  );
};

export default EmpLeaveFormComp;
