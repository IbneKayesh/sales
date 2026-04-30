import { useState } from "react";
import usePOS from "@/hooks/sales/usePOS";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import CartComp from "./CartComp";
import PaymComp from "./PaymComp";
import ProductsComp from "./ProductsComp";
import PrintComp from "./PrintComp";
import HeldInvComp from "./HeldInvComp";
import "./ProductsComp.css";
import "./CartComp.css";
import "./PaymComp.css";

const PosPage = () => {
  const [showHeldInvoices, setShowHeldInvoices] = useState(false);

  const {
    //hooks
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    dataListCategory,
    selectedCategory,
    dataListProduct,
    dataListProductTemp,
    dataListCustomers,
    selectedCustomer,
    setSelectedCustomer,
    dataListCart,
    currencyIcon,
    paymentDetails,
    paymentAmount,
    paymentModes,
    heldInvoices,
    //functions
    addToCart,
    handleClearCart,
    removeFromCart,
    updateCartQuantity,
    handleSearchChange,
    handleCheckoutClick,
    handleCategoryClick,
    handleChange,
    handleAddNewClick,
    handleSubmitClick,
    handleChangePayment,
    handleHoldInvoice,
    handleOpenHeldInvoice,
    handleClearHeldInvoice,
  } = usePOS();

  return (
    <div className="pos-container">
      {/* {JSON.stringify(paymentDetails)} */}
      {crView === "products" ? (
        <>
          <div className="pos-left-side">
            <ProductsComp
              currencyIcon={currencyIcon}
              dataListCategory={dataListCategory}
              dataListProduct={dataListProductTemp}
              dataListCart={dataListCart}
              activeCategory={selectedCategory}
              onCategoryClick={handleCategoryClick}
              onProductClick={addToCart}
              onBarcodeSearch={handleSearchChange}
            />
          </div>

          <div className="pos-right-side">
            <CartComp
              currencyIcon={currencyIcon}
              dataListCustomers={dataListCustomers}
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
              dataListCart={dataListCart}
              onClearCart={handleClearCart}
              onRemove={removeFromCart}
              onUpdateQty={updateCartQuantity}
              onCheckout={handleCheckoutClick}
              viewMode={crView}
              onHoldInvoice={handleHoldInvoice}
              heldInvoices={heldInvoices}
              onViewHeldInvoices={() => setShowHeldInvoices(true)}
            />
          </div>
        </>
      ) : crView === "checkout" || crView === "print" ? (
        <>
          <div className="pos-checkout-left">
            <CartComp
              currencyIcon={currencyIcon}
              dataListCustomers={dataListCustomers}
              selectedCustomer={selectedCustomer}
              onCustomerChange={setSelectedCustomer}
              dataListCart={dataListCart}
              onClearCart={handleClearCart}
              onRemove={removeFromCart}
              onUpdateQty={updateCartQuantity}
              onCheckout={handleCheckoutClick}
              viewMode={crView === "print" ? "checkout" : crView}
              onHoldInvoice={handleHoldInvoice}
              heldInvoices={heldInvoices}
              onViewHeldInvoices={() => setShowHeldInvoices(true)}
            />
          </div>

          <div className="pos-checkout-right">
            <PaymComp
              currencyIcon={currencyIcon}
              formData={paymentDetails}
              onChange={handleChangePayment}
              onSubmitClick={handleSubmitClick}
              paymentModes={paymentModes}
            />
          </div>

          {crView === "print" && (
            <PrintComp
              currencyIcon={currencyIcon}
              selectedCustomer={selectedCustomer}
              dataListCart={dataListCart}
              paymentDetails={paymentDetails}
              onClose={handleCheckoutClick}
            />
          )}
        </>
      ) : null}

      <HeldInvComp
        currencyIcon={currencyIcon}
        showHeldInvoices={showHeldInvoices}
        setShowHeldInvoices={setShowHeldInvoices}
        heldInvoices={heldInvoices}
        onOpenHeldInvoice={handleOpenHeldInvoice}
        onClearHeldInvoice={handleClearHeldInvoice}
      />
    </div>
  );
};

export default PosPage;
