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
import { parseAttributes } from "@/utils/jsonParser";

const ItemsComp = ({ formData, formDataItemList, setFormDataItemList }) => {
  const { dataList: productList, handleLoadTransferItems } = useProductsSgd();

  useEffect(() => {
    handleLoadTransferItems();
    //console.log("productList", productList);
  }, []);

  const [availableItemList, setAvailableItemList] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedNote, setSelectedNote] = useState("");
  const [selectedItemAddBtn, setSelectedItemAddBtn] = useState(true);
  const [showExtraColumns, setShowExtraColumns] = useState(false);
  const [activeRow, setActiveRow] = useState(null);
  const menu = useRef(null);

  const actionMenuItems = [
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
      return updatedItem;
    });

    const filtered = filteredList.filter(
      (item) =>
        !formDataItemList.some(
          (orderItem) => orderItem.ctrsf_refid === item.ctrsf_refid,
        ),
    );

    //const filtered = filteredList;
    setAvailableItemList(filtered);
  }, [productList, formDataItemList]);

  // Recalculate cost_price when extra costs change
  useEffect(() => {
    if (!formDataItemList || formDataItemList.length === 0) return;

    const extraCost = Number(formData.mtrsf_excst || 0);

    // Calculate grand total qty of all items (before extra cost distribution)
    const grandTotalQty = formDataItemList.reduce(
      (sum, item) => sum + Number(item.ctrsf_itqty || 0),
      0,
    );

    if (grandTotalQty === 0) return;

    // Calculate average extra cost per qty
    const avgExtraCostPerQty = extraCost / grandTotalQty;

    // Update each item's cost_price with distributed extra cost
    const updatedItems = formDataItemList.map((item) => {
      // Calculate base cost price (without extra cost)
      const baseCostPrice = Number(item.ctrsf_itrat || 0);

      // Calculate extra cost per unit based on qty-weighted average
      const extraCostPerUnit = avgExtraCostPerQty;

      // Calculate final cost price per unit
      const finalCostPrice = baseCostPrice + extraCostPerUnit;

      return {
        ...item,
        ctrsf_csrat: finalCostPrice,
      };
    });

    // Only update if there's an actual change to avoid infinite loops
    const hasChanged = updatedItems.some(
      (item, index) =>
        Number(item.ctrsf_csrat) !==
        Number(formDataItemList[index].ctrsf_csrat),
    );

    if (hasChanged) {
      setFormDataItemList(updatedItems);
    }
  }, [formData?.mtrsf_incst, formDataItemList.length]);

  const itemList_IT = (option) => {
    const parsedAttr = parseAttributes(option.ctrsf_attrb);
    return (
      <div className="grid">
        <div className="col-12 font-semibold p-1">
          {option.items_iname} ({option.items_icode})
        </div>
        <div className="grid col-12 text-gray-700 p-2">
          <div className="col-4 p-0">
            💵 Price: {Number(option.ctrsf_itrat).toFixed(2)}
          </div>
          <div className="col-4 p-0">
            📦 Stock: {Number(option.ctrsf_ohqty).toFixed(2)}
          </div>
          <div className="col-4 p-0">📈 No: {option.ctrsf_trnno}</div>
        </div>
        <div className="col-12 p-0 text-gray-500 text-sm">
          {Object.keys(parsedAttr).length > 0 &&
            Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
        </div>
      </div>
    );
  };

  const itemList_VT = (option) => {
    if (!option) {
      return "Select Item";
    }

    const parsedAttr = parseAttributes(option.ctrsf_attrb);
    return (
      <div className="flex flex-column">
        <span className="font-semibold">
          {option.items_iname}, 📦{Number(option.ctrsf_ohqty).toFixed(2)}{" "}
          {Object.keys(parsedAttr).length > 0 &&
            Object.entries(parsedAttr)
              .map(([key, value]) => `${key}: ${value}`)
              .join(", ")}
        </span>
      </div>
    );
  };

  const handleSelectItem = (option) => {
    setSelectedItem(option);
    const selectedItem = productList.find((i) => i.ctrsf_refid === option);
    if (selectedItem) {
      setSelectedQty(selectedItem.ctrsf_ohqty);
    } else {
      setSelectedQty(1);
    }
  };

  const handleAddToList = () => {
    if (!selectedItem) return;

    if (!selectedQty || Number(selectedQty) < 1) return;

    // Check if item is already added
    const existingItem = formDataItemList.find(
      (i) => i.ctrsf_refid === selectedItem,
    );
    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = productList.find((i) => i.ctrsf_refid === selectedItem);
    if (!item) return;

    const itemAmount = (selectedQty || 1) * item.ctrsf_itrat;
    const totalAmount = itemAmount;
    const costPrice = totalAmount / (selectedQty || 1);

    const newItemRow = {
      id: generateGuid(), // Temporary ID for new items
      ctrsf_mtrsf: "",
      ctrsf_bitem: item.ctrsf_bitem,
      ctrsf_items: item.ctrsf_items,
      ctrsf_itrat: item.ctrsf_itrat,
      ctrsf_itqty: selectedQty || 1,
      ctrsf_itamt: itemAmount,
      ctrsf_csrat: costPrice,
      ctrsf_ntamt: totalAmount,
      ctrsf_notes: selectedNote,
      ctrsf_attrb: item.ctrsf_attrb,
      ctrsf_rtqty: 0,
      ctrsf_slqty: 0,
      ctrsf_ohqty: selectedQty || 1,
      ctrsf_srcnm: item.ctrsf_srcnm,
      ctrsf_refid: item.ctrsf_refid,

      items_icode: item.items_icode,
      items_iname: item.items_iname,
      items_dfqty: item.items_dfqty,
      puofm_untnm: item.puofm_untnm,
      suofm_untnm: item.suofm_untnm,
      ctrsf_trnno: item.ctrsf_trnno,
      ctrsf_ohqty: item.ctrsf_ohqty,
    };
    setFormDataItemList([...formDataItemList, newItemRow]);

    setSelectedItem(null);
    setSelectedQty(1);
  };

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.ctrsf_attrb);

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
      </>
    );
  };

  const ctrsf_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.ctrsf_itrat).toFixed(2);
    const formattedCostPrice = Number(rowData.ctrsf_csrat).toFixed(2);
    return (
      <>
        {formattedPrice}{" "}
        <span className="text-sm text-gray-500">({formattedCostPrice})</span>
      </>
    );
  };

  const ctrsf_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.ctrsf_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm}</span>
      </>
    );
  };

  const ctrsf_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.ctrsf_itqty || 0), 0)
      .toFixed(2);
  };

  const ctrsf_ntamt_BT = (rowData) => {
    return Number(rowData.ctrsf_ntamt).toFixed(2);
  };

  const amount = formDataItemList
    .reduce((sum, item) => sum + Number(item.ctrsf_itamt || 0), 0)
    .toFixed(2);

  const netAmount = formDataItemList
    .reduce((sum, item) => sum + Number(item.ctrsf_ntamt || 0), 0)
    .toFixed(2);

  const ctrsf_ntamt_FT = () => {
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
        qty={rowData.ctrsf_itqty}
        dfQty={rowData.items_dfqty}
        pname={rowData.puofm_untnm}
        sname={rowData.suofm_untnm}
      />
    );
  };

  const ctrsf_rtqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.ctrsf_rtqty} text={rowData.ctrsf_rtqty} />
    );
  };

  const ctrsf_slqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.ctrsf_slqty} text={rowData.ctrsf_slqty} />
    );
  };

  const ctrsf_ohqty_BT = (rowData) => {
    return (
      <ZeroRowCell value={rowData.ctrsf_ohqty} text={rowData.ctrsf_ohqty} />
    );
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: `Are you sure you want to delete item "${rowData.items_iname}"?`,
      header: "Delete Confirmation",
      icon: "pi pi-exclamation-triangle",
      accept: () => {
        setFormDataItemList((prev) =>
          prev.filter((item) => item.ctrsf_refid !== rowData.ctrsf_refid),
        );
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

  const dataTable_FT = () => {
    return <ConvertedBDTCurrency value={netAmount} asWords={true} />;
  };

  const items_iname_HT = () => {
    return (
      <>
        Name{" "}
        <span
          className={`pi ${
            showExtraColumns
              ? "pi-eye-slash text-red-300"
              : "pi-eye text-gray-300"
          }  px-2 hover:text-gray-500 cursor-pointer`}
          onClick={() => setShowExtraColumns((prev) => !prev)}
        />
      </>
    );
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
              optionValue="ctrsf_refid"
              onChange={(e) => handleSelectItem(e.value)}
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
        dataKey="id"
        emptyMessage="No items added yet."
        size="small"
        className="shadow-1"
        showGridlines
        footer={dataTable_FT}
      >
        <Column
          field="items_iname"
          header={items_iname_HT}
          body={items_iname_BT}
          footer={items_iname_FT}
        />
        <Column field="ctrsf_itrat" header="Price" body={ctrsf_itrat_BT} />
        <Column
          field="ctrsf_itqty"
          header="Qty"
          body={ctrsf_itqty_BT}
          footer={ctrsf_itqty_FT}
        />
        <Column
          field="ctrsf_itamt"
          header="Amount"
          headerStyle={{ backgroundColor: "#49769bff" }}
          footer={amount}
          hidden={!showExtraColumns}
        />
        <Column
          field="ctrsf_ntamt"
          header="Sub Total"
          body={ctrsf_ntamt_BT}
          footer={ctrsf_ntamt_FT}
        />
        <Column field="ctrsf_notes" header="Remarks" />
        <Column header="Bulk" body={bulk_BT} />
        <Column
          field="ctrsf_rtqty"
          header="Returned"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={ctrsf_rtqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="ctrsf_slqty"
          header="Sold"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={ctrsf_slqty_BT}
          hidden={!showExtraColumns}
        />
        <Column
          field="ctrsf_ohqty"
          header="Stock"
          headerStyle={{ backgroundColor: "#49769bff" }}
          body={ctrsf_ohqty_BT}
          hidden={!showExtraColumns}
        />
        {!formData.edit_stop && (
          <Column header="#" body={action_BT} style={{ width: "20px" }} />
        )}
      </DataTable>
    </div>
  );
};

export default ItemsComp;
