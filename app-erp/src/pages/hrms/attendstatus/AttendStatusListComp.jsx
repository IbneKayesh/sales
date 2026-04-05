import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const AttendStatusListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.atnst_sname}"?`,
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

  const atnst_sname_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.atnst_sname} status={rowData.atnst_actve} />
    );
  };

  const atnst_prsnt_BT = (rowData) => {
    return (
      <span
        className={`pi ${rowData.atnst_prsnt ? "pi-check text-green-500" : "pi-times text-red-400"}`}
      />
    );
  };

  const atnst_paybl_BT = (rowData) => {
    return (
      <span
        className={`pi ${rowData.atnst_paybl ? "pi-check text-green-500" : "pi-times text-red-400"}`}
      />
    );
  };

  const atnst_nappl_BT = (rowData) => {
    return (
      <span
        className={rowData.atnst_nappl > 0 ? "text-green-500" : "text-red-400"}
      >
        {rowData.atnst_nappl > 0 ? rowData.atnst_nappl : "Not applicable"}
      </span>
    );
  };

  const atnst_color_BT = (rowData) => {
    return (
      <span
        className="p-2 rounded-2"
        style={{ backgroundColor: rowData.atnst_color }}
      ></span>
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
        globalFilterFields={["atnst_sname"]}
        header={header()}
      >
        <Column
          field="atnst_sname"
          header="Status Name"
          body={atnst_sname_BT}
          sortable
        />
        <Column
          field="atnst_prsnt"
          header="Is Present"
          body={atnst_prsnt_BT}
          sortable
        />
        <Column
          field="atnst_paybl"
          header="Is Payable"
          body={atnst_paybl_BT}
          sortable
        />
        <Column
          field="atnst_nappl"
          header="Number of Apply"
          body={atnst_nappl_BT}
          sortable
        />
        <Column field="atnst_color" header="Color" body={atnst_color_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default AttendStatusListComp;
