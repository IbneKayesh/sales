import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CustomerInformation from '@/components/checkout/CustomerInformation';
import DeliveryInformation from '@/components/checkout/DeliveryInformation';
import BillingInformation from '@/components/checkout/BillingInformation';
import OrderSummary from '@/components/checkout/OrderSummary';
import StepNav from '@/components/common/StepNav';
import { calculateCart } from '@/utils/calculateCart';
import { generateOrderId } from '@/utils/generateOrderId';
import { getVendorById, PAYMENT_METHOD_LABELS } from '@/data/vendors';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const {
    cartItems, selectedItems, selectedByVendor, clearCart,
    vendorCoupons, getVendorDiscount, totalDeliveryFee,
    getVendorDelivery, getVendorDeliveryMethod, getVendorPaymentMethod
  } = useCart();
  const { setUser } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
    sameAsDelivery: true,
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingPostalCode: ''
  });

  const [errors, setErrors] = useState({});
  const orderPlacedRef = useRef(false);

  const totalVendorDiscount = useMemo(() => {
    return selectedByVendor.reduce((sum, group) => {
      return sum + getVendorDiscount(group.vendorId, group.subtotal);
    }, 0);
  }, [selectedByVendor, getVendorDiscount, vendorCoupons]);

  const cartSummary = useMemo(() => {
    return calculateCart(selectedItems, totalDeliveryFee, totalVendorDiscount);
  }, [selectedItems, totalDeliveryFee, totalVendorDiscount]);

  useEffect(() => {
    document.title = 'Checkout | ShopEasy';
  }, []);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Delivery address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.sameAsDelivery) {
      if (!formData.billingName.trim()) newErrors.billingName = 'Billing name is required';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Billing address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'Billing city is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (selectedItems.length === 0) return;

    const orderId = generateOrderId();

    const billingAddress = formData.sameAsDelivery
      ? { name: formData.fullName, address: formData.address, city: formData.city, postalCode: formData.postalCode }
      : { name: formData.billingName, address: formData.billingAddress, city: formData.billingCity, postalCode: formData.billingPostalCode };

    const vendorOrders = selectedByVendor.map(group => {
      const vendorDiscount = getVendorDiscount(group.vendorId, group.subtotal);
      const methodId = getVendorDeliveryMethod(group.vendorId);
      const vendorDelivery = getVendorDelivery(group.vendorId, group.subtotal);
      const paymentMethodId = getVendorPaymentMethod(group.vendorId);
      const coupon = vendorCoupons[group.vendorId];
      const vendor = group.vendor;
      const deliveryMethod = vendor?.deliveryMethods?.find(m => m.id === methodId);

      return {
        vendorOrderId: generateOrderId(),
        vendorId: group.vendorId,
        vendorName: vendor?.name || 'Seller',
        items: group.items,
        subtotal: group.subtotal,
        discount: vendorDiscount,
        deliveryFee: vendorDelivery,
        deliveryMethod: deliveryMethod ? { name: deliveryMethod.name, description: deliveryMethod.description } : null,
        paymentMethod: paymentMethodId,
        paymentMethodLabel: PAYMENT_METHOD_LABELS[paymentMethodId] || paymentMethodId,
        couponCode: coupon?.code || null,
        couponLabel: coupon?.discount?.label || null,
        total: Math.max(0, group.subtotal - vendorDiscount + vendorDelivery)
      };
    });

    const orderData = {
      orderId,
      items: selectedItems,
      vendorOrders,
      customer: {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email
      },
      delivery: {
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        instructions: formData.deliveryInstructions
      },
      billing: billingAddress,
      subtotal: cartSummary.subtotal,
      deliveryFee: cartSummary.deliveryFee,
      discount: cartSummary.discount,
      total: cartSummary.total
    };

    setUser({
      name: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      city: formData.city,
      postalCode: formData.postalCode,
      isGuest: false
    });

    orderPlacedRef.current = true;
    clearCart();
    navigate('/order-confirmation', { state: { orderData } });
  };

  if (selectedItems.length === 0 && !orderPlacedRef.current) {
    navigate('/cart');
    return null;
  }

  return (
    <main className="page">
      <div className="container">
        <h1 className="page-title">Checkout</h1>
        <StepNav current="checkout" />

        <form onSubmit={handleSubmit} className="checkout-layout">
          <div className="checkout-form">
            <CustomerInformation
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
            <DeliveryInformation
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
            <BillingInformation
              formData={formData}
              errors={errors}
              onChange={handleChange}
            />
          </div>

          <div className="checkout-sidebar">
            <OrderSummary
              cartItems={selectedItems}
              subtotal={cartSummary.subtotal}
              deliveryFee={cartSummary.deliveryFee}
              discount={cartSummary.discount}
              total={cartSummary.total}
            />

            <button type="submit" className="btn btn-primary checkout-submit">
              Place Order - {cartSummary.total > 0 ? `$${cartSummary.total.toFixed(2)}` : ''}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
};

export default CheckoutPage;
