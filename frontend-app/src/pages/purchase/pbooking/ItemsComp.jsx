import { useEffect, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { InputText } from "primereact/inputtext";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { useProductsSgd } from "@/hooks/inventory/useProductsSgd";
import { generateGuid } from "@/utils/guid";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ActiveRowCell from "@/components/ActiveRowCell";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";


const ItemsComp = () => {
  const [formDataList, setFormDataList] = useState([]);

  const { dataList: productList, handleLoadBookingItems } = useProductsSgd();
  useEffect(() => {
    handleLoadBookingItems();
  }, []);

  const [availableItemList, setAvailableItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedItemAddBtn, setSelectedItemAddBtn] = useState(true);
  const [editingRows, setEditingRows] = useState([]);

  useEffect(() => {
    if (selectedItem) {
      setSelectedItemAddBtn(false);
    } else {
      setSelectedItemAddBtn(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    const filteredList = productList.map((item) => {
      const updatedItem = { ...item };

      //   updatedItem.discount_percent = pageConfig.include_discount
      //   ? item.discount_percent
      //   : 0;

      // updatedItem.vat_percent = pageConfig.include_vat ? item.vat_percent : 0;

      return updatedItem;
    });

    const filtered = filteredList.filter(
      (item) =>
        !formDataList.some((orderItem) => orderItem.bking_bitem === item.id)
    );

    //const filtered = filteredList;
    setAvailableItemList(filtered);
  }, [productList, formDataList]);

  const itemList_IT = (option) => {
    return (
      <div className="grid">
        <div className="col-12 font-semibold p-1">
          {option.items_iname} ({option.items_icode})
        </div>
        <div className="grid col-12 text-gray-700 p-2">
          <div className="col-4 p-0">
            💵 Price: {Number(option.bitem_lprat).toFixed(2)}
          </div>
          <div className="col-4 p-0">
            📊 Discount: {Number(option.bitem_sddsp).toFixed(2)}%
          </div>
          <div className="col-4 p-0">
            📈 VAT: {Number(option.items_sdvat).toFixed(2)}%
          </div>
        </div>
        <div className="col-12 p-0">
          📦 Stock: {Number(option.bitem_gstkq).toFixed(2)} {option.puofm_untnm}
        </div>
      </div>
    );
  };

  const itemList_VT = (option) => {
    if (!option) {
      return "Select Item";
    }

    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.items_iname}, 📦{Number(option.bitem_gstkq).toFixed(2)}{" "}
          {option.puofm_untnm}
        </span>
      </div>
    );
  };

  const handleAddToList = () => {
    if (!selectedItem) return;

    if (!selectedQty || Number(selectedQty) < 1) return;

    // Check if item is already added
    const existingItem = formDataList.find(
      (i) => i.bking_bitem === selectedItem
    );
    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = productList.find((i) => i.id === selectedItem);
    if (!item) return;

    const itemAmount = (selectedQty || 1) * item.bitem_lprat;
    const discountAmount = (item.bitem_sddsp / 100) * itemAmount;
    const vatAmount = (item.items_sdvat / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / (selectedQty || 1);

    const newItemRow = {
      id: generateGuid(), // Temporary ID for new items
      bking_pmstr: "",
      bking_bitem: selectedItem,
      bking_bkrat: item.bitem_lprat,
      bking_bkqty: selectedQty || 1,
      bking_itamt: itemAmount,
      bking_dspct: item.bitem_sddsp,
      bking_dsamt: discountAmount,
      bking_vtpct: item.items_sdvat,
      bking_vtamt: vatAmount,
      bking_csrat: costPrice,
      bking_ntamt: totalAmount,
      bking_notes: selectedNote,
      bking_cnqty: 0,
      bking_ivqty: 0,
      bking_pnqty: selectedQty || 1,

      items_iname: `${item.items_icode} - ${item.items_iname}`,
      items_dfqty: item.items_dfqty,
      puofm_untnm: item.puofm_untnm,
      suofm_untnm: item.suofm_untnm,
    };
    setFormDataList([...formDataList, newItemRow]);

    setSelectedItem(null);
    setSelectedQty(1);
  };

  const items_iname_BT = (rowData) => {
    return `${rowData.items_iname}`;
  };

  const items_iname_FT = () => {
    return `${formDataList.length} Items, ${editingRows.length} Editing`;
  };

  const bking_bkrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.bking_bkrat).toFixed(2);
    const formattedCostPrice = Number(rowData.bking_csrat).toFixed(2);
    return `${formattedPrice} (${formattedCostPrice})`;
  };

  const bking_bkqty_BT = (rowData) => {
    return `${rowData.bking_bkqty} ${rowData.puofm_untnm}`;
  };

  const bking_bkqty_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + Number(item.bking_bkqty || 0),
      0
    );
  };

  const bking_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.bking_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.bking_dspct).toFixed(2);
    return `${formattedDiscount} (${formattedDiscountPercent}%)`;
  };

  const bking_dspct_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + Number(item.bking_dsamt || 0),
      0
    );
  };

  const bking_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.bking_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.bking_vtpct).toFixed(2);
    return `${formattedVat} (${formattedVatPercent}%)`;
  };

  const bking_vtpct_FT = () => {
    return formDataList.reduce(
      (sum, item) => sum + Number(item.bking_vtamt || 0),
      0
    );
  };

  const bking_ntamt_BT = (rowData) => {
    const formattedAmount = Number(rowData.bking_itamt).toFixed(2);
    const formattedNetAmount = Number(rowData.bking_ntamt).toFixed(2);

    return (
      <>
        {formattedNetAmount}
        (<ActiveRowCell text={formattedAmount} status={0} />)
      </>
    );
  };

  const netAmount = formDataList.reduce(
    (sum, item) => sum + Number(item.bking_ntamt || 0),
    0
  );
  const bking_ntamt_FT = () => {
    const amount = formDataList.reduce(
      (sum, item) => sum + Number(item.bking_itamt || 0),
      0
    );
    return `${netAmount} (${amount})`;
  };

  const bulk_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.bking_bkqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const bking_cnqty_BT = (rowData) => {
    return (
      <div className="flex gap-2">
        <span className="text-sm">Cancelled: {rowData.bking_cnqty}</span>
        <span className="text-sm">Invocie: {rowData.bking_ivqty}</span>
        <span className="text-sm">Pending: {rowData.bking_pnqty}</span>
      </div>
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.items_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataList((prev) =>
          prev.filter((item) => item.id !== rowData.id)
        );
      },
      reject: () => {},
    });
  };

  const action_BT = (rowData) => {
    return (
      <span
        className="pi pi-trash text-red-600 text-bold px-2 hover:text-red-500 cursor-pointer"
        onClick={() => handleDelete(rowData)}
      ></span>
    );
  };

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ width: "110px" }}
        inputStyle={{ width: "100%" }}
        min={1}
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

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount

    const itemAmount = newData.bking_bkqty * newData.bking_bkrat;
    const discountAmount = (newData.bking_dspct / 100) * itemAmount;
    const vatAmount = (newData.bking_vtpct / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.bking_bkqty;

    newData.bking_dsamt = discountAmount;
    newData.bking_vtamt = vatAmount;
    newData.bking_itamt = totalAmount;
    newData.bking_csrat = costPrice;

    newData.bking_cnqty = 0;
    newData.bking_ivqty = 0;
    newData.bking_pnqty = newData.bking_bkqty;

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

  const dataTable_FT = () => {
    return <ConvertedBDTCurrency value={netAmount} asWords={true} />
  };

  return (
    <div>
      <ConfirmDialog />
      {/* {JSON.stringify(productList)} */}
      <div className="flex align-items-center gap-2 mb-2 bg-gray-300 p-1 border-round">
        <Dropdown
          value={selectedItem}
          options={availableItemList}
          optionLabel="items_iname"
          optionValue="id"
          onChange={(e) => setSelectedItem(e.value)}
          placeholder="Select Item"
          className="w-full"
          filter
          showClear
          itemTemplate={itemList_IT}
          valueTemplate={itemList_VT}
        />
        <InputNumber
          value={selectedQty}
          onValueChange={(e) => setSelectedQty(e.value)}
          placeholder="Enter Qty"
          min={1}
        />
        <InputText
          value={selectedNote}
          onChange={(e) => setSelectedNote(e.target.value)}
          placeholder="Note"
        />
        <Button
          label="Add"
          icon="pi pi-plus"
          onClick={handleAddToList}
          size="small"
          severity="info"
          className="pr-5"
          disabled={selectedItemAddBtn}
        />
      </div>
      <DataTable
        value={formDataList}
        editMode="row"
        dataKey="id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items found."
        size="small"
        showGridlines
        footer={dataTable_FT}
      >
        <Column
          field="items_iname"
          header="Product"
          body={items_iname_BT}
          footer={items_iname_FT}
        />
        <Column field="bking_bkrat" header="Price" body={bking_bkrat_BT} />
        <Column
          field="bking_bkqty"
          header="Qty"
          body={bking_bkqty_BT}
          footer={bking_bkqty_FT}
          editor={numberEditor}
        />
        <Column
          field="bking_dspct"
          header="Discount"
          body={bking_dspct_BT}
          footer={bking_dspct_FT}
        />
        <Column
          field="bking_vtpct"
          header="VAT"
          body={bking_vtpct_BT}
          footer={bking_vtpct_FT}
        />
        <Column
          field="bking_ntamt"
          header="Amount"
          body={bking_ntamt_BT}
          footer={bking_ntamt_FT}
        />
        <Column field="bking_notes" header="Note" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column field="bking_cnqty" header="Other Qty" body={bking_cnqty_BT} />
        <Column
          rowEditor
          headerStyle={{ width: "1%", minWidth: "8rem" }}
          bodyStyle={{ textAlign: "center" }}
        />
        <Column header={formDataList?.length + " rows"} body={action_BT} />
      </DataTable>

      
    </div>
  );
};

export default ItemsComp;
