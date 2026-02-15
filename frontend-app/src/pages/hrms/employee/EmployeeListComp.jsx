import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const EmployeeListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.emply_ename}"?`,
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
        <span className="text-md">
          <ActiveRowCell
            text={rowData.emply_ename}
            status={rowData.emply_actve}
          />
        </span>
        <span className="text-sm text-gray-500">
          Code: {rowData.emply_ecode}
        </span>
        <span className="text-sm text-gray-500">
          Card No: {rowData.emply_crdno}
        </span>
        <span className="text-sm text-gray-500">
          Designation: {rowData.emply_desig}
        </span>
        <span className="text-sm text-gray-500">
          Type: {rowData.emply_etype}
        </span>
        <span className="text-sm text-gray-500">
          Status: {rowData.emply_stats}
        </span>
      </div>
    );
  };

  const emply_econt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Contact: {rowData.emply_econt}</span>
        <span className="text-sm">Email: {rowData.emply_email}</span>
        <span className="text-sm">National ID: {rowData.emply_natid}</span>
      </div>
    );
  };
  const emply_prnam_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Parents: {rowData.emply_prnam}</span>
        <span className="text-sm">Gender: {rowData.emply_gendr}</span>
        <span className="text-sm">Marital Status: {rowData.emply_mstas}</span>
        <span className="text-sm">Blood Group: {rowData.emply_bgrup}</span>
        <span className="text-sm">Religion: {rowData.emply_rlgon}</span>
        <span className="text-sm">Education: {rowData.emply_edgrd}</span>
      </div>
    );
  };
  const emply_psadr_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Present: {rowData.emply_pradr}</span>
        <span className="text-sm">Permanent: {rowData.emply_psadr}</span>
      </div>
    );
  };

  const emply_jndat_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">
          Birth Date: {formatDate(rowData.emply_bdate)}
        </span>
        <span className="text-sm">Join: {formatDate(rowData.emply_jndat)}</span>
        <span className="text-sm">
          Confirm: {formatDate(rowData.emply_cndat)}
        </span>
        <span className="text-sm">
          Resign: {formatDate(rowData.emply_rgdat)}
        </span>
      </div>
    );
  };

  const emply_gssal_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Gross: {rowData.emply_gssal}</span>
        <span className="text-sm">OT Rate: {rowData.emply_otrat}</span>
        <span className="text-sm">Payment Account: {rowData.emply_pyacc}</span>
        <span className="text-sm">Salary Cycle: {rowData.emply_slcyl}</span>
      </div>
    );
  };
  const emply_wksft_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-sm">Shift: {rowData.emply_wksft}</span>
        <span className="text-sm">Supervisor: {rowData.emply_supid}</span>
        <span className="text-sm">Notes: {rowData.emply_notes}</span>
        <span className="text-sm">Login: {rowData.emply_login ? "Yes" : "No"}</span>
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
      >
        <Column field="emply_ecode" header="Employee" body={emply_ecode_BT} />
        <Column field="emply_econt" header="Contact" body={emply_econt_BT} />
        <Column field="emply_prnam" header="Details" body={emply_prnam_BT} />
        <Column field="emply_psadr" header="Address" body={emply_psadr_BT} />
        <Column field="emply_jndat" header="Date" body={emply_jndat_BT} />
        <Column field="emply_gssal" header="Salary" body={emply_gssal_BT} />
        <Column field="emply_wksft" header="Work" body={emply_wksft_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default EmployeeListComp;
