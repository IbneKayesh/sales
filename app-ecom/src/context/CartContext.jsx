import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { getVendorById, getVendorDeliveryFee } from '@/data/vendors';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [vendorCoupons, setVendorCoupons] = useState({});
  const [vendorDeliveryMethods, setVendorDeliveryMethods] = useState({});
  const [vendorPaymentMethods, setVendorPaymentMethods] = useState({});
  // Selected item IDs for checkout: Set of product IDs
  const [selectedItemIds, setSelectedItemIds] = useState(new Set());

  const addToCart = useCallback((product, quantity = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Auto-select new items
      setSelectedItemIds(prev => new Set([...prev, product.id]));
      return [...prev, { ...product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      next.delete(productId);
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setVendorCoupons({});
    setVendorDeliveryMethods({});
    setVendorPaymentMethods({});
    setSelectedItemIds(new Set());
  }, []);

  // Selection handlers
  const toggleItemSelection = useCallback((productId) => {
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }, []);

  const selectAllItems = useCallback(() => {
    setSelectedItemIds(new Set(cartItems.map(item => item.id)));
  }, [cartItems]);

  const deselectAllItems = useCallback(() => {
    setSelectedItemIds(new Set());
  }, []);

  const isItemSelected = useCallback((productId) => {
    return selectedItemIds.has(productId);
  }, [selectedItemIds]);

  // All selected items
  const selectedItems = useMemo(() => {
    return cartItems.filter(item => selectedItemIds.has(item.id));
  }, [cartItems, selectedItemIds]);

  // Check if all items are selected
  const allItemsSelected = useMemo(() => {
    return cartItems.length > 0 && cartItems.every(item => selectedItemIds.has(item.id));
  }, [cartItems, selectedItemIds]);

  // Check if some items are selected
  const someItemsSelected = useMemo(() => {
    return cartItems.some(item => selectedItemIds.has(item.id)) && !allItemsSelected;
  }, [cartItems, selectedItemIds, allItemsSelected]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  // Group selected items by vendor
  const selectedByVendor = useMemo(() => {
    const groups = {};
    selectedItems.forEach(item => {
      const vid = item.vendor_id || 'unknown';
      if (!groups[vid]) {
        groups[vid] = {
          vendor: getVendorById(vid),
          vendorId: vid,
          items: [],
          subtotal: 0
        };
      }
      groups[vid].items.push(item);
      groups[vid].subtotal += item.price * item.quantity;
    });
    return Object.values(groups);
  }, [selectedItems]);

  // Group ALL cart items by vendor (for display)
  const cartByVendor = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      const vid = item.vendor_id || 'unknown';
      if (!groups[vid]) {
        groups[vid] = {
          vendor: getVendorById(vid),
          vendorId: vid,
          items: [],
          subtotal: 0
        };
      }
      groups[vid].items.push(item);
      groups[vid].subtotal += item.price * item.quantity;
    });
    return Object.values(groups);
  }, [cartItems]);

  const vendorIds = useMemo(() => {
    return [...new Set(cartItems.map(item => item.vendor_id || 'unknown'))];
  }, [cartItems]);

  // Per-vendor delivery method handlers
  const setVendorDeliveryMethod = useCallback((vendorId, methodId) => {
    setVendorDeliveryMethods(prev => ({ ...prev, [vendorId]: methodId }));
  }, []);

  const getVendorDeliveryMethod = useCallback((vendorId) => {
    return vendorDeliveryMethods[vendorId] || 'standard';
  }, [vendorDeliveryMethods]);

  // Per-vendor payment method handlers
  const setVendorPaymentMethod = useCallback((vendorId, methodId) => {
    setVendorPaymentMethods(prev => ({ ...prev, [vendorId]: methodId }));
  }, []);

  const getVendorPaymentMethod = useCallback((vendorId) => {
    return vendorPaymentMethods[vendorId] || 'cod';
  }, [vendorPaymentMethods]);

  // Per-vendor coupon handlers
  const applyVendorCoupon = useCallback((vendorId, code, discountInfo) => {
    setVendorCoupons(prev => ({
      ...prev,
      [vendorId]: { code, discount: discountInfo }
    }));
  }, []);

  const removeVendorCoupon = useCallback((vendorId) => {
    setVendorCoupons(prev => {
      const next = { ...prev };
      delete next[vendorId];
      return next;
    });
  }, []);

  const getVendorDiscount = useCallback((vendorId, vendorSubtotal) => {
    const coupon = vendorCoupons[vendorId];
    if (!coupon || !coupon.discount) return 0;
    const d = coupon.discount;
    if (d.type === 'percent') return Math.round(vendorSubtotal * (d.value / 100) * 100) / 100;
    if (d.type === 'fixed') return Math.min(d.value, vendorSubtotal);
    return 0;
  }, [vendorCoupons]);

  // Get delivery fee for a vendor
  const getVendorDelivery = useCallback((vendorId, vendorSubtotal) => {
    const methodId = vendorDeliveryMethods[vendorId] || 'standard';
    return getVendorDeliveryFee(vendorId, vendorSubtotal, methodId);
  }, [vendorDeliveryMethods]);

  // Total delivery across selected vendors
  const totalDeliveryFee = useMemo(() => {
    return selectedByVendor.reduce((sum, group) => {
      const methodId = vendorDeliveryMethods[group.vendorId] || 'standard';
      return sum + getVendorDeliveryFee(group.vendorId, group.subtotal, methodId);
    }, 0);
  }, [selectedByVendor, vendorDeliveryMethods]);

  // Initialize default selections when vendors change
  useMemo(() => {
    cartByVendor.forEach(group => {
      const vid = group.vendorId;
      if (!vendorDeliveryMethods[vid]) {
        setVendorDeliveryMethods(prev => {
          if (prev[vid]) return prev;
          return { ...prev, [vid]: 'standard' };
        });
      }
      if (!vendorPaymentMethods[vid]) {
        setVendorPaymentMethods(prev => {
          if (prev[vid]) return prev;
          return { ...prev, [vid]: 'cod' };
        });
      }
    });
  }, [cartByVendor]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemCount,
    cartByVendor,
    selectedItems,
    selectedByVendor,
    selectedItemIds,
    allItemsSelected,
    someItemsSelected,
    toggleItemSelection,
    selectAllItems,
    deselectAllItems,
    isItemSelected,
    vendorIds,
    vendorCoupons,
    vendorDeliveryMethods,
    vendorPaymentMethods,
    applyVendorCoupon,
    removeVendorCoupon,
    getVendorDiscount,
    setVendorDeliveryMethod,
    getVendorDeliveryMethod,
    setVendorPaymentMethod,
    getVendorPaymentMethod,
    getVendorDelivery,
    totalDeliveryFee
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount, cartByVendor, selectedItems, selectedByVendor, selectedItemIds, allItemsSelected, someItemsSelected, toggleItemSelection, selectAllItems, deselectAllItems, isItemSelected, vendorIds, vendorCoupons, vendorDeliveryMethods, vendorPaymentMethods, applyVendorCoupon, removeVendorCoupon, getVendorDiscount, setVendorDeliveryMethod, getVendorDeliveryMethod, setVendorPaymentMethod, getVendorPaymentMethod, getVendorDelivery, totalDeliveryFee]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
