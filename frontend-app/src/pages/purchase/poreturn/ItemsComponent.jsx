import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useProducts } from "@/hooks/inventory/useProducts";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";

const ItemsComponent = ({ pageConfig, formData, formDataList, setFormDataList }) => {
  const [editingRows, setEditingRows] = useState([]);



  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataList || formDataList.length === 0) return;

    const extraCost = (formData.include_cost || 0) + (formData.exclude_cost || 0);

    // Calculate grand total of all items (before extra cost distribution)
    const grandTotal = formDataList.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );

    if (grandTotal === 0) return;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = item.total_amount / item.product_qty;

      // Calculate this item's share of extra cost (proportional to its total_amount)
      const extraCostShare = (item.total_amount / grandTotal) * extraCost;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostShare / item.product_qty;

      return {
        ...item,
        cost_price: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) => item.cost_price !== formDataList[index].cost_price
    );

    if (hasChanged) {
      setFormDataList(updatedItems);
    }
  }, [formData?.include_cost, formData?.exclude_cost, formDataList.length]);

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount
    if (newData.product_qty > newData.stock_qty) {
      setEditingRows([]);
      return;
    }

    const itemAmount = newData.product_qty * newData.product_price;
    const discountAmount = (newData.discount_percent / 100) * itemAmount;
    const vatAmount = (newData.vat_percent / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.product_qty;

    newData.discount_amount = discountAmount;
    newData.vat_amount = vatAmount;
    newData.total_amount = totalAmount;
    newData.cost_price = costPrice;

    let _localItems = [...formDataList];
    _localItems[index] = newData;
    setFormDataList(_localItems);
    setEditingRows([]);
  };

  const onRowEditCancel = (event) => {
    setEditingRows([]);
  };

  const onRowEditInit = (event) => {
    setEditingRows([event.data.id]);
  };

  const product_name_BT = (rowData) => {
    return `${rowData.product_name}`;
  };

  const product_name_FT = () => {
    return `${formDataList.length} Items, ${editingRows.length} Editing`;
  };

  const product_price_BT = (rowData) => {
    const formattedPrice = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.product_price);
    // cost_price is now calculated reactively in useEffect
    // It includes: base price - discount + vat + distributed extra costs
    const formattedCostPrice = Number(rowData.cost_price).toFixed(2);
    return `${formattedPrice} (${formattedCostPrice})`;
  };

  const product_qty_BT = (rowData) => {
    return `${rowData.product_qty} ${rowData.small_unit_name}`;
  };

  const product_qty_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + (item.product_qty || 0),
      0
    );
  };

  
  const discount_percent_BT = (rowData) => {
    const discountAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.discount_amount);

    return `${discountAmount} (${rowData.discount_percent}%)`;
  };

  const discount_percent_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + (item.discount_amount || 0),
      0
    );
  };

  const vat_percent_BT = (rowData) => {
    const vatAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.vat_amount);

    return `${vatAmount} (${rowData.vat_percent}%)`;
  };

  const vat_percent_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + (item.vat_amount || 0),
      0
    );
  };

  const total_amount_BT = (rowData) => {
    const totalAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(rowData.total_amount);

    return `${totalAmount}`;
  };

  const total_amount_FT = () => {
    const totalAmount = formDataList.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );
    return <ConvertedBDTCurrency value={totalAmount} asWords={true} />;
  };

  const Bulk_BT = (rowData) => {
    return (
      <ConvertedQtyComponent qty={rowData.product_qty} rowData={rowData} />
    );
  };

  
  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.product_name}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataList((prev) =>
          prev.filter((item) => item.order_id !== rowData.order_id)
        );
      },
      reject: () => { },
    });
  };

  const actionTemplate = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };


  const priceEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="BDT"
        locale="en-US"
        style={{ width: "120px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };
  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };
  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
      />
    );
  };

  return (
    <div>
      <ConfirmDialog />
      {/* {JSON.stringify(productList?.[0])} */}

      <DataTable
        value={formDataList}
        editMode="row"
        dataKey="order_id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items found."
        size="small"
      >
        <Column
          field="product_name"
          header="Product"
          body={product_name_BT}
          footer={product_name_FT}
        />
        <Column
          field="product_price"
          header="Price"
          body={product_price_BT}
          editor={priceEditor}
        />
        <Column
          field="product_qty"
          header="Qty"
          body={product_qty_BT}
          editor={numberEditor}
          footer={product_qty_FT}
        />
        <Column
          field="discount_percent"
          header="Discount%"
          body={discount_percent_BT}
          editor={numberEditor}
          footer={discount_percent_FT}
        />
        <Column
          field="vat_percent"
          header="Vat%"
          body={vat_percent_BT}
          editor={numberEditor}
          footer={vat_percent_FT}
        />
        <Column
          field="total_amount"
          header="Total"
          body={total_amount_BT}
          footer={total_amount_FT}
        />
        <Column header="Bulk" body={Bulk_BT} />
        <Column field="product_note" header="Note" editor={textEditor} />
        <Column
          rowEditor
          headerStyle={{ width: "1%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column header="#" body={actionTemplate} style={{ width: "100px" }} />
      </DataTable>
    </div>
  );
};

export default ItemsComponent;
