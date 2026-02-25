import { useRef, useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { OverlayPanel } from "primereact/overlaypanel";
import { demoOptions } from "@/utils/vtable";

const OrderEntryComp = ({ formData, onBack }) => {
  const [dataList, setDataList] = useState([
    { code: 123, name: "Item 1", quantity: 1, price: 100 },
    { code: 124, name: "Item 2", quantity: 2, price: 200 },
  ]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const opRef = useRef(null);

  const onItemSelect = (e) => {
    setSelectedItem(e.value);
    setQty(1);
    opRef.current.show(e.originalEvent);
  };

  const addItem = () => {
    if (!selectedItem) return;
    const existingIndex = dataList.findIndex(
      (item) => item.code === selectedItem.value,
    );
    if (existingIndex >= 0) {
      const updatedList = [...dataList];
      updatedList[existingIndex].quantity += qty;
      setDataList(updatedList);
    } else {
      setDataList([
        ...dataList,
        {
          code: selectedItem.value,
          name: selectedItem.label,
          quantity: qty,
          price: 100,
        },
      ]);
    }
    opRef.current.hide();
  };

  const removeItem = (code) =>
    setDataList(dataList.filter((item) => item.code !== code));

  const totalQty = dataList.reduce((s, i) => s + i.quantity, 0);
  const totalPrice = dataList.reduce((s, i) => s + i.quantity * i.price, 0);

  return (
    <div className="lite-card">
      {/* ── Header Row ── */}
      <div className="header-row">
        <div className="header-row-actions">
          <button
            className="lite-button lite-button-secondary lite-button-sm"
            onClick={() => onBack()}
          >
            <span className="pi pi-arrow-left mr-1 text-xs" />
            Back
          </button>
          <button
            className="lite-button lite-button-primary lite-button-sm"
            onClick={() => {}}
          >
            <span className="pi pi-check mr-1 text-xs" />
            Submit
          </button>
        </div>
        <div className="entity-meta-block">
          <span className="entity-meta-name">
            {formData?.cnrut_srlno
              ? `#${formData.cnrut_srlno} · ${formData.cntct_cntnm}`
              : (formData?.cntct_cntnm ?? "New Order")}
          </span>
          <span className="entity-meta-sub">
            {formData?.rutes_dname}
            {formData?.rutes_rname ? ` — ${formData.rutes_rname}` : ""}
          </span>
        </div>
      </div>

      <div className="lite-card-divider" />

      {/* ── Item Selector ── */}
      <div className="item-selector-row">
        <Dropdown
          name="fodrc_bitem"
          value={selectedItem}
          options={demoOptions}
          onChange={onItemSelect}
          className="w-full"
          placeholder="Select item to add…"
          optionLabel="label"
          optionValue="value"
          filter
        />
      </div>

      {/* Qty Overlay */}
      <OverlayPanel ref={opRef} showCloseIcon>
        <div className="qty-input-panel">
          <span className="qty-input-panel-title">
            {selectedItem?.label ?? "Set Quantity"}
          </span>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="p-inputtext p-component w-full"
          />
          <Button
            label="Add to Order"
            icon="pi pi-plus"
            onClick={addItem}
            size="small"
          />
        </div>
      </OverlayPanel>

      {/* ── Items Table ── */}
      <div className="entry-item-table">
        {/* Header */}
        <div className="entry-item-row header">
          <span>Item</span>
          <span style={{ textAlign: "right" }}>Qty</span>
          <span style={{ textAlign: "right" }}>Price</span>
          <span />
        </div>

        {dataList.length === 0 && (
          <div className="empty-state">
            <span className="pi pi-shopping-cart empty-state-icon" />
            <span className="empty-state-text">No items added yet</span>
          </div>
        )}

        {dataList.map((item) => (
          <div key={item.code} className="entry-item-row">
            <span style={{ fontWeight: 600 }}>{item.name}</span>
            <span
              style={{ textAlign: "right", color: "var(--text-secondary)" }}
            >
              {item.quantity}
            </span>
            <span style={{ textAlign: "right" }}>
              {(item.quantity * item.price).toLocaleString()}
            </span>
            <button
              className="lite-button lite-button-danger lite-button-sm"
              style={{ padding: "0 6px", minWidth: "unset" }}
              onClick={() => removeItem(item.code)}
              title="Remove"
            >
              <span className="pi pi-trash text-xs" />
            </button>
          </div>
        ))}

        {/* Summary Row */}
        {dataList.length > 0 && (
          <div className="entry-item-summary">
            <span className="entry-item-summary-label">
              {dataList.length} item{dataList.length !== 1 ? "s" : ""} ·{" "}
              {totalQty} qty
            </span>
            <span>Total</span>
            <span style={{ fontSize: 14 }}>{totalPrice.toLocaleString()}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderEntryComp;
