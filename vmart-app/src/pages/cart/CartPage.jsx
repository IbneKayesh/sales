import { useState, useEffect } from "react";
import { FiArrowRight, FiShoppingCart } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../components/SearchableSelect";
import { useUI } from "../context/UIContext";
import { calcSubtotal } from "../../utils/helpers";
import { load, save, KEYS } from "../../utils/storage";
import CartConfirmedView from "./CartConfirmedView";
import CartShopGroup from "./CartShopGroup";
import "./CartPage.css";
import useCart from "@/hooks/useCart";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    showModal,
    runit_options,
    scatg_options,
    cartItems,
    handleChange,
    handleEdit,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
  } = useCart();

  const { showToast, showConfirm, setBusy, isBusy } = useUI();
  const [cart, setCart] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [createdOrders, setCreatedOrders] = useState([]);

  const updateQty = (name, delta) => {
    setCart((prev) => {
      const next = prev.map((p) =>
        p.name === name ? { ...p, qty: Math.max(1, p.qty + delta) } : p,
      );
      save(KEYS.CART, next);
      return next;
    });
  };

  const removeItem = async (name) => {
    const confirmed = await showConfirm(`Remove ${name} from cart?`);
    if (!confirmed) return;
    setCart((prev) => {
      const next = prev.filter((p) => p.name !== name);
      save(KEYS.CART, next);
      return next;
    });
    showToast("Item removed from cart", "error");
  };

  const groupByShop = (items) => {
    const groups = {};
    items.forEach((item) => {
      console.log("item",item)
      const shop = item.bsins_id || "General";
      const shopName = item.bsins_cname
      if (!groups[shop]) groups[shop] = { shop, shopName, items: [] };
      groups[shop].items.push(item);
    });
    return Object.values(groups);
  };

  const shopGroups = groupByShop(cartItems);

  const calcGroupTotal = (group) =>
    group.items.reduce((s, p) => s + calcSubtotal(p), 0);
  const grandTotal = cartItems.reduce((s, p) => s + calcSubtotal(p), 0);
  const orderGroupCount = shopGroups.length;

  const confirmOrder = () => {
    if (!customerName.trim() || cart.length === 0) return;
    setBusy(true);
    const found = customers.find((c) => c.name === customerName);
    const orders = load(KEYS.ORDERS);
    const newOrders = [];

    shopGroups.forEach((group) => {
      const groupTotal = calcGroupTotal(group);
      const order = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        shop: group.shop,
        customer: found
          ? {
              name: found.name,
              contact: found.contact || "",
              address: found.address || "",
            }
          : { name: customerName, contact: "", address: "" },
        products: group.items.map((p) => ({ ...p })),
        deliveryCharge: 0,
        itemsTotal: groupTotal,
        grandTotal: groupTotal,
        status: "pending",
        paymentStatus: "due",
        paidAmount: 0,
        invoiceId: null,
      };
      newOrders.push(order);
      orders.push(order);
    });

    save(KEYS.ORDERS, orders);
    save(KEYS.CART, []);
    setCart([]);
    setCreatedOrders(newOrders);
    setConfirmed(true);
    showToast(`${newOrders.length} order(s) placed successfully!`);
    setBusy(false);
  };

  if (confirmed) {
    return (
      <CartConfirmedView
        createdOrders={createdOrders}
        orderGroupCount={orderGroupCount}
      />
    );
  }

  return (
    <section className="page-section">
      <div className="page-header">
        <div className="page-title-group">
          <p className="page-eyebrow">Cart</p>
          <h1 className="page-heading">Your Cart ({cartItems.length})</h1>
        </div>
        <div className="ui-badge">
          <FiShoppingCart />
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="cart-empty-state">
          <div className="cart-empty-icon-wrap">
            <FiShoppingCart />
          </div>
          <div>
            <h3 className="cart-empty-heading">Your cart is empty</h3>
            <p className="cart-empty-text">
              Browse products to add items to your cart.
            </p>
          </div>
          <button
            className="ui-btn ui-btn-primary cart-empty-btn"
            onClick={() => navigate("/shopping")}
          >
            Browse Products
          </button>
        </div>
      ) : (
        <>
          {shopGroups.map((group) => (
            <CartShopGroup
              key={group.shop}
              group={group}
              calcGroupTotal={calcGroupTotal}
              onChangeQty={updateQty}
              onRemoveItem={removeItem}
            />
          ))}

          {/* <div className="ui-card">
            <h3 className="ui-card-title">Customer</h3>
            <SearchableSelect
              value={customerName}
              onChange={setCustomerName}
              options={customers.map((c) => c.name)}
              placeholder="Search or type customer name..."
            />
          </div> */}

          <div className="ui-card">
            <h3 className="ui-card-title">Summary</h3>
            <div className="cart-summary-rows">
              <div className="cart-summary-row">
                <span className="cart-summary-label">Items Total</span>
                <span className="cart-summary-value">
                  ৳{grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="cart-summary-divider" />
              <div className="cart-summary-total-row">
                <span className="cart-summary-total-label">Total</span>
                <span className="cart-summary-total-value">
                  ৳{grandTotal.toFixed(2)}
                </span>
              </div>
              <div className="cart-summary-note">
                Order will be split into {orderGroupCount} order(s) by shop.
                Each shop receives its own order.
              </div>
            </div>
          </div>

          <button
            className="ui-btn ui-btn-primary cart-confirm-btn"
            onClick={confirmOrder}
            disabled={cartItems.length === 0 || isBusy}
          >
            <FiArrowRight /> Confirm & Place Orders ({orderGroupCount})
          </button>
        </>
      )}
    </section>
  );
}
