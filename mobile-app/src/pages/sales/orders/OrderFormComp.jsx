import { useRef, useState, useEffect } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { demoOptions } from "@/utils/vtable";
import EmptyState from "@/components/EmptyState";
import { useProductsSgd } from "@/hooks/inventory/useProductsSgd";
import { generateGuid } from "@/utils/guid";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { parseAttributes } from "@/utils/jsonParser";
import ConvertedQtyComponent from "@/components/ConvertedQtyComponent";
import ConvertedBDTCurrency from "@/components/ConvertedBDTCurrency";

const OrderFormComp = ({ formData, onBack }) => {
  const { dataList: productList, handleLoadOrderItems } = useProductsSgd();
  const [availableItemList, setAvailableItemList] = useState([]);
  const [formDataItemList, setFormDataItemList] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedQty, setSelectedQty] = useState(1);
  const opRef = useRef(null);

  useEffect(() => {
    handleLoadOrderItems();
  }, []);

  useEffect(() => {
    // const filteredList = productList.map((item) => ({
    //   ...item,
    //   bitem_sddsp: configs.cbkng_dspct ? item.bitem_sddsp : 0,
    //   items_sdvat: configs.cbkng_vtpct ? item.items_sdvat : 0,
    // }));

    const filtered = productList.filter(
      (item) =>
        !formDataItemList.some(
          (orderItem) => orderItem.fodrc_bitem === item.id,
        ),
    );

    //const filtered = filteredList;
    setAvailableItemList(filtered);
  }, [productList, formDataItemList]);

  const onItemSelect = (e) => {
    setSelectedItem(e.value);
    setSelectedQty(1);
    opRef.current.show(e.originalEvent);
  };

  const itemList_IT = (option) => {
    const totalStock = (
      Number(option.bitem_gstkq) + Number(option.bitem_istkq)
    ).toFixed(2);
    return (
      <div className="grid">
        <div className="col-12 font-semibold p-1">
          {option.items_iname} ({option.items_icode})
        </div>
        <div className="grid col-12 text-gray-700 p-2">
          <div className="col-4 p-0">
            💵 Price (DP): {Number(option.bitem_dprat).toFixed(2)}
          </div>
          <div className="col-4 p-0">
            📊 Discount: {Number(option.bitem_sddsp).toFixed(2)}%
          </div>
          <div className="col-4 p-0">
            📈 VAT: {Number(option.items_sdvat).toFixed(2)}%
          </div>
        </div>
        <div
          className={`col-12 p-0 ${Number(totalStock) === 0 ? "text-red-500" : ""}`}
        >
          📦 Stock: {totalStock} {option.puofm_untnm}
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
      (i) => i.fodrc_bitem === selectedItem,
    );

    if (existingItem) {
      // Item already exists, do not add duplicate
      setSelectedItem(null);
      return;
    }

    const item = productList.find((i) => i.id === selectedItem);
    if (!item) return;

    const itemAmount = (selectedQty || 1) * item.bitem_dprat;
    const discountAmount = (item.bitem_sddsp / 100) * itemAmount;
    const vatAmount = (item.items_sdvat / 100) * itemAmount;
    const totalAmount = itemAmount - discountAmount + vatAmount;
    const costPrice = totalAmount / (selectedQty || 1);

    const newItemRow = {
      id: generateGuid(), // Temporary ID for new items
      fodrc_fodrm: "",
      fodrc_bitem: selectedItem,
      fodrc_items: item.bitem_items,
      fodrc_itrat: item.bitem_dprat,
      fodrc_itqty: selectedQty || 1,
      fodrc_itamt: itemAmount,
      fodrc_dspct: item.bitem_sddsp,
      fodrc_dsamt: discountAmount,
      fodrc_vtpct: item.items_sdvat,
      fodrc_vtamt: vatAmount,
      fodrc_csrat: costPrice,
      fodrc_ntamt: totalAmount,
      fodrc_notes: "",
      fodrc_attrb: {},
      fodrc_dlqty: selectedQty || 1,
      fodrc_dgqty: 0,
      fodrc_srcnm: item.bitem_srcnm,
      fodrc_refid: item.bitem_refid,

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
    opRef.current.hide();
  };

  const handleRemoveItem = (rowData) => {
    setFormDataItemList((prev) =>
      prev.filter((item) => item.id !== rowData.id),
    );
  };

  const items_iname_BT = (rowData) => {
    const parsedAttr = parseAttributes(rowData.fodrc_attrb);

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

  const fodrc_itrat_BT = (rowData) => {
    const formattedPrice = Number(rowData.fodrc_itrat).toFixed(2);
    const itemAmount = Number(rowData.fodrc_itamt).toFixed(2);
    return (
      <>
        {itemAmount}{" "}
        <span className="text-sm text-gray-500">({formattedPrice})</span>
      </>
    );
  };

  const fodrc_itqty_BT = (rowData) => {
    return (
      <>
        {Number(rowData.fodrc_itqty).toFixed(2)}{" "}
        <span className="text-gray-600">{rowData.puofm_untnm} </span>
        <span className="text-sm text-gray-500">
          (
          <ConvertedQtyComponent
            qty={rowData.fodrc_itqty}
            dfQty={rowData.items_dfqty}
            pname={rowData.puofm_untnm}
            sname={rowData.suofm_untnm}
          />
          )
        </span>
      </>
    );
  };
  const fodrc_itqty_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.fodrc_itqty || 0), 0)
      .toFixed(2);
  };
  const fodrc_itrat_FT = () => {
    return formDataItemList
      .reduce((sum, item) => sum + Number(item.fodrc_itamt || 0), 0)
      .toFixed(2);
  };
  const action_BT = (rowData) => {
    return (
      <div className="flex justify-content-center">
        <button
          className="lite-button lite-button-danger lite-button-sm"
          style={{ padding: "0 6px", minWidth: "unset" }}
          onClick={() => handleRemoveItem(rowData)}
          title="Remove"
        >
          <span className="pi pi-trash text-xs" />
        </button>
      </div>
    );
  };

  return (
    <div className="lite-card">
      {/* ── Header Row ── */}
      <div className="header-row">
        <div className="header-row-actions">
          <button className="lite-round-btn" onClick={(e) => onSave(e)}>
            <span className="pi pi-save" />
          </button>
        </div>
        <div className="entity-meta-block">
          <span className="entity-meta-name">
            #{formData.cnrut_srlno} · {formData.cntct_cntnm}
          </span>
          <span className="entity-meta-sub">
            {formData?.rutes_dname} — {formData.rutes_rname}
          </span>
        </div>
      </div>

      <div className="lite-card-divider" />

      {/* ── Item Selector ── */}
      <div className="item-selector-row">
        <Dropdown
          name="fodrc_bitem"
          value={selectedItem}
          options={availableItemList}
          onChange={onItemSelect}
          className="w-full"
          placeholder="Select item to add…"
          optionLabel="items_iname"
          optionValue="id"
          filter
          showClear
          itemTemplate={itemList_IT}
          valueTemplate={itemList_VT}
        />
        {/* Qty Overlay */}
        <OverlayPanel ref={opRef} showCloseIcon>
          <div className="qty-input-panel">
            <span className="qty-input-panel-title">
              {selectedItem?.label ?? "Set Quantity"}
            </span>
            <input
              type="number"
              min={1}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
              className="p-inputtext p-component w-full"
            />
            <Button
              label="Add to List"
              icon="pi pi-plus"
              onClick={handleAddToList}
              size="small"
            />
          </div>
        </OverlayPanel>
      </div>
      {/* ── Items Table ── */}
      <div className="entry-item-table">
        {formDataItemList.length === 0 && (
          <EmptyState stateMessage="No items added yet" />
        )}
        <DataTable
          value={formDataItemList}
          dataKey="id"
          emptyMessage="No items added yet."
          size="small"
          className={`shadow-1 ${formDataItemList.length === 0 ? "hidden" : ""}`}
          showGridlines
          //footer={dataTable_FT}
        >
          <Column
            field="items_iname"
            header="Item"
            body={items_iname_BT}
            footer={items_iname_FT}
          />
          <Column
            field="fodrc_itqty"
            header="Qty"
            body={fodrc_itqty_BT}
            footer={fodrc_itqty_FT}
          />
          <Column
            field="fodrc_itrat"
            header="Price"
            body={fodrc_itrat_BT}
            footer={fodrc_itrat_FT}
          />
          {!formData.edit_stop && (
            <Column header="#" body={action_BT} style={{ width: "20px" }} />
          )}
        </DataTable>
      </div>
    </div>
  );
};

export default OrderFormComp;
