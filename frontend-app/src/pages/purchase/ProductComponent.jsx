import { useState, useEffect } from "react";
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

const ProductComponent = ({
  formData,
  formDataOrderItems,
  setFormDataOrderItems,
  editingRows,
  setEditingRows,
}) => {
  const { productList, setSelectedFilter } = useProducts();
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemQty, setItemQty] = useState(1);
  const [itemNote, setItemNote] = useState("");
  const [disabledItemAdd, setDisabledItemAdd] = useState(true);

  useEffect(() => {
    setSelectedFilter("allproducts");
  }, []);

  useEffect(() => {
    if (selectedItem) {
      setDisabledItemAdd(false);
    } else {
      setDisabledItemAdd(true);
    }
  }, [selectedItem]);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formData || formDataOrderItems.length === 0) return;

    const extraCost = (formData.cost_amount || 0) + (formData.other_cost || 0);

    // Calculate grand total of all items (before extra cost distribution)
    const grandTotal = formDataOrderItems.reduce(
      (sum, item) => sum + (item.total_amount || 0),
      0
    );

    if (grandTotal === 0) return;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataOrderItems.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = item.total_amount / item.product_qty;

      // Calculate this item's share of extra cost (proportional to its total_amount)
      const extraCostShare = (item.total_amount / grandTotal) * extraCost;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + (extraCostShare / item.product_qty);

      return {
        ...item,
        cost_price: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some((item, index) =>
      item.cost_price !== formDataOrderItems[index].cost_price
    );

    if (hasChanged) {
      setFormDataOrderItems(updatedItems);
    }
  }, [formData?.cost_amount, formData?.other_cost, formDataOrderItems.length]);

  const handleAddItem = () => {
    if (!selectedItem) return;

    // Check if item is already added
    const existingItem = formDataOrderItems.find(
      (i) => i.product_id === selectedItem
    );
    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = productList.find((i) => i.product_id === selectedItem);
    if (!item) return;

    const itemAmount = (itemQty || 1) * item.purchase_price;
    const discountAmount = (item.discount_percent / 100) * itemAmount;
    const vatAmount = (item.vat_percent / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / (itemQty || 1);

    const newRow = {
      po_details_id: generateGuid(), // Temporary ID for new items
      po_master_id: "sgd",
      product_id: selectedItem,
      product_name: `${item.product_code} - ${item.product_name}`,
      product_price: item.purchase_price,
      product_qty: itemQty || 1,
      discount_percent: item.discount_percent,
      discount_amount: discountAmount,
      vat_percent: item.vat_percent,
      vat_amount: vatAmount,
      cost_price: costPrice,
      total_amount: totalAmount, // Will be re-calculated on edit save,
      product_note: itemNote,
      ref_id: "", //default empty
      unit_difference_qty: item.unit_difference_qty,
      small_unit_name: item.small_unit_name,
      large_unit_name: item.large_unit_name,
      ismodified: 1, // Flag for new items
    };

    setFormDataOrderItems([...formDataOrderItems, newRow]);
    setSelectedItem(null);
    setItemQty(1);
  };

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount

    const itemAmount = newData.product_qty * newData.product_price;
    const discountAmount = (newData.discount_percent / 100) * itemAmount;
    const vatAmount = (newData.vat_percent / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.product_qty;

    newData.discount_amount = discountAmount;
    newData.vat_amount = vatAmount;
    newData.total_amount = totalAmount;
    newData.cost_price = costPrice;

    newData.ismodified = 1;

    let _localItems = [...formDataOrderItems];
    _localItems[index] = newData;
    setFormDataOrderItems(_localItems);
    setEditingRows([]);
  };

  const onRowEditCancel = (event) => {
    setEditingRows([]);
  };

  const onRowEditInit = (event) => {
    setEditingRows([event.data.id]);
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

  const product_name_BT = (rowData) => {
    return `${rowData.product_name}`;
  };

  const product_name_FT = () => {
    return `${formDataOrderItems.length} Items, ${editingRows.length} Editing`;
  };

  const productPrice_BT = (rowData) => {
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
    return formDataOrderItems.reduce(
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
    return formDataOrderItems.reduce(
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
    return formDataOrderItems.reduce(
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
    const totalAmount = formDataOrderItems.reduce(
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
        setFormDataOrderItems((prev) =>
          prev.filter((item) => item.po_details_id !== rowData.po_details_id)
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

  return (
    <>
      {/* {JSON.stringify(productList)} */}

      <ConfirmDialog />
      {/* Child Editable Table */}
      <div className="flex align-items-center gap-2 mb-2">
        <Dropdown
          value={selectedItem}
          options={productList.map((item) => ({
            label: `${item.product_code} - ${item.product_name}, Price: ${item.purchase_price}, Discount%: ${item.discount_percent}, vat%: ${item.vat_percent}, Stock: ${item.stock_qty} ${item.small_unit_name}`,
            value: item.product_id,
          }))}
          onChange={(e) => setSelectedItem(e.value)}
          placeholder="Select Item"
          optionLabel="label"
          optionValue="value"
          className="w-full"
          filter
          showClear
        />
        <InputNumber
          name="itemQty"
          value={itemQty}
          onValueChange={(e) => setItemQty(e.value)}
          placeholder="Enter Qty"
        />
        <InputText
          name="itemNote"
          value={itemNote}
          onChange={(e) => setItemNote(e.target.value)}
          placeholder="Note"
        />
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={handleAddItem}
          size="small"
          severity="info"
          className="pr-5"
          disabled={disabledItemAdd}
        />
      </div>
      <DataTable
        value={formDataOrderItems}
        editMode="row"
        dataKey="po_details_id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items found."
        className="bg-dark-300"
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
          body={productPrice_BT}
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
          headerStyle={{ width: "5%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column
          header="Actions"
          body={actionTemplate}
          style={{ width: "120px" }}
        />
      </DataTable>
    </>
  );
};
export default ProductComponent;
