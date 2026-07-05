// ─────────────────────────────────────────────────────────────────────────────
// CartContext — shared cart + customer orders state across customer pages
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useState, useEffect } from "react";
import { DEMO_PRODUCTS } from "@/hooks/useVmartData";
import {
  loadCustomerOrders,
  loadCart,
  saveCart,
  updateStoredOrders,
  appendOrder,
} from "@/utils/vmartStorage";

const CartContext = createContext();

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};

const getProductStock = (productId) =>
  DEMO_PRODUCTS.find((p) => p.id === productId)?.stock ?? Infinity;

export const CartProvider = ({ children, customerId }) => {
  const [orders, setOrders] = useState(() => loadCustomerOrders(customerId));
  const [cart, setCart] = useState(() => loadCart(customerId));

  useEffect(() => {
    saveCart(customerId, cart);
  }, [customerId, cart]);

  useEffect(() => {
    updateStoredOrders(customerId, orders);
  }, [customerId, orders]);

  const getCartQtyForProduct = (productId) => {
    for (const shop of Object.values(cart)) {
      const item = shop.items.find((i) => i.productId === productId);
      if (item) return item.qty;
    }
    return 0;
  };

  const addToCart = (product, qty = 1) => {
    const stock = product.stock ?? getProductStock(product.id);
    const currentQty = getCartQtyForProduct(product.id);
    if (currentQty + qty > stock) {
      return { success: false, message: `Only ${stock} in stock` };
    }

    setCart((prev) => {
      const shopCart = prev[product.shopId] || {
        shopId: product.shopId,
        shopName: product.shopName,
        items: [],
      };
      const existing = shopCart.items.find((i) => i.productId === product.id);
      const updatedItems = existing
        ? shopCart.items.map((i) =>
            i.productId === product.id ? { ...i, qty: i.qty + qty } : i
          )
        : [
            ...shopCart.items,
            { productId: product.id, name: product.name, price: product.price, qty },
          ];
      return { ...prev, [product.shopId]: { ...shopCart, items: updatedItems } };
    });
    return { success: true };
  };

  const removeFromCart = (shopId, productId) => {
    setCart((prev) => {
      const shopCart = prev[shopId];
      if (!shopCart) return prev;
      const updatedItems = shopCart.items.filter((i) => i.productId !== productId);
      if (updatedItems.length === 0) {
        const { [shopId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [shopId]: { ...shopCart, items: updatedItems } };
    });
  };

  const updateCartQty = (shopId, productId, qty) => {
    if (qty <= 0) {
      removeFromCart(shopId, productId);
      return { success: true };
    }
    const stock = getProductStock(productId);
    if (qty > stock) {
      return { success: false, message: `Only ${stock} in stock` };
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
    return { success: true };
  };

  const cartTotalItems = Object.values(cart).reduce(
    (acc, shop) => acc + shop.items.reduce((a, i) => a + i.qty, 0),
    0
  );
  const cartShops = Object.values(cart);

  const placeOrder = (shopId, { paymentMethod = "COD", deliveryAddress = "" } = {}) => {
    const shopCart = cart[shopId];
    if (!shopCart?.items?.length) return null;
    const total = shopCart.items.reduce((acc, i) => acc + i.price * i.qty, 0);
    const uniqueId = Date.now().toString();
    const newOrder = {
      id: `ORD-${uniqueId}`,
      orderNo: `ORD-${uniqueId}`,
      customerId,
      shopId,
      shopName: shopCart.shopName,
      date: new Date().toISOString().split("T")[0],
      status: "PENDING",
      items: [...shopCart.items],
      total,
      paymentMethod,
      deliveryAddress,
    };
    setOrders((prev) => [newOrder, ...prev]);
    appendOrder(newOrder);
    setCart((prev) => {
      const { [shopId]: _, ...rest } = prev;
      return rest;
    });
    return newOrder;
  };

  const addProductToOrder = (orderId, product) => {
    const stock = product.stock ?? getProductStock(product.id);
    let blocked = false;
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status !== "DRAFT") return o;
        const existing = o.items.find((i) => i.productId === product.id);
        const newQty = existing ? existing.qty + 1 : 1;
        if (newQty > stock) {
          blocked = true;
          return o;
        }
        const updatedItems = existing
          ? o.items.map((i) =>
              i.productId === product.id ? { ...i, qty: i.qty + 1 } : i
            )
          : [
              ...o.items,
              { productId: product.id, name: product.name, price: product.price, qty: 1 },
            ];
        return {
          ...o,
          items: updatedItems,
          total: updatedItems.reduce((a, i) => a + i.price * i.qty, 0),
        };
      })
    );
    return blocked ? { success: false, message: `Only ${stock} in stock` } : { success: true };
  };

  const removeProductFromOrder = (orderId, productId) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status !== "DRAFT") return o;
        const updatedItems = o.items.filter((i) => i.productId !== productId);
        return {
          ...o,
          items: updatedItems,
          total: updatedItems.reduce((a, i) => a + i.price * i.qty, 0),
        };
      })
    );
  };

  const updateOrderItemQty = (orderId, productId, qty) => {
    if (qty <= 0) {
      removeProductFromOrder(orderId, productId);
      return { success: true };
    }
    const stock = getProductStock(productId);
    if (qty > stock) return { success: false, message: `Only ${stock} in stock` };
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId || o.status !== "DRAFT") return o;
        const updatedItems = o.items.map((i) =>
          i.productId === productId ? { ...i, qty } : i
        );
        return {
          ...o,
          items: updatedItems,
          total: updatedItems.reduce((a, i) => a + i.price * i.qty, 0),
        };
      })
    );
    return { success: true };
  };

  const submitOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.status === "DRAFT" ? { ...o, status: "PENDING" } : o
      )
    );
  };

  const getOrderById = (id) => orders.find((o) => o.id === id);
  const uniqueShopsVisited = new Set(orders.map((o) => o.shopId)).size;

  const value = {
    orders,
    cart,
    cartShops,
    cartTotalItems,
    uniqueShopsVisited,
    addToCart,
    removeFromCart,
    updateCartQty,
    placeOrder,
    addProductToOrder,
    removeProductFromOrder,
    updateOrderItemQty,
    submitOrder,
    getOrderById,
    getCartQtyForProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
