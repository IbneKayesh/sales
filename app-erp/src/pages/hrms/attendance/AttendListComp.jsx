import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { formatDate, formatMinutesToHHMM } from "@/utils/datetime";

const AttendListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete attendance for employee "${rowData.attnd_emply}" on ${formatDate(rowData.attnd_atdat, 1)}?`,
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
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: rowData.edit_stop,
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-pencil"
          size="small"
          tooltip="Edit"
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
          disabled={rowData.edit_stop}
        />
      </div>
    );
  };

  const emply_ecode_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.emply_ecode}</div>
        <div className="text-md">{rowData.emply_ename}</div>
      </div>
    );
  };

  const attnd_atdat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.attnd_dname}</div>
        <div className="text-md">{formatDate(rowData.attnd_atdat, 1)}</div>
      </div>
    );
  };
  const attnd_intim_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.attnd_intim}</div>
        <div className="text-md">{rowData.attnd_stsin}</div>
        <div className="text-md">{rowData.attnd_trmni}</div>
      </div>
    );
  };
  const attnd_outim_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.attnd_outim}</div>
        <div className="text-md">{rowData.attnd_stsou}</div>
        <div className="text-md">{rowData.attnd_trmno}</div>
      </div>
    );
  };

  const attnd_totwh_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{formatMinutesToHHMM(rowData.attnd_totwh)}</div>
        <div className="text-md">{formatMinutesToHHMM(rowData.attnd_totoh)}</div>
      </div>
    );
  };

  const attnd_sname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">{rowData.attnd_sname}</div>
        <div className="text-md">{rowData.attnd_notes}</div>
        <span
          className={`pi ${rowData.attnd_prsnt ? "pi-check text-green-500" : "pi-times text-red-400"}`}
        />
        <span
          className={`pi ${rowData.attnd_paybl ? "pi-check text-green-500" : "pi-times text-red-400"}`}
        />
      </div>
    );
  };

  const header = () => {
    return (
      <div className="flex flex-column md:flex-row align-items-center justify-content-between gap-3">
        <div className="p-inputgroup w-full md:w-25rem">
          <span className="p-inputgroup-addon bg-gray-100">
            <i className="pi pi-search"></i>
          </span>
          <InputText
            type="search"
            onInput={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search Employee..."
            className="p-inputtext-sm"
          />
        </div>

        <div className="flex flex-column md:flex-row align-items-center gap-2 w-full md:w-auto"></div>
      </div>
    );
  };

  return (
    <div className="p-1">
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
        globalFilter={globalFilter}
        globalFilterFields={["emply_ecode"]}
        header={header()}
      >
        <Column
          field="emply_ecode"
          header="Employee"
          body={emply_ecode_BT}
          sortable
        />
        <Column
          field="attnd_atdat"
          header="Date"
          body={attnd_atdat_BT}
          sortable
        />
        <Column
          field="attnd_intim"
          header="Start Time"
          body={attnd_intim_BT}
          sortable
        />
        <Column
          field="attnd_outim"
          header="End Time"
          body={attnd_outim_BT}
          sortable
        />
        <Column
          field="attnd_totwh"
          header="Working Hour"
          body={attnd_totwh_BT}
          sortable
        />
        <Column
          field="attnd_sname"
          header="Status"
          body={attnd_sname_BT}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default AttendListComp;
