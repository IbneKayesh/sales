import { useState, useCallback } from "react";

const generateId = () => `row_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

const TAX_RATE = 0.05; // 5%

const PAYMENT_TERMS = [
  { label: "Cash on Delivery", value: "COD" },
  { label: "Net 15", value: "NET15" },
  { label: "Net 30", value: "NET30" },
  { label: "Net 60", value: "NET60" },
  { label: "Advance", value: "ADVANCE" },
];

const STATUS_OPTIONS = [
  { label: "Pending", value: "pending" },
  { label: "Work In Progress", value: "wip" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled" },
];

const useInquiry = () => {
  // ─── Reference lists ───────────────────────────────────────────────────────
  const [buyerList] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", phone: "0123456789" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", phone: "0987654321" },
    { id: 3, name: "Acme Corporation", email: "acme@example.com", phone: "01711000000" },
  ]);

  const [buyerAddressList] = useState([
    { id: 1, buyerId: 1, address: "123 Main Street", city: "Dhaka", country: "Bangladesh" },
    { id: 2, buyerId: 1, address: "45 Lake Road", city: "Sylhet", country: "Bangladesh" },
    { id: 3, buyerId: 2, address: "456 Market Road", city: "Chittagong", country: "Bangladesh" },
    { id: 4, buyerId: 3, address: "78 Industrial Zone", city: "Gazipur", country: "Bangladesh" },
  ]);

  const [productList] = useState([
    { id: 1, name: "T-Shirt", price: 800, unitId: 1 },
    { id: 2, name: "Polo Shirt", price: 1200, unitId: 1 },
    { id: 3, name: "Pant", price: 1500, unitId: 1 },
    { id: 4, name: "Jacket", price: 3500, unitId: 1 },
    { id: 5, name: "Fabric Roll", price: 250, unitId: 2 },
  ]);

  const [unitList] = useState([
    { id: 1, name: "Piece", shortName: "pc" },
    { id: 2, name: "Kilogram", shortName: "kg" },
    { id: 3, name: "Metre", shortName: "m" },
  ]);

  const [currencyList] = useState([
    { id: 1, code: "BDT", name: "Bangladeshi Taka" },
    { id: 2, code: "USD", name: "US Dollar" },
    { id: 3, code: "EUR", name: "Euro" },
  ]);

  const [attributeMasterList] = useState([
    { id: 1, name: "Color", options: ["Red", "Blue", "Green", "Black", "White", "Yellow"] },
    { id: 2, name: "Size", options: ["XS", "S", "M", "L", "XL", "XXL"] },
    { id: 3, name: "Material", options: ["Cotton", "Polyester", "Wool", "Linen", "Silk"] },
    { id: 4, name: "Finish", options: ["Matte", "Glossy", "Satin"] },
  ]);

  // ─── Core form state ────────────────────────────────────────────────────────
  const today = new Date();

  const [inquiry, setInquiry] = useState({
    id: null,
    inquiry_no: "",
    inquiry_date: today,
    required_date: today,
    buyer_id: null,
    inquiry_status: "pending",
    inquiry_note: "",
    inquiry_value: 0,
    reference_no: "",
    currency_id: 1,
    order_group_id: null,
    payment_terms: "NET30",
  });

  const [inquiryDetails, setInquiryDetails] = useState([]);
  // keyed by detailRowId
  const [inquiryDetailsAttributes, setInquiryDetailsAttributes] = useState({});

  const [isLocked, setIsLocked] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // ─── Derived / computed ─────────────────────────────────────────────────────
  const subtotal = inquiryDetails.reduce((sum, row) => {
    const qty = parseFloat(row.inquiry_qty) || 0;
    const price = parseFloat(row.inquiry_price) || 0;
    const discount = parseFloat(row.discount) || 0;
    return sum + qty * price * (1 - discount / 100);
  }, 0);

  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  const filteredAddresses = buyerAddressList.filter(
    (a) => a.buyerId === inquiry.buyer_id
  );

  // ─── Master handlers ────────────────────────────────────────────────────────
  const handleChange = useCallback((field, value) => {
    setInquiry((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });
  }, []);

  // ─── Detail handlers ────────────────────────────────────────────────────────
  const handleDetailChange = useCallback((rowId, field, value) => {
    setInquiryDetails((prev) =>
      prev.map((row) => {
        if (row._rowId !== rowId) return row;
        const updated = { ...row, [field]: value };
        // Auto-fill unit and price when product changes
        if (field === "product_id") {
          const product = productList.find((p) => p.id === value);
          if (product) {
            updated.unit_id = product.unitId;
            updated.inquiry_price = product.price;
          }
        }
        return updated;
      })
    );
  }, [productList]);

  const handleAddInquiryDetails = useCallback(() => {
    const newRow = {
      _rowId: generateId(),
      id: null,
      inquiry_id: inquiry.id,
      product_id: null,
      unit_id: null,
      inquiry_qty: 1,
      inquiry_price: 0,
      discount: 0,
      required_date: today,
      delivery_address_id: null,
    };
    setInquiryDetails((prev) => [...prev, newRow]);
  }, [inquiry.id]);

  const handleDeleteInquiryDetails = useCallback((rowId) => {
    setInquiryDetails((prev) => prev.filter((r) => r._rowId !== rowId));
    setInquiryDetailsAttributes((prev) => {
      const updated = { ...prev };
      delete updated[rowId];
      return updated;
    });
  }, []);

  // ─── Attribute handlers ─────────────────────────────────────────────────────
  const handleAddInquiryDetailsAttributes = useCallback((detailRowId) => {
    const newAttr = {
      _attrId: generateId(),
      id: null,
      inquiry_details_id: detailRowId,
      attributes_id: null,
      attributes_value: "",
    };
    setInquiryDetailsAttributes((prev) => ({
      ...prev,
      [detailRowId]: [...(prev[detailRowId] || []), newAttr],
    }));
  }, []);

  const handleAttributeChange = useCallback((detailRowId, attrId, field, value) => {
    setInquiryDetailsAttributes((prev) => ({
      ...prev,
      [detailRowId]: (prev[detailRowId] || []).map((attr) =>
        attr._attrId === attrId ? { ...attr, [field]: value } : attr
      ),
    }));
  }, []);

  const handleDeleteInquiryDetailsAttributes = useCallback((detailRowId, attrId) => {
    setInquiryDetailsAttributes((prev) => ({
      ...prev,
      [detailRowId]: (prev[detailRowId] || []).filter((a) => a._attrId !== attrId),
    }));
  }, []);

  // ─── Lock / Unlock ──────────────────────────────────────────────────────────
  const handleToggleLock = useCallback(() => {
    setIsLocked((prev) => !prev);
  }, []);

  // ─── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const errs = {};
    if (!inquiry.buyer_id) errs.buyer_id = "Buyer is required.";
    if (!inquiry.inquiry_date) errs.inquiry_date = "Order date is required.";
    if (inquiryDetails.length === 0) errs.details = "At least one item is required.";
    inquiryDetails.forEach((row, i) => {
      if (!row.product_id) errs[`detail_product_${i}`] = "Product required.";
      if (!row.inquiry_qty || row.inquiry_qty <= 0)
        errs[`detail_qty_${i}`] = "Qty must be > 0.";
    });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // ─── Save / Submit ──────────────────────────────────────────────────────────
  const handleSave = useCallback(() => {
    if (!validate()) return;
    setLoading(true);
    // Simulate API save
    setTimeout(() => {
      setInquiry((prev) => ({
        ...prev,
        inquiry_no: prev.inquiry_no || `INQ-${Date.now().toString().slice(-6)}`,
      }));
      setLoading(false);
      alert("Inquiry saved successfully!");
    }, 800);
  }, [inquiry, inquiryDetails]);

  const handleSubmit = useCallback(() => {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setInquiry((prev) => ({
        ...prev,
        inquiry_status: "wip",
        inquiry_no: prev.inquiry_no || `INQ-${Date.now().toString().slice(-6)}`,
      }));
      setIsLocked(true);
      setLoading(false);
      alert("Inquiry submitted and locked!");
    }, 800);
  }, [inquiry, inquiryDetails]);

  const handleCancel = useCallback(() => {
    if (window.confirm("Discard all changes?")) {
      setInquiry({
        id: null,
        inquiry_no: "",
        inquiry_date: today,
        required_date: today,
        buyer_id: null,
        inquiry_status: "pending",
        inquiry_note: "",
        inquiry_value: 0,
        reference_no: "",
        currency_id: 1,
        order_group_id: null,
        payment_terms: "NET30",
      });
      setInquiryDetails([]);
      setInquiryDetailsAttributes({});
      setErrors({});
      setIsLocked(false);
    }
  }, []);

  return {
    // state
    inquiry,
    inquiryDetails,
    inquiryDetailsAttributes,
    isLocked,
    errors,
    loading,
    // reference data
    buyerList,
    buyerAddressList,
    filteredAddresses,
    productList,
    unitList,
    currencyList,
    attributeMasterList,
    // constants
    PAYMENT_TERMS,
    STATUS_OPTIONS,
    // computed
    subtotal,
    tax,
    grandTotal,
    TAX_RATE,
    // handlers
    handleChange,
    handleDetailChange,
    handleAddInquiryDetails,
    handleDeleteInquiryDetails,
    handleAddInquiryDetailsAttributes,
    handleAttributeChange,
    handleDeleteInquiryDetailsAttributes,
    handleToggleLock,
    handleSave,
    handleSubmit,
    handleCancel,
  };
};

export default useInquiry;
