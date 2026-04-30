import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";

import "./CartComp.css";

const CartComp = ({
  currencyIcon,
  dataListCustomers = [],
  selectedCustomer,
  onCustomerChange,
  dataListCart,
  onClearCart,
  onRemove,
  onUpdateQty,
  onCheckout,
  viewMode,
  onHoldInvoice,
  heldInvoices,
  onViewHeldInvoices,
}) => {
  let subtotal = 0;
  let totalVAT = 0;
  let totalDiscount = 0;

  dataListCart.forEach((item) => {
    const qty = item.qty || 1;
    const price = item.amim_mrpp || 0;
    const taxr = item.amim_pvat || item.amim_pexc || 0;
    const dscp = item.pldt_dfds || 0;

    const itemSubtotal = price * qty;
    const itemDiscount = price * (dscp / 100) * qty;
    const itemTax = (price - price * (dscp / 100)) * (taxr / 100) * qty;

    subtotal += itemSubtotal;
    totalDiscount += itemDiscount;
    totalVAT += itemTax;
  });

  const totalPrice = subtotal - totalDiscount + totalVAT;

  const totalQty = dataListCart.reduce((total, item) => total + item.qty, 0);

  const customer_VT = (option, props) => {
    if (option) {
      return (
        <div className="flex align-items-center">
          <div className="font-bold">
            ({option.site_code}) {option.site_name},{" "}
            <span className="text-red-500">
              {currencyIcon} {option.site_blnc}
            </span>
          </div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const customer_IT = (option) => {
    return (
      <div className="flex align-items-center">
        <div className="flex flex-column">
          <span className="font-bold">
            ({option.site_code}) {option.site_name}
          </span>
          <small className="text-gray-500">Owner: {option.site_ownm}</small>
          <small className="text-gray-500">Mobile: {option.site_mob1}</small>
          <small className="text-gray-500">Address: {option.site_adrs}</small>
          <small className="text-red-500">
            Balance: {currencyIcon} {option.site_blnc}
          </small>
        </div>
      </div>
    );
  };
  
  return (
    <div className="cart-comp">
      <div className="cart-header">
        <h3>Total Items ({totalQty})</h3>
        <div className="flex align-items-center gap-3">
          {heldInvoices && heldInvoices.length > 0 && (
            <span
              className="pi pi-shopping-bag ml-1 text-xs bg-green-200 text-green-700 px-3 py-2 border-round-3xl cursor-pointer"
              onClick={onViewHeldInvoices}
              title={`View ${heldInvoices.length} held invoices`}
            >
              <span className="ml-1">{heldInvoices.length}</span>
            </span>
          )}
          <span
            className={`pi pi-trash text-lg text-red-500 cursor-pointer clear-cart ${viewMode === "checkout" ? "hidden" : ""}`}
            onClick={() => onClearCart()}
          ></span>
        </div>
      </div>

      <div className="cart-customer">
        {/* {JSON.stringify(selectedCustomer)} */}
        <Dropdown
          value={selectedCustomer}
          onChange={(e) => onCustomerChange(e.value)}
          options={dataListCustomers}
          optionLabel="site_name"
          placeholder="Select a Customer"
          filter
          valueTemplate={customer_VT}
          itemTemplate={customer_IT}
          className="w-full"
          disabled={viewMode === "checkout"}
        />
      </div>

      <div className="cart-items">
        {dataListCart.length === 0 ? (
          <div className="empty-cart">No items in cart</div>
        ) : (
          dataListCart.map((item) => {
            const qty = item.qty || 1;
            const price = item.amim_mrpp || 0;
            const itemSubtotal = price * qty;

            return (
              <div key={item.amim_id} className="cart-item">
                <div className="item-details">
                  <div className="item-name">{item.amim_name}</div>
                  <div className="item-inline-details">
                    <span className="inline-detail">
                      Unit: {item.runt_name || "N/A"}
                    </span>
                    <span className="inline-detail">
                      Price: {currencyIcon} {price}
                    </span>
                    <span className="inline-detail">
                      Tax: {item.amim_pvat || item.amim_pexc || 0}%
                    </span>
                    <span className="inline-detail">
                      Disc: {item.pldt_dfds || 0}%
                    </span>
                  </div>
                </div>
                <div className="item-actions">
                  <input
                    type="number"
                    className="qty-input"
                    value={qty}
                    min="1"
                    onChange={(e) => onUpdateQty(item.amim_id, e.target.value)}
                  />
                  <span className="item-subtotal">
                    {currencyIcon} {itemSubtotal.toFixed(2)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => onRemove(item.amim_id)}
                  >
                    &times;
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="cart-footer">
        <div className="cart-summary-line">
          <span>Subtotal:</span>
          <span>
            {currencyIcon} {subtotal.toFixed(2)}
          </span>
        </div>
        <div className="cart-summary-line">
          <span>Total VAT:</span>
          <span>
            {currencyIcon} {totalVAT.toFixed(2)}
          </span>
        </div>
        <div className="cart-summary-line">
          <span>Total Discount:</span>
          <span>
            -{currencyIcon} {totalDiscount.toFixed(2)}
          </span>
        </div>
        <div className="cart-total">
          <span>Total Price:</span>
          <span>
            {currencyIcon} {totalPrice.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2 w-full mt-3">
          <Button
            label={`${viewMode === "products" ? "Checkout" : "Add More"}`}
            icon={`pi ${viewMode === "products" ? "pi-check-circle" : "pi-cart-plus"}`}
            className={`checkout-btn flex-1 ${viewMode === "checkout" ? "add-more" : ""}`}
            onClick={onCheckout}
            disabled={dataListCart.length === 0}
          />
          {viewMode === "products" && (
            <Button
              label="Hold"
              icon="pi pi-pause"
              severity="warning"
              className="flex-2"
              onClick={onHoldInvoice}
              disabled={dataListCart.length === 0}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default CartComp;
