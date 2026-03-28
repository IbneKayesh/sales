import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const AttendLogListComp = ({
  localList,
  dataList,
  onDelete,
  onDeleteLocal,
}) => {
  const [globalFilterLocal, setGlobalFilterLocal] = useState(null);
  const [globalFilterDb, setGlobalFilterDb] = useState(null);

  // ── Confirm delete from DB ──────────────────────────────────────────────────
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete log for "${rowData.atnlg_ecode || rowData.atnlg_crdno}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => onDelete(rowData),
      reject: () => {},
    });
  };

  // ── Confirm discard from localStorage ──────────────────────────────────────
  const handleDeleteLocal = (rowData) => {
    confirmDialog({
      message: `Discard pending entry for "${rowData.atnlg_ecode || rowData.atnlg_crdno}"?`,
      header: "Discard Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => onDeleteLocal(rowData),
      reject: () => {},
    });
  };

  // ── Cell renderers ──────────────────────────────────────────────────────────
  const ecodeBT = (rowData) => (
    <ActiveRowCell text={rowData.atnlg_ecode} status={rowData.atnlg_actve} />
  );

  const crdnoBT = (rowData) => (
    <ActiveRowCell text={rowData.atnlg_crdno} status={rowData.atnlg_actve} />
  );

  const lgtimBT = (rowData) => {
    if (!rowData.atnlg_lgtim) return null;
    return new Date(rowData.atnlg_lgtim).toLocaleString();
  };

  const dbActionBT = (rowData) => (
    <div className="flex flex-wrap gap-2">
      <Button
        icon="pi pi-trash"
        size="small"
        severity="danger"
        tooltip="Delete"
        tooltipOptions={{ position: "top" }}
        onClick={() => handleDelete(rowData)}
        disabled={rowData.edit_stop}
      />
    </div>
  );

  const localActionBT = (rowData) => (
    <div className="flex flex-wrap gap-2">
      <Button
        icon="pi pi-times"
        size="small"
        severity="warning"
        tooltip="Discard"
        tooltipOptions={{ position: "top" }}
        onClick={() => handleDeleteLocal(rowData)}
      />
    </div>
  );

  // ── Shared search header factory ────────────────────────────────────────────
  const makeHeader = (onSearch) => (
    <div className="flex align-items-center gap-3">
      <div className="p-inputgroup w-full md:w-25rem">
        <span className="p-inputgroup-addon bg-gray-100">
          <i className="pi pi-search"></i>
        </span>
        <InputText
          type="search"
          onInput={(e) => onSearch(e.target.value)}
          placeholder="Search..."
          className="p-inputtext-sm"
        />
      </div>
    </div>
  );

  return (
    <div className="flex flex-column gap-4 p-1">
      <ConfirmDialog />

      {/* ── Pending (localStorage) list ─────────────────────────────────── */}
      <div>
        <div className="flex align-items-center gap-2 mb-2">
          <Tag
            severity="warning"
            value="Pending — not yet synced"
            icon="pi pi-clock"
          />
          <span className="text-sm text-color-secondary">
            {localList?.length ?? 0} record(s)
          </span>
        </div>
        <DataTable
          value={localList}
          paginator
          rows={10}
          rowsPerPageOptions={[10, 25, 50]}
          emptyMessage="No pending records."
          size="small"
          rowHover
          showGridlines
          globalFilter={globalFilterLocal}
          globalFilterFields={["atnlg_ecode", "atnlg_crdno"]}
          header={makeHeader(setGlobalFilterLocal)}
          rowClassName={() => ({ "bg-yellow-50": true })}
        >
          <Column
            field="atnlg_ecode"
            header="Employee Code"
            body={ecodeBT}
            sortable
          />
          <Column
            field="atnlg_crdno"
            header="Card Number"
            body={crdnoBT}
            sortable
          />
          <Column
            field="atnlg_lgtim"
            header="Login Time"
            body={lgtimBT}
            sortable
          />
          <Column
            header="Action"
            body={localActionBT}
            style={{ width: "5rem" }}
          />
        </DataTable>
      </div>

      {/* ── Database list ───────────────────────────────────────────────── */}
      <div>
        <div className="flex align-items-center gap-2 mb-2">
          <Tag
            severity="success"
            value="Synced — saved in database"
            icon="pi pi-database"
          />
          <span className="text-sm text-color-secondary">
            {dataList?.length ?? 0} record(s)
          </span>
        </div>
        <DataTable
          value={dataList}
          paginator
          rows={15}
          rowsPerPageOptions={[15, 50, 100]}
          emptyMessage="No data found."
          size="small"
          rowHover
          showGridlines
          globalFilter={globalFilterDb}
          globalFilterFields={["atnlg_ecode", "atnlg_crdno"]}
          header={makeHeader(setGlobalFilterDb)}
        >
          <Column
            field="atnlg_ecode"
            header="Employee Code"
            body={ecodeBT}
            sortable
          />
          <Column
            field="atnlg_crdno"
            header="Card Number"
            body={crdnoBT}
            sortable
          />
          <Column field="emply_ename" header="Employee Name" />
          <Column
            field="atnlg_lgtim"
            header="Login Time"
            body={lgtimBT}
            sortable
          />
          <Column header="Action" body={dbActionBT} style={{ width: "5rem" }} />
        </DataTable>
      </div>
    </div>
  );
};

export default AttendLogListComp;
