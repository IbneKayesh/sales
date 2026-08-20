import { useState, useMemo } from "react";
import PageCard, {
  PageCardHeader,
  PageCardTitle,
  PageCardBody,
} from "@/components/PageCard";
import Badge from "@/components/Badge";
import { IconBox } from "@/icons";
import TwoPanelPos from "./TwoPanelPos";
import FullGridPos from "./FullGridPos";
import TerminalPos from "./TerminalPos";
import "./pos.css";

// ─── Mock Products ──────────────────────────────────────────────────────────
export const PRODUCTS = [
  { id: "P001", name: "Espresso", price: 3.5, category: "Coffee", emoji: "☕" },
  { id: "P002", name: "Latte", price: 4.5, category: "Coffee", emoji: "☕" },
  { id: "P003", name: "Cappuccino", price: 4.0, category: "Coffee", emoji: "☕" },
  { id: "P004", name: "Americano", price: 3.0, category: "Coffee", emoji: "☕" },
  { id: "P005", name: "Mocha", price: 5.0, category: "Coffee", emoji: "☕" },
  { id: "P006", name: "Iced Tea", price: 2.5, category: "Drinks", emoji: "🧊" },
  { id: "P007", name: "Fresh Juice", price: 4.0, category: "Drinks", emoji: "🧃" },
  { id: "P008", name: "Smoothie", price: 5.5, category: "Drinks", emoji: "🥤" },
  { id: "P009", name: "Water", price: 1.0, category: "Drinks", emoji: "💧" },
  { id: "P010", name: "Croissant", price: 3.0, category: "Bakery", emoji: "🥐" },
  { id: "P011", name: "Muffin", price: 2.5, category: "Bakery", emoji: "🧁" },
  { id: "P012", name: "Bagel", price: 2.0, category: "Bakery", emoji: "🥯" },
  { id: "P013", name: "Toast", price: 1.5, category: "Bakery", emoji: "🍞" },
  { id: "P014", name: "Sandwich", price: 6.0, category: "Food", emoji: "🥪" },
  { id: "P015", name: "Burger", price: 7.5, category: "Food", emoji: "🍔" },
  { id: "P016", name: "Pizza Slice", price: 4.5, category: "Food", emoji: "🍕" },
  { id: "P017", name: "Pasta", price: 8.0, category: "Food", emoji: "🍝" },
  { id: "P018", name: "Salad", price: 5.0, category: "Food", emoji: "🥗" },
  { id: "P019", name: "Cake", price: 4.0, category: "Dessert", emoji: "🍰" },
  { id: "P020", name: "Ice Cream", price: 3.5, category: "Dessert", emoji: "🍦" },
  { id: "P021", name: "Donut", price: 2.0, category: "Dessert", emoji: "🍩" },
  { id: "P022", name: "Cookie", price: 1.5, category: "Dessert", emoji: "🍪" },
  { id: "P023", name: "Fries", price: 3.0, category: "Sides", emoji: "🍟" },
  { id: "P024", name: "Nuggets", price: 4.0, category: "Sides", emoji: "🍗" },
  { id: "P025", name: "Chips", price: 1.5, category: "Sides", emoji: "🍟" },
];

export const CATEGORIES = ["All", "Coffee", "Drinks", "Bakery", "Food", "Dessert", "Sides"];

const STYLES = [
  { id: "two-panel", label: "Two Panel" },
  { id: "full-grid", label: "Full Grid" },
  { id: "terminal", label: "Terminal" },
];

const PosPage = () => {
  const [posStyle, setPosStyle] = useState("two-panel");
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, qty } : item))
      );
    }
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );
  const tax = useMemo(() => subtotal * 0.1, [subtotal]);
  const total = useMemo(() => subtotal + tax, [subtotal, tax]);
  const itemCount = useMemo(
    () => cart.reduce((sum, item) => sum + item.qty, 0),
    [cart]
  );

  const cartState = { cart, addToCart, updateQty, removeFromCart, clearCart, subtotal, tax, total, itemCount };

  return (
    <div className="page-wrap">
      <PageCard>
        <PageCardHeader>
          <PageCardTitle
            title="Point of Sale"
            subtitle={`${itemCount} item${itemCount !== 1 ? "s" : ""} · $${total.toFixed(2)}`}
          />
        </PageCardHeader>
        <PageCardBody>
          {/* Style Switcher */}
          <div className="pos-style-switcher">
            {STYLES.map((s) => (
              <button
                key={s.id}
                type="button"
                className={`pos-style-btn${posStyle === s.id ? " pos-style-btn--active" : ""}`}
                onClick={() => setPosStyle(s.id)}
              >
                <IconBox size={14} />
                {s.label}
              </button>
            ))}
          </div>

          {posStyle === "two-panel" && <TwoPanelPos {...cartState} />}
          {posStyle === "full-grid" && <FullGridPos {...cartState} />}
          {posStyle === "terminal" && <TerminalPos {...cartState} />}
        </PageCardBody>
      </PageCard>
    </div>
  );
};

export default PosPage;
