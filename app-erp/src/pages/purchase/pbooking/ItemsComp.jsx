import { useEffect, useState, useRef } from "react";
import { Menu } from "primereact/menu";
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
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";
import ZeroRowCell from "@/components/ZeroRowCell";
import AttributesComp from "./AttributesComp";
import { parseAttributes } from "@/utils/jsonParser";

const ItemsComp = ({
  configs,
  formData,
  formDataItemList,
  setFormDataItemList,
}) => {
  const { dataList: productList, handleLoadBookingItems } = useProductsSgd();
  const [showAttributes, setShowAttributes] = useState(false);
  const [selectedItemAttributes, setSelectedItemAttributes] = useState(null);

  useEffect(() => {
    handleLoadBookingItems();
  }, []);

  useEffect(() => {
    setFormDataItemList((prev) =>
      prev.map((item) => {
        if (item.id === selectedItemAttributes.id) {
          return { ...item, cbkng_attrb: selectedItemAttributes.cbkng_attrb };
        }
        return item;
      }),
    );
  }, [selectedItemAttributes]);

  const [availableItemList, setAvailableItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedItemAddBtn, setSelectedItemAddBtn] = useState(true);
  const [editingRows, setEditingRows] = useState([]);
  const [showExtraColumns, setShowExtraColumns] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const menu = useRef(null);

  const actionMenuItems = [
    {
      label: "Attributes",
      icon: "pi pi-plus-circle text-green-600",
      command: () => activeRow && handleAddAttributes(activeRow),
    },
    {
      label: "Copy Row",
      icon: "pi pi-copy text-blue-600",
      command: () => activeRow && handleCopyRowConfirm(activeRow),
    },
    {
      label: "Delete",
      icon: "pi pi-trash text-red-600",
      command: () => activeRow && handleDelete(activeRow),
    },
  ];

  useEffect(() => {
    if (selectedItem) {
      setSelectedItemAddBtn(false);
    } else {
      setSelectedItemAddBtn(true);
    }
  }, [selectedItem]);

  useEffect(() => {
    const filteredList = productList.map((item) => ({
      ...item,
      bitem_sddsp: configs.cbkng_dspct ? item.bitem_sddsp : 0,
      items_sdvat: configs.cbkng_vtpct ? item.items_sdvat : 0,
    }));

    const filtered = filteredList.filter(
      (item) =>
        !formDataItemList.some(
          (orderItem) => orderItem.cbkng_bitem === item.id,
        ),
    );

    //const filtered = filteredList;
    setAvailableItemList(filtered);
  }, [productList, formDataItemList]);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataItemList || formDataItemList.length === 0) return;

    const extraCost =
      Number(formData.mbkng_incst || 0) + Number(formData.mbkng_excst || 0);

    // Calculate grand total qty of all items (before extra cost distribution)
    const grandTotalQty = formDataItemList.reduce(
      (sum, item) => sum + Number(item.cbkng_itqty || 0),
      0,
    );

    if (grandTotalQty === 0) return;

    // Calculate average extra cost per qty
    const avgExtraCostPerQty = extraCost / grandTotalQty;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataItemList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = Number(item.cbkng_itrat || 0);

      // Calculate extra cost per unit based on qty-weighted average
      const extraCostPerUnit = avgExtraCostPerQty;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostPerUnit;

      return {
        ...item,
        cbkng_csrat: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) =>
        Number(item.cbkng_csrat) !==
        Number(formDataItemList[index].cbkng_csrat),
    );

    if (hasChanged) {
      setFormDataItemList(updatedItems);
    }
  }, [formData?.mbkng_incst, formData?.mbkng_excst, formDataItemList.length]);

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
          📦 Stock:{" "}
          {(Number(option.bitem_gstkq) + Number(option.bitem_istkq)).toFixed(2)}{" "}
          {option.puofm_untnm}
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
    const existingItem = formDataItemList.find(
      (i) => i.cbkng_bitem === selectedItem,
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
      cbkng_mbkng: "",
      cbkng_bitem: selectedItem,
      cbkng_items: item.bitem_items,
      cbkng_itrat: item.bitem_lprat,
      cbkng_itqty: selectedQty || 1,
      cbkng_itamt: itemAmount,
      cbkng_dspct: item.bitem_sddsp,
      cbkng_dsamt: discountAmount,
      cbkng_vtpct: item.items_sdvat,
      cbkng_vtamt: vatAmount,
      cbkng_csrat: costPrice,
      cbkng_ntamt: totalAmount,
      cbkng_notes: selectedNote,
      cbkng_attrb: {},
      cbkng_cnqty: 0,
      cbkng_rcqty: 0,
      cbkng_pnqty: selectedQty || 1,

      items_icode: item.items_icode,
      items_iname: item.items_iname,
      items_dfqty: item.items_dfqty,
      puofm_untnm: item.puofm_untnm,
      suofm_untnm: item.suofm_untnm,
      bitem_gstkq: item.bitem_gstkq,
    };
    setFormDataItemList([...formDataItemList, newItemRow]);

    setSelectedItem(null);
    setSelectedQty(1);
  };

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.cbkng_attrb);

    return (
      <div className="flex flex-column">
        {/* {JSON.stringify(rowData.cbkng_attrb)} */}
        <span className="text-md">{`${rowData.items_icode} - ${rowData.items_iname}`}</span>
        {Object.keys(parsedAttr).length > 0 && (
          <span className="text-gray-500 text-sm">
            {Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
          </span>
        )}
      </div>
    );
  };

  const items_iname_FT = () => {
    return (
      <>
        <span>{formDataItemList.length} Items </span>
        {editingRows.length > 0 && (
          <span className="text-red-400">{editingRows.length} Editing</span>
        )}
      </>
    );
  };

  const cbkng_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.cbkng_itrat).toFixed(2);
    const formattedCostPrice = Number(rowData.cbkng_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const cbkng_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.cbkng_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const cbkng_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cbkng_itqty || 0), 0)
      .toFixed(2);
  };

  const cbkng_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.cbkng_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.cbkng_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cbkng_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const cbkng_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cbkng_dsamt || 0), 0)
      .toFixed(2);
  };

  const cbkng_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.cbkng_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.cbkng_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cbkng_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const cbkng_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cbkng_vtamt || 0), 0)
      .toFixed(2);
  };

  const cbkng_ntamt_BT = (rowData) => {
    return Number(rowData.cbkng_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cbkng_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cbkng_ntamt || 0), 0)
    .toFixed(2);

  const cbkng_ntamt_FT = () => {
    return (
      <>
        {netAmount}
        {showExtraColumns ? (
          <span className="text-gray-500"> ({amount})</span>
        ) : null}
      </>
    );
  };

  const bulk_BT = (rowData) => {
    return (
      <ConvertedQtyComponent
        qty={rowData.cbkng_itqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const bitem_gstkq_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_gstkq} text={rowData.bitem_gstkq} />
    );
  };

  const cbkng_cnqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.cbkng_cnqty} text={rowData.cbkng_cnqty} />
    );
  };

  const cbkng_rcqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.cbkng_rcqty} text={rowData.cbkng_rcqty} />
    );
  };

  const cbkng_pnqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.cbkng_pnqty} text={rowData.cbkng_pnqty} />
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.items_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataItemList((prev) =>
          prev.filter((item) => item.id !== rowData.id),
        );
      },
      reject: () => {},
    });
  };

  const rowEditor_HT = () => (
    <span
      className={`pi ${
        showExtraColumns ? "pi-eye-slash text-red-300" : "pi-eye text-gray-300"
      }  px-2 hover:text-gray-500 cursor-pointer`}
      onClick={() => setShowExtraColumns((prev) => !prev)}
    />
  );

  const handleAddAttributes = (rowData) => {
    setShowAttributes(true);
    setSelectedItemAttributes(rowData);
    //console.log(rowData);
  };

  const handleCopyRowConfirm = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to copy item "${rowData.items_iname}"?`,
      header: "Copy",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        const newRowData = { ...rowData, id: generateGuid() };
        setFormDataItemList((prev) => [...prev, newRowData]);
      },
      reject: () => {},
    });
  };

  const action_BT = (rowData) => {
    return (
      <div className="flex justify-content-center">
        <span
          className="pi pi-ellipsis-v text-gray-600 hover:text-gray-900 cursor-pointer p-2"
          onClick={(e) => {
            setActiveRow(rowData);
            menu.current.toggle(e);
          }}
        ></span>
      </div>
    );
  };

  const numberEditor = (options) => {
    return (
      <InputNumber
        value={options.value}
        onValueChange={(e) => options.editorCallback(e.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
        min={0}
        minFractionDigits={2}
      />
    );
  };
  const textEditor = (options) => {
    return (
      <InputText
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
        style={{ minWidth: "40px", padding: "3px" }}
        inputStyle={{ width: "80%", padding: "3px" }}
      />
    );
  };

  const onRowEditSave = (event) => {
    let { newData, index } = event;
    // Calculate item_amount
    let dsp = Number(newData.cbkng_dspct || 0);
    if (dsp < 0) dsp = 0;
    if (dsp > 100) dsp = 100;
    let vtp = Number(newData.cbkng_vtpct || 0);
    if (vtp < 0) vtp = 0;
    if (vtp > 1000) vtp = 100;

    const itemAmount = newData.cbkng_itqty * newData.cbkng_itrat;
    const discountAmount = (dsp / 100) * itemAmount;
    const vatAmount = (vtp / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.cbkng_itqty;

    newData.cbkng_dspct = dsp;
    newData.cbkng_vtpct = vtp;

    newData.cbkng_itamt = itemAmount;
    newData.cbkng_dsamt = discountAmount;
    newData.cbkng_vtamt = vatAmount;
    newData.cbkng_csrat = costPrice;
    newData.cbkng_ntamt = totalAmount;

    newData.cbkng_cnqty = 0;
    newData.cbkng_rcqty = 0;
    newData.cbkng_pnqty = newData.cbkng_itqty;

    let _localItems = [...formDataItemList];
    _localItems[index] = newData;
    setFormDataItemList(_localItems);
    setEditingRows([]);
  };

  const onRowEditCancel = (event) => {
    setEditingRows([]);
  };
  const onRowEditInit = (event) => {
    setEditingRows([event.data.id]);
  };

  const dataTable_FT = () => {
    return <ConvertedBDTCurrency value={netAmount} asWords={true} />;
  };

  return (
    <div className="mt-4">
      <ConfirmDialog />
      <Menu model={actionMenuItems} popup ref={menu} id="popup_menu" />
      {!formData.edit_stop && (
        <div className="grid border-round-md shadow-1 p-2 mb-3 bg-gray-100">
          <div className="col-12 md:col-5">
            <label htmlFor="items_iname" className="block font-bold mb-2">
              Items
            </label>
            <Dropdown
              name="items_iname"
              value={selectedItem}
              options={availableItemList}
              optionLabel="items_iname"
              optionValue="id"
              onChange={(e) => setSelectedItem(e.value)}
              placeholder="Select item"
              className="w-full"
              filter
              showClear
              itemTemplate={itemList_IT}
              valueTemplate={itemList_VT}
            />
          </div>
          <div className="col-12 md:col-2">
            <label htmlFor="qty" className="block font-bold mb-2">
              Quantity
            </label>
            <InputNumber
              name="qty"
              value={selectedQty}
              onValueChange={(e) => setSelectedQty(e.value)}
              placeholder="Qty"
              min={1}
              className="w-full"
              inputClassName="w-10rem"
            />
          </div>
          <div className="col-12 md:col-5">
            <label htmlFor="notes" className="block font-bold mb-2">
              Note (Optional)
            </label>
            <div className="p-inputgroup flex-1">
              <InputText
                name="notes"
                value={selectedNote}
                onChange={(e) => setSelectedNote(e.target.value)}
                placeholder="Enter item note"
              />
              <Button
                label="Add Item"
                icon="pi pi-plus"
                tooltip="Add Item"
                tooltipOptions={{ position: "top" }}
                onClick={handleAddToList}
                disabled={selectedItemAddBtn}
                className="p-inputgroup-addon"
              />
            </div>
          </div>
        </div>
      )}
      <DataTable
        value={formDataItemList}
        editMode={formData.edit_stop ? null : "row"}
        dataKey="id"
        editingRows={editingRows}
        onRowEditSave={onRowEditSave}
        onRowEditCancel={onRowEditCancel}
        onRowEditInit={onRowEditInit}
        emptyMessage="No items added yet."
        size="small"
        className="shadow-1"
        showGridlines
        footer={dataTable_FT}
      >
        <Column
          field="items_iname"
          header="Item"
          body={items_iname_BT}
          footer={items_iname_FT}
        />
        <Column
          field="cbkng_itrat"
          header="Price"
          body={cbkng_itrat_BT}
          editor={numberEditor}
        />
        <Column
          field="cbkng_itqty"
          header="Qty"
          body={cbkng_itqty_BT}
          footer={cbkng_itqty_FT}
          editor={numberEditor}
        />
        <Column
          field="cbkng_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="cbkng_dspct"
          header="Discount"
          body={cbkng_dspct_BT}
          footer={cbkng_dspct_FT}
          editor={numberEditor}
        />
        <Column
          field="cbkng_vtpct"
          header="VAT"
          body={cbkng_vtpct_BT}
          footer={cbkng_vtpct_FT}
          editor={numberEditor}
        />
        <Column
          field="cbkng_ntamt"
          header="Sub Total"
          body={cbkng_ntamt_BT}
          footer={cbkng_ntamt_FT}
        />
        <Column field="cbkng_notes" header="Remarks" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="bitem_gstkq"
          header="Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bitem_gstkq_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="cbkng_cnqty"
          header="Cancelled"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={cbkng_cnqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="cbkng_rcqty"
          header="Receipt"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={cbkng_rcqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="cbkng_pnqty"
          header="Available"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={cbkng_pnqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          header={rowEditor_HT()}
          rowEditor
          headerStyle={{ minWidth: "20px" }}
        />
        {!formData.edit_stop && (
          <Column header="#" body={action_BT} style={{ width: "20px" }} />
        )}
      </DataTable>

      {showAttributes && (
        <AttributesComp
          visible={showAttributes}
          setVisible={setShowAttributes}
          formData={selectedItemAttributes}
          setFormData={setSelectedItemAttributes}
        />
      )}
    </div>
  );
};

export default ItemsComp;
