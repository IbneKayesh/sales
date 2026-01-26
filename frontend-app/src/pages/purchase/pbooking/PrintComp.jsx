import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./PrintComp.css";
import { useAuth } from "@/hooks/useAuth";
import { parseAttributes } from "@/utils/jsonParser";

const PrintComp = ({ formData, formDataItemList, formDataPaymentList }) => {
  const { user, business } = useAuth();
  const [bImg, setBImg] = useState(null);

  useEffect(() => {
    const lImg = localStorage.getItem(business?.users_bsins);
    //console.log("business", business);
    if (lImg) {
      const imgData = JSON.parse(lImg);
      setBImg(imgData.bsins_image);
    } else {
      setBImg(user?.bsins_image);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-BD", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <div className="print-container">
        {/* Header: Company & Invoice Info */}
        <header className="print-header">
          <div className="company-logo-section">
            {bImg ? (
              <img
                src={bImg}
                alt="Logo"
                style={{
                  maxHeight: "65px",
                  maxWidth: "250px",
                  marginBottom: "5px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <h1>{business?.bsins_bname || "YOUR BUSINESS NAME"}</h1>
            )}
            <div className="company-details">
              <span className="text-xl font-bold mb-2">
                {business?.bsins_bname || "YOUR BUSINESS NAME"}
              </span>
              <br />
              {business?.bsins_addrs || "BUSINESS ADRESS"},{" "}
              {business?.bsins_addrs || "BUSINESS ADRESS"},{" "}
              {business?.bsins_cntry || "COUNTRY"} <br />
              BIN: {business?.bsins_binno || ""} | Email:{" "}
              {business?.bsins_email || "[EMAIL_ADDRESS]"} | Phone:{" "}
              {business?.bsins_cntct || "[PHONE_NUMBER]"}
            </div>
          </div>
          <div className="invoice-meta-top">
            <h2>{"Purchase Booking"}</h2>
            <div
              className="info-row"
              style={{ justifyContent: "flex-end", marginTop: "10px" }}
            >
              <span
                className="label"
                style={{ width: "auto", marginRight: "8px" }}
              ></span>
              <span style={{ fontWeight: 700 }}>{formData?.mbkng_trnno}</span>
            </div>
            <div
              className={`status-badge ${
                formData?.mbkng_ispad === 1 ? "paid" : "unpaid-partial"
              }`}
            >
              {formData?.mbkng_ispad === 1
                ? "PAID"
                : formData?.mbkng_ispad === 2
                  ? "PARTIAL"
                  : "UNPAID"}
            </div>
          </div>
        </header>

        {/* Info Grid: Supplier & Order Details */}
        <section className="info-grid">
          <div className="info-box">
            <h3>Supplier Information</h3>
            <div className="info-content">
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 600,
                  marginBottom: "5px",
                }}
              >
                {formData?.cntct_cntnm}
              </div>
              <div className="info-row">
                <span className="label">Contact:</span>
                <span>{formData?.cntct_cntno}, {formData?.cntct_cntps}</span>
              </div>
              <div className="info-row">
                <span className="label">Address:</span>
                <span style={{ maxWidth: "250px" }}>
                  {formData?.cntct_ofadr}
                </span>
              </div>
            </div>
          </div>
          <div className="info-box">
            <h3>Booking Details</h3>
            <div className="info-content">
              <div className="info-row">
                <span className="label">Date:</span>
                <span>{formatDate(formData?.mbkng_trdat)}</span>
              </div>
              <div className="info-row">
                <span className="label">Ref No:</span>
                <span>{formData?.mbkng_refno || "-"}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Items Table */}
        <section className="items-section">
          <table className="invoice-table">
            <thead>
              <tr>
                <th style={{ width: "40px" }}>ID</th>
                <th>Item Description</th>
                <th className="text-right">Price</th>
                <th className="text-right">Qty</th>
                <th className="text-right">VAT/Disc</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {formDataItemList?.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{item.items_icode} {item.items_iname}</span>                    
                    {item.cbkng_attrb && (
                      <span className="subtext">
                        {Object.entries(parseAttributes(item.cbkng_attrb))
                          .map(([key, value]) => `${key}: ${value}`)
                          .join(", ")}
                      </span>
                    )}
                    {item.cbkng_notes && (
                      <span className="subtext italic">
                        {item.cbkng_notes}
                      </span>
                    )}
                  </td>
                  <td className="text-right">
                    {formatCurrency(item.cbkng_itrat)}
                  </td>
                  <td className="text-right">
                    {Number(item.cbkng_itqty).toFixed(2)}
                    <span className="subtext">{item.puofm_untnm}</span>
                  </td>
                  <td className="text-right">
                    <span className="subtext">
                      VAT: {formatCurrency(item.cbkng_vtamt)} (
                      {Number(item.cbkng_vtpct).toFixed(2)}%)
                    </span>
                    <span className="subtext">
                      Disc: {formatCurrency(item.cbkng_dsamt)} (
                      {Number(item.cbkng_dspct).toFixed(2)}%)
                    </span>
                  </td>
                  <td className="text-right" style={{ fontWeight: 600 }}>
                    {formatCurrency(item.cbkng_ntamt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Financial Summary */}
        <section className="financial-flex">
          <div className="payment-history">
            <h3
              style={{
                fontSize: "12px",
                fontWeight: 600,
                textTransform: "uppercase",
                color: "#4a5568",
                marginBottom: "1rem",
              }}
            >
              Payment History
            </h3>
            {formDataPaymentList?.length > 0 ? (
              formDataPaymentList.map((p, i) => (
                <div key={i} className="payment-item">
                  <div>
                    <span className="mode">{p.paybl_pymod}</span>
                    <div
                      style={{
                        fontSize: "10px",
                        color: "#718096",
                        marginTop: "2px",
                      }}
                    >
                      {formatDate(p.paybl_trdat)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div style={{ fontWeight: 600 }}>
                      {p.paybl_dbamt > 0
                        ? formatCurrency(p.paybl_dbamt)
                        : formatCurrency(p.paybl_cramt)}
                    </div>
                    {p.paybl_descr && (
                      <div style={{ fontSize: "9px", fontStyle: "italic" }}>
                        {p.paybl_descr}
                        {p.paybl_notes && ", " + p.paybl_notes}
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div
                style={{
                  fontSize: "12px",
                  color: "#a0aec0",
                  fontStyle: "italic",
                }}
              >
                No payments recorded.
              </div>
            )}

            {formData?.mbkng_trnte && (
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "10px",
                  background: "#f8fafc",
                  borderRadius: "4px",
                  border: "1px solid #e2e8f0",
                }}
              >
                <span
                  style={{
                    display: "block",
                    fontSize: "10px",
                    fontWeight: 600,
                    color: "#4a5568",
                    textTransform: "uppercase",
                    marginBottom: "4px",
                  }}
                >
                  Notes:
                </span>
                <span style={{ fontSize: "12px" }}>
                  {formData?.mbkng_trnte}
                </span>
              </div>
            )}
          </div>

          <aside className="summary-card">
            <div className="summary-line">
              <span>Gross Amount:</span>
              <span>{formatCurrency(formData?.mbkng_odamt)}</span>
            </div>
            <div className="summary-line">
              <span>Discount:</span>
              <span style={{ color: "#e53e3e" }}>
                - {formatCurrency(formData?.mbkng_dsamt)}
              </span>
            </div>
            <div className="summary-line">
              <span>VAT:</span>
              <span>
                {formData?.mbkng_vatpy === 1
                  ? formatCurrency(formData?.mbkng_vtamt)
                  : 0}
              </span>
            </div>
            {Number(formData?.mbkng_incst) > 0 && (
              <>
                <div className="summary-line">
                  <span>Additional Costs:</span>
                  <span>{formatCurrency(formData?.mbkng_incst)}</span>
                </div>
              </>
            )}
            {Number(formData?.mbkng_rnamt) !== 0 && (
              <div className="summary-line">
                <span>Round Off:</span>
                <span>{formatCurrency(formData?.mbkng_rnamt)}</span>
              </div>
            )}
            <div className="summary-line grand-total">
              <span>Payable:</span>
              <span>{formatCurrency(formData?.mbkng_pyamt)}</span>
            </div>
            <div
              className="summary-line"
              style={{ marginTop: "10px", fontSize: "13px" }}
            >
              <span>Total Paid:</span>
              <span style={{ color: "#38a169", fontWeight: 600 }}>
                {formatCurrency(formData?.mbkng_pdamt)}
              </span>
            </div>
            <div
              className="summary-line due"
              style={{ fontSize: "15px", marginTop: "5px" }}
            >
              <span>Due:</span>
              <span>{formatCurrency(formData?.mbkng_duamt)}</span>
            </div>
          </aside>
        </section>

        {/* Footer & Signatures */}
        <footer className="invoice-footer">
          <div className="signature-grid">
            <div className="signature-box">
              <div style={{ fontSize: "10px", marginTop: "4px" }}>
                {user?.users_oname}
              </div>
              <div className="sig-line"></div>
              <span className="sig-label">Prepared By</span>
            </div>
            <div className="signature-box">
              {/* Intentional Empty for spacing or second sig */}
            </div>
            <div className="signature-box">
              <div style={{ fontSize: "10px", marginTop: "4px" }}>
                No Signature Required
              </div>
              <div className="sig-line"></div>
              <span className="sig-label">Authorized Signature</span>
            </div>
          </div>

          <div className="legal-notice">
            This is a computer-generated document and does not require a
            signature.
            <br />
            Printed on: {new Date().toLocaleString()}
          </div>
        </footer>
      </div>
    </>
  );
};

export default PrintComp;
