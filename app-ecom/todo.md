# E-commerce App - Todo List

## Phase 1: Project Setup & Structure
- [ ] 1.1 Create project folder structure (components, pages, context, hooks, data, styles, utils)
- [ ] 1.2 Install react-router-dom for routing
- [ ] 1.3 Set up CSS variables and global styles

## Phase 2: Static Data & Custom Hooks
- [ ] 2.1 Create mock data: products.js (15+ products, 5+ categories)
- [ ] 2.2 Create mock data: categories.js (5+ categories)
- [ ] 2.3 Create mock data: reviews.js (multiple reviews per product)
- [ ] 2.4 Create mock data: deliveryOptions.js (2+ options)
- [ ] 2.5 Create custom hooks: useProducts, useProduct, useCategories, useReviews, useDeliveryOptions

## Phase 3: Context Providers
- [ ] 3.1 Create AuthContext (user, isAuthenticated, isGuest, clearSession)
- [ ] 3.2 Create CartContext (cartItems, addToCart, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount)

## Phase 4: Utility Functions
- [ ] 4.1 Create formatCurrency.js
- [ ] 4.2 Create calculateCart.js
- [ ] 4.3 Create generateOrderId.js

## Phase 5: Layout Components
- [ ] 5.1 Create Header component (logo, nav, cart icon with count, mobile nav)
- [ ] 5.2 Create Footer component

## Phase 6: Home Page
- [ ] 6.1 Create CategoryCard component
- [ ] 6.2 Create CategoryList component
- [ ] 6.3 Create ProductCard component (image, name, desc, price, discount, rating, add-to-cart)
- [ ] 6.4 Create ProductGrid component
- [ ] 6.5 Assemble Home page

## Phase 7: Product Details Page
- [ ] 7.1 Create ProductGallery component
- [ ] 7.2 Create QuantitySelector component
- [ ] 7.3 Create ProductActions component (add to cart, buy now)
- [ ] 7.4 Create ProductDetails component
- [ ] 7.5 Create SuggestedProducts component
- [ ] 7.6 Create ReviewCard and ReviewList components
- [ ] 7.7 Assemble ProductDetails page

## Phase 8: Cart Page
- [ ] 8.1 Create CartItem component
- [ ] 8.2 Create CartList component
- [ ] 8.3 Create CartSummary component
- [ ] 8.4 Create EmptyCart component
- [ ] 8.5 Create SimilarProducts component
- [ ] 8.6 Assemble Cart page

## Phase 9: Checkout Flow
- [ ] 9.1 Create CustomerInformation form component
- [ ] 9.2 Create DeliveryInformation component
- [ ] 9.3 Create BillingInformation component (with same-as-delivery option)
- [ ] 9.4 Create OrderSummary component
- [ ] 9.5 Create PaymentSelection component (COD, Card demo)
- [ ] 9.6 Assemble Checkout page

## Phase 10: Order Confirmation Page
- [ ] 10.1 Create OrderConfirmation page (success message, order details, items, delivery, billing, payment, total)

## Phase 11: Routing
- [ ] 11.1 Set up React Router with all routes (/, /product/:id, /cart, /checkout, /order-confirmation)
- [ ] 11.2 Handle invalid routes and product IDs

## Phase 12: App Assembly
- [ ] 12.1 Wrap App with Context Providers (AuthContext, CartContext)
- [ ] 12.2 Integrate Router in App.jsx
- [ ] 12.3 Final cleanup and responsive testing

## Phase 13: Polish & Accessibility
- [ ] 13.1 Ensure semantic HTML throughout
- [ ] 13.2 Add proper labels, alt text, focus states
- [ ] 13.3 Test and fix responsive design
- [ ] 13.4 Final review and cleanup
