import { FiX, FiCheckCircle } from "react-icons/fi";

export default function InvoiceCollectionPayModal({ payModal, invoices, getDue, payAmount, setPayAmount, recordPayment, closePayModal, isBusy }) {
  const inv = invoices.find((i) => i.id === payModal);
  if (!inv) return null;
  const maxDue = getDue(inv);

  return (
    <div className="collect-modal-overlay" onClick={closePayModal}>
      <div className="collect-modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="collect-modal-header">
          <h3 className="collect-modal-title">Record Payment</h3>
          <button onClick={closePayModal} className="collect-modal-close"><FiX /></button>
        </div>
        <p className="collect-modal-subtitle">{inv.customer.name} · {inv.invoiceNumber}</p>

        <div className="ui-form-field collect-modal-field">
          <label className="ui-form-label" htmlFor="collection-amount">Amount (Max: ₹{maxDue.toFixed(2)})</label>
          <input type="number" id="collection-amount" name="collection-amount" className="ui-input" min={0} step={0.01} max={maxDue}
            value={payAmount}
            onChange={(e) => setPayAmount(Math.min(maxDue, Math.max(0, Number(e.target.value) || 0)))} />
        </div>

        <div className="collect-modal-actions">
          <button className="ui-btn ui-btn-secondary collect-modal-btn" onClick={closePayModal}>Cancel</button>
          <button className="ui-btn ui-btn-primary collect-modal-btn" onClick={() => recordPayment(payModal)} disabled={payAmount <= 0 || isBusy}>
            {payAmount >= maxDue ? "Pay Full ✓" : "Record Payment"}
          </button>
        </div>
      </div>
    </div>
  );
}
