import { useMemo, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import CartList from '@/components/cart/CartList';
import CartSummary from '@/components/cart/CartSummary';
import EmptyCart from '@/components/cart/EmptyCart';
import SimilarProducts from '@/components/cart/SimilarProducts';
import StepNav from '@/components/common/StepNav';
import useProducts from '@/hooks/useProducts';
import { calculateCart } from '@/utils/calculateCart';

const CartPage = () => {
  const { cartItems, totalDeliveryFee } = useCart();
  const { allProducts } = useProducts();

  const cartSummary = useMemo(() => {
    return calculateCart(cartItems, totalDeliveryFee, 0);
  }, [cartItems, totalDeliveryFee]);

  const suggestedProducts = useMemo(() => {
    // When cart is empty, show top-rated products
    if (cartItems.length === 0) {
      return [...allProducts]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 8);
    }

    // When cart has items, show similar products
    const cartCategoryIds = [...new Set(cartItems.map(item => item.category))];
    const cartItemIds = cartItems.map(item => item.id);

    return allProducts
      .filter(p => cartCategoryIds.includes(p.category) && !cartItemIds.includes(p.id))
      .slice(0, 4);
  }, [cartItems, allProducts]);

  if (cartItems.length === 0) {
    return (
      <main className="page">
        <div className="container">
          <EmptyCart suggestedProducts={suggestedProducts} />
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Shopping Cart</h1>
        <StepNav current="cart" />

        <div className="cart-layout">
          <div className="cart-items">
            <CartList items={cartItems} />
          </div>

          <div className="cart-sidebar">
            <CartSummary
              subtotal={cartSummary.subtotal}
              deliveryFee={cartSummary.deliveryFee}
              discount={cartSummary.discount}
              total={cartSummary.total}
              itemCount={cartSummary.itemCount}
            />
          </div>
        </div>
      </div>

      <SimilarProducts products={suggestedProducts} />
    </main>
  );
};

export default CartPage;
