import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "@/utils/api";
import { useUI } from "@/pages/context/UIContext";
import { useAuth } from "@/pages/context/AuthContext";

const useProducts = () => {
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
  const runit_options = ["Pcs", "Kg", "Ltr", "Box", "Dzn", "Pair"];
  const scatg_options = [
    "Groceries",
    "Electronics",
    "Clothing",
    "Home",
    "Beauty",
    "Other",
  ];

  //functions
  const handleGetProducts = async () => {
    try {
      setIsBusy(true);
      const resp = await apiRequest("/inventory/v1/items/vmart", {
        body: {},
      });
      //console.log("resp", resp);
      setDataList(resp.data);
      //console.log(resp);
    } catch (error) {
      console.log(error);
    } finally {
      setIsBusy(false);
    }
  };

  useEffect(() => {
    handleGetProducts();
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
    setFormData({
      id: null,
      items_iname: "",
      items_runit: "Pcs",
      items_scatg: "Groceries",
    });
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

  //  const deleteProduct = async (idx) => {
  //   const confirmed = await showConfirm(`Delete ${products[idx].name}?`);
  //   if (!confirmed) return;
  //   setBusy(true);
  //   setProducts((prev) => prev.filter((_, i) => i !== idx));

  //   showToast("Product deleted", "error");
  //   setBusy(false);
  // };

  return {
    crTitle,
    crView,
    formData,
    errors,
    dataList,
    showModal,
    runit_options,
    scatg_options,
    handleChange,
    handleEdit,
    handleOpenModal,
    handleCloseModal,
    handleSubmit,
  };
};
export default useProducts;
