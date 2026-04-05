import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import ActiveRowCell from "@/components/ActiveRowCell";
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { formatMinutesToHHMM } from "@/utils/datetime";

const WorkingShiftListComp = ({ dataList, onEdit, onDelete }) => {
  const [globalFilter, setGlobalFilter] = useState(null);
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.wksft_sftnm}"?`,
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

  const wksft_sftnm_BT = (rowData) => {
    return (
      <ActiveRowCell text={rowData.wksft_sftnm} status={rowData.wksft_actve} />
    );
  };

  const wksft_btbst_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-sm text-gray-500">
          Buffer: {rowData.wksft_btbst} mins
        </div>
        <div className="text-md">{rowData.wksft_satim}</div>
        <div className="text-sm text-gray-500">
          Grace: {rowData.wksft_gsmin} mins
        </div>
      </div>
    );
  };
  const wksft_gemin_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-sm text-gray-500">
          Grace: {rowData.wksft_gemin} mins
        </div>
        <div className="text-md">{rowData.wksft_entim}</div>
        <div className="text-sm text-gray-500">
          Buffer: {rowData.wksft_btand} mins
        </div>
      </div>
    );
  };

  const wksft_wrhrs_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <div className="text-md">
          Total: {formatMinutesToHHMM(rowData.wksft_wrhrs)}
        </div>
        <div className="text-md">
          Minimum: {formatMinutesToHHMM(rowData.wksft_mnhrs)}
        </div>
      </div>
    );
  };


  const others_BT = (rowData) => {
    return (
      <div className="flex flex-column gap-2">
        {/* First Row: Cross Day */}
        <div className="flex align-items-center gap-2">
          <span>Cross Day:</span>
          {rowData.wksft_crday ? (
            <i className="pi pi-check" style={{ color: "green" }}></i>
          ) : (
            <i className="pi pi-times" style={{ color: "red" }}></i>
          )}
        </div>

        {/* Second Row: Single Punch */}
        <div className="flex align-items-center gap-2">
          <span>Single Punch:</span>
          {rowData.wksft_sgpnc ? (
            <i className="pi pi-check" style={{ color: "green" }}></i>
          ) : (
            <i className="pi pi-times" style={{ color: "red" }}></i>
          )}
        </div>

        {/* Third Row: Overtime */}
        <div className="flex align-items-center gap-2">
          <span>Overtime:</span>
          {rowData.wksft_ovrtm ? (
            <i className="pi pi-check" style={{ color: "green" }}></i>
          ) : (
            <i className="pi pi-times" style={{ color: "red" }}></i>
          )}
        </div>
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
        globalFilterFields={["wksft_sftnm"]}
        header={header()}
      >
        <Column
          field="wksft_sftnm"
          header="Working Shift"
          body={wksft_sftnm_BT}
          sortable
        />
        <Column field="wksft_btbst" header="Start Time" body={wksft_btbst_BT} />
        <Column field="wksft_gemin" header="End Time" body={wksft_gemin_BT} />
        <Column
          field="wksft_wrhrs"
          header="Working Hours"
          body={wksft_wrhrs_BT}
        />
        <Column header="Others" body={others_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default WorkingShiftListComp;
