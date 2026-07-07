import { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { load, KEYS } from "../utils/storage";
import ShopDashboard from "./home/ShopDashboard";
import CustomerMarketplace from "./home/CustomerMarketplace";
import "./HomePage.css";

export default function HomePage() {
  const { user, isCustomer, isShop } = useAuth();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setShops(load(KEYS.SHOPS));
    setProducts(load(KEYS.PRODUCTS));
    setCart(load(KEYS.CART));
    setOrders(load(KEYS.ORDERS));
    setInvoices(load(KEYS.INVOICES));
    setFavorites(load(KEYS.FAVORITES));
    setReviews(load(KEYS.REVIEWS));
  }, []);

  if (isShop) {
    return (
      <ShopDashboard
        user={user}
        shops={shops}
        products={products}
        orders={orders}
        invoices={invoices}
      />
    );
  }

  return (
    <CustomerMarketplace
      user={user}
      shops={shops}
      products={products}
      cart={cart}
      orders={orders}
      invoices={invoices}
      favorites={favorites}
      reviews={reviews}
      isAuthenticated={!!user}
    />
  );
}
