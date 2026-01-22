import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const RouteListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const header = () => {
    return (
      <div className="flex flex-wrap align-items-center justify-content-between gap-2">
        <div className="flex flex-wrap align-items-center gap-2">
          <div className="p-inputgroup w-full md:w-25rem">
            <span className="p-inputgroup-addon bg-gray-100">
              <i className="pi pi-search"></i>
            </span>
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="p-inputtext-sm"
            />
          </div>
        </div>

        <div className="flex align-items-center gap-2"></div>
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.rutes_rname}"?`,
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
        />
      </div>
    );
  };

  const rutes_rname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell
            text={rowData.rutes_rname}
            status={rowData.rutes_actve}
          />
        </span>
        <span className="text-sm text-blue-500">{rowData.rutes_dname}</span>
      </div>
    );
  };

  const rutes_odval_BT = (rowData) => {
    const { rutes_odval, rutes_dlval, rutes_clval, rutes_duval } = rowData;

    return (
      <div className="flex gap-1">
        <span className="text-green-500 font-bold">
          {Number(rutes_odval).toFixed(2)}
        </span>
        •
        <span className="text-red-500 font-bold">
          {Number(rutes_dlval).toFixed(2)}
        </span>
        •
        <span className="text-blue-500 font-bold">
          {Number(rutes_clval).toFixed(2)}
        </span>
        •
        <span className="text-purple-500 font-bold">
          {Number(rutes_duval).toFixed(2)}
        </span>
      </div>
    );
  };

  const rutes_lvdat_BT = (rowData) => {
    return <>{formatDate(rowData.rutes_lvdat)}</>;
  };

  const rutes_ttcnt_BT = (rowData) => {
    return <>{Number(rowData.rutes_ttcnt).toFixed(0)}</>;
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
        globalFilterFields={["rutes_rname", "rutes_dname"]}
        header={header()}
      >
        <Column
          field="rutes_rname"
          header="Route"
          sortable
          body={rutes_rname_BT}
        />
        <Column field="rutes_lvdat" header="Last Visit" body={rutes_lvdat_BT} />
        <Column
          field="rutes_ttcnt"
          header="Total Contacts"
          body={rutes_ttcnt_BT}
        />
        <Column
          field="rutes_odval"
          header="Orders • Delivery • Collection • Dues"
          body={rutes_odval_BT}
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default RouteListComp;
