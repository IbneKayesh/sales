import { useState, useEffect } from "react";
import { productsAPI } from "@/api/inventory/productsAPI";
import validate from "@/models/validator";
import t_products from "@/models/inventory/t_products.json";
import { generateGuid } from "@/utils/guid";

const dataModel = {
  product_id: "",
  product_code: "",
  product_name: "",
  product_desc: "",
  category_id: "",
  small_unit_id: "",
  unit_difference_qty: 1,
  large_unit_id: "",
  stock_qty: 0,
  purchase_price: 0,
  sales_price: 0,
  discount_percent: 0,
  vat_percent: 0,
  cost_price_percent: 5,
  margin_price: 0,
  purchase_booking_qty: 0,
  sales_booking_qty: 0,
  shop_id: "",
  edit_stop: 0,
};

export const useProducts = () => {
  const [productList, setProductList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(dataModel);
  const [selectedFilter, setSelectedFilter] = useState("allproducts");
  const [filterOptions, setFilterOptions] = useState([
    { label: "Default", value: "default" },
    { label: "In Stock", value: "stock" },
    { label: "Nill Stock", value: "nstock" },
    { label: "No Purchase Price", value: "nopp" },
    { label: "No Sale Price", value: "nosp" },
    { label: "With Discount", value: "wd" },
    { label: "Without Discount", value: "wod" },
    { label: "With VAT", value: "wvat" },
    { label: "Without VAT", value: "wovat" },
    { label: "All Products", value: "allproducts" },
  ]);

  const [selectedItemLedger, setSelectedItemLedger] = useState([]);

  const handleLoadProductLedger = async (rowData) => {
    setSelectedItemLedger([]);
    try {
      const data = await productsAPI.getProductLedger(rowData.product_id);
      //console.log("data: " + JSON.stringify(data));
      setSelectedItemLedger(data);
    } catch (error) {
      console.error("Error loading product ledger:", error);
    }
  };

  const loadProducts = async (filter = "default") => {
    try {
      console.log("filter: " + filter);
      let response;
      if (filter == "po2so") {
        response = await productsAPI.getAllPo2So(filter);
        // response = { message, data }
        setProductList(response.data);
      } else {
        response = await productsAPI.getAll(filter);
        // response = { message, data }
        setProductList(response.data);
      }
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message,
      });
    } catch (error) {
      console.error("Error loading data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to load data",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadProducts(selectedFilter);
  }, [selectedFilter]);

  const fetchBookingProductList = async () => {
    const data = await productsAPI.getAllBooking();
    //console.log("data: " + JSON.stringify(data));
    setProductList(data);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate({ ...formData, [field]: value }, t_products);
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormData(dataModel);
    setErrors({});
  };

  const handleCancel = () => {
    handleClear();
    setCurrentView("list");
  };

  const handleAddNew = () => {
    handleClear();
    setCurrentView("form");
  };

  const handleEditProduct = (product) => {
    //console.log("product: " + JSON.stringify(product));
    setFormData(product);
    setCurrentView("form");
  };

  const handleDeleteProduct = async (rowData) => {
      try {
      // Call API, unwrap { message, data }
      const response = await productsAPI.delete(rowData);

      const updatedList = productList.filter((p) => p.product_id !== rowData.product_id);
      setProductList(updatedList);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: response.message || "Deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to delete data",
      });
    }
  };

  const handleRefresh = () => {
    loadProducts(true);
  };

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      setIsBusy(true);
      // Validate form
      const newErrors = validate(formData, t_products);
      setErrors(newErrors);
      console.log("handleSaveProduct: " + JSON.stringify(formData));

      const { small_unit_id, large_unit_id, unit_difference_qty } = formData;

      if (small_unit_id === large_unit_id && unit_difference_qty > 1) {
        setToastBox({
          severity: "warn",
          summary: "Warning",
          detail:
            "If Small Unit and Large Unit are the same, Unit Difference Qty must be 1.",
        });
        setIsBusy(false);
        return;
      } else if (small_unit_id !== large_unit_id && unit_difference_qty < 2) {
        setToastBox({
          severity: "warn",
          summary: "Warning",
          detail:
            "If Small Unit and Large Unit are different, Unit Difference Qty must be greater than 1.",
        });
        setIsBusy(false);
        return;
      }

      if (Object.keys(newErrors).length > 0) {
        setIsBusy(false);
        return;
      }

      // ---- Calculate profit before save ----
      const approxProfit = calculateApproxMargin(formData);

      // Ensure product_id exists (for create)
      const formDataNew = {
        ...formData,
        product_id: formData.product_id || generateGuid(),
        margin_price: approxProfit,
      };

      // console.log("formDataNew: " + JSON.stringify(formDataNew));
      // return;

      // Call API and get { message, data }
      let response;
      if (formData.product_id) {
        response = await productsAPI.update(formDataNew);
      } else {
        response = await productsAPI.create(formDataNew);
      }
      //console.log("response: " + JSON.stringify(response));

      // Update toast using API message
      setToastBox({
        severity: "success",
        summary: "Success",
        detail: response.message || "Operation successful",
      });

      handleClear();
      setCurrentView("list");
      loadProducts();
    } catch (error) {
      console.error("Error saving data:", error);

      setToastBox({
        severity: "error",
        summary: "Error",
        detail: error?.message || "Failed to save data",
      });
    } finally {
      setIsBusy(false);
    }
  };

  const calculateApproxMargin = (item) => {
    const discount_amount = item.sales_price * (item.discount_percent / 100);
    const net_sales_price = item.sales_price - discount_amount;

    const extra_cost_amount =
      item.sales_price * (item.cost_price_percent / 100);

    const approxMargin =
      net_sales_price - (item.purchase_price + extra_cost_amount);

    return approxMargin;
  };

  const calculateApproxMargin_2 = (item) => {
    const discount_amount = item.sales_price * (item.discount_percent / 100);
    const vat_amount = item.sales_price * (item.vat_percent / 100);
    const cost_amount = item.sales_price * (item.cost_price_percent / 100);

    const approxMargin =
      item.sales_price +
      vat_amount -
      (item.purchase_price + discount_amount + cost_amount);
    return approxMargin;
  };

  return {
    productList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formData,
    selectedFilter,
    setSelectedFilter,
    filterOptions,
    handleChange,
    handleCancel,
    handleAddNew,
    handleEditProduct,
    handleDeleteProduct,
    handleRefresh,
    handleSaveProduct,
    handleFilterChange,
    handleLoadProductLedger,
    selectedItemLedger,
    fetchBookingProductList,
  };
};
