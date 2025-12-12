import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const PaymentListComponent = ({ dataList, onDetail, onDelete }) => {

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.ref_no}"?`,
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

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Delete",
        icon: "pi pi-trash text-red-400",
        command: () => {
          handleDelete(rowData);
        },
        disabled: 1,
      },
    ];
    return (
      <div className="flex flex-wrap gap-2">
        <SplitButton
          icon="pi pi-book"
          size="small"
          tooltip="View Details"
          tooltipOptions={{ position: "top" }}
          onClick={() => onDetail(rowData)}
          model={menuItems}
          disabled={rowData.ismodified}
        />
      </div>
    );
  };

  const payment_head_BT = (rowData) => {
    return rowData.payment_head + " - " + rowData.contact_name;
  };


  const payment_amount_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.payment_amount);
  };

  const balance_amount_BT = (rowData) => {
    if(rowData.balance_amount === 0){
      return "0";
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.balance_amount);
  };

  const ref_no_BT = (rowData) => {
    return rowData.ref_no + ", " + rowData.payment_note;
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
        <Column field="payment_head" header="Head" sortable body={payment_head_BT} />
        <Column field="payment_mode" header="Mode" sortable/>
        <Column field="payment_date" header="Date" sortable/>
        <Column field="payment_amount" header="Payment" sortable body={payment_amount_BT}/>
        <Column field="balance_amount" header="Balance" sortable body={balance_amount_BT}/>
        <Column field="ref_no" header="Ref No" sortable body={ref_no_BT}/>
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default PaymentListComponent;