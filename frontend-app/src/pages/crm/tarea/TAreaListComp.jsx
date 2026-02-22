import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { InputText } from "primereact/inputtext";
import ActiveRowCell from "@/components/ActiveRowCell";

const TAreaListComp = ({ dataList, onEdit, onDelete }) => {
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
      message: `Are you sure you want to delete "${rowData.tarea_tname}"?`,
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

  const tarea_tname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell
            text={rowData.tarea_tname}
            status={rowData.tarea_actve}
          />
        </span>
      </div>
    );
  };

  const dzone_dname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.dzone_dname}</span>
        <span className="text-xs text-gray-500">{rowData.dzone_cntry}</span>
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
        globalFilterFields={["tarea_tname", "dzone_dname"]}
        header={header()}
      >
        <Column
          field="tarea_tname"
          header="Thana/Area"
          sortable
          body={tarea_tname_BT}
        />
        <Column field="dzone_dname" header="D/Zone" body={dzone_dname_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default TAreaListComp;
