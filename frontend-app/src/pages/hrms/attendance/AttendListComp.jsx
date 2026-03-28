import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { formatDate } from "@/utils/datetime";

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

  const attnd_emply_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.attnd_emply} status={rowData.attnd_actve} />
    );
  };

  const attnd_atdat_BT = (rowData) => {
    return <span>{formatDate(rowData.attnd_atdat, 1)}</span>;
  };

  const attnd_prsnt_BT = (rowData) => {
    return (
      <span
        className={`pi ${rowData.attnd_prsnt ? "pi-check text-green-500" : "pi-times text-red-400"}`}
      />
    );
  };

  const attnd_paybl_BT = (rowData) => {
    return (
      <span
        className={`pi ${rowData.attnd_paybl ? "pi-check text-green-500" : "pi-times text-red-400"}`}
      />
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
        globalFilterFields={["attnd_emply"]}
        header={header()}
      >
        <Column
          field="attnd_emply"
          header="Employee Code"
          body={attnd_emply_BT}
          sortable
        />
        <Column
          field="attnd_atdat"
          header="Date"
          body={attnd_atdat_BT}
          sortable
        />
        <Column
          field="attnd_wksft"
          header="Work Shift"
          sortable
        />
        <Column
          field="attnd_sname"
          header="Status"
          sortable
        />
        <Column
          field="attnd_prsnt"
          header="Present"
          body={attnd_prsnt_BT}
          sortable
        />
        <Column
          field="attnd_paybl"
          header="Payable"
          body={attnd_paybl_BT}
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default AttendListComp;
