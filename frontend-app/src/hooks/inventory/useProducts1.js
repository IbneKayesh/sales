import { useState, useEffect } from "react";
import { productsAPI } from "@/api/inventory/productsAPI";

export const useProducts1 = () => {
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


  return {
    productList,
    toastBox,
  };
};
