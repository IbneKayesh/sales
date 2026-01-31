import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate, formatDateTime } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

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

  const users_email_BTx = (rowData) => {
    return (
      <>
        {rowData.users_isrgs === 1 ? (
          <i className="pi pi-user text-green-500 mr-2" />
        ) : (
          <i className="pi pi-users text-blue-500 mr-2" />
        )}
        {rowData.users_email}{" "}
        {rowData.users_actve === 1 ? (
          <i className="pi pi-check-circle text-green-500 mr-2" />
        ) : (
          <i className="pi pi-times-circle text-red-500 mr-2" />
        )}
      </>
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
        <ActiveRowCell
          text={rowData.users_email}
          status={rowData.users_actve}
        />
      </>
    );
  };

  const users_oname_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell text={rowData.users_oname} status={rowData.users_actve} />
        </span>
        <span className="text-sm text-gray-500">
          {rowData.users_cntct}
        </span>
      </div>
    );
  };

  const users_regno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell text={rowData.users_regno} status={rowData.users_actve} />
        </span>
        <span className="text-sm text-gray-500">
          {formatDate(rowData.users_regdt)}
        </span>
      </div>
    );
  };

  const users_lstpd_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell text={formatDateTime(rowData.users_lstpd)} status={rowData.users_actve} />
        </span>
        <span className="text-sm text-gray-500">
          Last Login: {formatDateTime(rowData.users_lstgn)}
        </span>
      </div>
    );
  };

  const users_wctxt_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">
          <ActiveRowCell text={rowData.users_wctxt} status={rowData.users_actve} />
        </span>
        <span className="text-sm text-gray-500">
          {rowData.users_notes}
        </span>
      </div>
    );
  };

  const bsins_bname_BT = (rowData) => {
    return <span className="text-bold text-blue-500">{rowData.bsins_bname}</span>;
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
        <Column field="users_email" header="Email" body={users_email_BT} />
        <Column field="users_recky" header="Key" />
        <Column field="users_oname" header="Name" body={users_oname_BT} />
        <Column field="users_regno" header="Registered" body={users_regno_BT} />
        <Column
          field="users_lstpd"
          header="Available"
          body={users_lstpd_BT}
        />
        <Column field="users_wctxt" header="Welcome" body={users_wctxt_BT} />
        <Column field="users_nofcr" header="Credits" />
        <Column field="bsins_bname" header="Business" body={bsins_bname_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default UsersListComp;
