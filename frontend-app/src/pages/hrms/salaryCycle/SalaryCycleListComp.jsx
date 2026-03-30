import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { formatDate } from "@/utils/datetime";

const SalaryCycleListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.scyle_cname}"?`,
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
        disabled:
          rowData.edit_stop !== 0 && rowData.edit_stop !== undefined
            ? true
            : false,
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
          disabled={
            rowData.edit_stop !== 0 && rowData.edit_stop !== undefined
              ? true
              : false
          }
        />
      </div>
    );
  };

  const scyle_cname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">
          <span className="font-bold">Cycle Group:</span>
          {rowData.scyle_gname}
        </div>
        <span className="font-bold">Name:</span>
        <ActiveRowCell
          text={rowData.scyle_cname}
          status={rowData.scyle_actve}
        />
      </div>
    );
  };

  const scyle_dates_BT = (rowData) => {
    const fromDate = rowData.scyle_frdat ? formatDate(rowData.scyle_frdat) : "";
    const toDate = rowData.scyle_todat ? formatDate(rowData.scyle_todat) : "";

    return (
      <div className="flex flex-column gap-1">
        <div>
          <span className="font-bold">From:</span> {fromDate}
        </div>
        <div>
          <span className="font-bold">To:</span> {toDate}
        </div>
      </div>
    );
  };

  const scyle_info_BT = (rowData) => {
    return (
      <div className="flex flex-column gap-1">
        <div>
          <span className="font-bold">Year:</span> {rowData.scyle_yerid}
        </div>
        <div>
          <span className="font-bold">Total Days:</span> {rowData.scyle_today}
        </div>
      </div>
    );
  };

  const iscmp_BT = (rowData) => {
    return (
      <div className="flex align-items-center gap-2">
        {rowData.scyle_iscmp === 1 || rowData.scyle_iscmp === true ? (
          <i
            className="pi pi-check"
            style={{ color: "green", fontSize: "1.2rem" }}
          ></i>
        ) : (
          <i
            className="pi pi-times"
            style={{ color: "gray", fontSize: "1.2rem" }}
          ></i>
        )}
      </div>
    );
  };

    const scyle_iscmp_BT = (rowData) => {
    return (
      <span
        className={`pi ${rowData.scyle_iscmp ? "pi-check text-green-500" : "pi-times text-red-400"}`}
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
        globalFilterFields={["scyle_cname", "scyle_yerid"]}
        header={header()}
      >
        <Column
          field="scyle_cname"
          header="Cycle Name"
          body={scyle_cname_BT}
          sortable
        />
        <Column header="Duration" body={scyle_dates_BT} />
        <Column header="Info" body={scyle_info_BT} />
        <Column field="scyle_notes" header="Notes" />
        <Column
          field="scyle_iscmp"
          header="Complete"
          body={scyle_iscmp_BT}
          align="center"
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default SalaryCycleListComp;
