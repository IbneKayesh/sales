import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { formatDate } from "@/utils/datetime";
import ZeroRowCell from "@/components/ZeroRowCell";

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
      <div className="flex flex-column">
        <span className="text-md">{rowData.bsins_bname}</span>
        <span className="text-sm text-blue-500">{rowData.bacts_bankn}</span>
      </div>
    );
  };

const cntct_cntnm_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.cntct_cntnm}</span>
        <span className="text-sm text-blue-500">{rowData.trhed_hednm}</span>
      </div>
    );
  };

  const ledgr_pymod_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.ledgr_pymod}</span>
        <span className="text-sm text-gray-600">{formatDate(rowData.ledgr_trdat)}</span>
      </div>
    );
  };

  const ledgr_refno_BT = (rowData) => {
    return (
      <div className="flex flex-column">
        <span className="text-md">{rowData.ledgr_refno}</span>
        <span className="text-sm text-gray-600">{rowData.ledgr_notes}</span>
      </div>
    );
  };

  const ledgr_dbamt_BT = (rowData) => {
    return <ZeroRowCell value={rowData.ledgr_dbamt} text={rowData.ledgr_dbamt} />;
  };

  const ledgr_cramt_BT = (rowData) => {
    return <ZeroRowCell value={rowData.ledgr_cramt} text={rowData.ledgr_cramt} />;
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
        className="bg-dark-300"
        size="small"
      >
        <Column
          field="bsins_bname"
          header="Business"
          body={bsins_bname_BT}
          sortable
        />
        <Column field="cntct_cntnm" header="Contact" body={cntct_cntnm_BT} sortable />
        <Column
          field="ledgr_pymod"
          header="Date"
          body={ledgr_pymod_BT}
          sortable
        />
        <Column field="ledgr_refno" header="Ref No" body={ledgr_refno_BT} />
        <Column
          field="ledgr_dbamt"
          header="Debit (-)"
          sortable
          body={ledgr_dbamt_BT}
        />
        <Column
          field="ledgr_cramt"
          header="Credit (+)"
          sortable
          body={ledgr_cramt_BT}
        />
        <Column header={dataList?.length + " rows"} body={action_BT} />
      </DataTable>
    </div>
  );
};

export default LedgerListComp;
