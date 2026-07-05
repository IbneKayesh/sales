// ─────────────────────────────────────────────────────────────────────────────
// useCustomerOrders — Cart + Order management for CUSTOMER role
// ─────────────────────────────────────────────────────────────────────────────
import { useState } from "react";
import {
  DEMO_ORDERS,
  DEMO_PRODUCTS,
  STATUS_COLORS,
} from "@/hooks/useVmartData";

const useCustomerOrders = (customerId) => {
  // ── Order list (per customer, mutable local state) ────────────────────────
  const [orders, setOrders] = useState(
    DEMO_ORDERS.filter((o) => o.customerId === customerId)
  );

  // ── Cart: { [shopId]: { shopName, items: [{product, qty}] } } ─────────────
  const [cart, setCart] = useState({});

  // ── Add product to cart ───────────────────────────────────────────────────
  const addToCart = (product) => {
    setCart((prev) => {
      const shopCart = prev[product.shopId] || {
        shopId: product.shopId,
        shopName: product.shopName,
        items: [],
      };
      const existing = shopCart.items.find(
        (i) => i.productId === product.id
      );
      const updatedItems = existing
        ? shopCart.items.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
          )
        : [
            ...shopCart.items,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              qty: 1,
            },
          ];
      return {
        ...prev,
        [product.shopId]: { ...shopCart, items: updatedItems },
      };
    });
  };

  // ── Remove product from cart ──────────────────────────────────────────────
  const removeFromCart = (shopId, productId) => {
    setCart((prev) => {
      const shopCart = prev[shopId];
      if (!shopCart) return prev;
      const updatedItems = shopCart.items.filter(
        (i) => i.productId !== productId
      );
      if (updatedItems.length === 0) {
        const { [shopId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [shopId]: { ...shopCart, items: updatedItems } };
    });
  };

  // ── Update qty in cart ────────────────────────────────────────────────────
  const updateCartQty = (shopId, productId, qty) => {
    if (qty <= 0) {
      removeFromCart(shopId, productId);
      return;
    }
    setCart((prev) => ({
      ...prev,
      [shopId]: {
        ...prev[shopId],
        items: prev[shopId].items.map((i) =>
          i.productId === productId ? { ...i, qty } : i
        ),
      },
    }));
  };

  // ── Cart totals ───────────────────────────────────────────────────────────
  const cartTotalItems = Object.values(cart).reduce(
    (acc, shop) => acc + shop.items.reduce((a, i) => a + i.qty, 0),
    0
  );

  const cartShops = Object.values(cart);

  // ── Place order (one per shop cart group) ─────────────────────────────────
  const placeOrder = (shopId) => {
    const shopCart = cart[shopId];
    if (!shopCart || shopCart.items.length === 0) return;

    const total = shopCart.items.reduce(
      (acc, i) => acc + i.price * i.qty,
      0
    );
    const newOrder = {
      id: `ORD-${Date.now()}`,
      orderNo: `ORD-${Date.now()}`,
      customerId,
      shopId,
      shopName: shopCart.shopName,
      date: new Date().toISOString().split("T")[0],
      status: "PENDING",
      items: [...shopCart.items],
      total,
    };

    setOrders((prev) => [newOrder, ...prev]);
    // Remove this shop from cart
    setCart((prev) => {
      const { [shopId]: _, ...rest } = prev;
      return rest;
    });
  };

  // ── Add product to existing DRAFT order ───────────────────────────────────
  const addProductToOrder = (orderId, product) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status !== "DRAFT") return o;
        const existing = o.items.find((i) => i.productId === product.id);
        const updatedItems = existing
          ? o.items.map((i) =>
              i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
            )
          : [
              ...o.items,
              {
                productId: product.id,
                name: product.name,
                price: product.price,
                qty: 1,
              },
            ];
        const total = updatedItems.reduce(
          (acc, i) => acc + i.price * i.qty,
          0
        );
        return { ...o, items: updatedItems, total };
      })
    );
  };

  // ── Remove product from DRAFT order ──────────────────────────────────────
  const removeProductFromOrder = (orderId, productId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status !== "DRAFT") return o;
        const updatedItems = o.items.filter(
          (i) => i.productId !== productId
        );
        const total = updatedItems.reduce(
          (acc, i) => acc + i.price * i.qty,
          0
        );
        return { ...o, items: updatedItems, total };
      })
    );
  };

  // ── Submit DRAFT order → PENDING ──────────────────────────────────────────
  const submitOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "DRAFT"
          ? { ...o, status: "PENDING" }
          : o
      )
    );
  };

  // ── Filtered / sorted ─────────────────────────────────────────────────────
  const getOrderById = (id) => orders.find((o) => o.id === id);

  const STATUS_ORDER = ["DRAFT", "PENDING", "DELIVERED", "PAID", "COMPLETED"];

  return {
    orders,
    cart,
    cartShops,
    cartTotalItems,
    addToCart,
    removeFromCart,
    updateCartQty,
    placeOrder,
    addProductToOrder,
    removeProductFromOrder,
    submitOrder,
    getOrderById,
    STATUS_COLORS,
    STATUS_ORDER,
  };
};

export default useCustomerOrders;
