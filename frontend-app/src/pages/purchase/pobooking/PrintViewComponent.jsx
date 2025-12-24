import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "./PrintViewComponent.css";

const PrintViewComponent = ({
  visible,
  onHide,
  formData,
  formDataList,
  formDataPaymentList,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "BDT",
    }).format(value || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const dialogFooter = (
    <div className="flex justify-content-end gap-2">
      <Button
        label="Close"
        icon="pi pi-times"
        onClick={onHide}
        severity="secondary"
        size="small"
      />
      <Button
        label="Print"
        icon="pi pi-print"
        onClick={handlePrint}
        severity="success"
        size="small"
      />
    </div>
  );

  return (
    <Dialog
      header="Purchase Booking Invoice"
      visible={visible}
      onHide={onHide}
      footer={dialogFooter}
      style={{ width: "90vw", maxWidth: "1200px" }}
      maximizable
    >
      <div className="print-container">
        {/* Company Header */}
        <div className="print-header">
          <div className="company-info">
            <h1 className="company-name">Your Company Name</h1>
            <p className="company-details">
              123 Business Street, City, Country
              <br />
              Phone: +880 1234-567890 | Email: info@company.com
              <br />
              Website: www.company.com
            </p>
          </div>
          <div className="invoice-badge">
            <h2>PURCHASE BOOKING</h2>
            {formData?.is_posted ? (
              <span className="badge-posted">POSTED</span>
            ) : (
              <span className="badge-draft">DRAFT</span>
            )}
          </div>
        </div>

        <hr className="divider" />

        {/* Invoice Details */}
        <div className="invoice-details">
          <div className="detail-section">
            <h3>Supplier Information</h3>
            <p>
              <strong>Supplier:</strong> {formData?.contact_name || "N/A"}
            </p>
            <p>
              <strong>Contact:</strong> {formData?.contact_mobile || "N/A"}
            </p>
            <p>
              <strong>Address:</strong> {formData?.contact_address || "N/A"}
            </p>
          </div>
          <div className="detail-section">
            <h3>Booking Details</h3>
            <p>
              <strong>Booking No:</strong> {formData?.order_no || "N/A"}
            </p>
            <p>
              <strong>Booking Date:</strong> {formatDate(formData?.order_date)}
            </p>
            <p>
              <strong>Note:</strong> {formData?.order_note || "N/A"}
            </p>
          </div>
        </div>

        {/* Items Table */}
        <div className="items-section">
          <h3>Booking Items</h3>
          <table className="items-table">
            <thead>
              <tr>
                <th style={{ width: "5%" }}>#</th>
                <th style={{ width: "35%" }}>Product Name</th>
                <th style={{ width: "10%", textAlign: "right" }}>Price</th>
                <th style={{ width: "10%", textAlign: "right" }}>Qty</th>
                <th style={{ width: "10%", textAlign: "right" }}>Discount</th>
                <th style={{ width: "10%", textAlign: "right" }}>VAT</th>
                <th style={{ width: "10%", textAlign: "right" }}>Total</th>
                <th style={{ width: "10%" }}>Note</th>
              </tr>
            </thead>
            <tbody>
              {formDataList && formDataList.length > 0 ? (
                formDataList.map((item, index) => (
                  <tr key={item.booking_id || index}>
                    <td>{index + 1}</td>
                    <td>{item.product_name}</td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(item.product_price)}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {item.product_qty} {item.small_unit_name}
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(item.discount_amount)}
                      <br />
                      <small>({item.discount_percent}%)</small>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(item.vat_amount)}
                      <br />
                      <small>({item.vat_percent}%)</small>
                    </td>
                    <td style={{ textAlign: "right" }}>
                      {formatCurrency(item.total_amount)}
                    </td>
                    <td>{item.product_note || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" style={{ textAlign: "right" }}>
                  <strong>Total Items: {formDataList?.length || 0}</strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {formDataList?.reduce(
                      (sum, item) => sum + (item.product_qty || 0),
                      0
                    )}
                  </strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {formatCurrency(
                      formDataList?.reduce(
                        (sum, item) => sum + (item.discount_amount || 0),
                        0
                      )
                    )}
                  </strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {formatCurrency(
                      formDataList?.reduce(
                        (sum, item) => sum + (item.vat_amount || 0),
                        0
                      )
                    )}
                  </strong>
                </td>
                <td style={{ textAlign: "right" }}>
                  <strong>
                    {formatCurrency(
                      formDataList?.reduce(
                        (sum, item) => sum + (item.total_amount || 0),
                        0
                      )
                    )}
                  </strong>
                </td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <div className="summary-left">
            {formDataPaymentList && formDataPaymentList.length > 0 && (
              <>
                <table className="payment-table">
                  <thead>
                    <tr>
                        <th colSpan={4} style={{ textAlign: "center", fontSize: "16px", fontWeight: "bold", color: "#2c3e50" }}>Payment Details</th>
                    </tr>
                    <tr>
                      <th>Mode</th>
                      <th>Date</th>
                      <th style={{ textAlign: "right" }}>Amount</th>
                      <th>Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formDataPaymentList.map((payment, index) => (
                      <tr key={payment.payment_id || index}>
                        <td>{payment.payment_mode}</td>
                        <td>{formatDate(payment.payment_date)}</td>
                        <td style={{ textAlign: "right" }}>
                          {formatCurrency(payment.payment_amount)}
                        </td>
                        <td>{payment.payment_note || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}
          </div>
          <div className="summary-right">
            <h3>Amount Summary</h3>
            <div className="summary-row">
              <span>Order Amount:</span>
              <span>{formatCurrency(formData?.order_amount)}</span>
            </div>
            <div className="summary-row">
              <span>Discount Amount:</span>
              <span className="text-success">
                - {formatCurrency(formData?.discount_amount)}
              </span>
            </div>
            <div className="summary-row">
              <span>VAT Amount:</span>
              <span>{formatCurrency(formData?.vat_amount)}</span>
            </div>
            <div className="summary-row">
              <span>Include Cost:</span>
              <span>{formatCurrency(formData?.include_cost)}</span>
            </div>
            <div className="summary-row">
              <span>Exclude Cost:</span>
              <span>{formatCurrency(formData?.exclude_cost)}</span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>{formatCurrency(formData?.total_amount)}</span>
            </div>
            <div className="summary-row">
              <span>Payable Amount:</span>
              <span className="text-primary">
                {formatCurrency(formData?.payable_amount)}
              </span>
            </div>
            <div className="summary-row">
              <span>Paid Amount:</span>
              <span className="text-success">
                {formatCurrency(formData?.paid_amount)}
              </span>
            </div>
            <hr className="summary-divider" />
            <div className="summary-row due">
              <span>Due Amount:</span>
              <span
                className={
                  formData?.due_amount > 0 ? "text-danger" : "text-success"
                }
              >
                {formatCurrency(formData?.due_amount)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="print-footer">
          <div className="signature-section">
            <div className="signature-box">
              <hr className="signature-line" />
              <p>Prepared By</p>
            </div>
            <div className="signature-box">
              <hr className="signature-line" />
              <p>Checked By</p>
            </div>
            <div className="signature-box">
              <hr className="signature-line" />
              <p>Approved By</p>
            </div>
            <div className="signature-box">
              <hr className="signature-line" />
              <p>Supplier Signature</p>
            </div>
          </div>
          <p className="footer-note">
            This is a computer-generated document. No signature is required.
          </p>
        </div>
      </div>
    </Dialog>
  );
};

export default PrintViewComponent;
