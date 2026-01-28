import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const EmployeeListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.bsins_bname}"?`,
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
        <span className="text-sm text-gray-500">{rowData.emply_ecode}</span>
        <span className="text-sm text-gray-500">{rowData.emply_desig}</span>
      </div>
    );
  };

  const emply_econt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.emply_econt}</span>
        <span className="text-sm">{rowData.emply_addrs}</span>
      </div>
    );
  };

  const emply_jndat_BT = (rowData) => {
    return (
      <>
        Join: {formatDate(rowData.emply_jndat)}
        <br />
        Resign: {formatDate(rowData.emply_rgdat)}
      </>
    );
  };

  const emply_crsal_BT = (rowData) => {
    return <>{rowData.emply_crsal}</>;
  };

  const emply_supid_BT = (rowData) => {
    return <>{rowData.emply_supid}</>;
  };

  const emply_login_BT = (rowData) => {
    return <>{rowData.emply_login ? "Yes" : "No"}</>;
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
        <Column field="emply_ecode" header="Name" body={emply_ecode_BT} />
        <Column field="emply_econt" header="Contact" body={emply_econt_BT} />
        <Column field="emply_jndat" header="Date" body={emply_jndat_BT} />
        <Column field="emply_crsal" header="Salary" body={emply_crsal_BT} />
        <Column field="emply_supid" header="Supervisor" body={emply_supid_BT} />
        <Column field="emply_login" header="Login" body={emply_login_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default EmployeeListComp;
