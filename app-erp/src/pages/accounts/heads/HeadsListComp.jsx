import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const HeadsListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.trhed_hednm}"?`,
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

  const trhed_hednm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="font-bold text-md">
          <ActiveRowCell
            text={rowData.trhed_hednm}
            status={rowData.trhed_actve}
          />
        </div>
        <div className="text-sm">{rowData.trhed_descr}</div>
      </div>
    );
  };

  const trhed_grpnm_BT = (rowData) => {
    const activeClassStyle =
      rowData.trhed_grtyp === "In" ? "text-blue-500" : "text-red-500";
    return (
      <div className="flex flex-column">
        <span>{rowData.trhed_grpnm}</span>
        <span className={activeClassStyle}>{rowData.trhed_grtyp}</span>
      </div>
    );
  };

  const trhed_grpnm_BTx = (rowData) => {
    const adviceText = rowData.trhed_advic
      ? "Generate Advice"
      : "Direct Ledger Entry";
    return (
      <div className="flex flex-column">
        <span>{rowData.trhed_grpnm}</span>
        <span className="font-bold text-blue-400">{adviceText}</span>
      </div>
    );
  };

  const trhed_cntyp_BT = (rowData) => {
    const activeClassStyle = rowData.trhed_advic
      ? "text-blue-600"
      : "text-gray-600";
    const adviceText = rowData.trhed_advic
      ? "Generate Advice"
      : "Direct Ledger Entry";
    return (
      <div className="flex flex-column">
        <span>{rowData.trhed_cntyp}</span>
        <span className={activeClassStyle}>{adviceText}</span>
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
            placeholder="Search..."
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
        globalFilterFields={["trhed_hednm", "trhed_grpnm", "trhed_cntyp"]}
        header={header()}
      >
        <Column
          field="trhed_hednm"
          header="Head"
          body={trhed_hednm_BT}
          sortable
        />
        <Column
          field="trhed_grpnm"
          header="Group"
          body={trhed_grpnm_BT}
          sortable
        />
        <Column
          field="trhed_cntyp"
          header="Contact"
          body={trhed_cntyp_BT}
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default HeadsListComp;
