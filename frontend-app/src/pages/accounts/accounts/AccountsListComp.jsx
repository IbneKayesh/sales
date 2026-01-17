import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const AccountsListComp = ({ dataList, onEdit, onDelete, onSetDefault }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.bacts_bankn}"?`,
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
        label: rowData.bacts_isdef === 1 ? "Unset Default" : "Set Default",
        icon:
          rowData.bacts_isdef === 1
            ? "pi pi-times-circle text-red-500"
            : "pi pi-check-circle text-green-500",
        command: () => {
          onSetDefault(rowData);
        },
        disabled: rowData.edit_stop,
      },
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

  const bacts_bankn_BT = (rowData) => {
    const text =
      rowData.bacts_bankn +
      ", " +
      rowData.bacts_brnch +
      ", " +
      rowData.bacts_routn;
    return <ActiveRowCell text={text} status={rowData.bacts_actve} />;
  };

  const bacts_acnam_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.bacts_acnam}</span>
        <span className="text-sm text-gray-600">{rowData.bacts_acnum}</span>
        <span className="text-sm text-blue-500">{rowData.bacts_notes}</span>
      </div>
    );
  };

  const bacts_opdat_BT = (rowData) => {
    return <>{formatDate(rowData.bacts_opdat)}</>;
  };

  const bacts_isdef_BT = (rowData) => {
    return (
      <>
        {rowData.bacts_isdef === 1 ? (
          <i className="pi pi-check-circle text-green-500" />
        ) : (
          <i className="pi pi-times-circle text-red-500" />
        )}
      </>
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
        <Column field="bacts_bankn" header="Bank Name" body={bacts_bankn_BT} />
        <Column field="bacts_acnam" header="Account" body={bacts_acnam_BT} />
        <Column field="bacts_opdat" header="Open Date" body={bacts_opdat_BT} />
        <Column field="bacts_crbln" header="Balance" />
        <Column field="bacts_isdef" header="Default" body={bacts_isdef_BT} />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default AccountsListComp;
