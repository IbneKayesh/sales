import { useState, useEffect } from "react";
import {
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiSearch,
  FiShoppingBag,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useUI } from "../context/UIContext";
import { load, save, KEYS } from "../../utils/storage";
import { formatDate, calcSubtotal } from "../../utils/helpers";
import OrderTrackingTimeline from "./OrderTrackingTimeline";
import OrderDetailView from "./OrderDetailView";
import OrderFormModal from "./OrderFormModal";
import "./OrderPage.css";

const emptyCustomer = { name: "", contact: "", address: "" };
const defaultProduct = { name: "", qty: 1, price: 0, discount: 0 };

export default function OrderPage() {
  const { user, isCustomer, isShop } = useAuth();
  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [savedCustomers, setSavedCustomers] = useState([]);
  const [savedProducts, setSavedProducts] = useState([]);
  const [savedOrders, setSavedOrders] = useState([]);
  const [shops, setShops] = useState([]);
  const [shopFilter, setShopFilter] = useState("");

  const [customer, setCustomer] = useState({ ...emptyCustomer });
  const [products, setProducts] = useState([{ ...defaultProduct }]);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [orderShop, setOrderShop] = useState("");
  const [orderStatus, setOrderStatus] = useState("pending");
  const [paymentStatus, setPaymentStatus] = useState("due");
  const [paidAmount, setPaidAmount] = useState(0);
  const [modal, setModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    setSavedCustomers(load(KEYS.CUSTOMERS));
    setSavedProducts(load(KEYS.PRODUCTS));
    setSavedOrders(load(KEYS.ORDERS));
    setShops(load(KEYS.SHOPS));
  }, []);

  const itemsTotal = products.reduce(
    (sum, item) => sum + calcSubtotal(item),
    0,
  );
  const grandTotal = itemsTotal + Number(deliveryCharge);

  const resetForm = () => {
    setCustomer({ ...emptyCustomer });
    setProducts([{ ...defaultProduct }]);
    setDeliveryCharge(0);
    setOrderStatus("pending");
    setPaymentStatus("due");
    setPaidAmount(0);
    setOrderShop("");
    setEditingOrderId(null);
  };

  const openAdd = () => {
    resetForm();
    setModal(true);
  };
  const openEdit = (id) => {
    const order = savedOrders.find((o) => o.id === id);
    if (!order) return;
    setCustomer({ ...order.customer });
    setProducts(
      order.products.length > 0
        ? order.products.map((p) => ({ ...p }))
        : [{ ...defaultProduct }],
    );
    setDeliveryCharge(order.deliveryCharge || 0);
    setOrderStatus(order.status || "pending");
    setPaymentStatus(order.paymentStatus || "due");
    setPaidAmount(order.paidAmount || 0);
    setOrderShop(order.shop || "");
    setEditingOrderId(id);
    setModal(true);
  };
  const closeModal = () => {
    setModal(false);
    resetForm();
  };

  const saveOrder = () => {
    if (!customer.name.trim()) return;
    if (!products.some((p) => p.name.trim())) return;
    setBusy(true);
    const order = {
      id:
        editingOrderId ||
        Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      createdAt: editingOrderId
        ? savedOrders.find((o) => o.id === editingOrderId)?.createdAt ||
          new Date().toISOString()
        : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      shop: orderShop || "",
      customer: { ...customer },
      products: products.filter((p) => p.name.trim()).map((p) => ({ ...p })),
      deliveryCharge: Number(deliveryCharge),
      itemsTotal,
      grandTotal,
      status: orderStatus,
      paymentStatus,
      paidAmount: Number(paidAmount),
      invoiceId: null,
    };
    let updated;
    if (editingOrderId) {
      updated = savedOrders.map((o) => (o.id === editingOrderId ? order : o));
    } else {
      updated = [...savedOrders, order];
    }
    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    if (editingOrderId) {
      const existingOrder = savedOrders.find((o) => o.id === editingOrderId);
      if (existingOrder?.invoiceId) {
        const allInvoices = load(KEYS.INVOICES);
        const updatedInvoices = allInvoices.map((inv) =>
          inv.id === existingOrder.invoiceId
            ? {
                ...inv,
                status: orderStatus,
                paymentStatus,
                paidAmount: Number(paidAmount),
                updatedAt: new Date().toISOString(),
              }
            : inv,
        );
        save(KEYS.INVOICES, updatedInvoices);
      }
    }
    closeModal();
    showToast(
      editingOrderId
        ? "Order updated successfully"
        : "Order placed successfully",
    );
    setBusy(false);
  };

  const deleteOrder = async (id) => {
    const order = savedOrders.find((o) => o.id === id);
    const confirmed = await showConfirm(
      `Delete order for ${order?.customer?.name || "this customer"}?`,
    );
    if (!confirmed) return;
    setBusy(true);
    const updated = savedOrders.filter((o) => o.id !== id);
    setSavedOrders(updated);
    save(KEYS.ORDERS, updated);
    if (editingOrderId === id) closeModal();
    showToast("Order deleted", "error");
    setBusy(false);
  };

  const selectedOrder = savedOrders.find((o) => o.id === selectedOrderId);

  /* ── Detail view ── */
  if (selectedOrderId && selectedOrder) {
    return (
      <OrderDetailView
        order={selectedOrder}
        onBack={() => setSelectedOrderId(null)}
        onEdit={openEdit}
        onDelete={deleteOrder}
      />
    );
  }

  /* ── List view ── */
  const roleFiltered = isCustomer
    ? savedOrders.filter((o) => o.customer?.name === user?.name)
    : isShop
      ? savedOrders.filter((o) => o.shop === (user?.shopName || ""))
      : savedOrders;

  const filteredOrders = shopFilter
    ? roleFiltered.filter((o) => o.shop === shopFilter)
    : roleFiltered;

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Orders</p>
          <h1 className="page-heading">All Orders ({filteredOrders.length})</h1>
        </div>
        <div className="order-header-actions">
          <button
            className="ui-btn ui-btn-primary order-add-btn"
            onClick={openAdd}
          >
            <FiPlus /> Add
          </button>
          <div className="ui-badge">
            <FiShoppingBag />
          </div>
        </div>
      </div>

      {/* Shop filter */}
      {shops.length > 0 && (
        <div className="order-filter-row">
          <FiSearch size={14} className="order-filter-icon" />
          <div className="ui-select-wrapper order-filter-select">
            <select
              className="ui-select"
              value={shopFilter}
              onChange={(e) => setShopFilter(e.target.value)}
            >
              <option value="">All Shops</option>
              {shops.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {filteredOrders.length === 0 ? (
        <div className="order-empty-state">
          <div className="order-empty-icon">
            <FiShoppingBag />
          </div>
          <div>
            <h3 className="order-empty-heading">No orders yet</h3>
            <p className="order-empty-text">
              {isCustomer
                ? "Start shopping to place your first order."
                : isShop
                  ? "No orders for your shop yet."
                  : "Tap 'Add' to create one."}
            </p>
          </div>
        </div>
      ) : (
        <div className="ui-card">
          <h3 className="ui-card-title">
            All Orders ({filteredOrders.length})
          </h3>
          <div className="order-list">
            {[...filteredOrders].reverse().map((order) => (
              <div
                key={order.id}
                className="order-list-item"
                onClick={() => setSelectedOrderId(order.id)}
              >
                <div className="order-list-info">
                  <div className="order-list-name-row">
                    <span className="order-list-name">
                      {order.customer.name}
                    </span>
                    <span className="order-list-amount-badge">
                      ₹{order.grandTotal.toFixed(2)}
                    </span>
                  </div>
                  {order.shop && (
                    <div className="order-list-shop">
                      <FiShoppingBag size={12} /> {order.shop}
                    </div>
                  )}
                  <div className="order-list-status-row">
                    <span
                      className={`order-status-badge ${order.status === "delivered" ? "order-status-badge--success" : "order-status-badge--neutral"}`}
                    >
                      {order.status?.replace(/_/g, " ") || "pending"}
                    </span>
                    <span
                      className={`order-payment-badge ${order.paymentStatus === "paid" ? "order-payment-badge--paid" : order.paymentStatus === "partial_paid" ? "order-payment-badge--partial" : "order-payment-badge--due"}`}
                    >
                      {order.paymentStatus?.replace(/_/g, " ") || "due"}
                    </span>
                  </div>
                  <OrderTrackingTimeline status={order.status} variant="list" />
                  <div className="order-list-meta">
                    {order.products.length} item
                    {order.products.length > 1 ? "s" : ""}
                    {order.createdAt && <> · {formatDate(order.createdAt)}</>}
                  </div>
                </div>
                <div className="order-list-actions">
                  <button
                    className="order-icon-btn order-icon-btn--edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(order.id);
                    }}
                    aria-label="Edit order"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    className="order-icon-btn order-icon-btn--delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteOrder(order.id);
                    }}
                    aria-label="Delete order"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <OrderFormModal
          editingOrderId={editingOrderId}
          closeModal={closeModal}
          shops={shops}
          orderShop={orderShop}
          setOrderShop={setOrderShop}
          savedCustomers={savedCustomers}
          customer={customer}
          setCustomer={setCustomer}
          savedProducts={savedProducts}
          products={products}
          setProducts={setProducts}
          orderStatus={orderStatus}
          setOrderStatus={setOrderStatus}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          paidAmount={paidAmount}
          setPaidAmount={setPaidAmount}
          deliveryCharge={deliveryCharge}
          setDeliveryCharge={setDeliveryCharge}
          itemsTotal={itemsTotal}
          grandTotal={grandTotal}
          isBusy={isBusy}
          saveOrder={saveOrder}
        />
      )}
    </section>
  );
}
