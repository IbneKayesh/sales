import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";

const ItemsListComponent = ({ dataList, onEdit, onDelete }) => {
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.item_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        onDelete(rowData.item_id);
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
        disabled: rowData.ismodified,
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
          disabled={rowData.ismodified}
        />
      </div>
    );
  };

  const purchaseRateTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.purchase_rate);
  };

  const salesRateTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.sales_rate);
  };

  const approxProfitTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.approx_profit);
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
        responsiveLayout="scroll"
        className="bg-dark-300"
        size="small"
      >
        <Column field="item_name" header="Item Name" sortable />
        <Column field="item_description" header="Description" />
        <Column field="category_name" header="Category" />
        <Column field="small_unit_name" header="Small Unit" />
        <Column field="unit_difference_qty" header="Unit Diff Qty" />
        <Column field="big_unit_name" header="Big Unit" />
        <Column field="order_qty" header="Order Qty" sortable />
        <Column field="stock_qty" header="Stock Qty" sortable />
        <Column
          field="purchase_rate"
          header="Purchase Rate"
          body={purchaseRateTemplate}
          sortable
        />
        <Column
          field="sales_rate"
          header="Sales Rate"
          body={salesRateTemplate}
          sortable
        />
        <Column field="discount_percent" header="Discount %" />
        <Column
          field="approx_profit"
          header="Approx Profit"
          body={approxProfitTemplate}
          sortable
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
    </div>
  );
};

export default ItemsListComponent;
