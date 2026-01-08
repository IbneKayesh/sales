import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate, formatDateTime } from "@/utils/datetime";

const UsersListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.users_oname}"?`,
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

  const users_email_BT = (rowData) => {
    return (
      <>
        {rowData.users_isrgs === 1 ? (
          <i className="pi pi-user text-green-500 mr-2" />
        ) : (
          <i className="pi pi-users text-blue-500 mr-2" />
        )}
        {rowData.users_email} {" "}
        {rowData.users_actve === 1 ? (
          <i className="pi pi-check-circle text-green-500 mr-2" />
        ) : (
          <i className="pi pi-times-circle text-red-500 mr-2" />
        )}
      </>
    );
  };

  const users_regdt_BT = (rowData) => {
    return formatDate(rowData.users_regdt);
  };

  const users_lstgn_BT = (rowData) => {
    return formatDateTime(rowData.users_lstgn);
  };

  const users_lstpd_BT = (rowData) => {
    return formatDateTime(rowData.users_lstpd);
  };

  return (
    <div className="p-1">
      <ConfirmDialog />
      <DataTable
        value={dataList}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No data found."
        size="small"
        rowHover
        showGridlines
      >
        <Column field="users_email" header="Email" body={users_email_BT} />
        <Column field="users_recky" header="Key" />
        <Column field="users_oname" header="Name" />
        <Column field="users_cntct" header="Contact" />
        <Column field="users_regno" header="Reg No" />
        <Column field="users_regdt" header="Registered" body={users_regdt_BT} />
        <Column field="users_lstgn" header="Last Login" body={users_lstgn_BT} />
        <Column
          field="users_lstpd"
          header="Last pwd Change"
          body={users_lstpd_BT}
        />
        <Column field="users_wctxt" header="Welcome" />
        <Column field="users_notes" header="Notes" />
        <Column field="users_nofcr" header="Credits" />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default UsersListComp;
