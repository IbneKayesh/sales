import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";

const HolidaysListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.hlday_hldnm}"?`,
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

  const hlday_hldnm_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.hlday_hldnm} status={rowData.hlday_actve} />
    );
  };

  const hlday_hldat_BT = (rowData) => {
    if (!rowData.hlday_hldat) return null;
    const date = new Date(rowData.hlday_hldat);
    return <span>{date.toLocaleDateString()}</span>;
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
        globalFilterFields={["hlday_hldnm", "hlday_notes"]}
        header={header()}
      >
        <Column
          field="hlday_yerid"
          header="Year"
          sortable
        />
        <Column
          field="hlday_hldat"
          header="Holiday Date"
          body={hlday_hldat_BT}
          sortable
        />
        <Column
          field="hlday_hldnm"
          header="Holiday Name"
          body={hlday_hldnm_BT}
          sortable
        />
        <Column
          field="hlday_notes"
          header="Notes"
          sortable
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default HolidaysListComp;
