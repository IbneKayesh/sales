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

const ItemsComp = ({ formData, formDataItemList, setFormDataItemList }) => {
  const { dataList: productList, handleLoadSalesItems } = useProductsSgd();
  const [showAttributes, setShowAttributes] = useState(false);
  const [selectedItemAttributes, setSelectedItemAttributes] = useState(null);

  useEffect(() => {
    handleLoadSalesItems();
  }, []);

  useEffect(() => {
    setFormDataItemList((prev) =>
      prev.map((item) => {
        if (item.bitem_refid === selectedItemAttributes.bitem_refid) {
          return { ...item, cinvc_attrb: selectedItemAttributes.cinvc_attrb };
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
        !formDataItemList.some(
          (orderItem) => orderItem.cinvc_bitem === item.id,
        ),
    );

    //const filtered = filteredList;
    setAvailableItemList(filtered);
  }, [productList, formDataItemList]);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataItemList || formDataItemList.length === 0) return;

    const extraCost =
      Number(formData.minvc_incst || 0) + Number(formData.minvc_excst || 0);

    // Calculate grand total qty of all items (before extra cost distribution)
    const grandTotalQty = formDataItemList.reduce(
      (sum, item) => sum + Number(item.cinvc_itqty || 0),
      0,
    );

    if (grandTotalQty === 0) return;

    // Calculate average extra cost per qty
    const avgExtraCostPerQty = extraCost / grandTotalQty;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataItemList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = Number(item.cinvc_itrat || 0);

      // Calculate extra cost per unit based on qty-weighted average
      const extraCostPerUnit = avgExtraCostPerQty;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostPerUnit;

      return {
        ...item,
        cinvc_csrat: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) =>
        Number(item.cinvc_csrat) !==
        Number(formDataItemList[index].cinvc_csrat),
    );

    if (hasChanged) {
      setFormDataItemList(updatedItems);
    }
  }, [formData?.minvc_incst, formData?.minvc_excst, formDataItemList.length]);

  const itemList_IT = (option) => {
    const parsedAttr = parseAttributes(option.bitem_attrb);
    return (
      <div className="grid">
        <div className="col-12 font-semibold p-1">
          {option.items_iname} ({option.items_icode})
        </div>
        <div className="col-12 p-0 text-blue-600 text-sm">
          {Object.keys(parsedAttr).length > 0 &&
            Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
        </div>
        <div className="grid col-12 text-gray-700 p-2">
          <div className="col-3 p-0">
            💰 DP: {Number(option.bitem_dprat).toFixed(2)}
          </div>
          <div className="col-3 p-0">
            💵 MRP: {Number(option.bitem_mcmrp).toFixed(2)}
          </div>
          <div className="col-3 p-0">
            📊 Discount: {Number(option.bitem_sddsp).toFixed(2)}%
          </div>
          <div className="col-3 p-0">
            📈 VAT: {Number(option.items_sdvat).toFixed(2)}%
          </div>
        </div>
        <div className="grid col-12 text-gray-700 p-2">
          <div className="col-4 p-0">
            📦 Stock: {Number(option.bitem_ohqty).toFixed(2)}{" "}
            {option.puofm_untnm}
          </div>
          <div className="col-4 p-0">🧾 No: {option.bitem_refno}</div>
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
      (i) => i.bitem_refid === selectedItem,
    );
    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = productList.find((i) => i.id === selectedItem);
    if (!item) return;

    const itemAmount = (selectedQty || 1) * item.bitem_mcmrp;
    const discountAmount = (item.bitem_sddsp / 100) * itemAmount;
    const vatAmount = (item.items_sdvat / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / (selectedQty || 1);

    const newItemRow = {
      id: generateGuid(), // Temporary ID for new items
      cinvc_minvc: "",
      cinvc_bitem: selectedItem,
      cinvc_items: item.bitem_items,
      cinvc_itrat: item.bitem_mcmrp,
      cinvc_itqty: selectedQty || 1,
      cinvc_itamt: itemAmount,
      cinvc_dspct: item.bitem_sddsp,
      cinvc_dsamt: discountAmount,
      cinvc_vtpct: item.items_sdvat,
      cinvc_vtamt: vatAmount,
      cinvc_csrat: costPrice,
      cinvc_ntamt: totalAmount,
      cinvc_lprat: item.bitem_csrat,
      cinvc_notes: selectedNote,
      cinvc_attrb: item.bitem_attrb,
      cinvc_srcnm: item.bitem_srcnm,
      cinvc_refid: item.bitem_refid,

      items_icode: item.items_icode,
      items_iname: item.items_iname,
      items_dfqty: item.items_dfqty,
      puofm_untnm: item.puofm_untnm,
      suofm_untnm: item.suofm_untnm,
      bitem_ohqty: item.bitem_ohqty,
    };
    setFormDataItemList([...formDataItemList, newItemRow]);

    setSelectedItem(null);
    setSelectedQty(1);
  };

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.cinvc_attrb);

    return (
      <div className="flex flex-column">
        {/* {JSON.stringify(rowData.cinvc_attrb)} */}
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

  const cinvc_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.cinvc_itrat).toFixed(2);
    const formattedCostPrice = Number(rowData.cinvc_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const cinvc_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.cinvc_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const cinvc_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cinvc_itqty || 0), 0)
      .toFixed(2);
  };

  const cinvc_dspct_BT = (rowData) => {
    const formattedDiscount = Number(rowData.cinvc_dsamt).toFixed(2);
    const formattedDiscountPercent = Number(rowData.cinvc_dspct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cinvc_dsamt}
        text={`${formattedDiscount} (${formattedDiscountPercent}%)`}
      />
    );
  };

  const cinvc_dspct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cinvc_dsamt || 0), 0)
      .toFixed(2);
  };

  const cinvc_vtpct_BT = (rowData) => {
    const formattedVat = Number(rowData.cinvc_vtamt).toFixed(2);
    const formattedVatPercent = Number(rowData.cinvc_vtpct).toFixed(2);
    return (
      <ZeroRowCell
        value={rowData.cinvc_vtamt}
        text={`${formattedVat} (${formattedVatPercent}%)`}
      />
    );
  };

  const cinvc_vtpct_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.cinvc_vtamt || 0), 0)
      .toFixed(2);
  };

  const cinvc_ntamt_BT = (rowData) => {
    return Number(rowData.cinvc_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cinvc_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.cinvc_ntamt || 0), 0)
    .toFixed(2);

  const cinvc_ntamt_FT = () => {
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
        qty={rowData.cinvc_itqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const bitem_ohqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.bitem_ohqty} text={rowData.bitem_ohqty} />
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
    let dsp = Number(newData.cinvc_dspct || 0);
    if (dsp < 0) dsp = 0;
    if (dsp > 100) dsp = 100;
    let vtp = Number(newData.cinvc_vtpct || 0);
    if (vtp < 0) vtp = 0;
    if (vtp > 1000) vtp = 100;

    const itemAmount = newData.cinvc_itqty * newData.cinvc_itrat;
    const discountAmount = (dsp / 100) * itemAmount;
    const vatAmount = (vtp / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / newData.cinvc_itqty;

    newData.cinvc_dspct = dsp;
    newData.cinvc_vtpct = vtp;

    newData.cinvc_itamt = itemAmount;
    newData.cinvc_dsamt = discountAmount;
    newData.cinvc_vtamt = vatAmount;
    newData.cinvc_csrat = costPrice;
    newData.cinvc_ntamt = totalAmount;

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
          field="cinvc_itrat"
          header="Price"
          body={cinvc_itrat_BT}
          editor={numberEditor}
        />
        <Column
          field="cinvc_itqty"
          header="Qty"
          body={cinvc_itqty_BT}
          footer={cinvc_itqty_FT}
          editor={numberEditor}
        />
        <Column
          field="cinvc_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="cinvc_dspct"
          header="Discount"
          body={cinvc_dspct_BT}
          footer={cinvc_dspct_FT}
          editor={numberEditor}
        />
        <Column
          field="cinvc_vtpct"
          header="VAT"
          body={cinvc_vtpct_BT}
          footer={cinvc_vtpct_FT}
          editor={numberEditor}
        />
        <Column
          field="cinvc_ntamt"
          header="Sub Total"
          body={cinvc_ntamt_BT}
          footer={cinvc_ntamt_FT}
        />
        <Column field="cinvc_notes" header="Remarks" editor={textEditor} />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="bitem_ohqty"
          header="Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={bitem_ohqty_BT}
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
