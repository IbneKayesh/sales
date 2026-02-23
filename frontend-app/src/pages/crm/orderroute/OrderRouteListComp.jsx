import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const OrderRouteListComp = ({ dataList, onEdit, onDelete, onOutlets }) => {
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
        label: "Outlets",
        icon: "pi pi-shop",
        command: () => {
          onOutlets(rowData);
        },
        disabled: rowData.edit_stop,
      },
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

  const trtry_wname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.trtry_wname}</span>
        <span className="text-sm text-blue-500">{rowData.tarea_tname}</span>
        <span className="text-sm text-blue-500">{rowData.dzone_dname}</span>
      </div>
    );
  };

  const rutes_lvdat_BT = (rowData) => {
    return <>{formatDate(rowData.rutes_lvdat)}</>;
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
        <Column field="trtry_wname" header="Territory" body={trtry_wname_BT} />
        <Column field="rutes_lvdat" header="Last Visit" body={rutes_lvdat_BT} />
        <Column field="total_outlets" header="Outlets" />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default OrderRouteListComp;
