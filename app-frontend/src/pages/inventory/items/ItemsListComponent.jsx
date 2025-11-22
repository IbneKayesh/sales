import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Sidebar } from "primereact/sidebar";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";

const ItemsListComponent = ({ dataList, onEdit, onDelete }) => {
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState({});

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

  const handleVisibleDetail = (rowData) => {
    setVisibleDetail(true);
    setSelectedItemDetail(rowData);
  };

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Edit",
        icon: "pi pi-pencil",
        command: () => {
          onEdit(rowData);
        },
        disabled: rowData.ismodified,
      },
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
          icon="pi pi-eye"
          size="small"
          tooltip="View"
          tooltipOptions={{ position: "top" }}
          onClick={() => handleVisibleDetail(rowData)}
          model={menuItems}
        />
      </div>
    );
  };

  const item_nameTemplate = (rowData) => {
    return `${rowData.item_code} - ${rowData.item_name}`;
  }
  const order_qtyTemplate = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.order_qty} rowData={rowData} />;
  };

  const stock_qtyTemplate = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.stock_qty} rowData={rowData} />;
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

  const approxMarginTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.margin_rate || 0);
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return 'N/A';
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(value);
  };

  const orderValue = (selectedItemDetail?.purchase_rate ?? 0) * (selectedItemDetail?.order_qty ?? 0);
  const stockValue = (selectedItemDetail?.purchase_rate ?? 0) * (selectedItemDetail?.stock_qty ?? 0);
  const marginValue = (selectedItemDetail?.margin_rate ?? 0) * (selectedItemDetail?.stock_qty ?? 0);

  // Summary calculations for footer
  const totalItems = dataList.length;
  const totalOrderQty = dataList.reduce((sum, item) => sum + (item.order_qty ?? 0), 0);
  const totalStockQty = dataList.reduce((sum, item) => sum + (item.stock_qty ?? 0), 0);
  const totalPurchaseValue = dataList.reduce((sum, item) => sum + ((item.purchase_rate ?? 0) * (item.stock_qty ?? 0)), 0);
  const totalSalesValue = dataList.reduce((sum, item) => sum + ((item.sales_rate ?? 0) * (item.stock_qty ?? 0)), 0);
  const totalMarginValue = dataList.reduce((sum, item) => sum + ((item.margin_rate ?? 0) * (item.stock_qty ?? 0)), 0);

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
        <Column field="item_name" header="Item Name"  body={item_nameTemplate} footer={`Total Items: ${totalItems}`} sortable />
        <Column
          field="order_qty"
          header="Order Qty"
          sortable
          body={order_qtyTemplate}
          footer={totalOrderQty}
        />
        <Column
          field="stock_qty"
          header="Stock Qty"
          sortable
          body={stock_qtyTemplate}
          footer={totalStockQty}
        />
        <Column
          field="purchase_rate"
          header="Purchase Rate"
          body={purchaseRateTemplate}
          sortable
          footer={formatCurrency(totalPurchaseValue)}
        />
        <Column
          field="sales_rate"
          header="Sales Rate"
          body={salesRateTemplate}
          sortable
          footer={formatCurrency(totalSalesValue)}
        />
        <Column
          header="Margin Value"
          body={(rowData) => formatCurrency((rowData.margin_rate ?? 0) * (rowData.stock_qty ?? 0))}
          footer={formatCurrency(totalMarginValue)}
        />
        <Column field="discount_percent" header="Discount %" />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>

      <Sidebar
        visible={visibleDetail}
        position="right"
        onHide={() => setVisibleDetail(false)}
      >
        <h3>{selectedItemDetail?.item_name || 'N/A'}</h3>
        <dl>
          <dt>Description:</dt>
          <dd className="mb-3">{selectedItemDetail?.item_description || 'N/A'}</dd>
          <dt>Category:</dt>
          <dd className="mb-3">{selectedItemDetail?.category_name || 'N/A'}</dd>
          <dt>Small Unit:</dt>
          <dd className="mb-3">{selectedItemDetail?.small_unit_name || 'N/A'}</dd>
          <dt>Unit Diff Qty:</dt>
          <dd className="mb-3">{selectedItemDetail?.unit_difference_qty || 'N/A'}</dd>
          <dt>Big Unit:</dt>
          <dd className="mb-3">{selectedItemDetail?.big_unit_name || 'N/A'}</dd>
          <dt>Order Qty:</dt>
          <dd className="mb-3">{selectedItemDetail?.order_qty || 0} {selectedItemDetail?.small_unit_name || ''}</dd>
          <dt>Order Value:</dt>
          <dd className="mb-3">{formatCurrency(orderValue)}</dd>
          <dt>Stock Qty:</dt>
          <dd className="mb-3">{selectedItemDetail?.stock_qty || 0} {selectedItemDetail?.small_unit_name || ''}</dd>
          <dt>Stock Value:</dt>
          <dd className="mb-3">{formatCurrency(stockValue)}</dd>
          <dt>Margin:</dt>
          <dd className="mb-3">{approxMarginTemplate(selectedItemDetail)}</dd>
          <dt>Margin Value:</dt>
          <dd className="mb-3">{formatCurrency(marginValue)}</dd>
        </dl>
      </Sidebar>
    </div>
  );
};

export default ItemsListComponent;
