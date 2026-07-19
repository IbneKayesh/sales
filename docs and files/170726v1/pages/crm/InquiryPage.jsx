import React, { useState } from "react";
import useInquiry from "@/hooks/crm/useInquiry";
import "./InquiryPage.css";

// PrimeReact components
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";

// ─── Helper: format currency ────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ─── Status badge ────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    pending: { icon: "pi-clock", label: "Pending" },
    wip: { icon: "pi-spinner", label: "In Progress" },
    completed: { icon: "pi-check-circle", label: "Completed" },
    cancelled: { icon: "pi-times-circle", label: "Cancelled" },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className={`status-tag status-${status}`}>
      <i className={`pi ${cfg.icon}`} />
      {cfg.label}
    </span>
  );
};

// ─── Attribute row (child of detail) ─────────────────────────────────────────
const AttributeSubSection = ({
  detailRowId,
  attributes,
  attributeMasterList,
  isLocked,
  onAdd,
  onChange,
  onDelete,
}) => {
  return (
    <div className="attr-section">
      <div className="attr-header">
        <span>
          <i className="pi pi-tags" style={{ marginRight: 4 }} />
          Attributes
        </span>
        {!isLocked && (
          <Button
            icon="pi pi-plus"
            label="Add Attribute"
            size="small"
            text
            severity="secondary"
            onClick={() => onAdd(detailRowId)}
            style={{ fontSize: "0.72rem", padding: "0.2rem 0.5rem" }}
          />
        )}
      </div>

      {(!attributes || attributes.length === 0) ? (
        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          No attributes added.
        </span>
      ) : (
        <div className="attr-list">
          {attributes.map((attr) => {
            const master = attributeMasterList.find((m) => m.id === attr.attributes_id);
            const valueOptions = master?.options?.map((o) => ({ label: o, value: o })) || [];

            return (
              <div className="attr-row" key={attr._attrId}>
                {/* Attribute type */}
                {isLocked ? (
                  <>
                    <span className="attr-row-label">{master?.name || "—"}</span>
                    <span style={{ fontSize: "0.8rem", color: "#1e293b", fontWeight: 600 }}>
                      {attr.attributes_value || "—"}
                    </span>
                  </>
                ) : (
                  <>
                    <Dropdown
                      value={attr.attributes_id}
                      options={attributeMasterList.map((m) => ({ label: m.name, value: m.id }))}
                      onChange={(e) => onChange(detailRowId, attr._attrId, "attributes_id", e.value)}
                      placeholder="Type"
                      style={{ width: "110px", fontSize: "0.78rem" }}
                      className="p-narrow"
                    />
                    <Dropdown
                      value={attr.attributes_value}
                      options={valueOptions}
                      onChange={(e) =>
                        onChange(detailRowId, attr._attrId, "attributes_value", e.value)
                      }
                      placeholder="Value"
                      style={{ width: "110px", fontSize: "0.78rem" }}
                      className="p-narrow"
                      disabled={!master}
                    />
                    <Button
                      icon="pi pi-times"
                      size="small"
                      text
                      severity="danger"
                      onClick={() => onDelete(detailRowId, attr._attrId)}
                      style={{ width: "1.6rem", height: "1.6rem", padding: 0 }}
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Detail table row ─────────────────────────────────────────────────────────
const DetailRow = ({
  row,
  index,
  productList,
  unitList,
  buyerAddressList,
  filteredAddresses,
  attributeMasterList,
  inquiryDetailsAttributes,
  isLocked,
  onDetailChange,
  onDelete,
  onAddAttr,
  onAttrChange,
  onDeleteAttr,
}) => {
  const [showAttrs, setShowAttrs] = useState(false);

  const qty = parseFloat(row.inquiry_qty) || 0;
  const price = parseFloat(row.inquiry_price) || 0;
  const discount = parseFloat(row.discount) || 0;
  const lineTotal = qty * price * (1 - discount / 100);

  const attrs = inquiryDetailsAttributes[row._rowId] || [];

  const productOpts = productList.map((p) => ({ label: p.name, value: p.id }));
  const unitOpts = unitList.map((u) => ({ label: u.name, value: u.id }));
  const addrOpts = filteredAddresses.map((a) => ({
    label: `${a.address}, ${a.city}`,
    value: a.id,
  }));

  return (
    <>
      <tr>
        <td className="td-serial">{index + 1}</td>

        {/* Product */}
        <td style={{ minWidth: 160 }}>
          {isLocked ? (
            <span>{productList.find((p) => p.id === row.product_id)?.name || "—"}</span>
          ) : (
            <Dropdown
              value={row.product_id}
              options={productOpts}
              onChange={(e) => onDetailChange(row._rowId, "product_id", e.value)}
              placeholder="Select product"
              style={{ width: "100%" }}
              className="p-narrow"
            />
          )}
        </td>

        {/* Unit */}
        <td style={{ minWidth: 90 }}>
          {isLocked ? (
            <span>{unitList.find((u) => u.id === row.unit_id)?.shortName || "—"}</span>
          ) : (
            <Dropdown
              value={row.unit_id}
              options={unitOpts}
              onChange={(e) => onDetailChange(row._rowId, "unit_id", e.value)}
              placeholder="Unit"
              style={{ width: "100%" }}
              className="p-narrow"
            />
          )}
        </td>

        {/* Qty */}
        <td className="col-right" style={{ minWidth: 80 }}>
          {isLocked ? (
            <span>{fmt(row.inquiry_qty)}</span>
          ) : (
            <InputNumber
              value={row.inquiry_qty}
              onValueChange={(e) => onDetailChange(row._rowId, "inquiry_qty", e.value)}
              min={0}
              className="p-narrow"
              inputStyle={{ width: "70px", textAlign: "right" }}
            />
          )}
        </td>

        {/* Unit Price */}
        <td className="col-right" style={{ minWidth: 100 }}>
          {isLocked ? (
            <span>{fmt(row.inquiry_price)}</span>
          ) : (
            <InputNumber
              value={row.inquiry_price}
              onValueChange={(e) => onDetailChange(row._rowId, "inquiry_price", e.value)}
              min={0}
              className="p-narrow"
              inputStyle={{ width: "88px", textAlign: "right" }}
            />
          )}
        </td>

        {/* Discount % */}
        <td className="col-right" style={{ minWidth: 80 }}>
          {isLocked ? (
            <span>{fmt(row.discount)}%</span>
          ) : (
            <InputNumber
              value={row.discount}
              onValueChange={(e) => onDetailChange(row._rowId, "discount", e.value)}
              min={0}
              max={100}
              suffix="%"
              className="p-narrow"
              inputStyle={{ width: "70px", textAlign: "right" }}
            />
          )}
        </td>

        {/* Required Date */}
        <td style={{ minWidth: 130 }}>
          {isLocked ? (
            <span>{row.required_date ? new Date(row.required_date).toLocaleDateString() : "—"}</span>
          ) : (
            <Calendar
              value={row.required_date}
              onChange={(e) => onDetailChange(row._rowId, "required_date", e.value)}
              dateFormat="dd/mm/yy"
              showIcon
              className="p-narrow"
              inputStyle={{ width: "100px" }}
            />
          )}
        </td>

        {/* Delivery Address */}
        <td style={{ minWidth: 160 }}>
          {isLocked ? (
            <span>
              {filteredAddresses.find((a) => a.id === row.delivery_address_id)?.address || "—"}
            </span>
          ) : (
            <Dropdown
              value={row.delivery_address_id}
              options={addrOpts}
              onChange={(e) => onDetailChange(row._rowId, "delivery_address_id", e.value)}
              placeholder="Address"
              style={{ width: "100%" }}
              className="p-narrow"
              emptyMessage="Select buyer first"
            />
          )}
        </td>

        {/* Line Total */}
        <td className="col-right line-total">{fmt(lineTotal)}</td>

        {/* Actions */}
        <td className="col-center">
          <div style={{ display: "flex", gap: "0.25rem", justifyContent: "center" }}>
            <Button
              icon={showAttrs ? "pi pi-chevron-up" : "pi pi-chevron-down"}
              size="small"
              text
              severity="secondary"
              onClick={() => setShowAttrs((v) => !v)}
              tooltip={showAttrs ? "Hide attributes" : "Show attributes"}
              tooltipOptions={{ position: "top" }}
            />
            {!isLocked && (
              <Button
                icon="pi pi-trash"
                size="small"
                text
                severity="danger"
                onClick={() => onDelete(row._rowId)}
                tooltip="Delete row"
                tooltipOptions={{ position: "top" }}
              />
            )}
          </div>
        </td>
      </tr>

      {/* Attribute sub-row */}
      {showAttrs && (
        <tr>
          <td colSpan={10} style={{ padding: 0, background: "#fafbfd" }}>
            <AttributeSubSection
              detailRowId={row._rowId}
              attributes={attrs}
              attributeMasterList={attributeMasterList}
              isLocked={isLocked}
              onAdd={onAddAttr}
              onChange={onAttrChange}
              onDelete={onDeleteAttr}
            />
          </td>
        </tr>
      )}
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// InquiryPage — main component
// ═══════════════════════════════════════════════════════════════════════════════
const InquiryPage = () => {
  const {
    inquiry,
    inquiryDetails,
    inquiryDetailsAttributes,
    isLocked,
    errors,
    loading,
    buyerList,
    filteredAddresses,
    productList,
    unitList,
    currencyList,
    attributeMasterList,
    PAYMENT_TERMS,
    STATUS_OPTIONS,
    subtotal,
    tax,
    grandTotal,
    TAX_RATE,
    handleChange,
    handleDetailChange,
    handleAddInquiryDetails,
    handleDeleteInquiryDetails,
    handleAddInquiryDetailsAttributes,
    handleAttributeChange,
    handleDeleteInquiryDetailsAttributes,
    handleToggleLock,
    handleSave,
    handleSubmit,
    handleCancel,
  } = useInquiry();

  const buyerOpts = buyerList.map((b) => ({ label: b.name, value: b.id }));
  const currencyOpts = currencyList.map((c) => ({ label: `${c.code} — ${c.name}`, value: c.id }));

  // ── Readonly value helper ─────────────────────────────────────────
  const ReadVal = ({ children, style }) => (
    <div className="field-value-readonly" style={style}>
      {children || <span style={{ color: "#cbd5e1" }}>—</span>}
    </div>
  );

  return (
    <div className="inquiry-page">
      {/* ── Page header ──────────────────────────────────────────── */}
      <div className="inquiry-page-header">
        <div className="inquiry-page-title">
          <i className="pi pi-file-edit" style={{ fontSize: "1.3rem", color: "#3b82f6" }} />
          <h2>Customer Inquiry / Order</h2>
          {inquiry.inquiry_no && (
            <span className="inquiry-no-badge">{inquiry.inquiry_no}</span>
          )}
          <span className={`mode-badge ${isLocked ? "locked" : "open"}`}>
            <i className={`pi ${isLocked ? "pi-lock" : "pi-lock-open"}`} />
            {isLocked ? "Locked" : "Open"}
          </span>
        </div>

        {/* Action buttons */}
        <div className="inquiry-actions">
          {!isLocked && (
            <>
              <Button
                id="btn-save-inquiry"
                label="Save"
                icon="pi pi-save"
                severity="primary"
                size="small"
                loading={loading}
                onClick={handleSave}
              />
              <Button
                id="btn-submit-inquiry"
                label="Submit"
                icon="pi pi-send"
                severity="success"
                size="small"
                loading={loading}
                onClick={handleSubmit}
              />
            </>
          )}
          <Button
            id="btn-lock-inquiry"
            label={isLocked ? "Unlock" : "Lock"}
            icon={`pi ${isLocked ? "pi-lock-open" : "pi-lock"}`}
            severity={isLocked ? "warning" : "secondary"}
            size="small"
            outlined={!isLocked}
            onClick={handleToggleLock}
          />
          <Button
            id="btn-cancel-inquiry"
            label="Cancel"
            icon="pi pi-times"
            severity="danger"
            size="small"
            outlined
            onClick={handleCancel}
          />
        </div>
      </div>

      {/* Validation alert */}
      {Object.keys(errors).length > 0 && (
        <div
          style={{
            background: "#fee2e2",
            border: "1px solid #fca5a5",
            borderRadius: 8,
            padding: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.84rem",
            color: "#7f1d1d",
          }}
        >
          <i className="pi pi-exclamation-circle" style={{ marginRight: 6 }} />
          <strong>Please fix the following:</strong>
          <ul style={{ margin: "0.4rem 0 0 1.25rem", padding: 0 }}>
            {Object.values(errors).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── MASTER SECTION ──────────────────────────────────────────── */}
      <div className="inquiry-section">
        <div className="inquiry-section-header">
          <i className="pi pi-info-circle" />
          Order Master
        </div>
        <div className="inquiry-section-body">
          <div className="inquiry-master-grid">

            {/* Inquiry No */}
            <div className="inquiry-field">
              <label>Inquiry No.</label>
              <ReadVal>{inquiry.inquiry_no || "(auto on save)"}</ReadVal>
            </div>

            {/* Inquiry Date */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Order Date <span className="req">*</span></label>
              {isLocked ? (
                <ReadVal>{inquiry.inquiry_date ? new Date(inquiry.inquiry_date).toLocaleDateString() : "—"}</ReadVal>
              ) : (
                <Calendar
                  id="inquiry-date"
                  value={inquiry.inquiry_date}
                  onChange={(e) => handleChange("inquiry_date", e.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  style={{ width: "100%" }}
                />
              )}
              {errors.inquiry_date && <small className="text-red-500">{errors.inquiry_date}</small>}
            </div>

            {/* Required Date */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Required Date</label>
              {isLocked ? (
                <ReadVal>{inquiry.required_date ? new Date(inquiry.required_date).toLocaleDateString() : "—"}</ReadVal>
              ) : (
                <Calendar
                  id="required-date"
                  value={inquiry.required_date}
                  onChange={(e) => handleChange("required_date", e.value)}
                  dateFormat="dd/mm/yy"
                  showIcon
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {/* Buyer */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Customer / Buyer <span className="req">*</span></label>
              {isLocked ? (
                <ReadVal>{buyerList.find((b) => b.id === inquiry.buyer_id)?.name}</ReadVal>
              ) : (
                <Dropdown
                  id="buyer-dropdown"
                  value={inquiry.buyer_id}
                  options={buyerOpts}
                  onChange={(e) => handleChange("buyer_id", e.value)}
                  placeholder="Select buyer"
                  style={{ width: "100%" }}
                  filter
                />
              )}
              {errors.buyer_id && <small className="text-red-500">{errors.buyer_id}</small>}
            </div>

            {/* Status */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Status</label>
              {isLocked ? (
                <ReadVal><StatusBadge status={inquiry.inquiry_status} /></ReadVal>
              ) : (
                <Dropdown
                  id="inquiry-status"
                  value={inquiry.inquiry_status}
                  options={STATUS_OPTIONS}
                  onChange={(e) => handleChange("inquiry_status", e.value)}
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {/* Payment Terms */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Payment Terms</label>
              {isLocked ? (
                <ReadVal>{PAYMENT_TERMS.find((p) => p.value === inquiry.payment_terms)?.label}</ReadVal>
              ) : (
                <Dropdown
                  id="payment-terms"
                  value={inquiry.payment_terms}
                  options={PAYMENT_TERMS}
                  onChange={(e) => handleChange("payment_terms", e.value)}
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {/* Currency */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Currency</label>
              {isLocked ? (
                <ReadVal>{currencyList.find((c) => c.id === inquiry.currency_id)?.code}</ReadVal>
              ) : (
                <Dropdown
                  id="currency-dropdown"
                  value={inquiry.currency_id}
                  options={currencyOpts}
                  onChange={(e) => handleChange("currency_id", e.value)}
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {/* Reference No */}
            <div className={`inquiry-field ${isLocked ? "locked-field" : ""}`}>
              <label>Reference No.</label>
              {isLocked ? (
                <ReadVal>{inquiry.reference_no}</ReadVal>
              ) : (
                <InputText
                  id="reference-no"
                  value={inquiry.reference_no}
                  onChange={(e) => handleChange("reference_no", e.target.value)}
                  placeholder="e.g. PO-2024-001"
                  style={{ width: "100%" }}
                />
              )}
            </div>

            {/* Note */}
            <div className={`inquiry-field full-width ${isLocked ? "locked-field" : ""}`}>
              <label>Notes / Remarks</label>
              {isLocked ? (
                <ReadVal>{inquiry.inquiry_note}</ReadVal>
              ) : (
                <InputTextarea
                  id="inquiry-note"
                  value={inquiry.inquiry_note}
                  onChange={(e) => handleChange("inquiry_note", e.target.value)}
                  rows={2}
                  autoResize
                  placeholder="Any additional notes..."
                  style={{ width: "100%" }}
                />
              )}
            </div>

          </div>
        </div>
      </div>

      {/* ── DETAIL SECTION ───────────────────────────────────────────── */}
      <div className="inquiry-section">
        <div className="inquiry-section-header">
          <i className="pi pi-list" />
          Order Items
          <span
            style={{
              marginLeft: "auto",
              fontWeight: 600,
              color: "#3b82f6",
              fontSize: "0.78rem",
            }}
          >
            {inquiryDetails.length} item{inquiryDetails.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="inquiry-section-body">
          {/* Toolbar */}
          {!isLocked && (
            <div className="detail-toolbar">
              <span style={{ fontSize: "0.82rem", color: "#64748b" }}>
                Click <strong>Add Item</strong> to build your order.
              </span>
              <Button
                id="btn-add-detail"
                label="Add Item"
                icon="pi pi-plus"
                size="small"
                severity="primary"
                onClick={handleAddInquiryDetails}
              />
            </div>
          )}

          {errors.details && (
            <small className="text-red-500" style={{ display: "block", marginBottom: "0.5rem" }}>
              {errors.details}
            </small>
          )}

          {/* Table */}
          <div className="inquiry-detail-table-wrap">
            <table className="inquiry-detail-table">
              <thead>
                <tr>
                  <th style={{ width: 36 }}>#</th>
                  <th>Product</th>
                  <th>Unit</th>
                  <th className="col-right">Qty</th>
                  <th className="col-right">Unit Price</th>
                  <th className="col-right">Discount</th>
                  <th>Req. Date</th>
                  <th>Delivery Address</th>
                  <th className="col-right">Line Total</th>
                  <th className="col-center" style={{ width: 80 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {inquiryDetails.length === 0 ? (
                  <tr>
                    <td colSpan={10}>
                      <div className="detail-empty">
                        <i className="pi pi-inbox" />
                        No items added yet.{" "}
                        {!isLocked && (
                          <span
                            style={{ color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}
                            onClick={handleAddInquiryDetails}
                          >
                            Add first item
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  inquiryDetails.map((row, i) => (
                    <DetailRow
                      key={row._rowId}
                      row={row}
                      index={i}
                      productList={productList}
                      unitList={unitList}
                      filteredAddresses={filteredAddresses}
                      attributeMasterList={attributeMasterList}
                      inquiryDetailsAttributes={inquiryDetailsAttributes}
                      isLocked={isLocked}
                      onDetailChange={handleDetailChange}
                      onDelete={handleDeleteInquiryDetails}
                      onAddAttr={handleAddInquiryDetailsAttributes}
                      onAttrChange={handleAttributeChange}
                      onDeleteAttr={handleDeleteInquiryDetailsAttributes}
                    />
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ── Summary ───────────────────────────────────────────── */}
          <div className="inquiry-summary">
            <div className="inquiry-summary-box">
              <div className="summary-row">
                <span className="summary-label">Subtotal</span>
                <span className="summary-value">{fmt(subtotal)}</span>
              </div>
              <div className="summary-row">
                <span className="summary-label">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                <span className="summary-value">{fmt(tax)}</span>
              </div>
              <div className="summary-row grand-total">
                <span className="summary-label">Grand Total</span>
                <span className="summary-value">{fmt(grandTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom action bar ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "0.5rem",
          paddingTop: "0.5rem",
        }}
      >
        {!isLocked && (
          <>
            <Button
              id="btn-save-inquiry-bottom"
              label="Save Draft"
              icon="pi pi-save"
              severity="primary"
              outlined
              size="small"
              loading={loading}
              onClick={handleSave}
            />
            <Button
              id="btn-submit-inquiry-bottom"
              label="Submit Order"
              icon="pi pi-send"
              severity="success"
              size="small"
              loading={loading}
              onClick={handleSubmit}
            />
          </>
        )}
        <Button
          id="btn-lock-inquiry-bottom"
          label={isLocked ? "Unlock Order" : "Lock Order"}
          icon={`pi ${isLocked ? "pi-lock-open" : "pi-lock"}`}
          severity={isLocked ? "warning" : "secondary"}
          size="small"
          outlined={!isLocked}
          onClick={handleToggleLock}
        />
        <Button
          id="btn-cancel-inquiry-bottom"
          label="Cancel"
          icon="pi pi-times"
          severity="danger"
          size="small"
          outlined
          onClick={handleCancel}
        />
      </div>
    </div>
  );
};

export default InquiryPage;
