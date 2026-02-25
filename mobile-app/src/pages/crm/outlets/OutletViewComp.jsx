import { useNavigate } from "react-router-dom";
import { formatDate } from "@/utils/datetime";

const getDeliveryBadgeClass = (status) =>
  status
    ? "status-badge status-badge--delivered"
    : "status-badge status-badge--undelivered";

const OutletViewComp = ({ formData, onBack, onEdit }) => {
  const navigate = useNavigate();

  const viewOrder = (id) => {
    navigate(`/invoice/view/${id}`);
  };

  if (!formData) {
    return (
      <div className="empty-state" style={{ marginTop: 40 }}>
        <span className="pi pi-building empty-state-icon" />
        <span className="empty-state-text">No outlet selected</span>
      </div>
    );
  }

  const outlet = formData.outlet ?? formData;

  return (
    <div className="lite-card">
      {/* ── Header Row ── */}
      <div className="header-row">
        <div className="header-row-actions">
          <button
            className="lite-round-btn"
            onClick={() => onEdit(formData.outlet)}
          >
            <span className="pi pi-pencil" />
          </button>
        </div>
        <div className="entity-meta-block">
          <span className="entity-meta-name">{outlet.cntct_cntnm}</span>
          <span className="entity-meta-sub">{outlet.cntct_cntps}</span>
        </div>
      </div>

      <div className="lite-card-divider" />

      {/* ── Contact Detail Rows ── */}
      <div className="detail-rows">
        <div className="detail-row">
          <span className="detail-row-label">Phone</span>
          <span className="detail-row-value">{outlet.cntct_cntno}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Address</span>
          <span className="detail-row-value">{outlet.cntct_ofadr}</span>
        </div>
        <div className="detail-row">
          <span className="detail-row-label">Territory</span>
          <span className="detail-row-value">
            {outlet.tarea_tname}, {outlet.dzone_dname}
          </span>
        </div>
        {outlet.cntct_cntry && (
          <div className="detail-row">
            <span className="detail-row-label">Country</span>
            <span className="detail-row-value">{outlet.cntct_cntry}</span>
          </div>
        )}
      </div>

      <div className="lite-card-divider" />

      {/* ── Quick Actions ── */}
      <div className="lite-actions-grid">
        <button className="lite-action-btn">
          <span
            className="pi pi-phone text-xl"
            style={{ color: "var(--info)" }}
          />
          <span className="lite-action-btn-label">Call</span>
        </button>
        <button className="lite-action-btn">
          <span
            className="pi pi-whatsapp text-xl"
            style={{ color: "#22c55e" }}
          />
          <span className="lite-action-btn-label">WhatsApp</span>
        </button>
        <button className="lite-action-btn">
          <span
            className="pi pi-envelope text-xl"
            style={{ color: "var(--info)" }}
          />
          <span className="lite-action-btn-label">Email</span>
        </button>
      </div>

      <div className="lite-card-divider" />

      {/* ── Orders Section ── */}
      <div className="page-section-header">
        <div className="page-section-header-bar" />
        <span className="page-section-header-title">Order History</span>
        <span className="page-section-header-count">
          {formData.orders?.length ?? 0}
        </span>
      </div>

      <div className="list-container">
        {(!formData.orders || formData.orders.length === 0) && (
          <div className="empty-state">
            <span className="pi pi-file-o empty-state-icon" />
            <span className="empty-state-text">No orders found</span>
          </div>
        )}

        {formData.orders?.map((item) => (
          <div
            key={item.id}
            className="lite-card-item"
            style={{
              background:
                item.fodrm_odamt === 0
                  ? "rgba(251,191,36,0.06)"
                  : "var(--surface)",
            }}
          >
            <div className="lite-card-item-left">
              <div className="lite-card-item-left-title">
                {item.fodrm_trnno}
              </div>
              <div className="lite-card-item-left-subtitle">
                {formatDate(item.fodrm_trdat)}
              </div>
            </div>
            <div className="lite-card-item-right">
              <div className="lite-card-item-right-value">
                {item.fodrm_dlamt}
              </div>
              <span className={getDeliveryBadgeClass(item.fodrm_oshpm)}>
                {item.fodrm_oshpm || "Undelivered"}
              </span>
            </div>
            <div className="lite-card-item-footer">
              <button
                className="lite-button lite-button-info lite-button-sm"
                onClick={() => viewOrder(item.id)}
              >
                <span className="pi pi-eye mr-1 text-xs" />
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutletViewComp;
