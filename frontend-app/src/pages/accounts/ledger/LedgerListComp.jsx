import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";

const LedgerListComp = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.ledgr_trdat}, ${rowData.ledgr_refno}"?`,
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
    //console.log("rowData " + JSON.stringify(rowData));
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
          icon={`${rowData.edit_stop ? "pi pi-eye" : "pi pi-pencil"}`}
          size="small"
          tooltip={rowData.edit_stop ? "View" : "Edit"}
          tooltipOptions={{ position: "top" }}
          onClick={() => onEdit(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const bsins_bname_BT = (rowData) => {
    return (
      <>
        {rowData.bsins_bname}
        {", "}
        <span className="text-blue-400">{rowData.bacts_bankn}</span>
      </>
    );
  };

  const ledgr_trdat_BT = (rowData) => {
    return formatDate(rowData.ledgr_trdat);
  };

  const ledgr_refno_BT = (rowData) => {
    return (
      <>
        {rowData.ledgr_refno}
        {", "}
        <span className="text-gray-600">{rowData.ledgr_notes}</span>
      </>
    );
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
        className="bg-dark-300"
        size="small"
      >
        <Column
          field="bsins_bname"
          header="Business"
          body={bsins_bname_BT}
          sortable
        />
        <Column field="trhed_hednm" header="Head" sortable />
        <Column field="cntct_cntnm" header="Contact" sortable />
        <Column field="ledgr_pymod" header="Mode" sortable />
        <Column
          field="ledgr_trdat"
          header="Date"
          sortable
          body={ledgr_trdat_BT}
        />
        <Column field="ledgr_refno" header="Ref No" body={ledgr_refno_BT} />
        <Column field="ledgr_dbamt" header="Debit (+)" sortable />
        <Column field="ledgr_cramt" header="Credit (-)" sortable />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default LedgerListComp;
