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

  const action_BT = (rowData) => {
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

  const product_code_BT = (rowData) => {
    return `${rowData.product_code} - ${rowData.product_name}`;
  };

  const stock_qtyTemplate = (rowData) => {
    return <ConvertedQtyComponent qty={rowData.stock_qty} rowData={rowData} />;
  };

  const purchase_booking_qty_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.purchase_booking_qty}
        rowData={rowData}
      />
    );
  };

  const sales_booking_qty_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.sales_booking_qty}
        rowData={rowData}
      />
    );
  };

  const purchase_price_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.purchase_price);
  };

  const sales_price_BT = (rowData) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.sales_price);
  };

  const cost_price_percent_BT = (rowData) => {
    const marginPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.margin_price);

    return `${marginPrice} (${rowData.cost_price_percent}%)`;
  };
  const margin_price_BT = (rowData) => {};

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
  const totalSalesBookingQty = dataList.reduce(
    (sum, item) => sum + (item.sales_booking_qty ?? 0),
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
          body={product_code_BT}
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
          body={purchase_booking_qty_BT}
          footer={totalPurchaseBookingQty}
        />
        <Column
          field="sales_booking_qty"
          header="Sales Booking Qty"
          sortable
          body={sales_booking_qty_BT}
          footer={totalSalesBookingQty}
        />
        <Column
          field="purchase_price"
          header="Purchase Price"
          body={purchase_price_BT}
          sortable
          footer={formatCurrency(totalPurchaseValue)}
        />
        <Column
          field="sales_price"
          header="Sales Price"
          body={sales_price_BT}
          sortable
          footer={formatCurrency(totalSalesValue)}
        />
        <Column field="discount_percent" header="Discount %" />
        <Column field="vat_percent" header="VAT %" />
        <Column
          field="cost_price_percent"
          header="Cost %"
          body={cost_price_percent_BT}
        />
        <Column
          field="margin_price"
          header="Margin Price"
          body={margin_price_BT}
          footer={formatCurrency(totalMarginValue)}
        />
        <Column header="#" body={action_BT} style={{ width: "120px" }} />
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
          <dt>Purchase Booking Qty:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.purchase_booking_qty || 0}{" "}
            {selectedItemDetail?.small_unit_name || ""}
          </dd>
          <dt>Sales Booking Qty:</dt>
          <dd className="mb-3">
            {selectedItemDetail?.sales_booking_qty || 0}{" "}
            {selectedItemDetail?.small_unit_name || ""}
          </dd>
          <dt>Cost %:</dt>
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
            <span className="text-blue-500">Purchase to Sales Ledger of </span>
            {selectedItemDetail?.product_code || "N/A"} -{" "}
            {selectedItemDetail?.product_name || "N/A"}
            <br />
            Current Stock:{" "}
            <ConvertedQtyComponent
              qty={selectedItemDetail.stock_qty}
              rowData={selectedItemDetail}
            />
            <span className="text-blue-500"> or </span>
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
            showGridlines
            rowGroupMode="rowspan"
            groupRowsBy="booking_no"
            sortField="booking_no"
            sortOrder={1}
          >
            <Column field="booking_no" header="Booking" />
            <Column field="cancelled_qty" header="Cancelled Qty" />
            <Column field="invoice_qty" header="Invoice Qty" />
            <Column field="pending_qty" header="Pending Qty" />
            <Column field="order_no" header="Invoice/Order" />
            <Column field="product_qty" header="Invoice/Order Qty" />
            <Column field="returned_qty" header="Returned Qty" />
            <Column field="stock_qty" header="Stock Qty" />
          </DataTable>
        </div>
      </Dialog>
    </div>
  );
};

export default ProductListComponent;
