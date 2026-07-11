import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "@/utils/api";
import { useUI } from "@/pages/context/UIContext";
import {
  getStorageData,
  setStorageData,
  clearStorageData,
} from "@/utils/storage";

const useShopping = () => {
  const navigate = useNavigate();
  const { showToast, setIsBusy, isBusy } = useUI();

  const [crTitle, setCrTitle] = useState("Login");
  const [crView, setCrView] = useState("LOGIN");
  const [formData, setFormData] = useState({
    id: null,
    items_iname: "",
    items_runit: "Pcs",
    items_scatg: "Groceries",
  });
  const [errors, setErrors] = useState({});
  const [dataList, setDataList] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [cartItems, setCartItems] = useState([]);
  const cartItemsQty = cartItems.reduce((s, p) => s + p.qty, 0);
  const bsins_options = [
    ...new Map(
      dataList.map((item) => [
        item.bsins_id,
        {
          bsins_id: item.bsins_id,
          bsins_cname: item.bsins_cname,
        },
      ]),
    ).values(),
  ];

  const scatg_options = [
    ...new Map(
      dataList.map((item) => [
        item.items_scatg,
        {
          items_scatg: item.items_scatg,
          items_scatg: item.items_scatg,
        },
      ]),
    ).values(),
  ];

  //functions
  const handleGetProducts = async () => {
    try {
      setIsBusy(true);
      const resp = await apiRequest(
        "/inventory/v1/items/vmart/get-all-business-items",
        {
          body: {},
        },
      );
      //console.log("resp", resp.data);
      setDataList(resp.data);
      //console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleGetCartItems = async () => {
    const cartItems = getStorageData()?.vMartCart;
    setCartItems(cartItems || []);
  };

  useEffect(() => {
    handleGetProducts();
    handleGetCartItems();
  }, []);

  const handleChange = (field, value) => {
    setErrors({});
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEdit = (rowData) => {
    setFormData(rowData);
    setShowModal(true);
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const reqBody = {
        ...formData,
      };
      //console.log("reqBody", reqBody);
      if (!formData.items_iname) {
        showToast("Name is required", "error");
        return;
      }
      if (!formData.items_runit) {
        showToast("Unit is required", "error");
        return;
      }
      if (!formData.items_scatg) {
        showToast("Category is required", "error");
        return;
      }
      if (!formData.price_mrrat) {
        showToast("Price is required", "error");
        return;
      }
      setIsBusy(true);
      const resp = await apiRequest("/inventory/v1/items/vmart/upsert", {
        body: reqBody,
      });
      console.log("resp", resp);
      if (resp.success) {
        showToast(
          formData.id
            ? "Product updated successfully"
            : "Product added successfully",
        );
        handleGetProducts();
        setShowModal(false);
      }
      //console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  const handleAddToCart = async (product, qty = 1) => {
    setIsBusy(true);
    setCartItems((prev) => {
      const existing = prev.find((p) => p.id === product.id);
      let next;
      if (existing) {
        next = prev.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + qty } : p,
        );
      } else {
        next = [
          ...prev,
          {
            ...product,
            qty,
          },
        ];
      }
      //console.log("next", next);
      setStorageData({ vMartCart: next });
      return next;
    });
    showToast(`${product.items_iname} added to cart!`);
    setIsBusy(false);
  };

  const isInCart = (product) => {
    return cartItems.some((c) => c.id === product.id);
  };

  return {
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    showModal,
    scatg_options,
    bsins_options,
    cartItems,
    cartItemsQty,
    handleChange,
    handleEdit,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
    handleAddToCart,
    isInCart,
  };
};
export default useShopping;
