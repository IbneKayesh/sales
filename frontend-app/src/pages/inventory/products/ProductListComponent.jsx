import React, { useState, useRef, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { SplitButton } from "primereact/splitbutton";
import { Sidebar } from "primereact/sidebar";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import { Dialog } from "primereact/dialog";

const ProductListComponent = ({
  dataList,
  onEdit,
  onDelete,
  onLedger,
  itemLedger,
}) => {
  const [visibleDetail, setVisibleDetail] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState({});
  const [visibleLedger, setVisibleLedger] = useState(false);

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete "${rowData.item_name}"?`,
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

  const handleVisibleDetail = (rowData) => {
    setVisibleDetail(true);
    setSelectedItemDetail(rowData);
  };

  const handleVisibleLedger = (rowData) => {
    setVisibleLedger(true);
    setSelectedItemDetail(rowData);
    onLedger(rowData);
  };

  const actionTemplate = (rowData) => {
    let menuItems = [
      {
        label: "Ledger",
        icon: "pi pi-book",
        command: () => {
          handleVisibleLedger(rowData);
        },
      },
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

  const product_codeTemplate = (rowData) => {
    return `${rowData.product_code} - ${rowData.product_name}`;
  };

  const stock_qtyTemplate = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.stock_qty} rowData={rowData} />;
  };

  const purchase_booking_qtyTemplate = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.purchase_booking_qty}
        rowData={rowData}
      />
    );
  };

  const purchasePriceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.purchase_price);
  };

  const salePriceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.sales_price);
  };

  const marginPriceTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.margin_price);
  };

  const approxMarginTemplate = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.margin_price || 0);
  };

  const formatCurrency = (value) => {
    if (value == null || isNaN(value)) return "N/A";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(value);
  };

  const stockValue =
    (selectedItemDetail?.purchase_price ?? 0) *
    (selectedItemDetail?.stock_qty ?? 0);
  const marginValue =
    (selectedItemDetail?.margin_price ?? 0) *
    (selectedItemDetail?.stock_qty ?? 0);

  // Summary calculations for footer
  const totalItems = dataList.length;
  const totalStockQty = dataList.reduce(
    (sum, item) => sum + (item.stock_qty ?? 0),
    0
  );
  const totalPurchaseBookingQty = dataList.reduce(
    (sum, item) => sum + (item.purchase_booking_qty ?? 0),
    0
  );
  const totalPurchaseValue = dataList.reduce(
    (sum, item) => sum + (item.purchase_price ?? 0) * (item.stock_qty ?? 0),
    0
  );
  const totalSalesValue = dataList.reduce(
    (sum, item) => sum + (item.sales_price ?? 0) * (item.stock_qty ?? 0),
    0
  );
  const totalMarginValue = dataList.reduce(
    (sum, item) => sum + (item.margin_price ?? 0) * (item.stock_qty ?? 0),
    0
  );

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
          field="product_code"
          header="Product Code"
          body={product_codeTemplate}
          footer={`Total Items: ${totalItems}`}
          sortable
        />
        <Column
          field="stock_qty"
          header="Stock Qty"
          sortable
          body={stock_qtyTemplate}
          footer={totalStockQty}
        />
        <Column
          field="purchase_booking_qty"
          header="Purchase Booking Qty"
          sortable
          body={purchase_booking_qtyTemplate}
          footer={totalPurchaseBookingQty}
        />
        <Column
          field="purchase_price"
          header="Purchase Price"
          body={purchasePriceTemplate}
          sortable
          footer={formatCurrency(totalPurchaseValue)}
        />
        <Column
          field="sales_price"
          header="Sales Price"
          body={salePriceTemplate}
          sortable
          footer={formatCurrency(totalSalesValue)}
        />
        <Column
          header="Margin Price"
          body={marginPriceTemplate}
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
        <h3>
          {selectedItemDetail?.product_code || "N/A"} -{" "}
          {selectedItemDetail?.product_name || "N/A"}
        </h3>
        <dl>
          <dt>Description:</dt>
          <dd className="mb-3">{selectedItemDetail?.product_desc || "N/A"}</dd>
          <dt>Category:</dt>
          <dd className="mb-3">{selectedItemDetail?.category_name || "N/A"}</dd>
          <dt>Small Unit:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.small_unit_name || "N/A"}
          </dd>
          <dt>Unit Diff Qty:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.unit_difference_qty || "N/A"}
          </dd>
          <dt>Big Unit:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.large_unit_name || "N/A"}
          </dd>
          <dt>Stock Qty:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.stock_qty || 0}{" "}
            {selectedItemDetail?.small_unit_name || ""}
          </dd>
          <dt>Stock Value:</dt>
          <dd className="mb-3">{formatCurrency(stockValue)}</dd>
          <dt>Cost Price %:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.cost_price_percent || 0}
          </dd>
          <dt>Margin:</dt>
          <dd className="mb-3">{approxMarginTemplate(selectedItemDetail)}</dd>
          <dt>Margin Value:</dt>
          <dd className="mb-3">{formatCurrency(marginValue)}</dd>
        </dl>
      </Sidebar>

      <Dialog
        header={
          <>
            <span className="text-red-500">Purchase to Sales Ledger </span>
            <br />
            {selectedItemDetail?.product_code || "N/A"} -{" "}
            {selectedItemDetail?.product_name || "N/A"}
            <br />
            Current Stock:{" "}
            <ConvertedQtyComponent
              qty={selectedItemDetail.stock_qty}
              rowData={selectedItemDetail}
            />
            <span className="text-red-500"> or </span>
            {selectedItemDetail.stock_qty} {selectedItemDetail.small_unit_name}
          </>
        }
        visible={visibleLedger}
        style={{ width: "50vw" }}
        onHide={() => {
          if (!visibleLedger) return;
          setVisibleLedger(false);
        }}
      >
        <div className="m-0">
          {/* {JSON.stringify(itemLedger)} */}
          <DataTable
            value={itemLedger}
            keyField="product_id"
            emptyMessage="No data found."
            size="small"
          >
            <Column field="purchase_no" header="Purchase No" />
            <Column field="purchase_qty" header="Purchase Qty" />
            <Column field="purchase_return_qty" header="Purchase Return Qty" />
            <Column field="total_sales_qty" header="Total Sales Qty" />
            <Column field="stock_qty" header="Stock Qty" />
            <Column field="sales_no" header="Sales No" />
            <Column field="sales_order_qty" header="Sales Order Qty" />
            <Column field="sales_return_qty" header="Sales Return Qty" />
            <Column field="sales_qty" header="Sales Qty" />
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductListComponent;
