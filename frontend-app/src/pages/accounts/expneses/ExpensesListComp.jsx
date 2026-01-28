import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ActiveRowCell from "@/components/ActiveRowCell";

const ExpensesListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.expns_refno}"?`,
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
        //disabled: rowData.edit_stop,
        disabled: true,
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
          //disabled={rowData.edit_stop}
          disabled={true}
        />
      </div>
    );
  };

  const expns_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.expns_refno}</span>
        <span className="text-sm text-gray-600">{rowData.expns_srcnm}</span>
      </div>
    );
  };

  const expns_inexc_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        {rowData.expns_inexc === 1 ? "Including" : "Excluding"}
        <span className="text-sm text-gray-600">{formatDate(rowData.expns_trdat)}</span>
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
        <Column field="expns_refno" header="Ref No" body={expns_refno_BT} />
        <Column field="expns_inexc" header="In/Exclude" body={expns_inexc_BT} />
        <Column field="expns_notes" header="Notes" />
        <Column field="expns_xpamt" header="Amount" />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default ExpensesListComp;
