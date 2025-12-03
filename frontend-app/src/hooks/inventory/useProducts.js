import { useState, useEffect } from "react";
import { productsAPI } from "@/api/inventory/productsAPI";
import validate from "@/models/validator";
import t_products from "@/models/inventory/t_products.json";
import { generateGuid } from "@/utils/guid";

export const useProducts = () => {
  const [productList, setProductList] = useState([]);
  const [toastBox, setToastBox] = useState(null);
  const [isBusy, setIsBusy] = useState(false);
  const [currentView, setCurrentView] = useState("list"); // 'list' or 'form'
  const [errors, setErrors] = useState({});
  const [formDataProduct, setFormDataProduct] = useState({
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
    margin_price: 0,
    ismodified: "0",
  });
  const [selectedFilter, setSelectedFilter] = useState("default");
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
  const loadProducts = async (filter = "default", resetModified = false) => {
    try {
      console.log("filter: " + filter);
      if (filter == "po2so") {
        const data = await productsAPI.getAllPo2So(filter);
        console.log("po2so data: " + JSON.stringify(data));
        setProductList(data);
      } else {
        const data = await productsAPI.getAll(filter);
        console.log("data: " + JSON.stringify(data));
        setProductList(data);
      }
      if (resetModified) {
        setToastBox({
          severity: "info",
          summary: "Refreshed",
          detail: "Data refreshed from database.",
        });
      }
    } catch (error) {
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: resetModified
          ? "Failed to refresh data from server"
          : "Failed to load data from server",
      });
    }
  };

  //Fetch data from API on mount
  useEffect(() => {
    loadProducts(selectedFilter);
  }, [selectedFilter]);

  const handleChange = (field, value) => {
    setFormDataProduct((prev) => ({ ...prev, [field]: value }));
    const newErrors = validate(
      { ...formDataProduct, [field]: value },
      t_products
    );
    setErrors(newErrors);
  };

  const handleClear = () => {
    setFormDataProduct({
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
      margin_price: 0,
      ismodified: "0",
    });
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
    setFormDataProduct(product);
    setCurrentView("form");
  };

  const handleDeleteProduct = async (rowData) => {
    try {
      //console.log("rowData " + JSON.stringify(rowData))
      await productsAPI.delete(rowData);
      const updatedProducts = productList.filter(
        (p) => p.product_id !== rowData.product_id
      );
      setProductList(updatedProducts);

      setToastBox({
        severity: "info",
        summary: "Deleted",
        detail: `Deleted successfully.`,
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to delete product",
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
    setIsBusy(true);

    const newErrors = validate(formDataProduct, t_products);
    setErrors(newErrors);
    console.log("handleSaveProduct: " + JSON.stringify(formDataProduct));

    const { small_unit_id, large_unit_id, unit_difference_qty } =
      formDataProduct;

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

    try {
      let updatedProducts;

      // ---- Calculate profit before save ----
      const approxProfit = calculateApproxProfit(formDataProduct);

      // Build data object with profit included
      const productData = {
        ...formDataProduct,
        margin_price: approxProfit,
      };

      if (formDataProduct.product_id) {
        // Edit existing
        const updatedProductData = {
          ...productData
        };

        const updatedProduct = await productsAPI.update(updatedProductData);
        updatedProduct.ismodified = "1";
        updatedProducts = productList.map((p) =>
          p.product_id === formDataProduct.product_id ? updatedProduct : p
        );

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataProduct.product_name}" updated successfully.`,
        });
      } else {
        // Add new
        const newProductData = {
          ...productData,
          product_id: generateGuid(),
        };
        //console.log("newProductData: " + JSON.stringify(newProductData));

        const newProduct = await productsAPI.create(newProductData);
        newProduct.ismodified = "1";
        updatedProducts = [...productList, newProduct];

        setToastBox({
          severity: "success",
          summary: "Success",
          detail: `"${formDataProduct.product_name}" added successfully.`,
        });
      }
      setProductList(updatedProducts);

      handleClear();
      setCurrentView("list");
    } catch (error) {
      console.error("Error saving product:", error);
      setToastBox({
        severity: "error",
        summary: "Error",
        detail: "Failed to save product",
      });
    }

    setIsBusy(false);
  };

  const calculateApproxProfit = (item) => {
    const purchase = Number(item.purchase_price || 0);
    const sales = Number(item.sales_price || 0);
    const discountPercent = Number(item.discount_percent || 0);

    // Discount is applied on SALES price
    const discountAmount = sales * (discountPercent / 100);

    //apply VAT on sales price
    const vatAmount = sales * (vatPercent / 100);

    // Final selling price after discount
    const finalSellingPrice = sales - discountAmount;

    // Profit = final selling price - purchase price
    const approxProfit = finalSellingPrice - purchase;

    return approxProfit;
  };

  return {
    productList,
    toastBox,
    isBusy,
    currentView,
    errors,
    formDataProduct,
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
  };
};
