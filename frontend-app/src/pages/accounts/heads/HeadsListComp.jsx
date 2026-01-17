import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Button } from "primereact/button";
import ActiveRowCell from "@/components/ActiveRowCell";

const HeadsListComp = ({ dataList, onEdit, onDelete }) => {
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
    return (
      <>
        <Button
          icon="pi pi-trash"
          size="small"
          tooltip="Delete"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleDelete(rowData)}
          disabled={rowData.edit_stop}
        />
      </>
    );
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
      <ActiveRowCell text={rowData.trhed_hednm} status={rowData.trhed_actve} />
    );
  };

  const trhed_grpnm_BT = (rowData) => {
    const activeClassStyle = rowData.trhed_grtyp === "In" ? "text-blue-500" : "text-red-500";
    return (
      <div className="flex flex-column">
        <span>{rowData.trhed_grpnm}</span>
        <span className={activeClassStyle}>{rowData.trhed_grtyp}</span>
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
        <Column
          field="trhed_hednm"
          header="Head"
          body={trhed_hednm_BT}
          sortable
        />
        <Column field="trhed_grpnm" header="Group" body={trhed_grpnm_BT} sortable />
        <Column field="trhed_cntyp" header="Contact" sortable />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default HeadsListComp;
